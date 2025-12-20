from datetime import datetime, timedelta
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import col, lag, row_number, when, isnan, isnull, mean as spark_mean
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.regression import LinearRegression, RandomForestRegressor, GBTRegressor
from pyspark.ml.evaluation import RegressionEvaluator
import logging
from typing import Dict, List, Optional, Tuple
import math
import threading

# ---------------------------------------------------------------------------
# Spark Session Singleton
# ---------------------------------------------------------------------------
_SPARK_LOCK = threading.Lock()
_SPARK_SESSION: Optional[SparkSession] = None

def get_spark(app_name: str = "SENPrediction") -> Optional[SparkSession]:
    global _SPARK_SESSION
    if _SPARK_SESSION is not None:
        return _SPARK_SESSION
    with _SPARK_LOCK:
        if _SPARK_SESSION is None:
            try:
                _SPARK_SESSION = (SparkSession.builder
                                  .appName(app_name)
                                  .config("spark.ui.showConsoleProgress", "false")
                                  # Optimisations mémoire pour Fly.io (768MB total)
                                  .config("spark.driver.memory", "400m")
                                  .config("spark.executor.memory", "256m")
                                  .config("spark.driver.maxResultSize", "100m")
                                  .config("spark.sql.shuffle.partitions", "4")  # Réduit de 200 par défaut
                                  .config("spark.default.parallelism", "2")
                                  .config("spark.sql.autoBroadcastJoinThreshold", "10485760")  # 10MB
                                  .config("spark.memory.fraction", "0.6")
                                  .config("spark.memory.storageFraction", "0.5")
                                  .getOrCreate())
                logging.info("[Spark] Session created with optimized memory settings (768MB)")
            except Exception as e:
                logging.error(f"[Spark] Failed to create session: {e}")
                logging.warning("[Spark] Running in fallback mode without Spark")
                return None
    return _SPARK_SESSION

def warmup_spark(data_path: str = "owid-covid-data-sample.csv"):
    try:
        spark = get_spark("SENPredictionWarmup")
        spark.read.csv(data_path, header=True, inferSchema=True).select("location").limit(5).collect()
        logging.info("[Spark] Warmup completed")
    except Exception as e:
        logging.warning(f"[Spark] Warmup failed: {e}")

