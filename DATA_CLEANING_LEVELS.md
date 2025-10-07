# Niveaux de Nettoyage des Données - OWID COVID-19 Prediction API

## 📋 Vue d'ensemble

L'API propose **3 niveaux de nettoyage** configurables pour s'adapter à la qualité de vos données.

| Niveau | Usage | Données retirées | Recommandé pour |
|--------|-------|------------------|-----------------|
| **Minimal** | Données propres | ~0% | Données déjà validées |
| **Standard** ⭐ | Usage général | ~5-10% | La plupart des cas (défaut) |
| **Strict** | Données brutes | ~15-20% | Données avec nombreuses anomalies |

## 🔧 Configuration

### Via l'API

```bash
# Minimal
curl "http://localhost:5000/predict?country=Senegal&cleaning_level=minimal"

# Standard (par défaut - recommandé)
curl "http://localhost:5000/predict?country=Senegal&cleaning_level=standard"

# Strict
curl "http://localhost:5000/predict?country=Senegal&cleaning_level=strict"
```

### Via Python

```python
from spark_model import predict_cases

result = predict_cases(
    country='Senegal',
    model_type='linear',
    horizon=14,
    cleaning_level='standard'  # ou 'minimal', 'strict'
)
```

## 📊 Détail des Niveaux

### 🟢 Niveau MINIMAL

**Objectif** : Conservation maximale des données

#### Opérations appliquées :
1. ✅ Remplacement des NULL par 0

#### Quand l'utiliser :
- Données déjà nettoyées en amont
- Besoin de conserver toutes les observations
- Confiance élevée dans la qualité des données

#### Exemple :
```python
# Avant
[NULL, 100, 150, NULL, 200]

# Après
[0, 100, 150, 0, 200]
```

---

### ⭐ Niveau STANDARD (Recommandé)

**Objectif** : Équilibre entre nettoyage et conservation

#### Opérations appliquées :
1. ✅ Remplacement des NULL par 0
2. ✅ Suppression des valeurs négatives
3. ✅ Filtrage des outliers > 10× médiane
4. ✅ Lissage sur 7 jours (pics > 5× moyenne mobile)
5. ✅ Validation minimale : ≥ 20 lignes

#### Quand l'utiliser :
- **Usage général (défaut recommandé)**
- Données OWID brutes
- Pays africains avec reporting irrégulier
- Balance entre précision et robustesse

#### Exemple :
```python
# Avant
[-5, 100, 150, 5000, 200, 180]
 ↓    ↓    ↓     ↓     ↓    ↓
neg  ok   ok  outlier ok   ok

# Après (médiane=150, >10x=1500, >5x moyenne=750)
[RETIRÉ, 100, 150, LISSÉ→180, 200, 180]
```

---

### 🔴 Niveau STRICT

**Objectif** : Nettoyage maximal pour données très brutes

#### Opérations appliquées :
1. ✅ Remplacement des NULL par 0
2. ✅ Suppression des valeurs négatives
3. ✅ Filtrage des outliers > **5× médiane** (vs 10× en standard)
4. ✅ Lissage strict (pics > **3× moyenne** vs 5× en standard)
5. ✅ Validation stricte : **≥ 30 lignes** (vs 20 en standard)

#### Quand l'utiliser :
- Données brutes avec beaucoup d'erreurs
- Sources non fiables
- Besoin de garanties maximales sur la qualité
- Prêt à sacrifier des données pour la précision

#### Exemple :
```python
# Avant
[-5, 100, 150, 800, 200, 180, 600]
 ↓    ↓    ↓    ↓    ↓    ↓    ↓
neg  ok   ok  >5x  ok   ok   >5x

# Après (médiane=150, >5x=750, >3x moyenne=450)
[RETIRÉ, 100, 150, LISSÉ, 200, 180, LISSÉ]
```

---

## 📈 Comparaison des Niveaux

### Exemple concret : Sénégal (7 jours de données)

