# 🚀 Guide de Déploiement (Mise en ligne)

Pour rendre votre site accessible à tout le monde sur Internet, nous allons utiliser deux services gratuits et très populaires : **Render** (pour le serveur/backend) et **Vercel** (pour le site/frontend).

## Étape 1 : Préparer le code
Le code est déjà prêt. Assurez-vous simplement d'avoir tout sauvegardé.

## Étape 2 : Mettre le code sur GitHub
Pour déployer, le plus simple est de mettre votre code sur GitHub.
1. Créez un compte sur [GitHub.com](https://github.com).
2. Créez un "New Repository" (Nouveau dépôt).
3. Envoyez votre code dessus (ou demandez à un développeur de le faire).

## Étape 3 : Déployer le Backend (Serveur) sur Render
1. Créez un compte sur [Render.com](https://render.com).
2. Cliquez sur **"New +"** et choisissez **"Web Service"**.
3. Connectez votre compte GitHub et choisissez votre dépôt.
4. Remplissez les champs :
   - **Name** : `jewelry-ai-backend` (ou ce que vous voulez)
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Choisissez le plan **"Free"**.
6. Cliquez sur **"Create Web Service"**.
7. Attendez que ça finisse. Render vous donnera une URL (ex: `https://jewelry-ai-backend.onrender.com`). **Copiez cette URL.**

## Étape 4 : Déployer le Frontend (Site) sur Vercel
1. Créez un compte sur [Vercel.com](https://vercel.com).
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Importez votre dépôt GitHub.
4. Configurez le projet :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend` (Cliquez sur "Edit" pour changer ça)
5. **IMPORTANT** : Dans la section **"Environment Variables"**, ajoutez une variable :
   - **Key** : `VITE_API_URL`
   - **Value** : Collez l'URL de votre backend Render (ex: `https://jewelry-ai-backend.onrender.com`) **sans le slash à la fin**.
6. Cliquez sur **"Deploy"**.

## 🎉 C'est fini !
Vercel vous donnera un lien (ex: `https://jewelry-ai-studio.vercel.app`). C'est l'adresse de votre site que vous pouvez partager à tout le monde !

---
**Note importante sur le stockage** :
Sur la version gratuite de Render, les fichiers téléchargés (images Pinterest, résultats générés) sont temporaires. Ils disparaîtront si le serveur redémarre (ce qui arrive souvent en version gratuite). Pour un vrai projet commercial, il faudrait ajouter un stockage cloud (comme AWS S3), mais pour une démo, c'est suffisant.
