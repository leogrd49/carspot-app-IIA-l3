# Structure Complète du Projet CarSpot

```
carspot-app/
│
├── README.md                          # Documentation principale
├── QUICKSTART.md                      # Guide de démarrage rapide
├── PROJECT_STRUCTURE.md              # Ce fichier
├── package.json                       # Scripts npm racine
├── .gitignore                         # Fichiers à ignorer par git
├── install.bat                        # Script d'installation Windows
├── start.bat                          # Script de lancement Windows
│
├── backend/                           # Serveur API Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Configuration connexion MySQL
│   │   │
│   │   ├── routes/
│   │   │   ├── users.js              # CRUD utilisateurs + spots par user
│   │   │   ├── brands.js             # CRUD marques
│   │   │   ├── models.js             # CRUD modèles
│   │   │   ├── trims.js              # CRUD finitions
│   │   │   ├── specs.js              # CRUD spécifications
│   │   │   ├── cars.js               # CRUD voitures (avec jointures)
│   │   │   └── spots.js              # CRUD spots + statistiques
│   │   │
│   │   └── server.js                 # Point d'entrée serveur Express
│   │
│   ├── .env.example                  # Template variables d'environnement
│   ├── .gitignore                    # Fichiers à ignorer
│   └── package.json                  # Dépendances backend
│
└── frontend/                          # Application React
    ├── public/                        # Fichiers statiques
    │
    ├── src/
    │   ├── components/
    │   │   ├── ui/                   # Composants UI réutilisables (shadcn/ui style)
    │   │   │   ├── button.jsx        # Bouton stylisé avec variants
    │   │   │   ├── card.jsx          # Carte avec header/content/footer
    │   │   │   ├── input.jsx         # Input stylisé
    │   │   │   └── label.jsx         # Label de formulaire
    │   │   │
    │   │   └── Layout.jsx            # Layout principal avec navigation
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx         # Page d'accueil avec statistiques
    │   │   │                         #   - Total spots, users, locations, brands
    │   │   │                         #   - Graphiques locations & brands
    │   │   │
    │   │   ├── Spots.jsx             # Page gestion des spots
    │   │   │                         #   - Liste avec filtres
    │   │   │                         #   - Création de spots
    │   │   │                         #   - Suppression
    │   │   │
    │   │   ├── Cars.jsx              # Page catalogue voitures
    │   │   │                         #   - Liste avec filtres
    │   │   │                         #   - Specs détaillées
    │   │   │
    │   │   └── Users.jsx             # Page profils utilisateurs
    │   │                             #   - Liste des users
    │   │                             #   - Historique des spots
    │   │
    │   ├── lib/
    │   │   └── utils.js              # Utilitaires :
    │   │                             #   - cn() : fusion classes Tailwind
    │   │                             #   - api : client HTTP (get/post/put/delete)
    │   │
    │   ├── App.jsx                   # Composant racine avec Router
    │   ├── main.jsx                  # Point d'entrée React
    │   └── index.css                 # Styles Tailwind + variables CSS
    │
    ├── index.html                    # Template HTML
    ├── vite.config.js                # Configuration Vite + proxy API
    ├── tailwind.config.js            # Configuration Tailwind CSS
    ├── postcss.config.js             # Configuration PostCSS
    ├── .gitignore                    # Fichiers à ignorer
    └── package.json                  # Dépendances frontend
```

## Description des Fichiers Clés

### Backend

#### `src/config/database.js`
Configuration du pool de connexions MySQL avec mysql2/promise.

#### `src/routes/*.js`
Routes API RESTful pour chaque entité :
- Opérations CRUD standard (GET, POST, PUT, DELETE)
- Routes spéciales pour spots (statistiques)
- Routes spéciales pour users (spots par utilisateur)

#### `src/server.js`
Serveur Express principal :
- Middleware CORS
- Montage des routes
- Test de connexion DB au démarrage
- Point d'entrée `/api/health`

### Frontend

#### `src/components/ui/*.jsx`
Composants UI inspirés de shadcn/ui :
- Stylés avec Tailwind CSS
- Variants pour différents états
- Accessibles et réutilisables

