"""
Simple Flask API without Spark for testing the UI.
"""

from flask import Flask, request, jsonify
import logging
import random
from datetime import datetime, timedelta

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Manual CORS configuration
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle preflight requests
@app.route('/<path:path>', methods=['OPTIONS'])
@app.route('/', methods=['OPTIONS'])
def handle_options(path=None):
    return '', 200

# Sample data
SAMPLE_COUNTRIES = {
    'featured_countries': [
        {'name': 'Senegal', 'has_special_config': True, 'config': {'population_density_threshold': 83, 'optimization': 'Random Forest recommended'}},
        {'name': 'France', 'has_special_config': True, 'config': {'population_density_threshold': 119, 'optimization': 'Gradient Boosting recommended'}},
        {'name': 'Germany', 'has_special_config': True, 'config': {'population_density_threshold': 240, 'optimization': 'Gradient Boosting recommended'}}
    ],
    'other_countries': [
        {'name': 'United States', 'has_special_config': False},
        {'name': 'Brazil', 'has_special_config': False},
        {'name': 'India', 'has_special_config': False},
        {'name': 'United Kingdom', 'has_special_config': False},
        {'name': 'Italy', 'has_special_config': False},
        {'name': 'Spain', 'has_special_config': False}
    ],
    'total_countries': 9
}

AVAILABLE_MODELS = {
    'linear': {
        'name': 'Régression Linéaire',
        'description': 'Modèle linéaire simple, rapide et interprétable',
        'best_for': ['données limitées', 'tendances linéaires'],
        'complexity': 'Low',
        'accuracy': 'Medium',
        'speed': 'Fast'
    },
    'random_forest': {
        'name': 'Forêt Aléatoire',
        'description': 'Modèle ensembliste robuste aux valeurs aberrantes',
        'best_for': ['données complexes', 'relations non-linéaires'],
        'complexity': 'Medium',
        'accuracy': 'High',
        'speed': 'Medium'
    },
    'gradient_boost': {
        'name': 'Gradient Boosting',
        'description': 'Modèle avancé avec haute précision',
        'best_for': ['prédictions précises', 'gros datasets'],
        'complexity': 'High',
        'accuracy': 'Very High',
        'speed': 'Slow'
    }
}

@app.route('/predict', methods=['GET'])
def predict():
    """Generate sample predictions for testing."""
    country = request.args.get('country')
    model = request.args.get('model', default='linear')
    horizon = int(request.args.get('horizon', 14))
    
    if not country:
        return jsonify({'error': 'Country parameter required'}), 400
        
    if model not in AVAILABLE_MODELS:
        return jsonify({
            'error': f'Model "{model}" not supported',
            'available_models': list(AVAILABLE_MODELS.keys())
        }), 400
    
    # Generate sample predictions
    predictions = []
    base_value = random.randint(100, 1000)
    today = datetime.now()
    
    for i in range(horizon):
        date = today + timedelta(days=i+1)
        variation = (random.random() - 0.5) * 0.3  # ±15% variation
        prediction = max(0, int(base_value * (1 + variation)))
        
        predictions.append({
            'date': date.strftime('%Y-%m-%d'),
            'prediction': prediction
        })
        
        # Slight trend for next day
        base_value *= (1 + (random.random() - 0.5) * 0.1)
    
    # Generate realistic metrics
    model_quality = {'linear': 0.7, 'random_forest': 0.85, 'gradient_boost': 0.92}
    base_quality = model_quality.get(model, 0.75)
    
    # Country-specific adjustments
    if country == 'Senegal' and model == 'random_forest':
        base_quality += 0.05  # Optimized for Senegal
    
    result = {
        'country': country,
        'model_type': model,
        'horizon_days': horizon,
        'training_samples': random.randint(800, 1500),
        'test_samples': random.randint(200, 400),
        'features_used': [
            'cases_lag_1', 'cases_lag_3', 'cases_lag_7', 'cases_lag_14',
            'deaths_lag_1', 'deaths_lag_7', 'seasonal_sin', 'seasonal_cos'
        ],
        'metrics': {
            'rmse': round(50 * (1 - base_quality) + random.uniform(10, 30), 1),
            'mae': round(35 * (1 - base_quality) + random.uniform(5, 20), 1),
            'r2_score': round(base_quality + random.uniform(-0.05, 0.05), 3)
        },
        'predictions': predictions,
        'model_info': AVAILABLE_MODELS[model],
        'country_config': 'Optimized configuration' if country in ['Senegal', 'France', 'Germany'] else 'Default configuration'
    }
    
    logger.info(f"Generated prediction for {country} using {model} model")
    return jsonify(result)

@app.route('/countries', methods=['GET'])
def countries():
    """Return available countries."""
    return jsonify(SAMPLE_COUNTRIES)

@app.route('/models', methods=['GET'])
def models():
    """Return available models."""
    return jsonify({
        'available_models': AVAILABLE_MODELS,
        'default_model': 'linear',
        'recommended_by_country': {
            'Senegal': 'random_forest',
            'France': 'gradient_boost',
            'Germany': 'gradient_boost'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'SEN Prediction API (Simple)',
        'version': '2.0-simple',
        'features': ['multi-model', 'country-specific', 'senegal-optimized', 'demo-data']
    })

@app.route('/', methods=['GET'])
def home():
    """API documentation."""
    return jsonify({
        'message': 'API SEN Prediction (Version Simple)',
        'endpoints': {
            '/predict': 'GET - Générer des prédictions pour un pays',
            '/countries': 'GET - Liste des pays disponibles',
            '/models': 'GET - Liste des modèles ML disponibles',
            '/health': 'GET - Statut du service'
        },
        'example_request': '/predict?country=Senegal&model=random_forest&horizon=7',
        'note': 'Cette version utilise des données de démonstration'
    })

if __name__ == '__main__':
    logger.info("Démarrage du serveur SEN Prediction (version simple)...")
    app.run(host='0.0.0.0', port=5000, debug=True)