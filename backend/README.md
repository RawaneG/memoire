# Backend pour les prédictions de pandémie

Ce répertoire contient un squelette de service API permettant d'exposer des prédictions de cas COVID‑19 à l'aide de PySpark.  L'API est conçue pour être interrogée par un client Angular ou tout autre front‑end.

## Structure

- `app.py` : serveur Flask exposant une route `/predict`.
- `spark_model.py` : module contenant la logique de chargement des données, de préparation et de prédiction (à compléter avec la logique du chapitre 4).  Pour l'instant, il renvoie des valeurs factices.
- `requirements.txt` : liste minimale des dépendances Python.

## Prérequis

- Python 3.8 ou supérieur.
- PySpark (≥ 3.0) installé dans l'environnement Python.
- Flask pour l'API REST.
- Les jeux de données OWID placés dans un endroit accessible et le code de préparation correspondant.

## Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Exécution

Lancez le serveur Flask :

```bash
export FLASK_APP=app.py
flask run --host 0.0.0.0 --port 5000
```

Une fois lancé, l'API accepte des requêtes GET sur `/predict`.  Exemple :

```
http://localhost:5000/predict?country=France&model=linear&horizon=7
```

Cela renverra un JSON contenant sept prévisions fictives.  Pour obtenir des prévisions réalistes, remplacez le contenu de `spark_model.py` par l'implémentation présentée dans le chapitre 4.

## Intégration avec l'application Angular

Dans votre application Angular, créez un service qui envoie des requêtes HTTP à l'API Flask.  Le composant de sélection de pays et de modèle peut ensuite consommer les résultats et afficher les courbes de prédiction.  Les modèles disponibles doivent être alignés avec ceux implémentés dans `spark_model.py`.

## Remarques

Ce squelette est fourni pour illustrer la structure générale.  Il ne contient pas de logique Spark opérationnelle ni de gestion des erreurs avancée.  Pour un déploiement en production, pensez à :

- utiliser un serveur WSGI (comme Gunicorn) pour Flask ;
- sécuriser l'API et ajouter une validation des paramètres ;
- conteneuriser l'application (Docker) et automatiser le déploiement ;
- optimiser les performances de Spark en ajustant la configuration et en utilisant un cluster distribué.