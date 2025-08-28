# 📊 OWID COVID-19 Predictor

Une application web moderne de prédiction COVID-19 utilisant l'intelligence artificielle et des modèles d'apprentissage automatique avancés, avec une interface utilisateur primée et des optimisations spécifiques pour 10 pays stratégiques.

## 🎯 Aperçu du Projet

OWID Predictor combine des visualisations de données interactives avec des modèles ML sophistiqués pour fournir des prédictions précises des cas COVID-19. L'application utilise React avec des animations Framer Motion fluides et un backend Flask robuste avec Apache Spark et plusieurs algorithmes d'apprentissage automatique avancés.

### ✨ Fonctionnalités Principales

- 🌍 **10 Pays Configurés** - 5 pays africains + 5 pays développés avec optimisations spécifiques
- 🤖 **Modèles ML Multiples** - Régression linéaire, Forêt aléatoire, Gradient Boosting
- 📈 **Visualisations Interactives** - Graphiques avec intervalles de confiance
- 🎨 **Interface Moderne** - Design glassmorphism avec animations fluides
- ⚡ **Performance Optimisée** - Apache Spark pour le traitement des données à grande échelle
- 🌟 **Données Réelles OWID** - Plus de 429,000 enregistrements avec 67 variables
- 🎯 **Prédictions Spécialisées** - Modèles recommandés par pays et continent

---

## 🚀 Installation et Configuration

### 📋 Prérequis

**Frontend:**

- Node.js 16.0+
- npm ou yarn
- Navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+)

**Backend:**

- Python 3.8+
- pip gestionnaire de paquets

### ⚡ Installation Rapide

#### 1. Cloner le Projet

```bash
git clone <votre-repository>
cd OWID
```

#### 2. Configuration Backend

```bash
# Naviguer vers le backend
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel

# Windows (Command Prompt):
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Installer les dépendances (y compris Apache Spark)
pip install -r requirements.txt

# Lancer le serveur principal avec Spark
python app.py
```

Le backend sera disponible sur `http://localhost:5000`

**Note:** Pour une version simplifiée sans Spark, utilisez `python simple_app.py` à la place.

#### 3. Configuration Frontend

```bash
# Ouvrir un nouveau terminal et naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

L'application sera disponible sur `http://localhost:3000`

---

## 🏗️ Architecture du Système

### 📁 Structure du Projet

```
OWID/
├── backend/                     # API Flask et modèles ML
│   ├── app.py                  # Serveur principal avec Apache Spark
│   ├── simple_app.py           # Version simplifiée (optionnelle)
│   ├── spark_model.py          # Modèles ML avec Spark
│   ├── requirements.txt        # Dépendances Python
│   └── owid-covid-data-sample.csv  # Données OWID réelles (429k+ enregistrements)
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── CountrySelector.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   └── ...
│   │   ├── hooks/              # Hooks personnalisés
│   │   │   └── useApi.js
│   │   ├── App.js              # Composant racine
│   │   ├── index.css           # Styles globaux
│   │   └── index.js            # Point d'entrée
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js      # Configuration Tailwind
└── README.md                   # Ce fichier
```

### 🔧 Technologies Utilisées

#### Frontend

| Technologie       | Version  | Usage                     |
| ----------------- | -------- | ------------------------- |
| **React**         | 18.2.0   | Framework UI principal    |
| **Framer Motion** | 10.16.16 | Animations et transitions |
| **Tailwind CSS**  | 3.3.6    | Framework CSS utilitaire  |
| **Recharts**      | 2.8.0    | Visualisation de données  |
| **Lucide React**  | 0.294.0  | Bibliothèque d'icônes     |

#### Backend

| Technologie       | Usage                               |
| ----------------- | ----------------------------------- |
| **Flask**         | Framework web Python                |
| **Apache Spark**  | Traitement de données à grande échelle |
| **PySpark ML**    | Modèles d'apprentissage automatique |
| **scikit-learn**  | Modèles ML (version simplifiée)     |
| **pandas**        | Manipulation de données             |
| **numpy**         | Calculs numériques                  |
| **CORS**          | Support cross-origin                |

---

## 🎨 Guide d'Utilisation

### 🌍 1. Sélection du Pays

#### **Pays Africains Configurés** (5)
- 🇸🇳 **Sénégal** - Modèle recommandé: Forêt Aléatoire
- 🇳🇬 **Nigeria** - Modèle recommandé: Forêt Aléatoire  
- 🇿🇦 **Afrique du Sud** - Modèle recommandé: Gradient Boosting
- 🇰🇪 **Kenya** - Modèle recommandé: Forêt Aléatoire
- 🇲🇦 **Maroc** - Modèle recommandé: Gradient Boosting

