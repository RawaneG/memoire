# OWID COVID-19 Prediction API - Examples

## Overview
Enhanced API with multi-model support and country-specific optimizations, particularly for Senegal.

## Available Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Get Available Countries
```bash
curl http://localhost:5000/countries
```

### 3. Get Available Models
```bash
curl http://localhost:5000/models
```

### 4. Make Predictions

#### For Senegal (recommended: Random Forest)
```bash
# 7-day prediction for Senegal using Random Forest
curl "http://localhost:5000/predict?country=Senegal&model=random_forest&horizon=7"

# 14-day prediction for Senegal using Gradient Boosting
curl "http://localhost:5000/predict?country=Senegal&model=gradient_boost&horizon=14"
```

#### For France
```bash
# Linear regression for France
curl "http://localhost:5000/predict?country=France&model=linear&horizon=10"

# Gradient boosting for France (recommended)
curl "http://localhost:5000/predict?country=France&model=gradient_boost&horizon=14"
```

#### For Other Countries
```bash
# Germany with Random Forest
curl "http://localhost:5000/predict?country=Germany&model=random_forest&horizon=7"

# United States with Linear regression
curl "http://localhost:5000/predict?country=United States&model=linear&horizon=14"
```

## Response Format

### Prediction Response
```json
{
  "country": "Senegal",
  "model_type": "random_forest",
  "horizon_days": 7,
  "training_samples": 800,
  "test_samples": 200,
  "features_used": ["cases_lag_1", "cases_lag_3", "cases_lag_7", "cases_lag_14", "deaths_lag_1", "deaths_lag_7", "seasonal_sin", "seasonal_cos"],
  "metrics": {
    "rmse": 45.23,
    "mae": 32.11,
    "r2_score": 0.76
  },
  "country_config": {
    "population_density_threshold": 83,
    "gdp_per_capita_range": [1000, 2000],
    "vaccination_lag": 30,
    "seasonal_factor": true
  },
  "predictions": [
    {
      "date": "2024-08-27",
      "prediction": 123.45
    },
    ...
  ],
  "model_info": {
    "name": "Forêt Aléatoire",
    "description": "Modèle ensembliste robuste aux valeurs aberrantes",
    "best_for": ["données complexes", "relations non-linéaires"]
  }
}
```

## Country-Specific Features

### Senegal Configuration
- Population density threshold: 83 habitants/km²
- GDP per capita range: $1,000-$2,000
- Vaccination lag: 30 days
- Seasonal factors: Enabled
- Recommended model: Random Forest

### France Configuration  
- Population density threshold: 119 habitants/km²
- GDP per capita range: $35,000-$45,000
- Vaccination lag: 7 days
- Seasonal factors: Enabled
- Recommended model: Gradient Boosting

### Germany Configuration
- Population density threshold: 240 habitants/km²
- GDP per capita range: $45,000-$55,000  
- Vaccination lag: 5 days
- Seasonal factors: Enabled
- Recommended model: Gradient Boosting

## Model Types

1. **Linear Regression** (`linear`)
   - Fast and interpretable
   - Good for linear trends
   - Best for limited data

2. **Random Forest** (`random_forest`)
   - Robust to outliers
   - Handles non-linear relationships
   - Good for complex data patterns
   - **Recommended for developing countries like Senegal**

3. **Gradient Boosting** (`gradient_boost`)
   - High accuracy
   - Good for large datasets
   - **Recommended for developed countries**

## Error Handling

The API provides detailed error messages:

```json
{
  "error": "Pays 'InvalidCountry' non trouvé. Pays disponibles: ['Afghanistan', 'Albania', ...]"
}
```

```json
{
  "error": "Modèle 'invalid_model' non supporté",
  "available_models": ["linear", "random_forest", "gradient_boost"]
}
```

## Installation & Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure you have the OWID COVID-19 dataset (`owid-covid-data.csv`) in the backend directory

3. Run the API:
```bash
python app.py
```

4. Access the API at `http://localhost:5000`