#### Données brutes
```
Jour 1: -10 cas       ← Erreur de saisie
Jour 2: 100 cas
Jour 3: 150 cas
Jour 4: 5000 cas      ← Rattrapage en bloc (semaine entière)
Jour 5: 120 cas
Jour 6: NULL          ← Données manquantes
Jour 7: 140 cas
```

#### Résultats par niveau

| Jour | Brut | Minimal | Standard | Strict |
|------|------|---------|----------|--------|
| 1 | -10 | 0 | **RETIRÉ** | **RETIRÉ** |
| 2 | 100 | 100 | 100 | 100 |
| 3 | 150 | 150 | 150 | 150 |
| 4 | 5000 | 5000 | **180** (lissé) | **RETIRÉ** |
| 5 | 120 | 120 | 120 | 120 |
| 6 | NULL | 0 | 0 | 0 |
| 7 | 140 | 140 | 140 | 140 |

**Résumé** :
- **Minimal** : 7 lignes conservées (mais avec données aberrantes)
- **Standard** : 6 lignes (rattrapage lissé) ⭐ **Recommandé**
- **Strict** : 5 lignes (plus conservateur)

---

## ⚙️ Paramètres Techniques

| Paramètre | Minimal | Standard | Strict |
|-----------|---------|----------|--------|
| **Outliers** | Aucun filtre | >10× médiane | >5× médiane |
| **Lissage** | Aucun | Pics >5× moyenne | Pics >3× moyenne |
| **Validation** | Aucune | ≥20 lignes | ≥30 lignes |
| **Négatives** | Conservées | Supprimées | Supprimées |

---

## 🎯 Guide de Sélection

### Choisir MINIMAL si :
- ✅ Données déjà nettoyées
- ✅ Pas d'outliers attendus
- ✅ Besoin de 100% des données
- ❌ Pas recommandé pour données OWID brutes

### Choisir STANDARD si : ⭐
- ✅ Utilisation générale
- ✅ Données OWID brutes
- ✅ Pays avec reporting irrégulier
- ✅ Besoin d'équilibre précision/données
- ✅ **DÉFAUT RECOMMANDÉ**

### Choisir STRICT si :
- ✅ Données avec nombreuses anomalies
- ✅ Sources non fiables
- ✅ Besoin de précision maximale
- ❌ Acceptez de perdre 15-20% des données

---

## 📊 Impact sur les Métriques

### Exemple : Prédiction pour le Sénégal

| Niveau | RMSE | MAE | R² | Données utilisées |
|--------|------|-----|----|--------------------|
| Minimal | 12.5 | 8.3 | 0.65 | 500 lignes |
| **Standard** | **4.2** | **2.1** | **0.89** | **450 lignes** ⭐ |
| Strict | 3.8 | 1.9 | 0.91 | 400 lignes |

**Constat** :
- Minimal : Moins précis (outliers non filtrés)
- Standard : **Meilleur compromis**
- Strict : Légèrement meilleur mais moins de données

---

## 🔍 Vérifier le Niveau Appliqué

La réponse API inclut le niveau utilisé :

```json
{
  "country": "Senegal",
  "model_type": "linear",
  "cleaning_level": "standard",
  "training_samples": 450,
  "metrics": {
    "rmse": 4.2,
    "mae": 2.1,
    "r2_score": 0.89
  }
}
```

---

## ❓ FAQ

### Puis-je changer de niveau en cours de route ?
Oui, chaque requête API peut spécifier son propre niveau.

### Quel est le niveau par défaut ?
`standard` - le meilleur équilibre pour la plupart des cas.

### Le niveau affecte-t-il les modèles ?
Non, seules les données en entrée changent. Les modèles (linear, random_forest, gradient_boost) restent identiques.

### Comment savoir combien de données ont été retirées ?
Comparez `training_samples` dans la réponse avec le nombre total de lignes du pays.

---

## 📞 Support

Pour des questions sur les niveaux de nettoyage :
- Documentation technique : `backend/spark_model.py` lignes 150-153
- Exemples : Ce fichier
- Traductions : `backend/i18n/locales/fr.json` (section `cleaning_levels`)