# Configuration pour pays spécifiques avec leurs caractéristiques
COUNTRY_CONFIGS = {
    # 5 Pays Africains
    'Senegal': {
        'continent': 'Africa',
        'population_density_threshold': 83,  # habitants/km²
        'gdp_per_capita_range': (1000, 2000),  # USD
        'vaccination_lag': 30,  # jours de retard typique
        'seasonal_factor': True,  # prendre en compte la saisonnalité
        'recommended_model': 'random_forest'
    },
    'Nigeria': {
        'continent': 'Africa',
        'population_density_threshold': 226,
        'gdp_per_capita_range': (2000, 3000),
        'vaccination_lag': 45,
        'seasonal_factor': True,
        'recommended_model': 'random_forest'
    },
    'South Africa': {
        'continent': 'Africa',
        'population_density_threshold': 49,
        'gdp_per_capita_range': (6000, 7000),
        'vaccination_lag': 20,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    'Kenya': {
        'continent': 'Africa',
        'population_density_threshold': 94,
        'gdp_per_capita_range': (1800, 2500),
        'vaccination_lag': 35,
        'seasonal_factor': True,
        'recommended_model': 'random_forest'
    },
    'Morocco': {
        'continent': 'Africa',
        'population_density_threshold': 82,
        'gdp_per_capita_range': (3000, 4000),
        'vaccination_lag': 25,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    # 5 Autres Pays (Europe et Amérique du Nord)
    'France': {
        'continent': 'Europe',
        'population_density_threshold': 119,
        'gdp_per_capita_range': (35000, 45000),
        'vaccination_lag': 7,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    'Germany': {
        'continent': 'Europe',
        'population_density_threshold': 240,
        'gdp_per_capita_range': (45000, 55000),
        'vaccination_lag': 5,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    'United Kingdom': {
        'continent': 'Europe',
        'population_density_threshold': 281,
        'gdp_per_capita_range': (40000, 50000),
        'vaccination_lag': 5,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    'United States': {
        'continent': 'North America',
        'population_density_threshold': 36,
        'gdp_per_capita_range': (55000, 65000),
        'vaccination_lag': 7,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    },
    'Canada': {
        'continent': 'North America',
        'population_density_threshold': 4,
        'gdp_per_capita_range': (45000, 55000),
        'vaccination_lag': 10,
        'seasonal_factor': True,
        'recommended_model': 'gradient_boost'
    }
}

def get_available_countries(data_path: str = "owid-covid-data.csv") -> List[str]:
    """Retourne la liste des pays disponibles dans le dataset."""
    spark = get_spark("SENCountryList")

    # Si Spark n'est pas disponible, retourner la liste des pays configurés
    if spark is None:
        logging.warning("[Fallback] Spark unavailable, returning configured countries only")
        return sorted(list(COUNTRY_CONFIGS.keys()))

    try:
        try:
            df = spark.read.csv(data_path, header=True, inferSchema=True)
        except Exception:
            logging.warning(f"Main data file {data_path} not found, using sample data")
            df = spark.read.csv("owid-covid-data-sample.csv", header=True, inferSchema=True)
        countries = [row["location"] for row in df.select("location").distinct().collect()]
        return sorted(countries)
    except Exception as e:
        logging.error(f"Failed to list countries: {e}")
        # En cas d'erreur, retourner au moins les pays configurés
        return sorted(list(COUNTRY_CONFIGS.keys()))

def validate_country_data(df_country, country: str, min_rows: int = 10) -> bool:
    """Valide si le pays a suffisamment de données pour l'entraînement."""
    row_count = df_country.count()
    if row_count < min_rows:
        logging.warning(f"Pays {country}: seulement {row_count} lignes disponibles (minimum: {min_rows})")
        return False
    return True

def _generate_fallback_prediction(country: str, model_type: str, horizon: int, cleaning_level: str) -> Dict:
    """Génère des prédictions de fallback lorsque Spark n'est pas disponible."""
    import random
    from datetime import datetime, timedelta

    # Générer des prédictions mock réalistes
    predictions = []
    base_value = random.randint(100, 1000)
    today = datetime.now()

    for i in range(horizon):
        date = today + timedelta(days=i + 1)
        variation = (random.random() - 0.5) * 0.2  # ±10% variation
        prediction = max(0, int(base_value * (1 + variation)))

        predictions.append({
            'date': date.strftime('%Y-%m-%d'),
            'prediction': prediction
        })

    # Métriques mock réalistes
    model_names = {
        'linear': 'Régression Linéaire',
        'random_forest': 'Forêt Aléatoire',
        'gradient_boost': 'Gradient Boosting'
    }

    return {
        'country': country,
        'model_type': model_type,
        'model_name': model_names.get(model_type, 'Linear Regression'),
        'horizon_days': horizon,
        'cleaning_level': cleaning_level,
        'training_samples': random.randint(800, 1500),
        'test_samples': random.randint(200, 400),
        'features_used': ['cases_lag_1', 'cases_lag_7', 'deaths_lag_1', 'seasonal_sin'],
        'metrics': {
            'rmse': round(45.2 + random.random() * 20, 2),
            'mae': round(32.1 + random.random() * 15, 2),
            'r2_score': round(0.75 + random.random() * 0.2, 4),
            'r2_score_normalized': round(0.75 + random.random() * 0.2, 4)
        },
        'predictions': predictions,
        'warning': 'Prédictions générées en mode fallback (Spark indisponible)',
        'fallback_mode': True
    }

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
                 data_path: str = "owid-covid-data.csv", lang: str = 'fr',
                 cleaning_level: str = 'standard') -> Dict:
    """Prédit les cas COVID-19 pour un pays donné avec des modèles ML.

    Args:
        country: Nom du pays (ex: 'Senegal', 'France')
        model_type: Type de modèle ('linear', 'random_forest', 'gradient_boost')
        horizon: Nombre de jours à prédire
        data_path: Chemin vers le fichier de données COVID-19
        lang: Langue pour les messages ('fr' ou 'en')
        cleaning_level: Niveau de nettoyage ('minimal', 'standard', 'strict')
            - minimal: Remplace NULL par 0 uniquement
            - standard: + suppression négatives + outliers >10x + lissage 7j
            - strict: + outliers >5x + lissage + validation stricte

    Returns:
        Dict contenant les prédictions et métriques du modèle
    """

    # Créer une session Spark
    spark = get_spark(f"SENPrediction_{country}")

    # Si Spark n'est pas disponible, utiliser le fallback
    if spark is None:
        logging.warning(f"[Fallback] Spark unavailable, generating mock predictions for {country}")
        return _generate_fallback_prediction(country, model_type, horizon, cleaning_level)

    try:
        # Charger les données COVID-19
        try:
            df = spark.read.csv(data_path, header=True, inferSchema=True)
        except Exception:
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

        # =================================================================
        # NETTOYAGE DES DONNÉES - Niveaux configurables
        # =================================================================
        window_spec = Window.orderBy("date")

        # NIVEAU MINIMAL : Toujours appliqué (remplacer NULL par 0)
        df_clean = df_country.fillna({
            'new_cases': 0,
            'new_deaths': 0,
            'new_vaccinations': 0,
            'stringency_index': 0,
            'total_cases': 0,
            'total_deaths': 0
        })

        # NIVEAU STANDARD et STRICT : Nettoyage avancé
        if cleaning_level in ['standard', 'strict']:
            # Supprimer les valeurs négatives (erreurs de saisie)
            df_clean = df_clean.filter(
                (col('new_cases') >= 0) &
                (col('new_deaths') >= 0)
            )

            if 'new_vaccinations' in df_clean.columns:
                df_clean = df_clean.filter(col('new_vaccinations') >= 0)

            # Filtrer les valeurs aberrantes extrêmes
            try:
                median_cases = df_clean.approxQuantile("new_cases", [0.5], 0.01)[0]
                if median_cases > 0:
                    # Standard: >10x médiane, Strict: >5x médiane
                    multiplier = 5 if cleaning_level == 'strict' else 10
                    df_clean = df_clean.filter(col('new_cases') <= median_cases * multiplier)
                    logging.info(f"Median new_cases={median_cases:.2f}, max_limit={median_cases * multiplier:.2f}")
            except Exception as e:
                logging.warning(f"Median computation error: {e}")

            # Lissage sur 7 jours
            window_7 = Window.orderBy("date").rowsBetween(-3, 3)
            df_clean = df_clean.withColumn(
                "cases_7d_avg",
                spark_mean("new_cases").over(window_7)
            )

            # Standard: >5x moyenne, Strict: >3x moyenne
            threshold = 3 if cleaning_level == 'strict' else 5
            df_clean = df_clean.withColumn(
                "new_cases_cleaned",
                when(
                    (col("new_cases") > threshold * col("cases_7d_avg")) & (col("cases_7d_avg") > 0),
                    col("cases_7d_avg")
                ).otherwise(col("new_cases"))
            )

            df_clean = df_clean.withColumn("new_cases", col("new_cases_cleaned")).drop("new_cases_cleaned", "cases_7d_avg")

        # =================================================================
        # CRÉATION DES FEATURES
        # =================================================================

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
            
        # Remplacer les valeurs nulles restantes dans les features de décalage par 0
        for col_name in feature_cols:
            if col_name in df_lag.columns:
                df_lag = df_lag.fillna({col_name: 0})
        
        # Ne supprimer les lignes que si toutes les features sont nulles
        df_lag = df_lag.dropna(subset=feature_cols, how='all')
        
        # Vérifier que nous avons encore des données après le preprocessing
        count = df_lag.count()
        min_rows = 30 if cleaning_level == 'strict' else 20
        if count < min_rows:
            raise ValueError(f"Insufficient data after preprocessing for {country} (rows={count})")

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
        # Sanitize metric values (replace NaN/inf with None or fallback)
        def safe_float(value: float) -> Optional[float]:
            try:
                if value is None:
                    return None
                if isinstance(value, (int, float)) and (math.isnan(value) or math.isinf(value)):
                    return None
                return float(value)
            except Exception:
                return None

        # Compute a normalized/clipped R² for UI display (0.0–1.0)
        raw_r2 = safe_float(r2)
        r2_normalized = None
        try:
            if raw_r2 is not None:
                # clip into [0,1] so percentage stays in 0–100 for UX
                r2_normalized = max(0.0, min(1.0, float(raw_r2)))
        except Exception:
            r2_normalized = None

        model_info = {
            "country": country,
            "model_type": model_type,
            "horizon_days": horizon,
            "cleaning_level": cleaning_level,
            "training_samples": train_df.count(),
            "test_samples": test_df.count(),
            "features_used": feature_cols,
            "metrics": {
                "rmse": safe_float(rmse),
                "mae": safe_float(mae),
                # Keep raw R² for diagnostics but also provide a normalized field for UI
                "r2_score": raw_r2,
                "r2_score_normalized": r2_normalized
            },
            "country_config": COUNTRY_CONFIGS.get(country, "Default"),
            "predictions": pred_list
        }
        
        return model_info
        
    except Exception as e:
        logging.error(f"Erreur lors de la prédiction pour {country}: {str(e)}")
        raise
    finally:
        # Do not stop the singleton Spark session; keep it alive for reuse.
        pass

def get_configured_countries() -> List[str]:
    """Retourne la liste des pays configurés pour les prédictions optimisées."""
    return list(COUNTRY_CONFIGS.keys())

def predict_all_configured_countries(model_type: str = 'linear', horizon: int = 14, 
                                   data_path: str = "owid-covid-data-sample.csv") -> Dict:
    """Génère des prédictions pour tous les pays configurés.
    
    Args:
        model_type: Type de modèle ('linear', 'random_forest', 'gradient_boost')
        horizon: Nombre de jours à prédire
        data_path: Chemin vers le fichier de données COVID-19
        
    Returns:
        Dict contenant les prédictions pour tous les pays configurés
    """
    results = {
        'summary': {
            'total_countries': len(COUNTRY_CONFIGS),
            'african_countries': len([c for c in COUNTRY_CONFIGS.values() if c['continent'] == 'Africa']),
            'other_countries': len([c for c in COUNTRY_CONFIGS.values() if c['continent'] != 'Africa']),
            'model_used': model_type,
            'horizon_days': horizon
        },
        'predictions_by_country': {},
        'failed_countries': []
    }
    
    for country in COUNTRY_CONFIGS.keys():
        try:
            logging.info(f"Génération des prédictions pour {country}...")
            
            # Utiliser le modèle recommandé pour ce pays si aucun modèle spécifié
            recommended_model = COUNTRY_CONFIGS[country].get('recommended_model', model_type)
            
            prediction = predict_cases(
                country=country,
                model_type=recommended_model,
                horizon=horizon,
                data_path=data_path
            )
            
            results['predictions_by_country'][country] = prediction
            
        except Exception as e:
            logging.error(f"Échec de prédiction pour {country}: {str(e)}")
            results['failed_countries'].append({
                'country': country,
                'error': str(e)
            })
    
    return results
