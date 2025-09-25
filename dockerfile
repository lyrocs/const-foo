# #############################################################################
# STAGE 1: CONSTRUIRE L'APPLICATION DOCUSAURUS
# #############################################################################
FROM node:20-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances et les installer
# On copie ces fichiers en premier pour profiter de la mise en cache de Docker.
# Si ces fichiers не changent pas, Docker ne réinstallera pas les dépendances.
COPY package.json package-lock.json* ./
# Utiliser 'npm ci' pour une installation propre et déterministe en production
RUN npm ci

# Copier le reste du code source de l'application
COPY . .

# Lancer la commande de build de Docusaurus
# Cela va générer le site statique dans le dossier /app/build
RUN npm run build


# #############################################################################
# STAGE 2: SERVIR LES FICHIERS STATIQUES AVEC NGINX
# #############################################################################
FROM nginx:stable-alpine

# Définir le répertoire de travail
WORKDIR /usr/share/nginx/html

# Supprimer le contenu par défaut de Nginx
RUN rm -rf ./*

# Copier les fichiers statiques générés depuis l'étape "builder"
COPY --from=builder /app/build .

# (Optionnel mais fortement recommandé pour Docusaurus)
# Copier une configuration Nginx personnalisée pour gérer le routage des SPA
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 pour permettre les connexions entrantes
EXPOSE 80

# La commande pour démarrer Nginx est déjà incluse dans l'image de base.
# Inutile de rajouter une commande CMD.