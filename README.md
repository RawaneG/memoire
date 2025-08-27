# 📚 OWID Predictor - Documentation Complète

## 🎯 Vue d'Ensemble

OWID Predictor est une application web moderne de prédiction COVID-19 utilisant l'intelligence artificielle et des modèles d'apprentissage automatique. L'interface utilisateur primée combine des animations fluides avec des visualisations de données interactives, spécialement optimisée pour le Sénégal.

### 🏗️ Architecture du Système

```
OWID Predictor/
├── frontend/          # Interface utilisateur React
├── backend/           # API Flask avec modèles ML
└── documentation/     # Guides et références
```

## 🎨 Frontend - Interface Utilisateur

### 📋 Prérequis

- **Node.js** 16.0 ou supérieur
- **npm** ou **yarn**
- Navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+)

### 🚀 Installation Rapide

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Construire pour la production
npm run build
```

### 🎭 Technologies Utilisées

| Technologie       | Version  | Usage                     |
| ----------------- | -------- | ------------------------- |
| **React**         | 18.2.0   | Framework UI principal    |
| **Framer Motion** | 10.16.16 | Animations et transitions |
| **Tailwind CSS**  | 3.3.6    | Styles et mise en page    |
| **Recharts**      | 2.8.0    | Visualisation de données  |
| **Lucide React**  | 0.294.0  | Icônes modernes           |

### 🎨 Système de Design

#### **Palette de Couleurs**

```css
/* Couleurs Principales */
--primary-blue: #0ea5e9    /* Bleu principal */
--primary-purple: #8b5cf6  /* Violet accent */
--success-green: #10b981   /* Vert succès */
--warning-orange: #f59e0b  /* Orange avertissement */
--error-red: #ef4444       /* Rouge erreur */

/* Nuances de Gris */
--gray-50: #fafafa
--gray-800: #262626
--gray-900: #171717
```

#### **Typographie**

```css
/* Police Principale */
font-family: "Inter", system-ui, sans-serif;

/* Poids Disponibles */
font-weight: 300, 400, 500, 600, 700, 800, 900;

/* Police Monospace */
font-family: "JetBrains Mono", Monaco, Consolas, monospace;
```

### 🧩 Structure des Composants

#### **Composants Principaux**

1. **App.js** - Composant racine de l'application

   ```jsx
   // Gère l'état global et la logique principale
   const [country, setCountry] = useState("Senegal");
   const [model, setModel] = useState("random_forest");
   const [predictions, setPredictions] = useState(null);
   ```

2. **BackgroundElements.jsx** - Effets visuels d'arrière-plan

   ```jsx
   // Particules flottantes et dégradés animés
   - 20 particules animées
   - Grille de fond subtile
   - Orbes lumineux avec blend modes
   ```

3. **CountrySelector.jsx** - Sélecteur de pays avancé

   ```jsx
   // Fonctionnalités
   - Recherche en temps réel
   - Pays vedettes (Sénégal, France, Allemagne)
   - Badges de recommandation
   - Animations de dropdown
   ```

4. **ModelSelector.jsx** - Sélection de modèles ML

   ```jsx
   // Types de modèles
   - Régression Linéaire (rapide, simple)
   - Forêt Aléatoire (robuste, précis)
   - Gradient Boosting (haute précision)
   ```

5. **PredictionChart.jsx** - Visualisation des données
   ```jsx
   // Caractéristiques du graphique
   - Courbes interactives avec Recharts
   - Intervalles de confiance
   - Tooltips personnalisés
   - Statistiques résumées
   ```

#### **Hooks Personnalisés**

**useApi.js** - Gestion des appels API

```javascript
const { loading, error, predict, getCountries } = useApi();

// Fonctions disponibles
-predict(country, model, horizon) - getCountries() - getModels() - getHealth();
```

### 🎬 Animations et Interactions

#### **Framer Motion Variants**

```javascript
// Animation d'entrée
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animation d'éléments
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
```

#### **Classes CSS Personnalisées**

```css
/* Morphisme de verre */
.glass-morphism {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Bouton principal */
.button-primary {
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  transition: all 0.3s ease;
}

.button-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.4);
}
```

### 📱 Responsive Design

#### **Points de Rupture**

```css
/* Mobile */
@media (max-width: 768px) {
  .card-primary {
    padding: 1.5rem;
  }
  .text-5xl {
    font-size: 2.5rem;
  }
}

/* Tablette */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 🔧 Configuration et Personnalisation

