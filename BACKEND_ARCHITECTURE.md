# Architecture Backend - CarSpot API

## Vue d'Ensemble

Le backend CarSpot est une API RESTful construite avec Node.js et Express, connectée à une base de données MySQL. Il fournit des endpoints CRUD complets pour gérer les utilisateurs, voitures, marques, modèles, finitions, spécifications et spots.

## Stack Technologique

### Framework & Runtime
- **Node.js** (v18+) - Runtime JavaScript côté serveur
- **Express.js** (v4.18) - Framework web minimaliste et flexible

### Base de Données
- **MySQL** (v8.0+) - Système de gestion de base de données relationnelle
- **mysql2** (v3.6) - Client MySQL avec support des Promises

### Sécurité & Middleware
- **cors** (v2.8) - Gestion des requêtes cross-origin
- **dotenv** (v16.3) - Gestion des variables d'environnement
- **Validation personnalisée** - Middleware de validation des données
- **Rate Limiting** - Protection contre les abus (100 req/min)
- **Error Handling** - Gestionnaire d'erreurs centralisé

## Architecture du Projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # Configuration pool MySQL
│   ├── middleware/
│   │   ├── validation.js            # Validation des requêtes
│   │   ├── errorHandler.js          # Gestion des erreurs
│   │   └── rateLimiter.js           # Limitation de taux
│   ├── routes/
│   │   ├── users.js                 # Routes utilisateurs
│   │   ├── brands.js                # Routes marques
│   │   ├── models.js                # Routes modèles
│   │   ├── trims.js                 # Routes finitions
│   │   ├── specs.js                 # Routes spécifications
│   │   ├── cars.js                  # Routes voitures
│   │   └── spots.js                 # Routes spots
│   └── server.js                    # Point d'entrée application
├── .env                              # Variables d'environnement
├── .env.example                      # Template configuration
└── package.json                      # Dépendances npm
```

## Configuration de la Base de Données

### Connection Pool (database.js)

Le backend utilise un pool de connexions MySQL pour optimiser les performances:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // localhost
  user: process.env.DB_USER,         // root
  password: process.env.DB_PASSWORD, // mot de passe MySQL
  database: process.env.DB_NAME,     // carspot_db
  port: process.env.DB_PORT,         // 3306
  waitForConnections: true,          // Attendre si pool saturé
  connectionLimit: 10,               // Max 10 connexions simultanées
  queueLimit: 0                      // File d'attente illimitée
});

export const db = pool.promise();    // Version Promise pour async/await
```

### Avantages du Pool
- **Performance**: Réutilisation des connexions
- **Scalabilité**: Gestion automatique de multiples requêtes
- **Fiabilité**: Reconnexion automatique en cas de déconnexion

### Schéma de Base de Données

```
┌─────────┐      ┌──────────┐      ┌─────────┐
│  users  │      │   Spot   │      │  cars   │
├─────────┤      ├──────────┤      ├─────────┤
│ id_user │◄─────│ id_user  │      │ id_car  │
│username │      │ id_car   │─────►│id_brand │───┐
│  email  │      │spoted_at │      │id_model │───┤
│created_ │      │ location │      │ id_trim │───┤
│updated_ │      └──────────┘      │ id_specs│───┤
└─────────┘                        └─────────┘   │
                                                  │
    ┌──────────┐    ┌─────────┐    ┌─────────┐  │
    │  brands  │    │ models  │    │  trims  │  │
    ├──────────┤    ├─────────┤    ├─────────┤  │
    │ id_brand │◄───┤ id_model│◄───┤ id_trim │◄─┤
    │   name   │    │  name   │    │  name   │  │
    └──────────┘    └─────────┘    └─────────┘  │
                                                  │
                      ┌──────────┐               │
                      │  specs   │               │
                      ├──────────┤               │
                      │ id_specs │◄──────────────┘
                      │  price   │
                      │  engine  │
                      │  weight  │
                      │horse_power│
                      └──────────┘
```

## Sécurité

### 1. Protection SQL Injection

Toutes les requêtes utilisent des **parameterized queries** (requêtes préparées):

```javascript
// ✓ SÉCURISÉ - Parameterized query
db.query('SELECT * FROM users WHERE id_user = ?', [userId]);

// ✗ DANGEREUX - Interpolation directe
db.query(`SELECT * FROM users WHERE id_user = ${userId}`);
```

### 2. Validation des Données

#### Middleware de Validation (middleware/validation.js)

Toutes les entrées sont validées avant traitement:

**validateUser()**
- Username: requis, non vide, ≤ 50 caractères
- Email: requis, format valide, ≤ 100 caractères
- Sanitization: trim() des espaces

**validateSpot()**
- id_user: requis, entier valide
- id_car: requis, entier valide
- Location: requis, non vide, ≤ 50 caractères
- Conversion automatique en nombres

