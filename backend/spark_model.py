from datetime import datetime, timedelta
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import col, lag, row_number, when, isnan, isnull, mean as spark_mean
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.regression import LinearRegression, RandomForestRegressor, GBTRegressor
from pyspark.ml.evaluation import RegressionEvaluator
import logging
from typing import Dict, List, Optional, Tuple

# Configuration pour pays spécifiques avec leurs caractéristiques
COUNTRY_CONFIGS = {
    'Senegal': {
        'population_density_threshold': 83,  # habitants/km²
        'gdp_per_capita_range': (1000, 2000),  # USD
        'vaccination_lag': 30,  # jours de retard typique
        'seasonal_factor': True  # prendre en compte la saisonnalité
    },
    'France': {
        'population_density_threshold': 119,
        'gdp_per_capita_range': (35000, 45000),
        'vaccination_lag': 7,
        'seasonal_factor': True
    },
    'Germany': {
        'population_density_threshold': 240,
        'gdp_per_capita_range': (45000, 55000),
        'vaccination_lag': 5,
        'seasonal_factor': True
    }
}

def get_available_countries(data_path: str = "owid-covid-data.csv") -> List[str]:
    """Retourne la liste des pays disponibles dans le dataset."""
    spark = SparkSession.builder.appName("OWIDCountryList").getOrCreate()
    try:
        # Try main data file first, then fallback to sample
        try:
            df = spark.read.csv(data_path, header=True, inferSchema=True)
        except:
            logging.warning(f"Main data file {data_path} not found, using sample data")
            df = spark.read.csv("owid-covid-data-sample.csv", header=True, inferSchema=True)
        
        countries = [row["location"] for row in df.select("location").distinct().collect()]
        return sorted(countries)
    finally:
        spark.stop()

def validate_country_data(df_country, country: str, min_rows: int = 10) -> bool:
    """Valide si le pays a suffisamment de données pour l'entraînement."""
    row_count = df_country.count()
    if row_count < min_rows:
        logging.warning(f"Pays {country}: seulement {row_count} lignes disponibles (minimum: {min_rows})")
        return False
    return True

def create_country_specific_features(df_country, country: str):
    """Crée des features spécifiques au pays selon sa configuration."""
    config = COUNTRY_CONFIGS.get(country, COUNTRY_CONFIGS['France'])  # Défaut
    
    # Features de base
    df_features = df_country
    
    # Ajouter des features selon la configuration du pays
    if config.get('seasonal_factor'):
        from pyspark.sql.functions import dayofyear, sin, cos, lit
        from math import pi
        df_features = df_features.withColumn(
            "seasonal_sin", sin(2 * lit(pi) * dayofyear(col("date")) / 365)
        ).withColumn(
            "seasonal_cos", cos(2 * lit(pi) * dayofyear(col("date")) / 365)
        )
    
    return df_features