#### **Tailwind Configuration**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
};
```

#### **Variables d'Environnement**

```bash
# .env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=development
```

---

## 🖥️ Backend - API et Modèles ML

### 📋 Prérequis

- **Python** 3.8 ou supérieur
- **pip** gestionnaire de paquets
- **Flask** framework web
- (Optionnel) **Apache Spark** pour les gros datasets

### 🚀 Installation Rapide

```bash
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Mac/Linux)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur
python simple_app.py
```

### 🏗️ Structure du Backend

```
backend/
├── app.py                    # API Flask principale (avec Spark)
├── simple_app.py            # API simple sans Spark
├── spark_model.py           # Modèles ML avec Spark
├── requirements.txt         # Dépendances Python
├── owid-covid-data-sample.csv # Données d'exemple
└── README.md               # Documentation backend
```

### 🔌 Endpoints de l'API

#### **1. Santé du Service**

```http
GET /health

Réponse:
{
  "status": "healthy",
  "service": "OWID COVID-19 Prediction API",
  "version": "2.0-simple",
  "features": ["multi-model", "country-specific", "senegal-optimized"]
}
```

#### **2. Liste des Pays**

```http
GET /countries

Réponse:
{
  "total_countries": 9,
  "featured_countries": [
    {
      "name": "Senegal",
      "has_special_config": true,
      "config": {
        "population_density_threshold": 83,
        "optimization": "Random Forest recommended"
      }
    }
  ],
  "other_countries": [...]
}
```

#### **3. Modèles Disponibles**

```http
GET /models

Réponse:
{
  "available_models": {
    "linear": {
      "name": "Régression Linéaire",
      "description": "Modèle linéaire simple",
      "complexity": "Low",
      "accuracy": "Medium",
      "speed": "Fast"
    }
  },
  "recommended_by_country": {
    "Senegal": "random_forest"
  }
}
```

#### **4. Génération de Prédictions**

```http
GET /predict?country=Senegal&model=random_forest&horizon=14

Paramètres:
- country: Nom du pays (requis)
- model: Type de modèle (linear, random_forest, gradient_boost)
- horizon: Nombre de jours à prédire (1-30)

Réponse:
{
  "country": "Senegal",
  "model_type": "random_forest",
  "horizon_days": 14,
  "training_samples": 1249,
  "test_samples": 342,
  "features_used": ["cases_lag_1", "cases_lag_7", ...],
  "metrics": {
    "rmse": 17.5,
    "mae": 15.2,
    "r2_score": 0.881
  },
  "predictions": [
    {
      "date": "2025-08-28",
      "prediction": 261
    }
  ]
}
```

### 🤖 Modèles d'Apprentissage Automatique

#### **1. Régression Linéaire**

```python
# Caractéristiques
- Complexité: Faible
- Précision: Moyenne
- Vitesse: Rapide
- Usage: Tendances linéaires simples

# Configuration
LinearRegression(
    featuresCol="features",
    labelCol="new_cases",
    maxIter=100,
    regParam=0.01
)
```

#### **2. Forêt Aléatoire**

```python
# Caractéristiques
- Complexité: Moyenne
- Précision: Élevée
- Vitesse: Moyenne
- Usage: Relations non-linéaires

# Configuration
RandomForestRegressor(
    featuresCol="features",
    labelCol="new_cases",
    numTrees=100,
    maxDepth=10,
    seed=42
)
```

#### **3. Gradient Boosting**

```python
# Caractéristiques
- Complexité: Élevée
- Précision: Très élevée
- Vitesse: Lente
- Usage: Prédictions haute précision

# Configuration
GBTRegressor(
    featuresCol="features",
    labelCol="new_cases",
    maxIter=100,
    maxDepth=6,
    seed=42
)
```

### 🌍 Configuration Spécifique par Pays

#### **Sénégal (Optimisé)**

```python
COUNTRY_CONFIGS = {
    'Senegal': {
        'population_density_threshold': 83,  # hab/km²
        'gdp_per_capita_range': (1000, 2000),  # USD
        'vaccination_lag': 30,  # jours
        'seasonal_factor': True,
        'recommended_model': 'random_forest'
    }
}
```

### 🔒 Sécurité et CORS

#### **Configuration CORS**

```python
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
```

#### **Gestion des Erreurs**

```python
try:
    result = predict_cases(country, model, horizon)
    return jsonify(result)
except ValueError as ve:
    logger.error(f"Erreur de validation: {str(ve)}")
    return jsonify({'error': str(ve)}), 400
