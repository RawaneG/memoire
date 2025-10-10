# 🎯 Prochaines Étapes - Configuration du Déploiement

## ✅ Ce qui a été configuré

Tous les fichiers de déploiement ont été créés et configurés :

### Fichiers Backend

- ✅ `backend/Procfile` - Configuration Gunicorn
- ✅ `backend/requirements.txt` - Ajout de Gunicorn
- ✅ `backend/.env.example` - Template variables d'environnement

### Fichiers Frontend (Vercel)

- ✅ `frontend/vercel.json` - Configuration Vercel (sans bloc `env` ni `@api-url`)
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

#### A. Backend (hébergeur au choix)

Déployez l’API Flask sur la plateforme de votre choix (ex: Fly.io) et récupérez l’URL publique.

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
3. Ajoutez ces secrets (si vous utilisez des workflows GitHub Actions):

```
Nom: VERCEL_TOKEN
Valeur: [votre token Vercel]

Nom: VERCEL_ORG_ID
Valeur: [votre org ID]

Nom: VERCEL_PROJECT_ID
Valeur: [votre project ID]
```

### 3. Mettre à jour l'URL du backend (1 minute)

Une fois le backend déployé, vous obtiendrez une URL comme:
`https://votre-backend.example.com`

**Option A - Modifier le code:**
Éditez `frontend/src/config/environments.js`:

```javascript
production: {
   API_BASE_URL: 'https://votre-backend.example.com',
}
```

**Option B - Via Vercel (recommandé):**

```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Entrez: https://votre-backend.example.com
```

> Note: Vercel n’utilise plus de "Secrets" référencés par `@...` dans `vercel.json`. Utilisez uniquement les Variables d’environnement de Projet.

### 4. Commit et Push ! 🎉

```bash
git add .
git commit -m "chore: setup deployment configuration pour Vercel"
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

### Backend

```bash
# Tester le endpoint health
curl https://votre-backend.example.com/health

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

### ❌ Backend instable / manque de mémoire

**Cause:** Apache Spark utilise beaucoup de RAM.

**Solutions:**

- Utiliser `simple_app.py` au lieu de `app.py` (sans Spark)
- Choisir un hébergeur avec plus de ressources (ex: Fly.io)

### ❌ GitHub Actions échoue

**Vérifiez:**

1. Tous les secrets sont bien configurés
2. Les noms des secrets sont exacts (sensibles à la casse)
3. Consultez les logs dans l'onglet Actions

### ❌ Frontend ne peut pas se connecter au Backend

**Vérifiez:**

1. L'URL du backend dans `environments.js` (ou la variable `REACT_APP_API_URL` dans Vercel)
2. Que le backend est bien déployé et accessible
3. Les logs du backend sur votre hébergeur

### ❌ Build Vercel échoue (npm ERESOLVE / TypeScript)

**Symptôme:** conflit de peer dependencies avec `react-scripts@5` et TypeScript >= 5.

**Solution:** figez TypeScript à `4.9.5` dans `devDependencies` et `overrides` (déjà appliqué dans ce repo).

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

Sur le dashboard de votre hébergeur → Manual Deploy → Deploy latest commit

---

## 📚 Documentation

- **Guide Complet:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Démarrage Rapide:** [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
- **README Principal:** [README.md](./README.md)

---

## 🆘 Besoin d'aide ?

Consultez les documentations officielles:

- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

✨ **Bonne chance avec votre déploiement !** 🚀