#### **Pays Développés Configurés** (5)
- 🇫🇷 **France** - Modèle recommandé: Gradient Boosting
- 🇩🇪 **Allemagne** - Modèle recommandé: Gradient Boosting
- 🇬🇧 **Royaume-Uni** - Modèle recommandé: Gradient Boosting
- 🇺🇸 **États-Unis** - Modèle recommandé: Gradient Boosting
- 🇨🇦 **Canada** - Modèle recommandé: Gradient Boosting

**Fonctionnalités:**
- **Recherche en temps réel**: Tapez pour filtrer la liste des pays
- **Badge Spécial**: Pays configurés affichent des optimisations spécifiques
- **Plus de 255 pays disponibles** dans la base de données OWID

### 🤖 2. Choix du Modèle ML

#### **Régression Linéaire**

- ⚡ **Complexité**: Faible
- 📊 **Précision**: Moyenne
- 🚀 **Vitesse**: Rapide
- 💡 **Idéal pour**: Tendances simples, données limitées

#### **Forêt Aléatoire** ⭐ Recommandé pour l'Afrique

- ⚡ **Complexité**: Moyenne
- 📊 **Précision**: Élevée
- 🚀 **Vitesse**: Moyenne
- 💡 **Idéal pour**: Relations complexes, pays en développement, données non-linéaires
- 🌍 **Optimisé pour**: Sénégal, Nigeria, Kenya

#### **Gradient Boosting** ⭐ Recommandé pour les Pays Développés

- ⚡ **Complexité**: Élevée
- 📊 **Précision**: Très élevée
- 🚀 **Vitesse**: Lente
- 💡 **Idéal pour**: Prédictions haute précision, gros datasets, données riches
- 🌍 **Optimisé pour**: France, Allemagne, États-Unis, Canada, Afrique du Sud, Maroc

### 📅 3. Horizon de Prédiction

Choisissez la période de prédiction:

- **7 jours**: Prédictions à court terme
- **14 jours**: Horizon standard
- **21 jours**: Tendances moyennes
- **30 jours**: Projections long terme

### 📈 4. Visualisation des Résultats

- **Graphique Interactif**: Courbes avec tooltips détaillés
- **Métriques de Performance**: RMSE, MAE, R² Score
- **Intervalles de Confiance**: Zones d'incertitude
- **Données Historiques**: Comparaison avec les prédictions

---

## 🔌 API Endpoints

### 📊 Health Check

```http
GET /health
```

**Réponse:**

```json
{
  "status": "healthy",
  "service": "OWID COVID-19 Prediction API",
  "version": "2.0",
  "features": [
    "multi-model",
    "country-specific", 
    "senegal-optimized"
  ]
}
```

### 🌍 Liste des Pays

```http
GET /countries
```

**Réponse:**

```json
{
  "total_countries": 255,
  "featured_countries": [
    {
      "name": "Senegal",
      "has_special_config": true,
      "config": {
        "continent": "Africa",
        "recommended_model": "random_forest",
        "vaccination_lag": 30,
        "seasonal_factor": true
      }
    }
  ],
  "other_countries": [...]
}
```

### 🤖 Modèles Disponibles

```http
GET /models
```

**Réponse:**

```json
{
  "available_models": {
    "linear": {
      "name": "Linear Regression",
      "complexity": "Low",
      "accuracy": "Medium"
    },
    "random_forest": {
      "name": "Random Forest",
      "complexity": "Medium",
      "accuracy": "High"
    }
  },
  "recommended_by_country": {
    "Senegal": "random_forest",
    "Nigeria": "random_forest", 
    "Kenya": "random_forest",
    "South Africa": "gradient_boost",
    "Morocco": "gradient_boost",
    "France": "gradient_boost",
    "Germany": "gradient_boost",
    "United Kingdom": "gradient_boost",
    "United States": "gradient_boost",
    "Canada": "gradient_boost"
  }
}
```

### 📈 Génération de Prédictions

```http
GET /predict?country=Senegal&model=random_forest&horizon=14
```

### 🚀 Prédictions Groupées (Nouveau!)

```http
GET /predict_all?model=linear&horizon=7
```

Génère des prédictions pour tous les 10 pays configurés en une seule requête.

**Paramètres:**

- `country`: Nom du pays (obligatoire)
- `model`: Type de modèle (`linear`, `random_forest`, `gradient_boost`)
- `horizon`: Nombre de jours (1-30)
- `data_path`: Chemin vers données OWID (optionnel)

**Réponse:**

