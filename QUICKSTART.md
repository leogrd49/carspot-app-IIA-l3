# Guide de Démarrage Rapide - CarSpot

## Installation Rapide (Windows)

### 1. Préparer MySQL

Importez la base de données :
```bash
mysql -u root -p < C:\Users\anouk\Downloads\BonusSQL\carspotSQL.sql
```

### 2. Installation Automatique

Double-cliquez sur `install.bat` pour installer toutes les dépendances automatiquement.

### 3. Configuration

1. Copiez `backend\.env.example` vers `backend\.env`
2. Éditez `backend\.env` avec vos identifiants MySQL :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=carspot_db
DB_PORT=3306
PORT=5000
```

### 4. Lancement

Double-cliquez sur `start.bat` pour lancer l'application.

L'application s'ouvrira automatiquement :
- Backend : http://localhost:5000
- Frontend : http://localhost:3000

## Installation Manuelle

Si vous préférez installer manuellement :

### Backend
```bash
cd backend
npm install
copy .env.example .env
# Éditez .env avec vos identifiants
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Premiers Pas

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Explorez le **Dashboard** pour voir les statistiques
3. Allez dans **Spots** pour voir et créer des observations de voitures
4. Consultez le **Catalogue** pour voir toutes les voitures
5. Visitez **Users** pour voir les profils utilisateurs

## Résolution de Problèmes

### MySQL ne démarre pas
```bash
# Windows : Démarrer MySQL
net start MySQL80
```

### Port 3000 ou 5000 déjà utilisé
Fermez les applications utilisant ces ports ou modifiez les ports dans :
- Backend : `backend\.env` (PORT=5000)
- Frontend : `frontend\vite.config.js` (port: 3000)

### Erreur de connexion à la base de données
Vérifiez que :
1. MySQL est démarré
2. Les identifiants dans `backend\.env` sont corrects
3. La base de données `carspot_db` existe

```bash
# Vérifier MySQL
mysql -u root -p -e "SHOW DATABASES;"
```

## Fonctionnalités Disponibles

- **Dashboard** : Vue d'ensemble avec statistiques
- **Spots** : Créer, voir, filtrer et supprimer des spots
- **Cars** : Catalogue complet des voitures avec spécifications
- **Users** : Profils utilisateurs avec historique des spots

## Support

Consultez le README.md pour plus de détails sur :
- Structure du projet
- API endpoints
- Technologies utilisées
- Améliorations futures
