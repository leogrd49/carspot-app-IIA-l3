# CarSpot - Exotic Car Spotting Application

Application web complète pour suivre et gérer les observations de voitures exotiques avec dashboard, gestion des spots, catalogue de voitures et profils utilisateurs.

## Stack Technologique

### Frontend
- **Vite.js** - Build tool rapide et moderne
- **React 18** - Framework UI
- **React Router** - Navigation
- **Tailwind CSS** - Styling utilitaire
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Client MySQL
- **CORS** - Gestion des requêtes cross-origin

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **MySQL** (version 8.0 ou supérieure)
- Un client MySQL (MySQL Workbench, phpMyAdmin, ou ligne de commande)

## Installation

### 1. Configurer la base de données

Créez la base de données MySQL en important le fichier SQL :

```bash
# Option 1 : Depuis la ligne de commande MySQL
mysql -u root -p < C:\Users\anouk\Downloads\BonusSQL\carspotSQL.sql

# Option 2 : Dans MySQL Workbench
# Ouvrez le fichier carspotSQL.sql et exécutez-le
```

Cela créera :
- La base de données `carspot_db`
- Les tables : `users`, `brands`, `models`, `trims`, `specs`, `cars`, `Spot`
- Des données de test

### 2. Installation du Backend

```bash
# Naviguez vers le dossier backend
cd carspot-app/backend

# Installez les dépendances
npm install

# Créez le fichier .env
copy .env.example .env
```

Éditez le fichier `.env` avec vos identifiants MySQL :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=carspot_db
DB_PORT=3306
PORT=5000
```

### 3. Installation du Frontend

```bash
# Ouvrez un nouveau terminal
# Naviguez vers le dossier frontend
cd carspot-app/frontend

# Installez les dépendances
npm install
```

## Lancement de l'application

### Démarrer le Backend

```bash
cd carspot-app/backend
npm start

# Ou en mode développement avec auto-reload :
npm run dev
```

Le serveur backend démarrera sur `http://localhost:5000`

Vous devriez voir :
```
✓ Database connected
✓ Server running on http://localhost:5000
```

### Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd carspot-app/frontend
npm run dev
```

Le frontend démarrera sur `http://localhost:3000`

Ouvrez votre navigateur à l'adresse `http://localhost:3000`

## Structure du Projet

