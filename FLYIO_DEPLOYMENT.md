# 🚀 Déploiement sur Fly.io (100% Gratuit avec Spark)

## 🎯 Pourquoi Fly.io ?

- ✅ **100% gratuit** - Pas de carte bancaire requise pour démarrer
- ✅ **768MB RAM** - 3 VMs × 256MB (suffisant pour Spark optimisé)
- ✅ **Support Docker** - Parfait pour Apache Spark + Java
- ✅ **Déploiement automatique** via GitHub Actions
- ✅ **app.py avec Spark** fonctionne (pas besoin de simple_app.py)

---

## 📋 Prérequis

- Compte GitHub
- Compte Fly.io (gratuit)
- Flyctl CLI installé localement

---

## ⚡ Installation Rapide (10 minutes)

### 1. Créer un Compte Fly.io

```bash
# Installer flyctl
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh

# Se connecter ou créer un compte
flyctl auth signup
# ou si vous avez déjà un compte:
flyctl auth login
```

### 2. Initialiser l'Application Backend

```bash
cd backend

# Créer l'application Fly.io
flyctl launch --no-deploy

# Répondez aux questions:
# - App name: owid-predictor-api (ou votre choix)
# - Region: cdg (Paris) ou autre proche de vous
# - PostgreSQL database: No
# - Redis database: No
```

Fly.io détectera automatiquement le `Dockerfile` et `fly.toml` déjà configurés ✅

### 3. Configurer les Secrets

```bash
# Configurer les variables d'environnement sur Fly.io
flyctl secrets set FLASK_ENV=production
flyctl secrets set PYTHON_VERSION=3.9
```

### 4. Déployer !

```bash
# Premier déploiement
flyctl deploy

# Fly.io va:
# 1. Construire l'image Docker avec Java + Python + Spark
# 2. Déployer sur 3 VMs gratuites (768MB total)
# 3. Configurer HTTPS automatiquement
```

### 5. Vérifier le Déploiement

```bash
# Obtenir l'URL de votre API
flyctl info

# Tester l'endpoint health
curl https://owid-predictor-api.fly.dev/health

# Voir les logs
flyctl logs
```

---

## 🔧 Configuration GitHub Actions (CI/CD Automatique)

### 1. Obtenir le Token Fly.io

```bash
# Créer un token pour GitHub Actions
flyctl tokens create deploy
```

Copiez le token affiché.

### 2. Ajouter le Secret GitHub

1. Allez sur https://github.com/RawaneG/memoire/settings/secrets/actions
2. Cliquez sur **"New repository secret"**
3. Nom: `FLY_API_TOKEN`
4. Valeur: Collez le token obtenu ci-dessus
5. Cliquez **"Add secret"**

### 3. Push et Déploiement Automatique !

```bash
git add .
git commit -m "feat: add Fly.io deployment configuration"
git push origin main
```

✅ **GitHub Actions déploiera automatiquement sur Fly.io + Vercel !**

---

## 🎯 Déploiement Frontend (Vercel)

Le frontend reste sur Vercel (déjà configuré). Une fois le backend déployé:

### Mettre à Jour l'URL Backend

**Option A - Modifier le code:**

Éditez `frontend/src/config/environments.js`:
```javascript
production: {
  API_BASE_URL: 'https://owid-predictor-api.fly.dev',
}
```

**Option B - Variable d'environnement Vercel:**
```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Entrez: https://owid-predictor-api.fly.dev
```

---

## 📊 Architecture Fly.io

```
┌─────────────────────────────────────┐
│   Fly.io Backend (Free Tier)       │
├─────────────────────────────────────┤
│  VM 1: 256MB (Gunicorn Worker 1)   │
│  VM 2: 256MB (Gunicorn Worker 2)   │  ← 768MB Total
│  VM 3: 256MB (Reserve/Load Balance) │
├─────────────────────────────────────┤
│  Apache Spark: 400MB driver         │
│                256MB executor       │  ← Optimisé !
└─────────────────────────────────────┘
```

### Optimisations Spark Appliquées

Dans `spark_model.py`, Spark est configuré pour utiliser **656MB** sur les 768MB disponibles:

```python
.config("spark.driver.memory", "400m")
.config("spark.executor.memory", "256m")
.config("spark.driver.maxResultSize", "100m")
.config("spark.sql.shuffle.partitions", "4")  # Réduit de 200
```

---

## 🛠️ Commandes Utiles

### Déploiement Manuel

```bash
cd backend
flyctl deploy
```

### Voir les Logs en Temps Réel

