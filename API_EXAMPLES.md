# Exemples de Requêtes et Réponses API

Ce document fournit des exemples concrets de requêtes et réponses pour toutes les routes de l'API CarSpot.

## Base URL
```
http://localhost:5000/api
```

## Format des Requêtes
Toutes les requêtes POST et PUT doivent inclure le header:
```
Content-Type: application/json
```

---

## Health Check

### GET /api/health
Vérifie le statut de l'API.

**Requête:**
```bash
curl http://localhost:5000/api/health
```

**Réponse: 200 OK**
```json
{
  "status": "ok",
  "message": "CarSpot API is running",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "environment": "development"
}
```

---

## Users

### GET /api/users
Récupère tous les utilisateurs.

**Requête:**
```bash
curl http://localhost:5000/api/users
```

**Réponse: 200 OK**
```json
[
  {
    "id_user": 1,
    "username": "Alice",
    "email": "alice@mail.com",
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-15T10:00:00.000Z"
  },
  {
    "id_user": 2,
    "username": "Bob",
    "email": "bob@mail.com",
    "created_at": "2025-01-15T10:01:00.000Z",
    "updated_at": "2025-01-15T10:01:00.000Z"
  }
]
```

### GET /api/users/:id
Récupère un utilisateur spécifique.

**Requête:**
```bash
curl http://localhost:5000/api/users/1
```

**Réponse: 200 OK**
```json
{
  "id_user": 1,
  "username": "Alice",
  "email": "alice@mail.com",
  "created_at": "2025-01-15T10:00:00.000Z",
  "updated_at": "2025-01-15T10:00:00.000Z"
}
```

**Erreur: 404 Not Found**
```json
{
  "error": "User not found"
}
```

**Erreur: 400 Bad Request** (ID invalide)
```json
{
  "error": "Invalid ID parameter"
}
```

### GET /api/users/:id/spots
Récupère tous les spots d'un utilisateur.

**Requête:**
```bash
curl http://localhost:5000/api/users/1/spots
```

**Réponse: 200 OK**
```json
[
  {
    "id_user": 1,
    "id_car": 1,
    "spoted_at": "2025-01-15T12:30:00.000Z",
    "location": "Paris",
    "brand_name": "Ferrari",
    "model_name": "488",
    "trim_name": "Base",
    "id_specs": 1,
    "price": "250000.00",
    "engine": "V8",
    "weight": "1500.00",
    "horse_power": "670"
  }
]
```

### POST /api/users
Crée un nouvel utilisateur.

**Requête:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Charlie",
    "email": "charlie@example.com"
  }'
```

**Réponse: 201 Created**
```json
{
  "id": 11,
  "username": "Charlie",
  "email": "charlie@example.com"
}
```

**Erreur: 400 Bad Request** (Validation)
```json
{
  "error": "Username is required"
}
```

```json
{
  "error": "Invalid email format"
}
```

```json
{
  "error": "Username must be 50 characters or less"
}
```

### PUT /api/users/:id
Met à jour un utilisateur existant.

**Requête:**
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Alice Updated",
    "email": "alice.new@mail.com"
  }'
```

**Réponse: 200 OK**
```json
{
  "id": "1",
  "username": "Alice Updated",
  "email": "alice.new@mail.com"
}
```

### DELETE /api/users/:id
Supprime un utilisateur.

**Requête:**
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

**Réponse: 200 OK**
```json
{
  "message": "User deleted"
}
```

