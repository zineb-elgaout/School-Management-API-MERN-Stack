# Image de base Node.js légère
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json en premier (optimisation cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5000

# Démarrer le serveur
CMD ["npm", "run", "dev"]