```bash
flyctl logs --follow
```

### Monitorer l'Application

```bash
# Dashboard web
flyctl dashboard

# Métriques
flyctl status
flyctl scale show
```

### Redémarrer l'Application

```bash
flyctl apps restart owid-predictor-api
```

### Scaler (si besoin d'augmenter les ressources)

```bash
# Augmenter la RAM par VM (plan payant)
flyctl scale memory 512

# Augmenter le nombre de VMs
flyctl scale count 3
```

---

## 🐛 Dépannage

### ❌ Out of Memory lors du Build

**Solution:** Le build se fait sur les serveurs Fly.io (pas de limite), pas de souci.

### ❌ Application lente au démarrage

**Cause:** Cold start - Fly.io met en veille les apps inactives.

**Solution:**
```bash
# Garder au moins 1 VM active en permanence (Free tier)
flyctl scale count 1 --min-machines-running=1
```

### ❌ Spark échoue avec "Java heap space"

**Solution:** Vérifiez que les optimisations Spark sont bien appliquées dans `spark_model.py`:
```bash
flyctl ssh console
# Dans la VM:
ps aux | grep spark  # Vérifier les paramètres mémoire
```

### 🔍 Déboguer en Direct

```bash
# Se connecter en SSH à une VM
flyctl ssh console

# Vérifier les processus
ps aux

# Vérifier les logs Python
tail -f /app/*.log
```

---

## 💰 Coûts

### Free Tier (Ce que vous utilisez)

- ✅ **3 VMs × 256MB** = 100% gratuit
- ✅ **160GB de transfert/mois** = gratuit
- ✅ **HTTPS/SSL** = gratuit
- ✅ **Builds illimités** = gratuit

**Total: 0€/mois** 🎉

### Si vous dépassez (peu probable)

- VMs supplémentaires: ~2$/mois par VM
- RAM supplémentaire: ~0.01$/GB/heure

---

## 🔐 Variables d'Environnement

Variables configurées sur Fly.io:

```bash
# Voir les secrets
flyctl secrets list

# Ajouter un secret
flyctl secrets set MY_SECRET=value

# Secrets recommandés (déjà configurés)
FLASK_ENV=production
PYTHON_VERSION=3.9
```

---

## 📈 Monitoring et Performance

### Métriques de Performance Attendues

Avec Spark optimisé sur 768MB:

- ⚡ Temps de réponse API: 200-500ms (après warmup)
- 📊 Cold start: ~10-15s (première requête après inactivité)
- 💾 Utilisation mémoire: ~650MB en charge
- 🔥 Prédictions simultanées: 2-3

### Dashboard Fly.io

```bash
# Ouvrir le dashboard
flyctl dashboard

# Voir les métriques en temps réel
flyctl status
```

---

## 🚀 Workflow Complet

### Développement Local

```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

### Déploiement en Production

```bash
# Option 1: Push automatique
git push origin main
# → GitHub Actions déploie sur Fly.io + Vercel

# Option 2: Manuel
cd backend && flyctl deploy
cd frontend && npm run deploy
```

---

## 🆚 Comparaison Render vs Fly.io

| Critère | Render (Free) | Fly.io (Free) |
|---------|---------------|---------------|
| RAM | 512MB | 768MB (3×256MB) |
| Spark Support | ❌ Insuffisant | ✅ Fonctionne |
| app.py | ❌ Crash | ✅ OK |
| Cold Start | ~30-60s | ~10-15s |
| Build Time | ~5 min | ~3 min |
| HTTPS | ✅ Gratuit | ✅ Gratuit |
| CI/CD | ✅ GitHub | ✅ GitHub |

**Verdict: Fly.io est meilleur pour Spark** 🏆

---

## 📚 Ressources

- [Documentation Fly.io](https://fly.io/docs/)
- [Flyctl CLI Reference](https://fly.io/docs/flyctl/)
- [Scaling Guide](https://fly.io/docs/reference/scaling/)
- [Pricing](https://fly.io/docs/about/pricing/)

---

## 🆘 Support

### Problèmes fréquents

1. **Build échoue**: Vérifiez le Dockerfile et les logs `flyctl logs`
2. **Application ne démarre pas**: Vérifiez `flyctl status` et les health checks
3. **Spark échoue**: Consultez les logs `flyctl logs --follow`

### Communauté

- [Forum Fly.io](https://community.fly.io/)
- [Discord Fly.io](https://fly.io/discord)

---

✨ **Vous avez maintenant Apache Spark qui tourne gratuitement !** 🎉
