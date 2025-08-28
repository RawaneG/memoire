# 📊 OWID COVID-19 Predictor

Une application web moderne de prédiction COVID-19 utilisant l'intelligence artificielle et des modèles d'apprentissage automatique avancés, avec une interface utilisateur primée et des optimisations spécifiques pour le Sénégal.

## 🎯 Aperçu du Projet

OWID Predictor combine des visualisations de données interactives avec des modèles ML sophistiqués pour fournir des prédictions précises des cas COVID-19. L'application utilise React avec des animations Framer Motion fluides et un backend Flask robuste avec plusieurs algorithmes d'apprentissage automatique.

### ✨ Fonctionnalités Principales

- 🌍 **Sélection de Pays Intelligent** - Recherche en temps réel avec pays vedettes
- 🤖 **Modèles ML Multiples** - Régression linéaire, Forêt aléatoire, Gradient Boosting
- 📈 **Visualisations Interactives** - Graphiques avec intervalles de confiance
- 🎨 **Interface Moderne** - Design glassmorphism avec animations fluides
- ⚡ **Performance Optimisée** - Chargement rapide et interactions responsives
- 🌟 **Optimisations Spécifiques** - Configuration spéciale pour le Sénégal

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

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python simple_app.py
```

Le backend sera disponible sur `http://localhost:5001`

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
│   ├── simple_app.py           # Serveur principal
│   ├── app.py                  # Version avec Spark (optionnelle)
│   ├── spark_model.py          # Modèles ML avec Spark
│   ├── requirements.txt        # Dépendances Python
│   └── owid-covid-data-sample.csv  # Données d'exemple
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

| Technologie      | Usage                               |
| ---------------- | ----------------------------------- |
| **Flask**        | Framework web Python                |
| **scikit-learn** | Modèles d'apprentissage automatique |
| **pandas**       | Manipulation de données             |
| **numpy**        | Calculs numériques                  |
| **CORS**         | Support cross-origin                |

---

## 🎨 Guide d'Utilisation

### 🌍 1. Sélection du Pays

- **Pays Vedettes**: Sénégal (optimisé), France, Allemagne
- **Recherche**: Tapez pour filtrer la liste des pays
- **Badge Spécial**: Le Sénégal affiche "Optimized" pour les configurations spéciales

### 🤖 2. Choix du Modèle ML

#### **Régression Linéaire**

- ⚡ **Complexité**: Faible
- 📊 **Précision**: Moyenne
- 🚀 **Vitesse**: Rapide
- 💡 **Idéal pour**: Tendances simples, données limitées

#### **Forêt Aléatoire** ⭐ Recommandé pour le Sénégal

- ⚡ **Complexité**: Moyenne
- 📊 **Précision**: Élevée
- 🚀 **Vitesse**: Moyenne
- 💡 **Idéal pour**: Relations complexes, données non-linéaires

#### **Gradient Boosting**

- ⚡ **Complexité**: Élevée
- 📊 **Précision**: Très élevée
- 🚀 **Vitesse**: Lente
- 💡 **Idéal pour**: Prédictions haute précision, gros datasets

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
  "version": "2.0-simple"
}
```

### 🌍 Liste des Pays

```http
GET /countries
```

**Réponse:**

```json
{
  "total_countries": 9,
  "featured_countries": [
    {
      "name": "Senegal",
      "has_special_config": true
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
    "Senegal": "random_forest"
  }
}
```

### 📈 Génération de Prédictions

```http
GET /predict?country=Senegal&model=random_forest&horizon=14
```

**Paramètres:**

- `country`: Nom du pays (obligatoire)
- `model`: Type de modèle (`linear`, `random_forest`, `gradient_boost`)
- `horizon`: Nombre de jours (1-30)

**Réponse:**

```json
{
  "country": "Senegal",
  "model_type": "random_forest",
  "horizon_days": 14,
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
echo "web: python simple_app.py" > Procfile

# Configuration Heroku
heroku create owid-predictor-api
git push heroku main

# Variables d'environnement
heroku config:set FLASK_ENV=production
heroku config:set PORT=5000
```

### 🐳 Docker (Alternative)

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "simple_app.py"]
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
curl "http://localhost:5001/health"
curl "http://localhost:5001/countries"
curl "http://localhost:5001/predict?country=Senegal&model=random_forest&horizon=7"
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
Backend: http://localhost:5001 ✓
Frontend: http://localhost:3000 ✓

# Redémarrer les serveurs si nécessaire
```

#### **Port Déjà Utilisé**

```bash
# Windows: Trouver et tuer le processus
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Alternative: Changer de port
python -c "from simple_app import app; app.run(port=5002)"
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

Développé avec ❤️ pour la prédiction intelligente des cas COVID-19, avec des optimisations spéciales pour le Sénégal et l'Afrique de l'Ouest.

**Technologies clés:** React • Flask • Framer Motion • Tailwind CSS • scikit-learn • Recharts