**validateCar()**
- id_specs, id_trim, id_model, id_brand: requis, entiers valides
- Vérification de toutes les clés étrangères

**validateSpecs()**
- Price: requis, nombre positif
- Engine: requis, ≤ 50 caractères
- Weight: requis, nombre positif
- Horse_power: requis, non vide

**validateName()** (pour brands, models, trims)
- Name: requis, non vide, ≤ 50 caractères

**validateId()**
- ID: requis, entier valide

#### Exemples d'Erreurs de Validation

```json
// Username invalide
{
  "error": "Username must be 50 characters or less"
}

// Email invalide
{
  "error": "Invalid email format"
}

// ID non numérique
{
  "error": "Invalid ID parameter"
}

// Prix négatif
{
  "error": "Valid price is required (must be positive)"
}
```

### 3. Rate Limiting

Protection contre les abus via limitation de taux (middleware/rateLimiter.js):

**Configuration:**
- **100 requêtes** maximum par minute
- Par **adresse IP**
- Fenêtre glissante de **60 secondes**
- Nettoyage automatique des données expirées

**Réponse Rate Limit Dépassé:**
```json
{
  "error": "Too many requests",
  "message": "Please try again later",
  "retryAfter": 45
}
```

**Code HTTP:** 429 Too Many Requests

### 4. Gestion des Erreurs

#### Error Handler Centralisé (middleware/errorHandler.js)

Gestion intelligente des erreurs MySQL:

**ER_DUP_ENTRY** (Code 409)
```json
{
  "error": "Duplicate entry",
  "message": "This record already exists in the database"
}
```

**ER_NO_REFERENCED_ROW_2** (Code 400)
```json
{
  "error": "Invalid reference",
  "message": "Referenced record does not exist"
}
```

**ER_ROW_IS_REFERENCED_2** (Code 409)
```json
{
  "error": "Cannot delete",
  "message": "This record is referenced by other records"
}
```

**Erreur Générique** (Code 500)
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

En mode développement, le message d'erreur détaillé est retourné.

### 5. CORS

Configuration CORS permissive pour le développement:

```javascript
app.use(cors());  // Autorise toutes les origines
```

Pour la production, utiliser une configuration restrictive:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

### 6. Body Parser

Limitation de la taille des requêtes JSON:

```javascript
app.use(express.json({ limit: '10mb' }));
```

## Routes API

### Structure d'une Route

Chaque route suit ce pattern:

```javascript
import express from 'express';
import { db } from '../config/database.js';
import { validateX, validateId } from '../middleware/validation.js';

const router = express.Router();

// GET /api/resource
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM resource');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/resource (avec validation)
router.post('/', validateX, async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    const [result] = await db.query(
      'INSERT INTO resource (field1, field2) VALUES (?, ?)',
      [field1, field2]
    );
    res.status(201).json({ id: result.insertId, field1, field2 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Montage des Routes (server.js)

```javascript
app.use('/api/users', usersRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/trims', trimsRouter);
app.use('/api/specs', specsRouter);
app.use('/api/cars', carsRouter);
app.use('/api/spots', spotsRouter);
```

### Routes Spéciales

#### Health Check
```
GET /api/health
```

Retourne le statut du serveur et de la base de données.

#### Statistiques Spots

```
GET /api/spots/stats/locations
GET /api/spots/stats/brands
```

Agrégations SQL avec GROUP BY pour statistiques.

#### Spots par Utilisateur

```
GET /api/users/:id/spots
```

Jointure complexe retournant tous les spots d'un utilisateur avec détails.

## Requêtes SQL Complexes

### Récupération de Voitures avec Détails

```sql
SELECT
  cars.*,
  brands.name as brand_name,
  models.name as model_name,
  trims.name as trim_name,
  specs.price,
  specs.engine,
  specs.weight,
  specs.horse_power
FROM cars
JOIN brands ON brands.id_brand = cars.id_brand
JOIN models ON models.id_model = cars.id_model
JOIN trims ON trims.id_trim = cars.id_trim
JOIN specs ON specs.id_specs = cars.id_specs
WHERE cars.id_car = ?
```

Cette requête effectue 4 jointures pour récupérer toutes les informations d'une voiture en une seule requête.

### Spots avec Toutes les Informations

```sql
SELECT
  Spot.*,
  users.username,
  users.email,
  brands.name as brand_name,
  models.name as model_name,
  trims.name as trim_name,
  specs.price,
  specs.engine,
  specs.weight,
  specs.horse_power
FROM Spot
JOIN users ON users.id_user = Spot.id_user
JOIN cars ON cars.id_car = Spot.id_car
JOIN brands ON brands.id_brand = cars.id_brand
JOIN models ON models.id_model = cars.id_model
JOIN trims ON trims.id_trim = cars.id_trim
JOIN specs ON specs.id_specs = cars.id_specs
ORDER BY Spot.spoted_at DESC
```

Jointure de 6 tables pour récupérer les spots avec toutes leurs relations.

### Statistiques Agrégées

```sql
-- Par localisation
SELECT location, COUNT(*) as count
FROM Spot
GROUP BY location
ORDER BY count DESC

-- Par marque
SELECT brands.name as brand_name, COUNT(*) as count
FROM Spot
JOIN cars ON cars.id_car = Spot.id_car
JOIN brands ON brands.id_brand = cars.id_brand
GROUP BY brands.name
ORDER BY count DESC
```

## Ordre d'Exécution des Middlewares

```
Requête HTTP
    ↓
1. CORS (cors)
    ↓
2. JSON Parser (express.json)
    ↓
3. Rate Limiter (rateLimiter)
    ↓
4. Routing (/api/users, /api/spots, etc.)
    ↓
5. Validation (validateUser, validateSpot, etc.)
    ↓
6. Controller (logique métier)
    ↓
7. Réponse ou Erreur
    ↓
8. Error Handler (errorHandler)
    ↓
Réponse HTTP
```

## Variables d'Environnement

### Fichier .env

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=carspot_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Sécurité des Variables

- **.env** est dans `.gitignore` (jamais commité)
- **.env.example** fourni comme template
- Utilisation de `dotenv` pour chargement sécurisé

## Démarrage du Serveur

### Séquence de Démarrage (server.js)

```javascript
app.listen(PORT, async () => {
  try {
    // Test de connexion à la base de données
    await db.query('SELECT 1');
    console.log(`✓ Database connected`);
    console.log(`✓ Server running on http://localhost:${PORT}`);
  } catch (error) {
    // Arrêt immédiat si DB inaccessible
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
});
```

### Logs de Démarrage

```
✓ Database connected
✓ Server running on http://localhost:5000
```

En cas d'erreur:

```
✗ Database connection failed: Access denied for user 'root'@'localhost'
```

## Optimisations & Bonnes Pratiques

### 1. Async/Await

Toutes les opérations asynchrones utilisent async/await:

```javascript
// ✓ Moderne et lisible
async function getUsers() {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
}

// ✗ Callbacks (évité)
db.query('SELECT * FROM users', (err, rows) => {
  if (err) throw err;
  return rows;
});
```

### 2. Gestion des Erreurs

Try-catch dans chaque route:

```javascript
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Codes de Statut HTTP

- **200** OK - Succès GET, PUT, DELETE
- **201** Created - Succès POST (création)
- **400** Bad Request - Validation échouée
- **404** Not Found - Ressource introuvable
- **409** Conflict - Conflit de données
- **429** Too Many Requests - Rate limit dépassé
- **500** Internal Server Error - Erreur serveur

### 4. Structured Logging

```javascript
console.log(`✓ Database connected`);
console.error('✗ Database connection failed:', error.message);
```

### 5. Séparation des Responsabilités

- **Routes**: Définition des endpoints
- **Middleware**: Validation, sécurité, erreurs
- **Config**: Configuration DB
- **Server**: Orchestration générale

## Scalabilité

### Actuellement

- Pool de connexions: 10 connexions
- Rate limiting: 100 req/min
- Single instance

### Pour Production

**Recommandations:**

1. **Load Balancing**: Nginx devant plusieurs instances Node.js
2. **Clustering**: Utiliser `cluster` module pour multi-process
3. **Caching**: Redis pour données fréquentes
4. **Monitoring**: PM2 pour gestion de process
5. **Logging**: Winston pour logs structurés
6. **Database**: Réplication MySQL master/slave
7. **Environment**: Variables d'environnement via secrets manager
8. **Security**: HTTPS, helmet.js, rate limit plus strict

## Testing

### Tester Localement

```bash
# Démarrer le serveur
npm run dev

# Tester health check
curl http://localhost:5000/api/health

# Lister les utilisateurs
curl http://localhost:5000/api/users

# Créer un spot
curl -X POST http://localhost:5000/api/spots \
  -H "Content-Type: application/json" \
  -d '{"id_user": 1, "id_car": 2, "location": "Nice"}'
```

### Outils de Test

- **cURL**: Tests en ligne de commande
- **Postman**: Interface graphique
- **Thunder Client**: Extension VS Code
- **Jest/Supertest**: Tests automatisés (à ajouter)

## Documentation Complémentaire

- **API_EXAMPLES.md**: Exemples de requêtes/réponses
- **README.md**: Installation et démarrage
- **PROJECT_STRUCTURE.md**: Structure du projet
- **FRONTEND_ARCHITECTURE.md**: Architecture frontend

## Support

Pour problèmes ou questions:
1. Vérifier les logs du serveur
2. Tester la connexion MySQL: `mysql -u root -p`
3. Vérifier les variables d'environnement dans `.env`
4. Consulter `API_EXAMPLES.md` pour exemples de requêtes