def predict_cases(country: str, model_type: str = 'linear', horizon: int = 14, 
                 data_path: str = "owid-covid-data.csv") -> Dict:
    """Prédit les cas COVID-19 pour un pays donné avec des modèles ML.
    
    Args:
        country: Nom du pays (ex: 'Senegal', 'France')
        model_type: Type de modèle ('linear', 'random_forest', 'gradient_boost')
        horizon: Nombre de jours à prédire
        data_path: Chemin vers le fichier de données OWID
        
    Returns:
        Dict contenant les prédictions et métriques du modèle
    """
    
    # Créer une session Spark
    spark = SparkSession.builder.appName(f"OWIDPrediction_{country}").getOrCreate()
    
    try:
        # Charger les données OWID
        try:
            df = spark.read.csv(data_path, header=True, inferSchema=True)
        except:
            logging.warning(f"Main data file {data_path} not found, using sample data")
            df = spark.read.csv("owid-covid-data-sample.csv", header=True, inferSchema=True)
        
        # Vérifier si le pays existe
        available_countries = [row["location"] for row in df.select("location").distinct().collect()]
        if country not in available_countries:
            raise ValueError(f"Pays '{country}' non trouvé. Pays disponibles: {sorted(available_countries)[:10]}...")
        
        # Filtrer le pays
        df_country = df.filter(col("location") == country)
        
        # Valider les données du pays
        if not validate_country_data(df_country, country):
            raise ValueError(f"Données insuffisantes pour le pays '{country}'")
            
        # Créer des features spécifiques au pays
        df_country = create_country_specific_features(df_country, country)

        # Créer des variables de décalage améliorées
        window_spec = Window.orderBy("date")
        
        # Remplacer les valeurs nulles par des moyennes
        df_clean = df_country.fillna({
            'new_cases': 0,
            'new_deaths': 0,
            'new_vaccinations': 0,
            'stringency_index': 0
        })
        
        # Variables de décalage multiples pour capturer les tendances
        df_lag = (
            df_clean
            .withColumn("cases_lag_1", lag("new_cases", 1).over(window_spec))
            .withColumn("cases_lag_3", lag("new_cases", 3).over(window_spec))
            .withColumn("cases_lag_7", lag("new_cases", 7).over(window_spec))
            .withColumn("cases_lag_14", lag("new_cases", 14).over(window_spec))
            .withColumn("deaths_lag_1", lag("new_deaths", 1).over(window_spec))
            .withColumn("deaths_lag_7", lag("new_deaths", 7).over(window_spec))
        )
        
        # Ajouter features supplémentaires si disponibles
        available_cols = df_lag.columns
        feature_cols = ["cases_lag_1", "cases_lag_3", "cases_lag_7", "cases_lag_14", 
                       "deaths_lag_1", "deaths_lag_7"]
        
        if "new_vaccinations" in available_cols:
            df_lag = df_lag.withColumn("vaccinations_lag_7", lag("new_vaccinations", 7).over(window_spec))
            feature_cols.append("vaccinations_lag_7")
            
        if "stringency_index" in available_cols:
            df_lag = df_lag.withColumn("stringency_lag_1", lag("stringency_index", 1).over(window_spec))
            feature_cols.append("stringency_lag_1")
        
        # Ajouter features saisonnières si configurées
        if "seasonal_sin" in df_lag.columns:
            feature_cols.extend(["seasonal_sin", "seasonal_cos"])
            
        df_lag = df_lag.dropna()

        # Assembler les features disponibles
        assembler = VectorAssembler(
            inputCols=feature_cols,
            outputCol="features_raw"
        )
        
        df_features = assembler.transform(df_lag)
        
        # Normalisation des features (important pour la convergence)
        scaler = StandardScaler(inputCol="features_raw", outputCol="features", 
                              withStd=True, withMean=True)
        scaler_model = scaler.fit(df_features)
        df_ml = scaler_model.transform(df_features).select("date", "new_cases", "features")

        # Séparer entraînement/test selon la chronologie (80/20 pour plus de données d'entraînement)
        total = df_ml.count()
        train_size = int(total * 0.8)
        df_indexed = df_ml.withColumn("row_number", row_number().over(window_spec))
        train_df = df_indexed.filter(col("row_number") <= train_size)
        test_df = df_indexed.filter(col("row_number") > train_size)
        
        logging.info(f"Données d'entraînement: {train_df.count()}, Test: {test_df.count()}")

        # Choisir et configurer le modèle selon le type
        if model_type == 'linear':
            reg = LinearRegression(
                featuresCol="features", 
                labelCol="new_cases",
                maxIter=100,
                regParam=0.01  # Régularisation pour éviter l'overfitting
            )
        elif model_type == 'random_forest':
            reg = RandomForestRegressor(
                featuresCol="features", 
                labelCol="new_cases", 
                numTrees=100,
                maxDepth=10,
                seed=42  # Pour la reproductibilité
            )
        elif model_type == 'gradient_boost':
            reg = GBTRegressor(
                featuresCol="features",
                labelCol="new_cases",
                maxIter=100,
                maxDepth=6,
                seed=42
            )
        else:
            raise ValueError(f"Model type '{model_type}' not supported. Use 'linear', 'random_forest', or 'gradient_boost'.")

        # Entraîner le modèle
        model = reg.fit(train_df)
        
        # Évaluation du modèle sur les données de test
        test_predictions = model.transform(test_df)
        evaluator = RegressionEvaluator(
            labelCol="new_cases", 
            predictionCol="prediction", 
            metricName="rmse"
        )
        rmse = evaluator.evaluate(test_predictions)
        
        # Calculer d'autres métriques
        evaluator_mae = RegressionEvaluator(
            labelCol="new_cases", 
            predictionCol="prediction", 
            metricName="mae"
        )
        mae = evaluator_mae.evaluate(test_predictions)
        
        evaluator_r2 = RegressionEvaluator(
            labelCol="new_cases", 
            predictionCol="prediction", 
            metricName="r2"
        )
        r2 = evaluator_r2.evaluate(test_predictions)
        
        # Faire des prédictions futures (extrapolation)
        # Utiliser les dernières données pour prédire les prochains jours
        latest_data = df_indexed.orderBy(col("date").desc()).limit(horizon)
        future_predictions = model.transform(latest_data)
        
        # Convertir les prédictions en format Python
        pred_list = []
        for row in future_predictions.select("date", "prediction").collect():
            pred_list.append({
                "date": row["date"].strftime("%Y-%m-%d") if isinstance(row["date"], datetime) else str(row["date"]),
                "prediction": max(0, float(row["prediction"]))  # S'assurer que les prédictions sont positives
            })
        
        # Informations sur la qualité du modèle
        model_info = {
            "country": country,
            "model_type": model_type,
            "horizon_days": horizon,
            "training_samples": train_df.count(),
            "test_samples": test_df.count(),
            "features_used": feature_cols,
            "metrics": {
                "rmse": float(rmse),
                "mae": float(mae),
                "r2_score": float(r2)
            },
            "country_config": COUNTRY_CONFIGS.get(country, "Default"),
            "predictions": pred_list
        }
        
        return model_info
        
    except Exception as e:
        logging.error(f"Erreur lors de la prédiction pour {country}: {str(e)}")
        raise
    finally:
        spark.stop()