except Exception as exc:
    logger.error(f"Erreur interne: {str(exc)}")
    return jsonify({'error': 'Erreur interne du serveur'}), 500
```

---

## 🚀 Guide de Déploiement

### 🔧 Développement Local

#### **Étape 1: Préparer l'Environnement**

```bash
# Cloner le projet
git clone <votre-repo>
cd OWID-Predictor

# Installer les dépendances backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Installer les dépendances frontend
cd ../frontend
npm install
```

#### **Étape 2: Lancer les Serveurs**

```bash
# Terminal 1: Backend
cd backend
python simple_app.py
# → http://localhost:5001

# Terminal 2: Frontend
cd frontend
npm start
# → http://localhost:3000
```

### 🌐 Déploiement Production

#### **Frontend (Vercel - Recommandé)**

```bash
# Construire l'application
npm run build

# Déployer avec Vercel
npx vercel --prod

# Configuration vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ]
}
```

#### **Backend (Heroku)**

```bash
# Créer Procfile
echo "web: python simple_app.py" > Procfile

# Déployer
heroku create owid-predictor-api
git push heroku main

# Variables d'environnement
heroku config:set FLASK_ENV=production
heroku config:set PORT=5000
```

#### **Docker (Méthode Alternative)**

```dockerfile
# Dockerfile pour le backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "simple_app.py"]

# Dockerfile pour le frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

---

## 🧪 Tests et Qualité

### ✅ Tests Frontend

#### **Tests Unitaires**

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm test -- --watch
```

#### **Tests d'Intégration**

```javascript
// Exemple de test composant
import { render, screen } from "@testing-library/react";
import CountrySelector from "../components/CountrySelector";

test("affiche le sélecteur de pays", () => {
  render(<CountrySelector value="Senegal" onChange={jest.fn()} />);
  expect(screen.getByText("Senegal")).toBeInTheDocument();
});
```

### 🔍 Tests Backend

#### **Tests API**

```bash
# Tester les endpoints
curl -X GET "http://localhost:5001/health"
curl -X GET "http://localhost:5001/countries"
curl -X GET "http://localhost:5001/predict?country=Senegal&model=random_forest&horizon=7"
```

#### **Tests Python**

```python
# test_api.py
import unittest
from simple_app import app

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_health_endpoint(self):
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'healthy', response.data)

if __name__ == '__main__':
    unittest.main()
```

### 📊 Métriques de Performance

#### **Objectifs Frontend**

- ⚡ **First Contentful Paint**: < 1.5s
- 🎯 **Largest Contentful Paint**: < 2.5s
- 🚀 **Time to Interactive**: < 3.5s
- 📐 **Cumulative Layout Shift**: < 0.1

#### **Métriques Backend**

- 🔥 **Temps de réponse API**: < 200ms
- 💾 **Utilisation mémoire**: < 512MB
- ⚙️ **Charge CPU**: < 70%

---

## 🐛 Dépannage

### 🔧 Problèmes Courants

#### **Frontend**

**1. Erreurs CORS**

```bash
# Vérifier que le backend est sur le bon port
Backend: http://localhost:5001 ✓
Frontend: http://localhost:3000 ✓

# Redémarrer les deux serveurs
```

**2. Styles Tailwind non appliqués**

```bash
# Vérifier postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# Réinstaller les dépendances
npm install
```

**3. Animations Framer Motion saccadées**

```javascript
// Optimiser les animations
const variants = {
  animate: {
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

#### **Backend**

**1. Erreur Port Occupé**

```bash
# Changer le port
python -c "from simple_app import app; app.run(port=5002)"

# Ou tuer le processus
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**2. Erreur Modules Python**

```bash
# Réinstaller l'environnement virtuel
deactivate
rm -rf venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**3. Données Manquantes**

```python
# Le fichier simple_app.py génère des données de démo
# Pas besoin de fichier CSV externe
```

### 📞 Support et Communauté

#### **Ressources Utiles**

- 📚 **Documentation React**: https://reactjs.org/docs
- 🎨 **Framer Motion**: https://framer.com/motion
- 🎨 **Tailwind CSS**: https://tailwindcss.com/docs
- ⚡ **Flask Documentation**: https://flask.palletsprojects.com

#### **Contact et Contribution**

```bash
# Signaler un bug
Issues: https://github.com/votre-repo/issues

# Contribuer au code
1. Fork le projet
2. Créer une branche feature
3. Commit les modifications
4. Push vers la branche
5. Ouvrir une Pull Request
```
