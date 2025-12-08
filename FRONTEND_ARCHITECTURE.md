# Architecture Frontend - CarSpot Application

## Vue d'Ensemble

Le frontend CarSpot est une Single Page Application (SPA) construite avec React et Vite.js. Il communique avec le backend via une API REST et fournit une interface utilisateur moderne pour gérer les spots de voitures exotiques.

## Stack Technologique

### Build & Development
- **Vite.js** (v5.0) - Build tool ultra-rapide avec HMR
- **React** (v18.2) - Library UI avec Hooks
- **React Router** (v6.20) - Routing côté client

### Styling
- **Tailwind CSS** (v3.4) - Framework CSS utilitaire
- **shadcn/ui** - Composants UI accessibles (style)
- **PostCSS** - Transformation CSS
- **Autoprefixer** - Préfixes CSS automatiques

### Utilitaires
- **Lucide React** (v0.294) - Bibliothèque d'icônes modernes
- **clsx** - Fusion conditionnelle de classes CSS
- **tailwind-merge** - Merge intelligent de classes Tailwind

## Architecture du Projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                      # Composants UI réutilisables
│   │   │   ├── button.jsx           # Bouton avec variants
│   │   │   ├── card.jsx             # Carte avec sections
│   │   │   ├── input.jsx            # Input stylisé
│   │   │   └── label.jsx            # Label de formulaire
│   │   └── Layout.jsx               # Layout principal + navigation
│   │
│   ├── pages/                       # Pages de l'application
│   │   ├── Dashboard.jsx            # Statistiques et aperçu
│   │   ├── Spots.jsx                # Gestion des spots
│   │   ├── Cars.jsx                 # Catalogue voitures
│   │   └── Users.jsx                # Profils utilisateurs
│   │
│   ├── lib/
│   │   └── utils.js                 # Utilitaires (cn, api)
│   │
│   ├── App.jsx                      # Composant racine + Router
│   ├── main.jsx                     # Point d'entrée React
│   └── index.css                    # Styles Tailwind globaux
│
├── index.html                       # Template HTML
├── vite.config.js                   # Configuration Vite
├── tailwind.config.js               # Configuration Tailwind
├── postcss.config.js                # Configuration PostCSS
└── package.json                     # Dépendances npm
```

## Configuration Vite

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],              // Support React avec Fast Refresh
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Import alias @/
    },
  },
  server: {
    port: 3000,                    // Port développement
    proxy: {
      '/api': {                    // Proxy API vers backend
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### Avantages du Proxy

Le proxy Vite permet d'éviter les problèmes CORS en développement:

```javascript
// Au lieu de:
fetch('http://localhost:5000/api/users')

// On peut faire:
fetch('/api/users')  // Automatiquement proxifié vers :5000
```

## Flux de Données

### Architecture Générale

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React App)                   │
│                                                           │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐         │
│  │  Pages   │───►│ API Call │───►│   State   │         │
│  │Dashboard │    │  (fetch) │    │ (useState)│         │
│  │  Spots   │◄───│ Response │◄───│  Update   │         │
│  │  Cars    │    └──────────┘    └───────────┘         │
│  │  Users   │           │                               │
│  └──────────┘           │                               │
│         │               │                               │
│         │        ┌──────▼──────┐                        │
│         └───────►│   Layout    │                        │
│                  │ Navigation  │                        │
│                  └─────────────┘                        │
└─────────────────────────────────────────────────────────┘
                          │
                   HTTP Request
                          │
                          ▼
                  ┌───────────────┐
                  │  API Backend  │
                  │   :5000/api   │
                  └───────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  MySQL DB     │
                  │   :3306       │
                  └───────────────┘
```

### Cycle de Vie d'une Requête

```
1. User Action
    │
    ├─► Click Button / Load Page
    │
2. Component State Update
    │
    ├─► setLoading(true)
    │
3. API Call (via utils.js)
    │
    ├─► api.get('/spots')
    │   │
    │   └─► fetch('/api/spots')
    │       │
    │       └─► Proxied to http://localhost:5000/api/spots
    │
4. Backend Processing
    │
    ├─► Route Handler
    ├─► Validation
    ├─► Database Query
    └─► Response JSON
    │
5. Frontend Processing
    │
    ├─► .then(res => res.json())
    ├─► setData(data)
    ├─► setLoading(false)
    │
6. UI Update
    │
    └─► React Re-render avec nouvelles données
```

