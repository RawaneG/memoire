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
3. **Compte Backend** - Hébergeur au choix (ex: Fly.io)

### Outils Locaux

```bash
node >= 16.0.0
npm >= 8.0.0
git >= 2.0.0
```

---

## ⚙️ Configuration Initiale

### 1. Configuration Backend (Générique)

Déployez l'API Flask (`backend/`) sur l’hébergeur de votre choix (ex: Fly.io). Assurez‑vous d’obtenir une URL publique, par exemple: `https://votre-backend.example.com`.

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

### 3. Configuration GitHub Secrets (optionnel)

1. Allez sur votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. Ajoutez les secrets suivants:

```
VERCEL_TOKEN=votre_vercel_token
VERCEL_ORG_ID=votre_org_id
VERCEL_PROJECT_ID=votre_project_id
```

### 4. Mettre à Jour l'URL du Backend

Une fois votre backend déployé:

1. Copiez l'URL de votre service (ex: `https://votre-backend.example.com`)
2. Mettez à jour `frontend/src/config/environments.js`:

```javascript
production: {
   API_BASE_URL: 'https://votre-backend.example.com',
}
```

Ou configurez-le comme variable d'environnement sur Vercel (recommandé):

```bash
vercel env add REACT_APP_API_URL production
# Entrez: https://votre-backend.example.com
```

> Remarque: Vercel n’utilise plus de "Secrets" séparés référencés par `@...` dans `vercel.json`. Utilisez uniquement les Variables d’Environnement du Projet.

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

### Backend

Le déploiement dépend de votre hébergeur (voir leur documentation). La plupart proposent un déclenchement automatique à chaque push ou un “Manual Deploy”.

---

## 🔐 Variables d'Environnement

### Backend

Variables d’environnement typiques côté backend (à adapter à votre hébergeur):

```env
FLASK_ENV=production
PYTHON_VERSION=3.9.18
PORT=5000
```

### Frontend (Vercel)

Variables configurées sur Vercel Dashboard ou via CLI:

```env
REACT_APP_API_URL=https://votre-backend.example.com
NODE_ENV=production
```

Pour ajouter via CLI:

```bash
vercel env add REACT_APP_API_URL production
```

### ⚠️ Conflit TypeScript (Build Vercel)

Si le build échoue avec un message `ERESOLVE` lié à `react-scripts@5` et `typescript@>=5`, épinglez TypeScript à `4.9.5` dans `package.json`:

```json
{
  "devDependencies": {
    "typescript": "4.9.5"
  },
  "overrides": {
    "typescript": "4.9.5"
  }
}
```

---

## 🩺 Dépannage

### ❌ Backend ne démarre pas / OOM

Apache Spark utilise beaucoup de RAM. Solutions:

1. Utiliser `simple_app.py` (sans Spark)
2. Augmenter les ressources ou changer d’hébergeur (ex: Fly.io)

### ❌ Frontend ne se connecte pas au Backend

**Problème**: CORS ou URL incorrecte

**Solutions**:

1. Vérifiez l'URL dans `environments.js`
2. Vérifiez que le backend est bien déployé et accessible
3. Testez l'endpoint: `https://votre-backend.example.com/health`

### ❌ GitHub Actions échoue

**Problème**: Secrets manquants ou incorrects

**Solution**:

1. Vérifiez que tous les secrets sont configurés dans GitHub
2. Vérifiez l'orthographe des noms de secrets
3. Consultez les logs d'erreur dans l'onglet Actions

### 🐌 Backend lent (cold start)

Selon l’hébergeur choisi, le service peut être mis en veille, rendant la première requête plus lente.

Solutions:

1. Choisir une offre sans cold start ou augmenter les ressources
2. Utiliser un service de ping (ex: UptimeRobot)
3. Ajouter un message de chargement dans le frontend

### 📊 Monitoring

#### Vérifier le statut du Backend

```bash
curl https://votre-backend.example.com/health
```

Réponse attendue:

```json
{
  "status": "healthy",
  "service": "OWID COVID-19 Prediction API",
  "version": "2.0"
}
```

#### Logs Backend

1. Dashboard de votre hébergeur → Votre service
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
# Voir sur le dashboard de votre hébergeur

# Logs Frontend
# Voir sur vercel.com/dashboard

# Test endpoint Backend
curl https://votre-backend.example.com/health

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

1. Consultez les logs (hébergeur backend + Vercel)
2. Vérifiez les [GitHub Actions logs](https://github.com/RawaneG/memoire/actions)
3. Testez les endpoints manuellement
4. Vérifiez les variables d'environnement

---

## 🔗 Liens Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gunicorn Documentation](https://docs.gunicorn.org/)

---

✨ **Bon déploiement !** 🚀
