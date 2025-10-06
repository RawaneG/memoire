"""
Flask API pour exposer des services de prédiction de pandémie.

Ce serveur fournit des routes pour :
- `/predict` : prédictions de cas COVID-19 pour un pays donné
- `/countries` : liste des pays disponibles
- `/models` : liste des modèles ML disponibles

La logique de prédiction utilise Apache Spark avec des modèles optimisés
par pays, notamment pour le Sénégal.
"""

from flask import Flask, request, jsonify
from spark_model import predict_cases, get_available_countries, COUNTRY_CONFIGS, predict_all_configured_countries, get_configured_countries
import logging

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

# Configuration des modèles disponibles
AVAILABLE_MODELS = {
    'linear': {
        'name': 'Régression Linéaire',
        'description': 'Modèle linéaire simple, rapide et interprétable',
        'best_for': ['données limitées', 'tendances linéaires']
    },
    'random_forest': {
        'name': 'Forêt Aléatoire',
        'description': 'Modèle ensembliste robuste aux valeurs aberrantes',
        'best_for': ['données complexes', 'relations non-linéaires']
    },
    'gradient_boost': {
        'name': 'Gradient Boosting',
        'description': 'Modèle avancé avec haute précision',
        'best_for': ['prédictions précises', 'gros datasets']
    }
}


@app.route('/predict', methods=['GET'])
def predict():
    """Endpoint HTTP pour générer des prévisions avec validation complète.

    Paramètres de requête :
      - country : nom du pays (ex. "Senegal", "France")
      - model : type de modèle ("linear", "random_forest", "gradient_boost")
      - horizon : nombre de jours à prédire (1-30, défaut: 14)
      - cleaning_level : niveau de nettoyage ("minimal", "standard", "strict")
      - lang : langue ("fr", "en")
      - data_path : chemin vers les données (optionnel)

    Retour : JSON avec prédictions et métriques du modèle
    """
    lang = get_lang_from_request()
    set_language(lang)

    country = request.args.get('country')
    model = request.args.get('model', default='linear')
    horizon = request.args.get('horizon', 14, type=int)
    cleaning_level = request.args.get('cleaning_level', default='standard')
    data_path = request.args.get('data_path', 'owid-covid-data.csv')

    # Validation des paramètres
    if not country:
        return jsonify({
            'error': t('api.errors.country_required', lang=lang),
            'available_countries_sample': ['Senegal', 'Nigeria', 'South Africa', 'Kenya', 'Morocco', 'France', 'Germany', 'United Kingdom', 'United States', 'Canada']
        }), 400

    if model not in AVAILABLE_MODEL_TYPES:
        return jsonify({
            'error': t('api.errors.model_not_supported', model=model, lang=lang),
            'available_models': AVAILABLE_MODEL_TYPES
        }), 400

    if not (1 <= horizon <= 30):
        return jsonify({
            'error': t('api.errors.horizon_range', lang=lang)
        }), 400

    if cleaning_level not in ['minimal', 'standard', 'strict']:
        return jsonify({
            'error': t('api.errors.cleaning_level_invalid', lang=lang) if 'cleaning_level_invalid' in dir() else f'Cleaning level must be "minimal", "standard", or "strict"',
            'available_levels': ['minimal', 'standard', 'strict']
        }), 400

    try:
        logger.info(t('api.messages.prediction_start', country=country, model=model, horizon=horizon, lang=lang))

        result = predict_cases(
            country=country,
            model_type=model,
            horizon=horizon,
            data_path=data_path,
            lang=lang,
            cleaning_level=cleaning_level
        )
        
        # Enrichir la réponse avec des informations sur le modèle
        result['model_info'] = get_models_translated(lang)[model]
        result['request_params'] = {
            'country': country,
            'model': model,
            'horizon': horizon,
            'cleaning_level': cleaning_level,
            'lang': lang
        }
        
        logger.info(f"Prédiction réussie - RMSE: {result['metrics']['rmse']:.2f}")
        return jsonify(result)
        
    except ValueError as ve:
        logger.error(f"Erreur de validation: {str(ve)}")
        return jsonify({'error': str(ve)}), 400
    except Exception as exc:
        logger.error(f"Erreur lors de la prédiction pour {country}: {str(exc)}")
        return jsonify({
            'error': 'Erreur interne du serveur',
            'details': str(exc)
        }), 500