## API Client (lib/utils.js)

### Client HTTP Simplifié

```javascript
const API_URL = '/api';  // Proxy vers :5000 en dev

export const api = {
  // GET - Récupération
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  // POST - Création
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  // PUT - Modification
  async put(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  // DELETE - Suppression
  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
};
```

### Utilisation du Client

```javascript
// GET
const spots = await api.get('/spots');

// POST
const newSpot = await api.post('/spots', {
  id_user: 1,
  id_car: 2,
  location: 'Paris'
});

// PUT
const updated = await api.put('/users/1', {
  username: 'New Name',
  email: 'new@email.com'
});

// DELETE
await api.delete('/spots/1/2');
```

## Composants

### 1. Layout (components/Layout.jsx)

**Responsabilités:**
- Navigation principale
- Structure de page commune
- Active state des liens
- Responsive design

**Structure:**
```jsx
<div className="min-h-screen bg-gray-50">
  <nav>
    {/* Logo + Navigation Links */}
  </nav>
  <main>
    {children}  {/* Pages content */}
  </main>
</div>
```

**Navigation Items:**
```javascript
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Spots', href: '/spots', icon: MapPin },
  { name: 'Cars', href: '/cars', icon: Car },
  { name: 'Users', href: '/users', icon: Users },
];
```

### 2. Pages

#### Dashboard (pages/Dashboard.jsx)

**État:**
```javascript
const [stats, setStats] = useState({
  locationStats: [],
  brandStats: [],
  totalSpots: 0,
  totalUsers: 0,
});
const [loading, setLoading] = useState(true);
```

**Flux de Données:**
```
useEffect (mount)
    │
    ├─► loadStats()
    │   │
    │   ├─► api.get('/spots/stats/locations')
    │   ├─► api.get('/spots/stats/brands')
    │   ├─► api.get('/users')
    │   │
    │   └─► Promise.all()
    │       │
    │       └─► setStats({ ... })
    │           │
    │           └─► setLoading(false)
    │
    └─► Render
        │
        ├─► 4 x Card (KPIs)
        └─► 2 x Card (Charts)
```

**Affichage:**
- 4 cartes de statistiques (total spots, users, locations, brands)
- 2 graphiques (répartition par location et par marque)

#### Spots (pages/Spots.jsx)

**État:**
```javascript
const [spots, setSpots] = useState([]);
const [filteredSpots, setFilteredSpots] = useState([]);
const [filter, setFilter] = useState('');
const [showForm, setShowForm] = useState(false);
const [users, setUsers] = useState([]);
const [cars, setCars] = useState([]);
const [formData, setFormData] = useState({
  id_user: '',
  id_car: '',
  location: '',
});
```

**Flux de Données:**
```
Mount
    │
    ├─► loadSpots() ──► setSpots([...])
    ├─► loadUsers() ──► setUsers([...])
    └─► loadCars() ──► setCars([...])

Filter Change
    │
    └─► useEffect ──► setFilteredSpots([...])

Create Spot
    │
    ├─► handleSubmit()
    │   │
    │   └─► api.post('/spots', formData)
    │       │
    │       └─► loadSpots() (refresh)

Delete Spot
    │
    └─► handleDelete()
        │
        └─► api.delete(`/spots/${id_user}/${id_car}`)
            │
            └─► loadSpots() (refresh)
```

**Fonctionnalités:**
- Liste des spots avec filtrage en temps réel
- Formulaire de création (modal)
- Suppression avec confirmation
- Affichage détaillé (marque, modèle, location, specs)

#### Cars (pages/Cars.jsx)

**État:**
```javascript
const [cars, setCars] = useState([]);
const [filteredCars, setFilteredCars] = useState([]);
const [filter, setFilter] = useState('');
```

