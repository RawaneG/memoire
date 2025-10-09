# 🚀 Guide de Déploiement OWID Predictor

Ce guide vous explique comment déployer automatiquement le frontend et le backend de votre application.

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Configuration Initiale](#configuration-initiale)
- [Déploiement Automatique](#déploiement-automatique)
- [Déploiement Manuel](#déploiement-manuel)
- [Variables d'Environnement](#variables-denvironnement)
- [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Comptes Nécessaires

1. **GitHub Account** - Pour héberger le code et CI/CD
2. **Vercel Account** - Pour le frontend (gratuit)
3. **Render Account** - Pour le backend (gratuit)

### Outils Locaux

```bash
node >= 16.0.0
npm >= 8.0.0
git >= 2.0.0
```

---

## ⚙️ Configuration Initiale

### 1. Configuration Backend (Render)

#### A. Créer un Service sur Render

1. Allez sur [render.com](https://render.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur **"New +"** → **"Web Service"**
4. Connectez votre repository GitHub
5. Configuration du service:
   - **Name**: `owid-predictor-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Plan**: `Free`

6. Variables d'environnement:
   ```
   FLASK_ENV=production
   PYTHON_VERSION=3.9.18
   ```

7. Cliquez sur **"Create Web Service"**

#### B. Récupérer les Credentials Render

1. Allez dans **Account Settings** → **API Keys**
2. Créez une nouvelle API Key
3. Copiez votre `RENDER_API_KEY`
4. Sur votre service, copiez le `Service ID` depuis l'URL (ex: `srv-xxxxx`)

### 2. Configuration Frontend (Vercel)

#### A. Installer Vercel CLI

```bash
cd frontend
npm install -g vercel
```

#### B. Premier Déploiement

```bash
vercel login
vercel
```

Suivez les instructions:
- Link to existing project? **No**
- Project name: `owid-predictor`
- In which directory is your code located? `./`
- Want to override settings? **No**

#### C. Récupérer les Credentials Vercel

```bash
# Ces commandes afficheront vos IDs
vercel env ls
```

Ou depuis le dashboard Vercel:
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **General**:
   - Copiez le **Project ID**
4. **Account Settings** → **Tokens**:
   - Créez un nouveau token
   - Copiez le **VERCEL_TOKEN**
5. Votre **ORG_ID** se trouve dans l'URL: `vercel.com/[org-id]/...`

### 3. Configuration GitHub Secrets

1. Allez sur votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. Ajoutez les secrets suivants:

```
RENDER_API_KEY=votre_render_api_key
RENDER_SERVICE_ID=srv-xxxxx

VERCEL_TOKEN=votre_vercel_token
VERCEL_ORG_ID=votre_org_id
VERCEL_PROJECT_ID=votre_project_id
```

### 4. Mettre à Jour l'URL du Backend

Une fois votre backend déployé sur Render:

1. Copiez l'URL de votre service (ex: `https://owid-predictor-api.onrender.com`)
2. Mettez à jour `frontend/src/config/environments.js`:

```javascript
production: {
  API_BASE_URL: 'https://owid-predictor-api.onrender.com',
}
```

Ou configurez-le comme variable d'environnement sur Vercel:

```bash
vercel env add REACT_APP_API_URL production
# Entrez: https://owid-predictor-api.onrender.com
```

---

## 🤖 Déploiement Automatique

### Déploiement sur Push

Une fois les secrets GitHub configurés, chaque push sur la branche `main` déclenche automatiquement:

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

✅ **Frontend** et **Backend** seront déployés automatiquement!

### Déploiement via GitHub Actions (Interface Web)

1. Allez sur votre repository GitHub
2. Onglet **"Actions"**
3. Sélectionnez le workflow:
   - **"Deploy Frontend and Backend"** - Déploie tout
   - **"Deploy Frontend Only"** - Déploie uniquement le frontend
   - **"Deploy Backend Only"** - Déploie uniquement le backend
4. Cliquez sur **"Run workflow"**
5. Sélectionnez la branche et lancez

---

## 🛠️ Déploiement Manuel

### Frontend (Vercel)

```bash
cd frontend

# Déploiement en production
npm run deploy

# Déploiement de preview (pour tester)
npm run deploy:preview
```

### Backend (Render)

Le backend se déploie automatiquement à chaque push. Pour forcer un redéploiement:

1. Allez sur le dashboard Render
2. Sélectionnez votre service
3. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

Ou via l'API:

```bash
curl -X POST "https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": false}'
```

---

## 🔐 Variables d'Environnement

### Backend (Render)

Variables configurées sur Render Dashboard:

```env
FLASK_ENV=production
PYTHON_VERSION=3.9.18
PORT=[auto-généré]
```

### Frontend (Vercel)

Variables configurées sur Vercel Dashboard ou via CLI:

```env
REACT_APP_API_URL=https://owid-predictor-api.onrender.com
NODE_ENV=production
```

Pour ajouter via CLI:

```bash
vercel env add REACT_APP_API_URL production
```

---

## 🩺 Dépannage

### ❌ Backend ne démarre pas sur Render

**Problème**: Out of Memory (OOM)

**Solution**: Apache Spark utilise beaucoup de RAM. Sur le plan gratuit (512MB):

1. Option 1 - Utiliser `simple_app.py`:
   ```yaml
   # Dans render.yaml
   startCommand: gunicorn simple_app:app --bind 0.0.0.0:$PORT
   ```

2. Option 2 - Passer au plan payant (7$/mois pour 2GB RAM)

### ❌ Frontend ne se connecte pas au Backend

**Problème**: CORS ou URL incorrecte

**Solutions**:
1. Vérifiez l'URL dans `environments.js`
2. Vérifiez que le backend est bien déployé et accessible
3. Testez l'endpoint: `https://votre-backend.onrender.com/health`

### ❌ GitHub Actions échoue

**Problème**: Secrets manquants ou incorrects

**Solution**:
1. Vérifiez que tous les secrets sont configurés dans GitHub
2. Vérifiez l'orthographe des noms de secrets
3. Consultez les logs d'erreur dans l'onglet Actions

### 🐌 Backend lent sur le plan gratuit Render

**Causes**:
- Cold start: Render met en veille les services inactifs (15 min)
- Première requête après réveil: ~30-60 secondes

**Solutions**:
1. Passer au plan payant (pas de cold start)
2. Utiliser un service de ping (ex: UptimeRobot) pour garder le service actif
3. Ajouter un message de chargement dans le frontend

### 📊 Monitoring

#### Vérifier le statut du Backend

```bash
curl https://votre-backend.onrender.com/health
```

Réponse attendue:
```json
{
  "status": "healthy",
  "service": "OWID COVID-19 Prediction API",
  "version": "2.0"
}
```

#### Logs Backend (Render)

1. Dashboard Render → Votre service
2. Onglet **"Logs"**

#### Logs Frontend (Vercel)

1. Dashboard Vercel → Votre projet
2. **Deployments** → Cliquez sur un déploiement
3. Onglet **"Build Logs"** ou **"Function Logs"**

---

## 📝 Commandes Rapides Résumées

```bash
# Déploiement Frontend
cd frontend && npm run deploy

# Déploiement Backend (via GitHub)
git push origin main

# Logs Backend
# Voir sur dashboard.render.com

# Logs Frontend
# Voir sur vercel.com/dashboard

# Test endpoint Backend
curl https://votre-backend.onrender.com/health

# Test Frontend
# Ouvrir https://votre-frontend.vercel.app dans le navigateur
```

---

## 🎯 Workflow Recommandé

1. **Développement local**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   venv\Scripts\activate
   python app.py

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Tester localement** → Tout fonctionne ✅

3. **Commit et Push**:
   ```bash
   git add .
   git commit -m "feat: ma nouvelle fonctionnalité"
   git push origin main
   ```

4. **Déploiement automatique** → GitHub Actions déploie frontend + backend

5. **Vérifier** → Tester sur les URLs de production

---

## 🆘 Support

Si vous rencontrez des problèmes:

1. Consultez les logs (Render + Vercel)
2. Vérifiez les [GitHub Actions logs](https://github.com/RawaneG/memoire/actions)
3. Testez les endpoints manuellement
4. Vérifiez les variables d'environnement

---

## 🔗 Liens Utiles

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gunicorn Documentation](https://docs.gunicorn.org/)

---

✨ **Bon déploiement !** 🚀