#### `src/components/Layout.jsx`
Layout principal de l'application :
- Navigation horizontale
- Icônes Lucide React
- Active state sur page actuelle
- Container responsive

#### `src/pages/Dashboard.jsx`
Tableau de bord avec :
- 4 cartes de statistiques
- 2 graphiques (locations & brands)
- Chargement asynchrone des données

#### `src/pages/Spots.jsx`
Gestion complète des spots :
- Liste paginée et filtrable
- Formulaire de création
- Sélection user & car via dropdown
- Suppression avec confirmation

#### `src/pages/Cars.jsx`
Catalogue des voitures :
- Grille responsive
- Filtrage en temps réel
- Affichage des specs (prix, puissance, poids, moteur)
- Design avec gradient et icônes

#### `src/pages/Users.jsx`
Profils utilisateurs :
- Liste des utilisateurs
- Historique des 3 derniers spots
- Compteur total de spots
- Design carte avec sections

#### `src/lib/utils.js`
Utilitaires partagés :
- `cn()` : fusion intelligente des classes Tailwind
- `api` : client HTTP simplifié avec gestion d'erreurs

### Configuration

#### `vite.config.js`
- Plugin React
- Alias @ vers src/
- Proxy API vers backend:5000

#### `tailwind.config.js`
- Thème personnalisé
- Couleurs shadcn/ui
- Border radius personnalisés
- Container centré

## Base de Données MySQL

### Tables
1. **users** - Utilisateurs de l'application
2. **brands** - Marques de voitures
3. **models** - Modèles de voitures
4. **trims** - Finitions/versions
5. **specs** - Spécifications techniques
6. **cars** - Voitures (jointure des 4 tables ci-dessus)
7. **Spot** - Observations de voitures (table de liaison)

### Relations
```
cars ─┬─> brands (id_brand)
      ├─> models (id_model)
      ├─> trims (id_trim)
      └─> specs (id_specs)

Spot ─┬─> users (id_user)
      └─> cars (id_car)
```

## Routes API Disponibles

### Users
- `GET /api/users` - Tous les utilisateurs
- `GET /api/users/:id` - Détails utilisateur
- `GET /api/users/:id/spots` - Spots de l'utilisateur
- `POST /api/users` - Créer utilisateur
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur

### Spots
- `GET /api/spots` - Tous les spots (avec jointures)
- `GET /api/spots/stats/locations` - Stats par location
- `GET /api/spots/stats/brands` - Stats par marque
- `POST /api/spots` - Créer spot
- `PUT /api/spots/:id_user/:id_car` - Modifier spot
- `DELETE /api/spots/:id_user/:id_car` - Supprimer spot

### Cars
- `GET /api/cars` - Toutes les voitures (avec specs)
- `GET /api/cars/:id` - Détails voiture
- `POST /api/cars` - Créer voiture
- `PUT /api/cars/:id` - Modifier voiture
- `DELETE /api/cars/:id` - Supprimer voiture

### Brands, Models, Trims, Specs
Routes CRUD standard pour chaque entité.

## Technologies & Versions

### Backend
- Node.js 18+
- Express 4.18
- MySQL2 3.6
- CORS 2.8
- dotenv 16.3

### Frontend
- React 18.2
- React Router 6.20
- Vite 5.0
- Tailwind CSS 3.4
- Lucide React 0.294

## Scripts Disponibles

### Racine du projet
```bash
npm run install:all    # Installe backend + frontend
npm run dev            # Lance backend + frontend en parallèle
npm run dev:backend    # Lance uniquement le backend
npm run dev:frontend   # Lance uniquement le frontend
```

### Backend
```bash
npm start              # Mode production
npm run dev            # Mode développement (nodemon)
```

### Frontend
```bash
npm run dev            # Serveur de développement
npm run build          # Build de production
npm run preview        # Prévisualiser le build
```

## Ports Utilisés

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000
- **MySQL** : localhost:3306

## Variables d'Environnement

### Backend (.env)
```env
DB_HOST=localhost      # Hôte MySQL
DB_USER=root           # Utilisateur MySQL
DB_PASSWORD=           # Mot de passe MySQL
DB_NAME=carspot_db     # Nom de la base
DB_PORT=3306           # Port MySQL
PORT=5000              # Port du serveur backend
```