**Erreur: 409 Conflict** (Si l'utilisateur a des spots)
```json
{
  "error": "Cannot delete",
  "message": "This record is referenced by other records"
}
```

---

## Brands

### GET /api/brands
Récupère toutes les marques.

**Requête:**
```bash
curl http://localhost:5000/api/brands
```

**Réponse: 200 OK**
```json
[
  {
    "id_brand": 1,
    "name": "Ferrari"
  },
  {
    "id_brand": 2,
    "name": "Lamborghini"
  },
  {
    "id_brand": 3,
    "name": "Porsche"
  }
]
```

### GET /api/brands/:id
Récupère une marque spécifique.

**Requête:**
```bash
curl http://localhost:5000/api/brands/1
```

**Réponse: 200 OK**
```json
{
  "id_brand": 1,
  "name": "Ferrari"
}
```

### POST /api/brands
Crée une nouvelle marque.

**Requête:**
```bash
curl -X POST http://localhost:5000/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aston Martin"
  }'
```

**Réponse: 201 Created**
```json
{
  "id": 11,
  "name": "Aston Martin"
}
```

**Erreur: 400 Bad Request**
```json
{
  "error": "Name is required"
}
```

### PUT /api/brands/:id
Met à jour une marque.

**Requête:**
```bash
curl -X PUT http://localhost:5000/api/brands/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ferrari S.p.A."
  }'
```

**Réponse: 200 OK**
```json
{
  "id": "1",
  "name": "Ferrari S.p.A."
}
```

### DELETE /api/brands/:id
Supprime une marque.

**Requête:**
```bash
curl -X DELETE http://localhost:5000/api/brands/1
```

**Réponse: 200 OK**
```json
{
  "message": "Brand deleted"
}
```

---

## Models

### GET /api/models
Récupère tous les modèles.

**Requête:**
```bash
curl http://localhost:5000/api/models
```

**Réponse: 200 OK**
```json
[
  {
    "id_model": 1,
    "name": "488"
  },
  {
    "id_model": 2,
    "name": "Aventador"
  }
]
```

Les routes POST, PUT, DELETE pour Models suivent le même format que Brands.

---

## Trims

### GET /api/trims
Récupère toutes les finitions.

**Requête:**
```bash
curl http://localhost:5000/api/trims
```

**Réponse: 200 OK**
```json
[
  {
    "id_trim": 1,
    "name": "Base"
  },
  {
    "id_trim": 2,
    "name": "Sport"
  }
]
```

Les routes POST, PUT, DELETE pour Trims suivent le même format que Brands.

---

## Specs

### GET /api/specs
Récupère toutes les spécifications.

**Requête:**
```bash
curl http://localhost:5000/api/specs
```

**Réponse: 200 OK**
```json
[
  {
    "id_specs": 1,
    "price": "250000.00",
    "engine": "V8",
    "weight": "1500.00",
    "horse_power": "670"
  },
  {
    "id_specs": 2,
    "price": "400000.00",
    "engine": "V12",
    "weight": "1700.00",
    "horse_power": "740"
  }
]
```

### GET /api/specs/:id
Récupère des spécifications spécifiques.

**Requête:**
```bash
curl http://localhost:5000/api/specs/1
```

**Réponse: 200 OK**
```json
{
  "id_specs": 1,
  "price": "250000.00",
  "engine": "V8",
  "weight": "1500.00",
  "horse_power": "670"
}
```

### POST /api/specs
Crée de nouvelles spécifications.

**Requête:**
```bash
curl -X POST http://localhost:5000/api/specs \
  -H "Content-Type: application/json" \
  -d '{
    "price": 350000,
    "engine": "V10",
    "weight": 1600,
    "horse_power": "800"
  }'
```

**Réponse: 201 Created**
```json
{
  "id": 11,
  "price": 350000,
  "engine": "V10",
  "weight": 1600,
  "horse_power": "800"
}
```

**Erreur: 400 Bad Request**
```json
{
  "error": "Valid price is required (must be positive)"
}
```

```json
{
  "error": "Engine type is required"
}
```

### PUT /api/specs/:id
Met à jour des spécifications.

**Requête:**
```bash
curl -X PUT http://localhost:5000/api/specs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 260000,
    "engine": "V8 Twin Turbo",
    "weight": 1480,
    "horse_power": "690"
  }'
```

**Réponse: 200 OK**
```json
{
  "id": "1",
  "price": 260000,
  "engine": "V8 Twin Turbo",
  "weight": 1480,
  "horse_power": "690"
}
```

### DELETE /api/specs/:id
Supprime des spécifications.

**Requête:**
```bash
curl -X DELETE http://localhost:5000/api/specs/1
```

**Réponse: 200 OK**
```json
{
  "message": "Specs deleted"
}
```

---

## Cars

### GET /api/cars
Récupère toutes les voitures avec leurs détails complets.

**Requête:**
```bash
curl http://localhost:5000/api/cars
```

**Réponse: 200 OK**
```json
[
  {
    "id_car": 1,
    "id_specs": 1,
    "id_trim": 1,
    "id_model": 1,
    "id_brand": 1,
    "brand_name": "Ferrari",
    "model_name": "488",
    "trim_name": "Base",
    "price": "250000.00",
    "engine": "V8",
    "weight": "1500.00",
    "horse_power": "670"
  },
  {
    "id_car": 2,
    "id_specs": 2,
    "id_trim": 2,
    "id_model": 2,
    "id_brand": 2,
    "brand_name": "Lamborghini",
    "model_name": "Aventador",
    "trim_name": "Sport",
    "price": "400000.00",
    "engine": "V12",
    "weight": "1700.00",
    "horse_power": "740"
  }
]
```

### GET /api/cars/:id
Récupère une voiture spécifique.

**Requête:**
```bash
curl http://localhost:5000/api/cars/1
```

**Réponse: 200 OK**
```json
{
  "id_car": 1,
  "id_specs": 1,
  "id_trim": 1,
  "id_model": 1,
  "id_brand": 1,
  "brand_name": "Ferrari",
  "model_name": "488",
  "trim_name": "Base",
  "price": "250000.00",
  "engine": "V8",
  "weight": "1500.00",
  "horse_power": "670"
}
```

### POST /api/cars
Crée une nouvelle voiture.

**Requête:**
```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "id_specs": 3,
    "id_trim": 3,
    "id_model": 3,
    "id_brand": 3
  }'
```

**Réponse: 201 Created**
```json
{
  "id": 11,
  "id_specs": 3,
  "id_trim": 3,
  "id_model": 3,
  "id_brand": 3
}
```

**Erreur: 400 Bad Request**
```json
{
  "error": "Valid brand ID is required"
}
```

**Erreur: 400 Bad Request** (Référence invalide)
```json
{
  "error": "Invalid reference",
  "message": "Referenced record does not exist"
}
```

### PUT /api/cars/:id
Met à jour une voiture.

**Requête:**
```bash
curl -X PUT http://localhost:5000/api/cars/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id_specs": 1,
    "id_trim": 2,
    "id_model": 1,
    "id_brand": 1
  }'
```

**Réponse: 200 OK**
```json
{
  "id": "1",
  "id_specs": 1,
  "id_trim": 2,
  "id_model": 1,
  "id_brand": 1
}
```

### DELETE /api/cars/:id
Supprime une voiture.

**Requête:**
```bash
curl -X DELETE http://localhost:5000/api/cars/1
```

**Réponse: 200 OK**
```json
{
  "message": "Car deleted"
}
```

---

## Spots

### GET /api/spots
Récupère tous les spots avec détails complets.

**Requête:**
```bash
curl http://localhost:5000/api/spots
```

**Réponse: 200 OK**
```json
[
  {
    "id_user": 1,
    "id_car": 1,
    "spoted_at": "2025-01-15T12:30:00.000Z",
    "location": "Paris",
    "username": "Alice",
    "email": "alice@mail.com",
    "brand_name": "Ferrari",
    "model_name": "488",
    "trim_name": "Base",
    "price": "250000.00",
    "engine": "V8",
    "weight": "1500.00",
    "horse_power": "670"
  },
  {
    "id_user": 2,
    "id_car": 2,
    "spoted_at": "2025-01-15T14:45:00.000Z",
    "location": "Lyon",
    "username": "Bob",
    "email": "bob@mail.com",
    "brand_name": "Lamborghini",
    "model_name": "Aventador",
    "trim_name": "Sport",
    "price": "400000.00",
    "engine": "V12",
    "weight": "1700.00",
    "horse_power": "740"
  }
]
```

### GET /api/spots/stats/locations
Récupère les statistiques par localisation.

**Requête:**
```bash
curl http://localhost:5000/api/spots/stats/locations
```

**Réponse: 200 OK**
```json
[
  {
    "location": "Paris",
    "count": 5
  },
  {
    "location": "Lyon",
    "count": 3
  },
  {
    "location": "Marseille",
    "count": 2
  }
]
```

### GET /api/spots/stats/brands
Récupère les statistiques par marque.

**Requête:**
```bash
curl http://localhost:5000/api/spots/stats/brands
```

**Réponse: 200 OK**
```json
[
  {
    "brand_name": "Ferrari",
    "count": 4
  },
  {
    "brand_name": "Lamborghini",
    "count": 3
  },
  {
    "brand_name": "Porsche",
    "count": 2
  }
]
```

### POST /api/spots
Crée un nouveau spot.

**Requête:**
```bash
curl -X POST http://localhost:5000/api/spots \
  -H "Content-Type: application/json" \
  -d '{
    "id_user": 1,
    "id_car": 2,
    "location": "Nice"
  }'
```

**Réponse: 201 Created**
```json
{
  "id_user": 1,
  "id_car": 2,
  "location": "Nice"
}
```

**Erreur: 400 Bad Request**
```json
{
  "error": "Valid user ID is required"
}
```

```json
{
  "error": "Location is required"
}
```

```json
{
  "error": "Location must be 50 characters or less"
}
```

**Erreur: 409 Conflict** (Spot déjà existant)
```json
{
  "error": "Duplicate entry",
  "message": "This record already exists in the database"
}
```

### PUT /api/spots/:id_user/:id_car
Met à jour un spot existant.

**Requête:**
```bash
curl -X PUT http://localhost:5000/api/spots/1/2 \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Cannes"
  }'
```

**Réponse: 200 OK**
```json
{
  "id_user": "1",
  "id_car": "2",
  "location": "Cannes"
}
```

### DELETE /api/spots/:id_user/:id_car
Supprime un spot.

**Requête:**
```bash
curl -X DELETE http://localhost:5000/api/spots/1/2
```

**Réponse: 200 OK**
```json
{
  "message": "Spot deleted"
}
```

---

## Codes d'Erreur Communs

### 400 Bad Request
Données de requête invalides (validation échouée).

### 404 Not Found
Ressource non trouvée ou route inexistante.

### 409 Conflict
Conflit de données (doublon ou référence utilisée).

### 429 Too Many Requests
Limite de taux atteinte (max 100 requêtes/minute).

**Exemple:**
```json
{
  "error": "Too many requests",
  "message": "Please try again later",
  "retryAfter": 45
}
```

### 500 Internal Server Error
Erreur serveur interne.

**Exemple (mode développement):**
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

**Exemple (mode production):**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Tests avec cURL

### Tester la connexion
```bash
curl http://localhost:5000/api/health
```

### Lister tous les spots
```bash
curl http://localhost:5000/api/spots
```

### Créer un nouveau spot
```bash
curl -X POST http://localhost:5000/api/spots \
  -H "Content-Type: application/json" \
  -d '{"id_user": 1, "id_car": 3, "location": "Monaco"}'
```

### Obtenir les statistiques
```bash
curl http://localhost:5000/api/spots/stats/locations
curl http://localhost:5000/api/spots/stats/brands
```

---

## Tests avec JavaScript (Fetch)

```javascript
// GET - Récupérer tous les spots
fetch('http://localhost:5000/api/spots')
  .then(res => res.json())
  .then(data => console.log(data));

// POST - Créer un spot
fetch('http://localhost:5000/api/spots', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_user: 1,
    id_car: 3,
    location: 'Monaco'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// PUT - Mettre à jour un utilisateur
fetch('http://localhost:5000/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Alice Updated',
    email: 'alice.new@mail.com'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// DELETE - Supprimer un spot
fetch('http://localhost:5000/api/spots/1/3', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Notes de Sécurité

1. **Validation des Données**: Toutes les entrées sont validées côté serveur
2. **SQL Injection**: Protection via requêtes préparées (parameterized queries)
3. **Rate Limiting**: Max 100 requêtes/minute par IP
4. **CORS**: Activé pour le développement local
5. **Taille Limite**: Requêtes JSON limitées à 10MB

---

## Support

Pour plus d'informations:
- Consultez `README.md` pour l'installation
- Voir `BACKEND_ARCHITECTURE.md` pour l'architecture
- Voir `FRONTEND_ARCHITECTURE.md` pour le frontend