**Flux de Données:**
```
Mount
    │
    └─► loadCars()
        │
        └─► api.get('/cars')
            │
            ├─► setCars([...])
            └─► setFilteredCars([...])

Filter Change
    │
    └─► useEffect
        │
        └─► setFilteredCars(
              cars.filter(car =>
                car.brand_name.includes(filter) ||
                car.model_name.includes(filter)
              )
            )
```

**Affichage:**
- Grille responsive de cartes
- Filtrage dynamique (brand, model, trim)
- Specs détaillées (prix, puissance, poids, moteur)
- Design avec gradient et icônes

#### Users (pages/Users.jsx)

**État:**
```javascript
const [users, setUsers] = useState([]);
const [userSpots, setUserSpots] = useState({});
```

**Flux de Données:**
```
Mount
    │
    └─► loadUsers()
        │
        ├─► api.get('/users')
        │   │
        │   └─► setUsers([...])
        │
        └─► Promise.all(
              users.map(user =>
                api.get(`/users/${user.id}/spots`)
              )
            )
            │
            └─► setUserSpots({
                  [userId]: [...spots]
                })
```

**Affichage:**
- Grille de cartes utilisateurs
- Historique des 3 derniers spots
- Compteur total de spots
- Email et date d'inscription

### 3. Composants UI (components/ui/)

#### Button

**Variants:**
- default: fond primary
- destructive: rouge pour actions danger
- outline: bordure sans fond
- secondary: fond secondaire
- ghost: transparent hover

**Sizes:**
- default: hauteur 10
- sm: petit
- lg: large
- icon: carré pour icônes

**Utilisation:**
```jsx
<Button variant="default" size="lg">
  <Plus className="h-4 w-4 mr-2" />
  New Spot
</Button>
```

#### Card

**Composants:**
- Card: conteneur principal
- CardHeader: en-tête
- CardTitle: titre
- CardDescription: sous-titre
- CardContent: contenu
- CardFooter: pied de page

**Utilisation:**
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Input / Label

Inputs stylisés avec Tailwind et états focus/disabled.

```jsx
<div>
  <Label htmlFor="location">Location</Label>
  <Input
    id="location"
    value={formData.location}
    onChange={(e) => setFormData({...formData, location: e.target.value})}
  />
</div>
```

## Routing (App.jsx)

```jsx
<BrowserRouter>
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/spots" element={<Spots />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </Layout>
</BrowserRouter>
```

**Navigation:**
- Client-side routing (pas de rechargement page)
- Layout persistant
- Active state automatique

## Gestion d'État

### Local State (useState)

Chaque page gère son propre état:

```javascript
// Dashboard
const [stats, setStats] = useState({ ... });
const [loading, setLoading] = useState(true);

// Spots
const [spots, setSpots] = useState([]);
const [filter, setFilter] = useState('');
const [showForm, setShowForm] = useState(false);
```

### Pas de State Management Global

Pour cette application, pas besoin de Redux/Context car:
- Pas de données partagées complexes
- Chaque page est indépendante
- Simplicité > Over-engineering

## Patterns React Utilisés

### 1. Hooks

**useState** - État local
```javascript
const [data, setData] = useState([]);
```

**useEffect** - Effets de bord
```javascript
useEffect(() => {
  loadData();
}, []); // [] = mount uniquement
```

**useEffect avec Dépendances**
```javascript
useEffect(() => {
  setFilteredSpots(spots.filter(...));
}, [filter, spots]); // Re-run si filter ou spots change
```

**useLocation** (React Router)
```javascript
const location = useLocation();
const isActive = location.pathname === item.href;
```

### 2. Async/Await dans Composants

```javascript
async function loadSpots() {
  try {
    setLoading(true);
    const data = await api.get('/spots');
    setSpots(data);
  } catch (error) {
    console.error('Failed to load spots:', error);
  } finally {
    setLoading(false);
  }
}
```

### 3. Conditional Rendering

```javascript
{loading && <div>Loading...</div>}

{!loading && spots.length === 0 && (
  <div>No spots found</div>
)}

{!loading && spots.map(spot => (
  <Card key={spot.id}>...</Card>
))}
```

### 4. Event Handlers

```javascript
// Inline
<Button onClick={() => setShowForm(true)}>
  Open Form
</Button>

// Function
async function handleSubmit(e) {
  e.preventDefault();
  await api.post('/spots', formData);
  loadSpots();
}

<form onSubmit={handleSubmit}>...</form>
```

