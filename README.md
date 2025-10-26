# 📊 SEN Prediction

Une application web moderne de prédiction COVID-19 utilisant l'intelligence artificielle et des modèles d'apprentissage automatique avancés, avec une interface utilisateur primée et des optimisations spécifiques pour 10 pays stratégiques.

## 🎯 Aperçu du Projet

SEN Prediction combine des visualisations de données interactives avec des modèles ML sophistiqués pour fournir des prédictions précises des cas COVID-19. L'application utilise React avec des animations Framer Motion fluides et un backend Flask robuste avec Apache Spark et plusieurs algorithmes d'apprentissage automatique avancés.

### ✨ Fonctionnalités Principales

- 🌍 **10 Pays Configurés** - 5 pays africains + 5 pays développés avec optimisations spécifiques
- 🤖 **Modèles ML Multiples** - Régression linéaire, Forêt aléatoire, Gradient Boosting
- 📈 **Visualisations Interactives** - Graphiques avec intervalles de confiance
- 🎨 **Interface Moderne** - Design glassmorphism avec animations fluides
- ⚡ **Performance Optimisée** - Apache Spark pour le traitement des données à grande échelle
- 🌟 **Données Réelles** - Plus de 429,000 enregistrements avec 67 variables
- 🎯 **Prédictions Spécialisées** - Modèles recommandés par pays et continent
- 🌐 **Internationalisation** - Support complet français/anglais avec détection automatique
- 🔄 **Mode Hors-ligne** - Données de fallback et prédictions simulées

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

### ⚙️ Configuration des Environnements

Le projet utilise un module de configuration centralisé pour gérer les URLs d'API selon l'environnement :

**Fichier:** `frontend/src/config/environments.js`

```javascript
const environments = {
  development: {
    API_BASE_URL: "http://localhost:5000",
  },
  production: {
    API_BASE_URL: "https://your-production-api.com",
  },
  staging: {
    API_BASE_URL: "https://your-staging-api.com",
  },
};
```

**Avantages:**

- ✅ Configuration centralisée des URLs d'API
- ✅ Basculement automatique selon `NODE_ENV`
- ✅ Pas besoin de modifier le code pour changer d'environnement

### ⚡ Installation Rapide

#### 1. Cloner le Projet

```bash
git clone <votre-repository>
cd SEN-Prediction
```

#### 2. Configuration Backend

```bash
# Naviguer vers le backend
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel

  # Windows (Command Prompt Terminal):
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
SEN-Prediction/
├── backend/                     # API Flask et modèles ML
│   ├── app.py                  # Serveur principal avec Apache Spark
│   ├── simple_app.py           # Version simplifiée (optionnelle)
│   ├── spark_model.py          # Modèles ML avec Spark
│   ├── requirements.txt        # Dépendances Python
│   └── owid-covid-data-sample.csv  # Données réelles (429k+ enregistrements)
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── CountrySelector.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   ├── OfflineNotice.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── BackgroundElements.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MetricsDisplay.jsx
│   │   │   └── ...
│   │   ├── config/             # Configuration et environnements
│   │   │   └── environments.js # Configuration API par environnement
│   │   ├── hooks/              # Hooks personnalisés
│   │   │   └── useApi.js       # Hook API avec fallback offline
│   │   ├── i18n.js             # Configuration internationalisation
│   │   ├── App.js              # Composant racine
│   │   ├── index.css           # Styles globaux
│   │   └── index.js            # Point d'entrée
│   ├── public/
│   │   └── locales/            # Fichiers de traduction
│   │       ├── en/             # Traductions anglaises
│   │       └── fr/             # Traductions françaises
│   ├── package.json
│   └── tailwind.config.js      # Configuration Tailwind
└── README.md                   # Ce fichier
```

### 🔧 Technologies Utilisées

#### Frontend

| Technologie       | Version  | Usage                               |
| ----------------- | -------- | ----------------------------------- |
| **React**         | 18.2.0   | Framework UI principal              |
| **Framer Motion** | 10.16.16 | Animations et transitions           |
| **Tailwind CSS**  | 3.3.6    | Framework CSS utilitaire            |
| **Recharts**      | 2.8.0    | Visualisation de données            |
| **Lucide React**  | 0.294.0  | Bibliothèque d'icônes               |
| **i18next**       | 25.4.2   | Internationalisation                |
| **react-i18next** | 15.7.3   | Intégration React i18n              |
| **clsx**          | 2.0.0    | Gestion classes CSS conditionnelles |

#### Backend