@app.route('/countries', methods=['GET'])
def countries():
    """Retourne la liste des pays disponibles dans le dataset."""
    try:
        data_path = request.args.get('data_path', 'owid-covid-data.csv')
        countries_list = get_available_countries(data_path)
        
        # Mettre en évidence les pays avec configuration spéciale
        featured_countries = []
        other_countries = []
        
        for country in countries_list:
            if country in COUNTRY_CONFIGS:
                featured_countries.append({
                    'name': country,
                    'has_special_config': True,
                    'config': COUNTRY_CONFIGS[country]
                })
            else:
                other_countries.append({
                    'name': country,
                    'has_special_config': False
                })
        
        return jsonify({
            'total_countries': len(countries_list),
            'featured_countries': featured_countries,
            'other_countries': other_countries[:50]  # Limiter pour éviter une réponse trop grande
        })
        
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500


@app.route('/predict_all', methods=['GET'])
def predict_all():
    """Endpoint pour générer des prédictions pour tous les pays configurés.

    Paramètres de requête :
      - model : type de modèle ("linear", "random_forest", "gradient_boost")
      - horizon : nombre de jours à prédire (1-30, défaut: 7)

    Retour : JSON avec prédictions pour tous les pays configurés
    """
    model = request.args.get('model', default='linear')
    horizon = request.args.get('horizon', 7, type=int)
    
    # Validation des paramètres
    if model not in AVAILABLE_MODELS:
        return jsonify({
            'error': f'Modèle "{model}" non supporté',
            'available_models': list(AVAILABLE_MODELS.keys())
        }), 400
        
    if not (1 <= horizon <= 30):
        return jsonify({
            'error': 'Horizon doit être entre 1 et 30 jours'
        }), 400
    
    try:
        logger.info(f"Prédiction pour tous les pays configurés avec modèle {model}, horizon {horizon} jours")
        
        result = predict_all_configured_countries(
            model_type=model, 
            horizon=horizon,
            data_path='owid-covid-data-sample.csv'
        )
        
        logger.info(f"Prédiction réussie pour {len(result['predictions_by_country'])} pays")
        return jsonify(result)
        
    except Exception as exc:
        logger.error(f"Erreur lors de la prédiction groupée: {str(exc)}")
        return jsonify({
            'error': 'Erreur interne du serveur',
            'details': str(exc)
        }), 500


@app.route('/models', methods=['GET'])
def models():
    """Retourne la liste des modèles ML disponibles avec leurs descriptions."""
    return jsonify({
        'available_models': AVAILABLE_MODELS,
        'default_model': 'linear',
        'recommended_by_country': {
            # African Countries
            'Senegal': 'random_forest',
            'Nigeria': 'random_forest',
            'South Africa': 'gradient_boost',
            'Kenya': 'random_forest',
            'Morocco': 'gradient_boost',
            # Other Countries
            'France': 'gradient_boost',
            'Germany': 'gradient_boost',
            'United Kingdom': 'gradient_boost',
            'United States': 'gradient_boost',
            'Canada': 'gradient_boost'
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de santé pour vérifier le statut du service."""
    return jsonify({
        'status': 'healthy',
        'service': 'OWID COVID-19 Prediction API',
        'version': '2.0',
        'features': ['multi-model', 'country-specific', 'senegal-optimized']
    })


@app.route('/', methods=['GET'])
def home():
    """Page d'accueil avec documentation de l'API."""
    return jsonify({
        'message': 'API de Prédiction COVID-19 OWID',
        'endpoints': {
            '/predict': 'GET - Générer des prédictions pour un pays',
            '/predict_all': 'GET - Générer des prédictions pour tous les pays configurés',
            '/countries': 'GET - Liste des pays disponibles', 
            '/models': 'GET - Liste des modèles ML disponibles',
            '/health': 'GET - Statut du service'
        },
        'example_request': '/predict?country=Senegal&model=random_forest&horizon=7',
        'documentation': 'https://github.com/your-repo/owid-prediction-api'
    })


if __name__ == '__main__':
    # Lancer le serveur en mode développement
    # En production, utiliser un serveur WSGI (gunicorn, uwsgi, etc.)
    logger.info("Démarrage du serveur de prédiction OWID...")
    app.run(host='0.0.0.0', port=5000, debug=True)