### 5. Controlled Components

```javascript
<Input
  value={formData.location}
  onChange={(e) => setFormData({
    ...formData,
    location: e.target.value
  })}
/>
```

## Styling avec Tailwind CSS

### Configuration (tailwind.config.js)

```javascript
export default {
  content: ['./src/**/*.{js,jsx}'],  // Scan ces fichiers
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... },
        // Couleurs shadcn/ui
      },
    },
  },
  plugins: [],
}
```

### Utility Classes

```jsx
<div className="flex items-center justify-between">
  <span className="text-2xl font-bold">{count}</span>
  <Icon className="h-4 w-4 text-muted-foreground" />
</div>
```

### Responsive Design

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 col mobile, 2 tablet, 3 desktop */}
</div>
```

### cn() Helper

Fusion intelligente de classes avec gestion des conflits:

```javascript
import { cn } from '@/lib/utils';

<Button
  className={cn(
    "base-classes",
    variant === "primary" && "primary-classes",
    isActive && "active-classes",
    className  // Props externes
  )}
/>
```

## Performance

### 1. Vite HMR (Hot Module Replacement)

Rechargement instantané des modules sans perdre l'état:
- Changement CSS: update instantané
- Changement composant: re-render uniquement le composant
- Fast Refresh: préserve l'état React

### 2. Lazy Loading (Possible)

Pour optimiser, possibilité d'ajouter:

```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 3. Memoization (Possible)

Pour composants lourds:

```javascript
const MemoizedCard = memo(Card);
```

### 4. useMemo / useCallback (Si Besoin)

```javascript
const filteredData = useMemo(() => {
  return data.filter(item => item.name.includes(filter));
}, [data, filter]);
```

## Build de Production

### Commande

```bash
npm run build
```

### Résultat

```
dist/
├── assets/
│   ├── index-[hash].js      # JavaScript minifié
│   └── index-[hash].css     # CSS minifié
└── index.html               # HTML avec références hashed
```

### Optimisations Automatiques

- **Minification**: JS/CSS compressés
- **Tree Shaking**: Code mort éliminé
- **Code Splitting**: Chunks optimisés
- **Asset Hashing**: Cache busting
- **Compression**: Gzip ready

## Déploiement

### Serveur de Production

```bash
# Build
npm run build

# Preview local
npm run preview

# Deploy vers serveur statique
# Copier dist/ vers serveur (Netlify, Vercel, etc.)
```

### Configuration Serveur

Pour SPA, rediriger toutes les routes vers index.html:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Améliorations Futures

### Court Terme
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Pagination des listes
- [ ] Validation formulaires côté client
- [ ] Error boundaries

### Moyen Terme
- [ ] Dark mode
- [ ] Tests (Vitest + React Testing Library)
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] PWA (Service Worker)
- [ ] Optimistic UI updates

### Long Terme
- [ ] State management (Zustand si besoin)
- [ ] Authentification (JWT)
- [ ] WebSocket pour temps réel
- [ ] Carte interactive (Leaflet)
- [ ] Upload d'images

## Outils de Développement

### VS Code Extensions Recommandées

- **ES7+ React/Redux/React-Native**: Snippets React
- **Tailwind CSS IntelliSense**: Autocomplétion Tailwind
- **ESLint**: Linting JavaScript
- **Prettier**: Formatage code
- **Auto Rename Tag**: Renommage tags HTML

### Scripts Disponibles

```bash
npm run dev      # Serveur développement :3000
npm run build    # Build production
npm run preview  # Preview build local
```

## Documentation Complémentaire

- **API_EXAMPLES.md**: Exemples de requêtes API
- **BACKEND_ARCHITECTURE.md**: Architecture backend
- **README.md**: Installation et démarrage
- **PROJECT_STRUCTURE.md**: Structure complète

## Support

Pour problèmes:
1. Vérifier la console navigateur (F12)
2. Vérifier que le backend tourne (:5000)
3. Tester l'API directement (curl)
4. Clear cache navigateur (Ctrl+Shift+R)
5. Réinstaller node_modules si besoin
