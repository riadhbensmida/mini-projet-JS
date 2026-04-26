# BiblioNet - Library Management System

Ce projet est maintenant divisé en deux parties : **Frontend** (React) et **Backend** (PHP OOP).

## Structure du Projet

- `/frontend` : Application React avec Vite et Tailwind CSS.
- `/backend` : API REST en PHP orienté objet avec MySQL.

## Installation

### 1. Backend (PHP)
1. Assurez-vous d'avoir un serveur PHP/MySQL (XAMPP, WAMP, ou Docker).
2. Importez le fichier `backend/database.sql` dans votre gestionnaire de base de données (phpMyAdmin).
3. Configurez les accès à la base de données dans `backend/config/Database.php`.
4. Lancez le serveur PHP sur le port **8000** :
   ```bash
   cd backend
   php -S localhost:8000
   ```

### 2. Frontend (React)
1. Installez les dépendances :
   ```bash
   cd frontend
   npm install
   ```
2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Points Clés

- **Proxy Vite** : Le frontend est configuré pour rediriger toutes les requêtes `/api` vers `http://localhost:8000`. Cela évite les erreurs CORS.
- **Sessions** : L'authentification utilise les sessions PHP natives.
- **Sécurité** : Les mots de passe sont hachés avec `password_hash()`.
- **Modèle Objet** : Chaque ressource (Book, User, Loan, etc.) possède son propre modèle et contrôleur backend.
