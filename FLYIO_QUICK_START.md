# ⚡ Fly.io - Démarrage en 5 Minutes

## 🎯 Ce que vous obtenez

✅ **Apache Spark** qui fonctionne (avec `app.py`)
✅ **768MB RAM gratuit** (3 VMs × 256MB)
✅ **100% gratuit** - Pas de carte bancaire requise
✅ **Déploiement auto** via GitHub Actions

---

## 🚀 Installation en 3 Étapes

### 1️⃣ Installer Flyctl (2 min)

**Windows:**

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**

```bash
curl -L https://fly.io/install.sh | sh
```

### 2️⃣ Créer Compte et App (2 min)

```bash
# Se connecter ou créer un compte
flyctl auth signup

# Aller dans le dossier backend
cd backend

# Créer l'application
flyctl launch --no-deploy

# Répondre:
# - App name: owid-predictor-api
# - Region: cdg (Paris)
# - Database: No
```

### 3️⃣ Déployer ! (1 min)

```bash
# Déployer
flyctl deploy

# Tester
flyctl info  # Voir l'URL
curl https://owid-predictor-api.fly.dev/health
```

**✅ C'est tout ! Votre backend Spark est en ligne !**

---

## 🔧 GitHub Actions (CI/CD)

### Configurer le Déploiement Automatique

```bash
# Créer un token
flyctl tokens create deploy

# Copier le token, puis:
```

1. GitHub → **Settings** → **Secrets** → **Actions**
2. **New secret**:
   - Nom: `FLY_API_TOKEN`
   - Valeur: [votre token]

**Terminé !** Chaque push sur `main` déploiera automatiquement.

---

## 🌐 Frontend (Vercel)

Une fois le backend déployé, mettez à jour l'URL:

```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Entrez: https://owid-predictor-api.fly.dev
```

Ou éditez `frontend/src/config/environments.js`:

```javascript
production: {
  API_BASE_URL: 'https://owid-predictor-api.fly.dev',
}
```

---

## 📋 Commandes Utiles

```bash
# Voir les logs
flyctl logs

# Redémarrer
flyctl apps restart

# Dashboard web
flyctl dashboard

# Status
flyctl status
```

---

## ⚠️ Si ça Crash

**Vérifier les logs:**

```bash
flyctl logs --follow
```

**Out of Memory?**
Impossible avec nos optimisations Spark (400m driver + 256m executor = 656MB sur 768MB disponibles).

**Cold start lent?**
C'est normal la première fois (~10-15s). Fly.io met en veille les apps inactives.

---

## 💰 Coûts

**Free Tier:**

- 3 VMs × 256MB = **0€**
- 160GB transfert/mois = **0€**
- HTTPS/SSL = **0€**

**Total: 0€/mois** 🎉

---

## 📚 Plus de Détails

Consultez [FLYIO_DEPLOYMENT.md](./FLYIO_DEPLOYMENT.md) pour le guide complet.

---

## 🆚 Pourquoi Fly.io au lieu de Render?

| Critère | Render     | Fly.io        |
| ------- | ---------- | ------------- |
| RAM     | 512MB ❌   | 768MB ✅      |
| Spark   | Crash ❌   | Fonctionne ✅ |
| Prix    | Gratuit ✅ | Gratuit ✅    |
| Setup   | 5 min      | 5 min         |

**Fly.io gagne pour Spark !** 🏆

---

# 🚀 Déploiement Complet avec Fly.io et Vercel
