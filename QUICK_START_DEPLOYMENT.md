# 🚀 Démarrage Rapide - Déploiement

## ⚡ En 5 Minutes

### 1️⃣ Configuration des Comptes (5 min)

**Vercel (Frontend):**

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

### 2️⃣ Variables & Secrets GitHub (optionnel pour workflows)

Sur GitHub → **Settings** → **Secrets** → **Actions** → Ajoutez (seulement si vous utilisez des workflows GitHub Actions):

```
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

✅ **Automatique:** Frontend déployé (si workflow configuré) !

---

## 🎯 Commandes Rapides

### Déploiement Manuel

**Frontend uniquement:**

```bash
cd frontend
npm run deploy
```

**Backend:**

- Déployez votre API sur la plateforme de votre choix (par exemple Fly.io) et récupérez une URL publique, ex: `https://votre-backend.example.com`.

### Déployer les Deux Séparément

**Option 1 - GitHub Actions (recommandé):**

1. GitHub → Actions → "Deploy Frontend and Backend"
2. Run workflow → Choisir "both"

**Option 2 - CLI:**

```bash
# Frontend
cd frontend && npm run deploy
```

---

## 📋 Checklist Post-Déploiement

- [ ] Backend déployé (ex: Fly.io) et accessible
- [ ] Frontend déployé sur Vercel
- [ ] Tester endpoint: `https://votre-backend.example.com/health`
- [ ] Tester frontend: `https://votre-frontend.vercel.app`
- [ ] Mettre à jour `frontend/src/config/environments.js` avec l'URL de votre backend (optionnel si ENV)
- [ ] Configurer la variable `REACT_APP_API_URL` sur Vercel (Project → Settings → Environment Variables)

### Définir REACT_APP_API_URL (Vercel)

Dashboard Vercel → Project → Settings → Environment Variables → Add

- Key: `REACT_APP_API_URL`
- Value: `https://votre-backend.example.com`
- Environment: Production (et Preview/Development si besoin)

ou via CLI:

```bash
cd frontend
vercel link  # si non lié
vercel env add REACT_APP_API_URL production
# saisir l'URL du backend
```

---

## ⚠️ Important

Si votre backend consomme beaucoup de mémoire (ex: Spark), choisissez un hébergement adapté (ex: Fly.io) ou utilisez la version `simple_app.py`.

---

## 🆘 Aide

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet.

**Test rapide:**

```bash
# Backend
curl https://votre-backend.example.com/health

# Devrait retourner:
# {"status": "healthy", "service": "OWID COVID-19 Prediction API"}
```
