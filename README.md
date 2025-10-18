# TerraGIS Frontend - Documentation Complète

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Composants principaux](#composants-principaux)
- [Intégration Backend](#intégration-backend)
- [Fonctionnalités](#fonctionnalités)
- [Scripts disponibles](#scripts-disponibles)
- [Déploiement](#déploiement)
- [Dépannage](#dépannage)
- [Contribution](#contribution)

## 🎯 Vue d'ensemble

TerraGIS Frontend est une application React moderne qui fournit une interface utilisateur complète pour le système de gestion d'entreprise TerraGIS. Cette application frontend s'intègre parfaitement avec le backend Spring Boot pour offrir une solution complète de gestion des appels d'offres, clients, opportunités, contrats et livrables.

### Fonctionnalités principales
- 🔐 **Authentification sécurisée** - Système de connexion avec gestion des rôles
- 👥 **Gestion des clients** - Interface complète pour la gestion des maîtres d'ouvrage et contacts
- 💼 **Gestion des opportunités** - Suivi des opportunités commerciales avec états et documents
- 📋 **Gestion des offres** - Création et suivi des offres avec tâches associées
- 📊 **Tableaux de bord** - Analytics et visualisations de données avancées
- 💰 **Gestion des factures** - Système de notifications pour les factures
- 📄 **Gestion des contrats et livrables** - Module complet pour les contrats et livrables
- 📱 **Interface responsive** - Compatible mobile et desktop
- 🛡️ **Gestion des permissions** - Contrôle d'accès basé sur les rôles

## 🏗️ Architecture

L'application suit une architecture modulaire React avec :
- **Create React App** comme base de développement
- **Composants fonctionnels** avec React Hooks
- **Routing** avec React Router pour la navigation
- **Services** dédiés pour les appels API vers le backend Spring Boot
- **Composants protégés** pour la sécurité et l'authentification
- **Gestion d'état** locale et contexte React

### Intégration avec le Backend TerraGIS
Le frontend communique avec le backend Spring Boot qui gère :
- Entités métier (User, MaitreOeuvrage, Opportunite, Offre, Contrat, Livrable)
- Authentification Spring Security
- API REST pour toutes les opérations CRUD
- Gestion des fichiers et documents

## 📋 Prérequis

Avant de commencer l'installation, assurez-vous d'avoir :

### Logiciels requis
- **Node.js** (version 16.x ou supérieure)
- **npm** (version 8.x ou supérieure) ou **yarn**
- **Git** pour le contrôle de version

### Backend TerraGIS
- Le backend Spring Boot TerraGIS doit être installé et fonctionnel
- Base de données configurée (PostgreSQL)
- API REST accessible sur le port configuré (généralement 8080)

Vérifiez vos versions :
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/hafsi12/frontendAPPELoffre
cd terragis-frontend
```

### Étape 2 : Installer les dépendances

```bash
# Avec npm (recommandé)
npm install

# Ou avec yarn
yarn install
```

### Étape 3 : Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Copier le fichier d'exemple si disponible
cp .env.example .env

# Ou créer un nouveau fichier .env
touch .env
```

Configurez les variables d'environnement dans `.env` :

```env
# Configuration API Backend TerraGIS
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_BACKEND_URL=http://localhost:8080

# Configuration d'authentification
REACT_APP_JWT_SECRET=your_jwt_secret_key
REACT_APP_AUTH_ENDPOINT=/auth

# Fonctionnalités activées
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_FILE_UPLOAD=true

# Configuration de l'environnement
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG_MODE=true

# Configuration des uploads
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,png,xlsx
```

### Étape 4 : Vérifier la connexion backend

Avant de démarrer le frontend, assurez-vous que le backend est accessible :

```bash
# Tester la connexion au backend
curl http://localhost:8080/api/health

# Ou vérifier les endpoints disponibles
curl http://localhost:8080/api/
```

### Étape 5 : Démarrer l'application

```bash
# Mode développement
npm start

# Ou avec yarn
yarn start
```

L'application sera accessible sur `http://localhost:3000`

## ⚙️ Configuration

### Configuration du Backend TerraGIS

Assurez-vous que le backend TerraGIS Spring Boot est correctement configuré :

1. **Base de données** : Configurée avec les entités TerraGIS
2. **Spring Security** : Authentification JWT activée
3. **CORS** : Autorisé pour `http://localhost:3000`
4. **Endpoints API** : Tous les contrôleurs REST fonctionnels

### Configuration des services frontend

Les services sont configurés pour communiquer avec les endpoints backend :

```javascript
// Configuration API dans src/services/
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Endpoints principaux
- /api/auth/* - Authentification
- /api/users/* - Gestion des utilisateurs
- /api/maitres-oeuvrage/* - Clients
- /api/opportunites/* - Opportunités
- /api/offres/* - Offres
- /api/contrats/* - Contrats
- /api/livrables/* - Livrables
- /api/factures/* - Factures
```

## 📁 Structure du projet

```
terragis-frontend/
├── public/
│   ├── index.html                 # Page HTML principale
│   └── favicon.ico               # Icône de l'application
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin_dashboard.js    # Tableau de bord administrateur
│   │   │   ├── admin_menu.js         # Menu administration
│   │   │   └── DiagnosticPanel.js    # Panel de diagnostic système
│   │   ├── auth/
│   │   │   ├── login.js              # Page de connexion
│   │   │   ├── ProtectedRoute.js     # Routes protégées
│   │   │   └── AuthDiagnostic.js     # Diagnostic d'authentification
│   │   ├── clients/
│   │   │   ├── Clients.js            # Gestion des maîtres d'ouvrage
│   │   │   └── ClientsWithAuth.js    # Clients avec authentification
│   │   ├── opportunities/
│   │   │   ├── Opportunite.js        # Gestion des opportunités
│   │   │   └── OpportunityDetails.js # Détails d'une opportunité
│   │   ├── offers/
│   │   │   └── Offre.js              # Gestion des offres
│   │   ├── charts/
│   │   │   ├── AdvancedCharts.js     # Graphiques avancés
│   │   │   ├── customChart.js        # Graphiques personnalisés
│   │   │   └── pieChart.js           # Graphiques circulaires
│   │   ├── ui/
│   │   │   ├── Navbar.js             # Barre de navigation
│   │   │   └── modal.js              # Composants modaux
│   │   ├── billing/
│   │   │   └── notification.js       # Notifications pour les factures
│   │   ├── contracts/
│   │   │   └── module.js             # Module contrats et livrables
│   │   └── common/
│   │       └── home.js               # Page d'accueil
│   ├── services/
│   │   └── statisticsService.js      # Service de statistiques
│   ├── utils/
│   │   └── PermissionDebugger.js     # Debugger de permissions
│   ├── App.js                        # Composant racine
│   └── index.js                      # Point d'entrée React
├── package.json                      # Dépendances et scripts
├── .env                             # Variables d'environnement
└── README.md                        # Documentation
```

## 🧩 Composants principaux

### 1. App.js
Composant racine qui configure :
- Routing de l'application
- Providers de contexte
- Gestion de l'authentification globale

### 2. admin_dashboard.js
Tableau de bord administrateur avec :
- Vue d'ensemble des métriques business
- Graphiques de performance
- Statistiques des opportunités et contrats
- Gestion des utilisateurs et permissions

### 3. login.js
Interface d'authentification intégrée avec Spring Security :
- Formulaire de connexion sécurisé
- Gestion des tokens JWT
- Redirection basée sur les rôles utilisateur
- Gestion des erreurs d'authentification

### 4. Clients.js & ClientsWithAuth.js
Gestion des maîtres d'ouvrage :
- Liste complète des clients
- Création et édition des informations client
- Gestion des contacts associés
- Recherche et filtrage avancés

### 5. Opportunite.js & OpportunityDetails.js
Gestion du cycle de vie des opportunités :
- Création d'opportunités liées aux clients
- Suivi des états (EN_COURS, GO, NO_GO)
- Gestion des documents associés
- Transition vers les offres

### 6. Offre.js
Gestion des offres commerciales :
- Création d'offres basées sur les opportunités
- Gestion des tâches et planning
- Suivi du statut (GAGNEE, PERDUE, EN_ATTENTE)
- Documents et pièces jointes

### 7. notification.js
Système de notifications pour les factures :
- Notifications de paiement
- Alertes de factures en retard
- Suivi des échéances
- Gestion des statuts de paiement

### 8. module.js
Module de gestion des contrats et livrables :
- Interface de gestion des contrats
- Suivi des livrables
- Gestion des échéances
- Validation et approbation

## 🔗 Intégration Backend

### Entités Backend correspondantes

Le frontend interagit avec les entités Spring Boot suivantes :

#### Gestion des utilisateurs
- **User** : Authentification et profils utilisateur
- **Role** : Rôles (ADMIN, GESTION_CLIENTS_OPPORTUNITES, etc.)

#### Gestion commerciale
- **MaitreOeuvrage** : Clients/Maîtres d'ouvrage
- **Contact** : Contacts clients
- **Opportunite** : Opportunités commerciales
- **EtatOpportunite** : États des opportunités
- **Offre** : Offres et propositions
- **Contrat** : Contrats signés
- **Livrable** : Livrables et factures
- **Facture** : Gestion des factures

#### Documents et fichiers
- **DocumentOpportunite** : Documents d'opportunités
- **DocumentOffre** : Documents d'offres
- **File** : Gestion des fichiers joints

### API Endpoints utilisés

```javascript
// Authentification
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// Clients (MaitreOeuvrage)
GET /api/maitres-oeuvrage
POST /api/maitres-oeuvrage
PUT /api/maitres-oeuvrage/{id}
DELETE /api/maitres-oeuvrage/{id}

// Opportunités
GET /api/opportunites
POST /api/opportunites
PUT /api/opportunites/{id}
GET /api/opportunites/{id}/documents

// Offres
GET /api/offres
POST /api/offres
PUT /api/offres/{id}
GET /api/offres/{id}/taches

// Contrats
GET /api/contrats
POST /api/contrats
PUT /api/contrats/{id}

// Livrables
GET /api/livrables
POST /api/livrables
PUT /api/livrables/{id}

// Factures
GET /api/factures
POST /api/factures
PUT /api/factures/{id}

// Statistiques
GET /api/statistics/dashboard
GET /api/statistics/opportunities
GET /api/statistics/offers
```

## 🎯 Fonctionnalités

### Authentification et Sécurité
- **Connexion sécurisée** avec tokens JWT
- **Gestion des rôles** basée sur les entités backend
- **Routes protégées** selon les permissions
- **Session management** avec refresh automatique

### Gestion des Clients (CRM)
- **CRUD complet** des maîtres d'ouvrage
- **Gestion des contacts** associés
- **Historique des interactions**
- **Recherche et filtrage** avancés

### Gestion des Opportunités
- **Cycle de vie complet** des opportunités
- **Gestion des états** (EN_COURS, GO, NO_GO)
- **Documents associés** avec upload
- **Transition vers offres**

### Gestion des Offres
- **Création d'offres** basées sur opportunités
- **Gestion des tâches** et planning
- **Suivi du statut** de l'offre
- **Documents et annexes**

### Gestion Financière
- **Notifications de factures** avec alertes
- **Suivi des paiements** et échéances
- **Gestion des statuts** de facturation
- **Rapports financiers**

### Gestion Contractuelle
- **Module contrats** complet
- **Suivi des livrables** et échéances
- **Validation** et approbation
- **Gestion documentaire**

### Analytics et Reporting
- **Tableaux de bord** interactifs
- **Graphiques en temps réel**
- **Métriques de performance**
- **Rapports personnalisables**

## 📜 Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`
Lance l'application en mode développement.
Ouvre [http://localhost:3000](http://localhost:3000) dans votre navigateur.

La page se recharge automatiquement lors des modifications.
Les erreurs de lint s'affichent dans la console.

### `npm test`
Lance le runner de tests en mode interactif.
Voir la section [running tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.

### `npm run build`
Construit l'application pour la production dans le dossier `build`.
Bundle React correctement en mode production et optimise la build pour les meilleures performances.

La build est minifiée et les noms de fichiers incluent les hashes.
Votre application est prête à être déployée !

### `npm run eject`
**Note : c'est une opération à sens unique. Une fois que vous `eject`, vous ne pouvez pas revenir en arrière !**

Si vous n'êtes pas satisfait des outils de build et des choix de configuration, vous pouvez `eject` à tout moment.

## 🚀 Déploiement

### Build de production

```bash
# Créer le build de production
npm run build

# Vérifier le build
npm run build && ls -la build/
```

### Déploiement sur serveur web

```bash
# Nginx - Copier les fichiers
sudo cp -r build/* /var/www/html/terragis-frontend/

# Apache - Copier les fichiers
sudo cp -r build/* /var/www/html/terragis-frontend/
```

### Variables d'environnement de production

Configurez `.env.production` :

```env
REACT_APP_API_BASE_URL=https://api.terragis.com/api
REACT_APP_BACKEND_URL=https://api.terragis.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG_MODE=false
```

### Configuration serveur web

#### Nginx
```nginx
server {
    listen 80;
    server_name terragis-frontend.com;
    
    location / {
        root /var/www/html/terragis-frontend;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Dépannage

### Problèmes courants

#### 1. Erreur de connexion au backend
```bash
# Vérifier que le backend Spring Boot est démarré
curl http://localhost:8080/api/health

# Vérifier les variables d'environnement
echo $REACT_APP_API_BASE_URL

# Vérifier les logs du backend
tail -f logs/terragis-backend.log
```

#### 2. Problèmes d'authentification
- Vérifier la configuration JWT dans le backend
- Consulter le composant `AuthDiagnostic.js`
- Vérifier les cookies et localStorage
- Tester l'endpoint `/api/auth/login`

#### 3. Erreurs CORS
```javascript
// Backend Spring Boot - Configuration CORS
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ApiController {
    // ...
}
```

#### 4. Erreurs de build
```bash
# Nettoyer le cache npm
npm start -- --reset-cache

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier les dépendances
npm audit
npm audit fix
```

### Logs et debugging

#### Frontend
```bash
# Logs de développement
npm start

# Logs de build
npm run build

# Tests avec verbose
npm test -- --verbose
```

#### Backend Integration
```bash
# Tester les endpoints
curl -X GET http://localhost:8080/api/opportunites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Vérifier la base de données
# Connectez-vous à votre DB et vérifiez les tables TerraGIS
```

### Outils de diagnostic intégrés
- `PermissionDebugger.js` - Debug des permissions utilisateur
- `DiagnosticPanel.js` - Diagnostic système complet
- `AuthDiagnostic.js` - Diagnostic d'authentification
- Console navigateur - Erreurs JavaScript et réseau

## 🤝 Contribution

### Standards de code
- **ESLint** et **Prettier** pour la cohérence du code
- **Conventions React** pour les composants
- **Documentation** des composants complexes
- **Tests** pour les nouvelles fonctionnalités

### Workflow de développement
1. **Fork** et clone du repository
2. **Branche feature** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Développement** avec tests
4. **Commit** avec messages descriptifs
5. **Pull Request** avec description détaillée

### Tests
```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests end-to-end (si configurés)
npm run test:e2e
```

### Integration avec le Backend
Lors de l'ajout de nouvelles fonctionnalités :
1. Vérifier les entités backend correspondantes
2. Tester les endpoints API
3. Gérer les erreurs et cas limites
4. Mettre à jour la documentation

## 📞 Support et Ressources

### Documentation
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- Documentation Backend TerraGIS Spring Boot

### Liens utiles
- **Code Splitting** : [Guide officiel](https://facebook.github.io/create-react-app/docs/code-splitting)
- **Bundle Analysis** : [Analyzing Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- **PWA** : [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- **Advanced Configuration** : [Configuration avancée](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- **Deployment** : [Guide de déploiement](https://facebook.github.io/create-react-app/docs/deployment)

### Troubleshooting
- **Build fails to minify** : [Solution](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Contact
Pour toute question ou problème :
- Consultez les issues GitHub du projet
- Vérifiez la documentation backend TerraGIS
- Contactez l'équipe de développement

## 📄 Licence

Ce projet est sous licence [LICENCE_TYPE]. Voir le fichier LICENSE pour plus de détails.

---

**Version Frontend :** 1.0.0  
**Compatible Backend :** TerraGIS Spring Boot v1.0.0  
**Dernière mise à jour :** Septembre 2025  
**Équipe de développement :** TerraGIS Development Team

*Cette application frontend fait partie du système complet TerraGIS de gestion des appels d'offres et de la relation client.*