| Technologie      | Usage                                  |
| ---------------- | -------------------------------------- |
| **Flask**        | Framework web Python                   |
| **Apache Spark** | Traitement de données à grande échelle |
| **PySpark ML**   | Modèles d'apprentissage automatique    |
| **scikit-learn** | Modèles ML (version simplifiée)        |
| **pandas**       | Manipulation de données                |
| **numpy**        | Calculs numériques                     |
| **CORS**         | Support cross-origin                   |

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
  "service": "SEN Prediction API",
  "version": "2.0",
  "features": ["multi-model", "country-specific", "senegal-optimized"]
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

Génère des prédictions pour tous les 10 pays configurés en une seule requête avec leurs modèles recommandés.

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
    "cases_lag_1",
    "cases_lag_3",
    "cases_lag_7",
    "cases_lag_14",
    "deaths_lag_1",
    "deaths_lag_7",
    "vaccinations_lag_7",
    "stringency_lag_1",
    "seasonal_sin",
    "seasonal_cos"
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
    "population_density_threshold": 83,
    "gdp_per_capita_range": [1000, 2000],
    "vaccination_lag": 30,
    "seasonal_factor": true,
    "recommended_model": "random_forest"
  },
  "model_info": {
    "name": "Forêt Aléatoire",
    "description": "Modèle ensembliste robuste aux valeurs aberrantes",
    "best_for": ["données complexes", "relations non-linéaires"]
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

## � Normalisation des Métriques (R²)

### Pourquoi normaliser ?

Le score R² brut (
coefficient de détermination) peut devenir négatif lorsque le modèle performe moins bien qu'une simple moyenne naïve. Cela provoquait dans l'UI des pourcentages « -104.7% » peu lisibles.

### Stratégie Implémentée

- Le backend calcule toujours le `r2_score` brut via Spark ML.
- Un champ supplémentaire `r2_score_normalized` est ajouté dans `metrics` :
  - `r2_score_normalized = clamp(r2_score, 0.0, 1.0)`
  - Valeur utilisée pour l'affichage (barre de progression + badge %).
- Si le R² brut est négatif, une note contextuelle apparaît en UI: _« R² brut négatif – valeur plafonnée à 0% pour une meilleure lisibilité »_.

### Avantages

- ✅ UX plus propre (0–100%)
- ✅ Diagnostic préservé (R² brut disponible si besoin futur d'export)
- ✅ Évite de fausses interprétations utilisateur

### Exemple de Payload API (extrait)

```json
{
  "metrics": {
    "rmse": 42.1,
    "mae": 31.4,
    "r2_score": -0.1479,
    "r2_score_normalized": 0.0
  }
}
```

---

## 🧭 Composants Dropdown Unifiés (Country / Model / Cleaning Level)

### Objectifs

- Harmonisation visuelle : accent vertical animé + glassmorphism.
- Accessibilité clavier : navigation ↑ / ↓ / Home / End / Entrée / Échap.
- Respect de `prefers-reduced-motion`.
- Micro-interactions cohérentes (hover, focus, sélection, recommandation).

### Fonctionnalités Clés

| Composant             | Accent dynamique          | Clavier | Tooltip / Info            | Reduced Motion | Badge Recommandé    |
| --------------------- | ------------------------- | ------- | ------------------------- | -------------- | ------------------- |
| CountrySelector       | Bar verticale gradient    | Oui     | Section labels            | Oui            | Pays optimisés      |
| ModelSelector         | Bar verticale gradient    | Oui     | Specs (complexity, speed) | Oui            | Modèle recommandé   |
| CleaningLevelSelector | Bar + gradient par niveau | Oui     | Tooltip use-case          | Oui            | Standard par défaut |

### Patterns d'Animation

| Élément            | Entrée                        | Sortie      | Hover                | Sélection              |
| ------------------ | ----------------------------- | ----------- | -------------------- | ---------------------- |
| Panel              | Fade + y:-6 (0.25s)           | Fade + y:-6 | Accent bar fade in   | Accent bar persistante |
| Items              | Stagger léger (12ms \* index) | Fade + y:-2 | Légère translation x | Anneau + fond atténué  |
| Tooltip (Cleaning) | Fade + (scale 0.98 → 1)       | Fade        | —                    | —                      |

### Accessibilité

- Rôles utilisés: `listbox`, `option`, attributs `aria-selected`, `aria-activedescendant`.
- Focus retour automatisé au bouton déclencheur après sélection.
- Tooltip marqué `role="note"`.
- Footer informatif `aria-live="polite"` (extensible pour messages dynamiques).

### Bonnes Pratiques Résumées

- Limiter les animations complexes sur l'ouverture (latence perçue < 300ms).
- Conserver une hiérarchie visuelle claire : featured ≠ others (luminance + densité).
- Offrir un chemin clair de navigation sans souris.
- Ne jamais bloquer la fermeture avec ESC + clic extérieur.

### Extension Future (Suggestions)

1. Extraction d'un hook `useAccessibleDropdown()` pour éliminer duplication.
2. Support ARIA multi-sélection (si ajout de filtres combinés).
3. Mode "compact" auto en dessous de 340px de hauteur viewport.

---

## 🛡️ Qualité & Observabilité (Roadmap)

Non encore implémenté mais prévu :
| Axe | Idée | Bénéfice |
|-----|------|----------|
| Monitoring | Ajout de métriques Prometheus côté backend | Suivi perf/erreurs |
| Logging structuré | JSON logs (correlation id) | Debug amélioré |
| Tests UI | Storybook + Chromatic visual diffs | Régression visuelle évitée |
| Export | Endpoint `/export?country=...` CSV/Parquet | Intégration pipelines |

---

---

## �🚀 Déploiement Production

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

#### Variables d'environnement (sans Secrets Vercel)

- Vercel n'utilise plus les "Secrets" historiques référencés par `@…`. Notre `vercel.json` n'embarque donc pas de clé `env` et ne référence plus `@api-url`.
- Pour définir l'URL de l'API en production, ajoutez la variable de projet suivante dans Vercel:
  - Clé: `REACT_APP_API_URL`
  - Valeur: `https://votre-backend.exemple.com`
  - Environnements: Production (et Preview/Development si besoin)

Via CLI (depuis `frontend/`, projet lié):

````bash
### 🖥️ Backend (Heroku)

```bash
````

Important:

- Create React App injecte `REACT_APP_*` au moment du build. Après toute modification de variable, relancez un déploiement.
- Si vous voyez encore des références `@api-url` dans des docs anciennes, ignorez-les: elles ne sont plus utilisées.

#### Astuce build (npm ERESOLVE)

Si le build Vercel échoue avec un conflit de dépendances lié à TypeScript et `react-scripts@5`, figez TypeScript sur `4.9.5` (déjà appliqué dans ce repo):

```json
# Créer Procfile
echo "web: python app.py" > Procfile

# Configuration Heroku
heroku create sen-prediction-api
git push heroku main

# Variables d'environnement
```

heroku config:set FLASK_ENV=production
heroku config:set PORT=5000

# Ajouter Java pour Apache Spark

heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 heroku/java

````

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
````

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

### 🌐 Tests Internationalisation

```bash
# Tester les traductions
# Vérifier les fichiers dans public/locales/
# Basculer entre FR/EN via l'interface
# Tester la détection automatique de langue
```

### 🔍 Tests API Backend

```bash
# Test des endpoints
curl "http://localhost:5000/health"
curl "http://localhost:5000/countries"
curl "http://localhost:5000/predict?country=Senegal&model=random_forest&horizon=7"
curl "http://localhost:5000/predict_all?model=linear&horizon=7"

# Test avec données de fallback (serveur éteint)
# L'application doit fonctionner en mode offline
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

### 🆕 Nouvelles Fonctionnalités (Version 2.0)

- ✨ **Internationalisation complète** - Interface en français et anglais
- 🌐 **Détection automatique de langue** - Basée sur les préférences du navigateur
- 🔄 **Mode hors-ligne robuste** - Données de fallback et prédictions simulées
- 📊 **Métriques enrichies** - Plus de features pour les modèles ML
- 🎨 **Interface améliorée** - Composants LanguageSwitcher et BackgroundElements
- ⚡ **Gestion d'erreurs avancée** - Fallback gracieux et notifications utilisateur
- 🔧 **Configuration par pays étendue** - 10 configurations spécialisées détaillées

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
- [Apache Spark PySpark](https://spark.apache.org/docs/latest/api/python/)
- [i18next Documentation](https://www.i18next.com/)
- [React i18next](https://react.i18next.com/)
- [Our World in Data](https://ourworldindata.org/coronavirus)

### 🐞 Signaler un Bug

Utilisez les **GitHub Issues** pour signaler des bugs ou demander des fonctionnalités.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🏆 Crédits

Développé avec ❤️ pour la prédiction intelligente des cas COVID-19, avec des optimisations spéciales pour 10 pays stratégiques incluant 5 pays africains (Sénégal, Nigeria, Kenya, Afrique du Sud, Maroc) et 5 pays développés.

**Technologies clés:** React • Flask • Apache Spark • Framer Motion • Tailwind CSS • PySpark ML • Recharts

**Données:** Our World in Data - Plus de 429,000+ enregistrements COVID-19 avec 67 variables détaillées

**Optimisations régionales:** Modèles spécialisés par continent avec configurations adaptées aux caractéristiques épidémiologiques et socio-économiques de chaque région.

**Langues supportées:** 🇫🇷 Français • 🇺🇸 English - Interface complètement internationalisée avec détection automatique

**Architecture moderne:** Mode SPA React avec fallback offline, animations fluides Framer Motion, et backend Spark haute performance