```json
{
  "country": "Senegal",
  "model_type": "random_forest",
  "horizon_days": 14,
  "training_samples": 1339,
  "test_samples": 335,
  "features_used": [
    "cases_lag_1", "cases_lag_7", "deaths_lag_1", 
    "vaccinations_lag_7", "seasonal_sin", "seasonal_cos"
  ],
  "metrics": {
    "rmse": 17.5,
    "mae": 15.2,
    "r2_score": 0.881
  },
  "predictions": [
    {
      "date": "2024-08-28",
      "prediction": 34.27
    }
  ],
  "country_config": {
    "continent": "Africa",
    "recommended_model": "random_forest",
    "vaccination_lag": 30
  }
}
```

---

## 🎨 Design et Animations

### 🌟 Glassmorphism Design

L'interface utilise un style glassmorphism moderne avec:

- **Arrière-plans translucides** avec flou
- **Bordures subtiles** en blanc transparent
- **Ombres douces** pour la profondeur
- **Gradients animés** pour les accents

### ⚡ Animations Framer Motion

#### Animations d'Entrée

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
```

#### Interactions Micro

- **Hover**: Échelle 1.02x avec transitions douces
- **Click**: Échelle 0.98x pour le feedback tactile
- **Dropdowns**: Animations de slide avec courbes d'accélération

### 🎨 Palette de Couleurs

```css
/* Couleurs Principales */
--primary-blue: #0ea5e9     /* Bleu océan */
--primary-purple: #8b5cf6   /* Violet moderne */
--success-green: #10b981    /* Vert émeraude */
--warning-orange: #f59e0b   /* Orange ambre */
--error-red: #ef4444        /* Rouge corail */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.1)
--glass-border: rgba(255, 255, 255, 0.2)
--glass-shadow: rgba(0, 0, 0, 0.1)
```

---

## 🚀 Déploiement Production

### 🌐 Frontend (Vercel Recommandé)

```bash
# Build de production
npm run build

# Déploiement Vercel
npx vercel --prod

# Configuration dans vercel.json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "build" }
  }]
}
```

### 🖥️ Backend (Heroku)

```bash
# Créer Procfile
echo "web: python app.py" > Procfile

# Configuration Heroku
heroku create owid-predictor-api
git push heroku main

# Variables d'environnement
heroku config:set FLASK_ENV=production
heroku config:set PORT=5000

# Ajouter Java pour Apache Spark
heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 heroku/java
```

### 🐳 Docker (Alternative)

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

---

## 🧪 Tests et Développement

### ✅ Tests Frontend

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm test -- --watch
```

### 🔍 Tests API Backend

```bash
# Test des endpoints
curl "http://localhost:5000/health"
curl "http://localhost:5000/countries"
curl "http://localhost:5000/predict?country=Senegal&model=random_forest&horizon=7"
curl "http://localhost:5000/predict_all?model=linear&horizon=7"
```

### 📊 Métriques de Performance

**Objectifs Frontend:**

- ⚡ First Contentful Paint < 1.5s
- 🎯 Largest Contentful Paint < 2.5s
- 🚀 Time to Interactive < 3.5s

**Métriques Backend:**

- 🔥 Temps de réponse API < 200ms
- 💾 Utilisation mémoire < 512MB

---

## 🐛 Dépannage

### ❌ Problèmes Courants

#### **CORS Errors**

```bash
# Vérifier les ports
Backend: http://localhost:5000 ✓
Frontend: http://localhost:3000 ✓

# Redémarrer les serveurs si nécessaire
```

#### **Port Déjà Utilisé**

```bash
# Windows: Trouver et tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Alternative: Changer de port dans app.py
python -c "from app import app; app.run(port=5002)"
```

#### **Modules Python Manquants**

```bash
# Réinstaller l'environnement
deactivate
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### **Styles Tailwind Non Appliqués**

```bash
# Vérifier postcss.config.js
npm install
npm start
```

---

## 📞 Support et Contribution

### 🤝 Comment Contribuer

1. **Fork** le projet
2. Créer une **branche feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit** les modifications (`git commit -m 'Add: Amazing Feature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### 📚 Ressources Utiles

- [Documentation React](https://reactjs.org/docs)
- [Framer Motion](https://framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com)

### 🐞 Signaler un Bug

Utilisez les **GitHub Issues** pour signaler des bugs ou demander des fonctionnalités.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🏆 Crédits

Développé avec ❤️ pour la prédiction intelligente des cas COVID-19, avec des optimisations spéciales pour 10 pays stratégiques incluant 5 pays africains (Sénégal, Nigeria, Kenya, Afrique du Sud, Maroc) et 5 pays développés.

**Technologies clés:** React • Flask • Apache Spark • Framer Motion • Tailwind CSS • PySpark ML • Recharts

**Données:** Our World in Data (OWID) - Plus de 429,000 enregistrements COVID-19 avec 67 variables détaillées

**Optimisations régionales:** Modèles spécialisés par continent avec configurations adaptées aux caractéristiques épidémiologiques et socio-économiques de chaque région.
