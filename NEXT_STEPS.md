# 🎯 Prochaines Étapes - Configuration du Déploiement

## ✅ Ce qui a été configuré

Tous les fichiers de déploiement ont été créés et configurés :

### Fichiers Backend (Render)
- ✅ `backend/Procfile` - Configuration Gunicorn
- ✅ `backend/render.yaml` - Configuration Render automatique
- ✅ `backend/requirements.txt` - Ajout de Gunicorn
- ✅ `backend/.env.example` - Template variables d'environnement

### Fichiers Frontend (Vercel)
- ✅ `frontend/vercel.json` - Configuration Vercel
- ✅ `frontend/package.json` - Commandes de déploiement ajoutées
- ✅ `frontend/src/config/environments.js` - Support REACT_APP_API_URL
- ✅ `frontend/.env.example` - Template variables d'environnement

### GitHub Actions CI/CD
- ✅ `.github/workflows/deploy.yml` - Déploiement automatique sur push
- ✅ `.github/workflows/deploy-frontend.yml` - Déploiement frontend uniquement
- ✅ `.github/workflows/deploy-backend.yml` - Déploiement backend uniquement

### Documentation
- ✅ `DEPLOYMENT.md` - Guide complet de déploiement
- ✅ `QUICK_START_DEPLOYMENT.md` - Guide rapide (5 minutes)
- ✅ `.gitignore` - Mis à jour pour ignorer .env et fichiers de build

---

## 🚀 Action Requise - À Faire Maintenant

### 1. Créer les comptes (5 minutes)

#### A. Render (Backend)
1. Allez sur https://render.com
2. Créez un compte (gratuit)
3. Connectez votre GitHub
4. Créez un nouveau **Web Service**:
   - Repository: `RawaneG/memoire`
   - Root Directory: `backend`
   - Render détectera automatiquement `render.yaml` ✅

5. Récupérez les credentials:
   - **RENDER_API_KEY**: Account Settings → API Keys → Create
   - **RENDER_SERVICE_ID**: URL de votre service (ex: `srv-xxxxx`)

#### B. Vercel (Frontend)
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter et déployer
cd frontend
vercel login
vercel
```

Suivez les instructions, puis récupérez:
- **VERCEL_TOKEN**: vercel.com → Settings → Tokens → Create
- **VERCEL_ORG_ID**: Dans l'URL `vercel.com/[org-id]/...`
- **VERCEL_PROJECT_ID**: Project Settings → General

### 2. Configurer GitHub Secrets (2 minutes)

1. Allez sur https://github.com/RawaneG/memoire/settings/secrets/actions
2. Cliquez sur **"New repository secret"**
3. Ajoutez ces 5 secrets:

```
Nom: RENDER_API_KEY
Valeur: [votre clé API Render]

Nom: RENDER_SERVICE_ID
Valeur: srv-xxxxx

Nom: VERCEL_TOKEN
Valeur: [votre token Vercel]

Nom: VERCEL_ORG_ID
Valeur: [votre org ID]

Nom: VERCEL_PROJECT_ID
Valeur: [votre project ID]
```

### 3. Mettre à jour l'URL du backend (1 minute)

Une fois le backend déployé sur Render, vous obtiendrez une URL comme:
`https://owid-predictor-api.onrender.com`

**Option A - Modifier le code:**
Éditez `frontend/src/config/environments.js`:
```javascript
production: {
  API_BASE_URL: 'https://owid-predictor-api.onrender.com',
}
```

**Option B - Via Vercel (recommandé):**
```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Entrez: https://owid-predictor-api.onrender.com
```

### 4. Commit et Push ! 🎉

```bash
git add .
git commit -m "chore: setup deployment configuration for Vercel and Render"
git push origin feature/real-owid-data-implementation
```

Puis mergez votre branche dans `main`:
```bash
git checkout main
git merge feature/real-owid-data-implementation
git push origin main
```

**🎊 C'est tout ! Le déploiement automatique se lancera !**

---

## 📊 Vérifier le Déploiement

### Backend (Render)
```bash
# Tester le endpoint health
curl https://votre-backend.onrender.com/health

# Devrait retourner:
# {"status": "healthy", "service": "OWID COVID-19 Prediction API"}
```

### Frontend (Vercel)
Ouvrez l'URL fournie par Vercel dans votre navigateur.

### GitHub Actions
1. Allez sur https://github.com/RawaneG/memoire/actions
2. Vous verrez les workflows en cours d'exécution
3. Cliquez sur un workflow pour voir les logs

---

## 🔧 Dépannage Rapide

### ❌ Backend crash sur Render (Out of Memory)

**Cause:** Apache Spark utilise trop de RAM (plan gratuit = 512MB)

**Solution:**
Éditez `backend/render.yaml`:
```yaml
startCommand: gunicorn simple_app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

Utilisez `simple_app.py` au lieu de `app.py` (pas de Spark, mais fonctionne).

### ❌ GitHub Actions échoue

**Vérifiez:**
1. Tous les secrets sont bien configurés
2. Les noms des secrets sont exacts (sensibles à la casse)
3. Consultez les logs dans l'onglet Actions

### ❌ Frontend ne peut pas se connecter au Backend

**Vérifiez:**
1. L'URL du backend dans `environments.js`
2. Que le backend est bien déployé et accessible
3. Les logs du backend sur Render

---

## 🎯 Commandes Utiles Après Configuration

### Déploiement Manuel Frontend
```bash
cd frontend
npm run deploy
```

### Déploiement via GitHub Actions
1. GitHub → Actions
2. Choisir le workflow désiré
3. "Run workflow"

### Forcer un redéploiement Backend
Sur Render Dashboard → Manual Deploy → Deploy latest commit

---

## 📚 Documentation

- **Guide Complet:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Démarrage Rapide:** [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
- **README Principal:** [README.md](./README.md)

---

## 🆘 Besoin d'aide ?

Consultez les documentations officielles:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

✨ **Bonne chance avec votre déploiement !** 🚀
