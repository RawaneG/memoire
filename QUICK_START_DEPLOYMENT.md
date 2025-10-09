# 🚀 Démarrage Rapide - Déploiement

## ⚡ En 5 Minutes

### 1️⃣ Configuration des Comptes (5 min)

**Render (Backend):**
1. Créez un compte sur [render.com](https://render.com)
2. Connectez votre GitHub
3. Créez un Web Service → Sélectionnez votre repo
4. Render détectera automatiquement `render.yaml` ✅

**Vercel (Frontend):**
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

### 2️⃣ GitHub Secrets (2 min)

Sur GitHub → **Settings** → **Secrets** → **Actions** → Ajoutez:

```
RENDER_API_KEY=xxx         # Render → Account Settings → API Keys
RENDER_SERVICE_ID=srv-xxx  # Render → Votre service → copier ID de l'URL

VERCEL_TOKEN=xxx           # Vercel → Settings → Tokens
VERCEL_ORG_ID=xxx          # Dans URL vercel.com/[org-id]/...
VERCEL_PROJECT_ID=xxx      # Vercel → Project Settings → General
```

### 3️⃣ Push et C'est Fait! 🎉

```bash
git add .
git commit -m "chore: setup deployment"
git push origin main
```

✅ **Automatique:** Frontend + Backend déployés!

---

## 🎯 Commandes Rapides

### Déploiement Manuel

**Frontend uniquement:**
```bash
cd frontend
npm run deploy
```

**Backend uniquement:**
- Via GitHub: Actions → "Deploy Backend Only" → Run workflow
- Ou push sur `main` déclenche auto-deploy

### Déployer les Deux Séparément

**Option 1 - GitHub Actions (recommandé):**
1. GitHub → Actions → "Deploy Frontend and Backend"
2. Run workflow → Choisir "both"

**Option 2 - CLI:**
```bash
# Frontend
cd frontend && npm run deploy

# Backend
git push origin main  # Auto-deploy Render
```

---

## 📋 Checklist Post-Déploiement

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel
- [ ] Tester endpoint: `https://votre-backend.onrender.com/health`
- [ ] Tester frontend: `https://votre-frontend.vercel.app`
- [ ] Mettre à jour `frontend/src/config/environments.js` avec URL Render
- [ ] Configurer variable `REACT_APP_API_URL` sur Vercel

---

## ⚠️ Important

**Spark & Mémoire:** Le plan gratuit Render (512MB) peut être insuffisant pour Apache Spark.

**Si backend crash:**
1. Render Dashboard → Logs → Vérifier "Out of Memory"
2. Solution rapide: Utiliser `simple_app.py` au lieu de `app.py`
   ```yaml
   # Dans backend/render.yaml
   startCommand: gunicorn simple_app:app --bind 0.0.0.0:$PORT
   ```

---

## 🆘 Aide

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet.

**Test rapide:**
```bash
# Backend
curl https://votre-backend.onrender.com/health

# Devrait retourner:
# {"status": "healthy", "service": "OWID COVID-19 Prediction API"}
```