```
carspot-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuration MySQL
│   │   ├── routes/
│   │   │   ├── users.js             # Routes utilisateurs
│   │   │   ├── brands.js            # Routes marques
│   │   │   ├── models.js            # Routes modèles
│   │   │   ├── trims.js             # Routes finitions
│   │   │   ├── specs.js             # Routes spécifications
│   │   │   ├── cars.js              # Routes voitures
│   │   │   └── spots.js             # Routes spots
│   │   └── server.js                # Point d'entrée serveur
│   ├── .env.example                 # Template variables d'environnement
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Composants UI (shadcn/ui style)
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   └── label.jsx
│   │   │   └── Layout.jsx           # Layout principal avec navigation
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Page dashboard avec stats
│   │   │   ├── Spots.jsx            # Page gestion des spots
│   │   │   ├── Cars.jsx             # Page catalogue voitures
│   │   │   └── Users.jsx            # Page profils utilisateurs
│   │   ├── lib/
│   │   │   └── utils.js             # Utilitaires et API client
│   │   ├── App.jsx                  # Composant racine
│   │   ├── main.jsx                 # Point d'entrée React
│   │   └── index.css                # Styles Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## Fonctionnalités

### 1. Dashboard
- Statistiques en temps réel :
  - Nombre total de spots
  - Nombre total d'utilisateurs
  - Nombre de localisations uniques
  - Nombre de marques spotées
- Graphiques :
  - Répartition des spots par localisation
  - Répartition des spots par marque

### 2. Gestion des Spots
- Liste complète des spots avec filtres
- Création de nouveaux spots
- Suppression de spots
- Filtrage par localisation, marque ou utilisateur
- Affichage détaillé :
  - Voiture spottée (marque, modèle, finition)
  - Localisation
  - Utilisateur
  - Spécifications (moteur, puissance)
  - Date

### 3. Catalogue des Voitures
- Visualisation de toutes les voitures
- Filtrage par marque, modèle ou finition
- Informations détaillées :
  - Prix
  - Puissance (chevaux)
  - Poids
  - Type de moteur
  - Finition

### 4. Profils Utilisateurs
- Liste de tous les utilisateurs
- Historique des spots par utilisateur
- Informations :
  - Email
  - Date d'inscription
  - Nombre total de spots
  - 3 spots les plus récents

## API Endpoints

### Users
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `GET /api/users/:id/spots` - Spots d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Brands
- `GET /api/brands` - Liste toutes les marques
- `GET /api/brands/:id` - Détails d'une marque
- `POST /api/brands` - Créer une marque
- `PUT /api/brands/:id` - Modifier une marque
- `DELETE /api/brands/:id` - Supprimer une marque

### Models
- `GET /api/models` - Liste tous les modèles
- `GET /api/models/:id` - Détails d'un modèle
- `POST /api/models` - Créer un modèle
- `PUT /api/models/:id` - Modifier un modèle
- `DELETE /api/models/:id` - Supprimer un modèle

### Trims
- `GET /api/trims` - Liste toutes les finitions
- `GET /api/trims/:id` - Détails d'une finition
- `POST /api/trims` - Créer une finition
- `PUT /api/trims/:id` - Modifier une finition
- `DELETE /api/trims/:id` - Supprimer une finition

### Specs
- `GET /api/specs` - Liste toutes les spécifications
- `GET /api/specs/:id` - Détails de spécifications
- `POST /api/specs` - Créer des spécifications
- `PUT /api/specs/:id` - Modifier des spécifications
- `DELETE /api/specs/:id` - Supprimer des spécifications

### Cars
- `GET /api/cars` - Liste toutes les voitures avec détails complets
- `GET /api/cars/:id` - Détails d'une voiture
- `POST /api/cars` - Créer une voiture
- `PUT /api/cars/:id` - Modifier une voiture
- `DELETE /api/cars/:id` - Supprimer une voiture

### Spots
- `GET /api/spots` - Liste tous les spots avec détails complets
- `GET /api/spots/stats/locations` - Statistiques par localisation
- `GET /api/spots/stats/brands` - Statistiques par marque
- `POST /api/spots` - Créer un spot
- `PUT /api/spots/:id_user/:id_car` - Modifier un spot
- `DELETE /api/spots/:id_user/:id_car` - Supprimer un spot

## Dépannage

### Le backend ne se connecte pas à MySQL

Vérifiez :
1. MySQL est démarré
2. Les identifiants dans `.env` sont corrects
3. La base de données `carspot_db` existe
4. Le port 3306 est disponible

```bash
# Tester la connexion MySQL
mysql -u root -p -e "SHOW DATABASES;"
```

### Le frontend ne charge pas les données

Vérifiez :
1. Le backend est démarré sur le port 5000
2. Pas d'erreurs dans la console du navigateur
3. Pas d'erreurs CORS

```bash
# Tester l'API
curl http://localhost:5000/api/health
```

### Erreur "Module not found"

Réinstallez les dépendances :

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Scripts Disponibles

### Backend
- `npm start` - Démarre le serveur en mode production
- `npm run dev` - Démarre le serveur en mode développement avec auto-reload

### Frontend
- `npm run dev` - Démarre le serveur de développement Vite
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build de production

## Technologies Utilisées

- **Vite.js** - Build tool ultra-rapide
- **React 18** - Library UI avec Hooks
- **React Router v6** - Routing côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI accessibles et personnalisables
- **Express** - Framework backend minimaliste
- **MySQL2** - Driver MySQL avec support des Promises
- **Lucide React** - Bibliothèque d'icônes moderne

## Améliorations Futures

- [ ] Authentification et autorisation
- [ ] Upload d'images pour les spots
- [ ] Carte interactive pour visualiser les spots
- [ ] Statistiques avancées et graphiques
- [ ] Export des données (CSV, PDF)
- [ ] Notifications en temps réel
- [ ] Mode sombre
- [ ] API de recherche avancée
- [ ] Pagination pour les grandes listes
- [ ] PWA (Progressive Web App)

## Licence

Ce projet est fourni à des fins éducatives.

## Support

Pour toute question ou problème, créez une issue dans le repository du projet.
