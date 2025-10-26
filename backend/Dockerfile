# Utilise une image Python légère
FROM python:3.9-slim

# Installe Java (nécessaire pour Apache Spark)
RUN apt-get update && \
    apt-get install -y default-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Définit JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Crée le répertoire de travail
WORKDIR /app

# Copie les dépendances et les installe
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie le code de l'application
COPY . .

# Expose le port
EXPOSE 8080

# Configure les variables d'environnement pour Spark (optimisé pour 768MB)
ENV SPARK_DRIVER_MEMORY=400m
ENV SPARK_EXECUTOR_MEMORY=256m
ENV PYSPARK_PYTHON=python3
ENV PYSPARK_DRIVER_PYTHON=python3

# Commande de démarrage avec Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "--worker-class", "sync"]
