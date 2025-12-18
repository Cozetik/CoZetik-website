# 📸 Configuration Cloudinary (100% Gratuit)

Ce guide vous explique comment configurer Cloudinary pour gérer les uploads d'images sur votre backoffice Cozetik.

## 🎁 Plan Gratuit Cloudinary

- ✅ **25 GB** de stockage GRATUIT
- ✅ **25 GB** de bande passante/mois GRATUIT
- ✅ Transformations d'images illimitées
- ✅ CDN global automatique
- ✅ Optimisation automatique des images

**Parfait pour un site vitrine pendant des années !**

---

## 🚀 Étape 1 : Créer un compte Cloudinary

1. **Accédez à Cloudinary**
   - Allez sur [cloudinary.com](https://cloudinary.com)
   - Cliquez sur **"Sign Up for Free"** (inscription gratuite)

2. **Remplissez le formulaire d'inscription**
   - Email
   - Nom complet
   - Créez un mot de passe
   - Acceptez les conditions

3. **Confirmez votre email**
   - Vérifiez votre boîte mail
   - Cliquez sur le lien de confirmation

4. **Configurez votre compte**
   - Choisissez un **Cloud Name** (ex: `cozetik-prod`)
   - Ce nom sera visible dans les URLs de vos images
   - Vous ne pourrez plus le changer après !

---

## 🔑 Étape 2 : Récupérer les Credentials

1. **Accédez au Dashboard**
   - Une fois connecté, vous arrivez sur votre Dashboard
   - URL : [cloudinary.com/console](https://cloudinary.com/console)

2. **Trouvez vos credentials**
   - Sur la page d'accueil du Dashboard, vous verrez un encadré **"Account Details"**
   - Vous y trouverez :
     - **Cloud Name** : `votre-cloud-name`
     - **API Key** : `123456789012345`
     - **API Secret** : `cliquez sur "reveal" pour voir le secret`

3. **Copiez les 3 valeurs**
   ```
   Cloud Name: cozetik-prod
   API Key: 123456789012345
   API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz12345
   ```

---

## ⚙️ Étape 3 : Configurer votre projet

1. **Ouvrez votre fichier `.env.local`**
   - Dans votre projet Next.js
   - Chemin : `/Users/wissem/CoZetik-website/CoZetik-website/.env.local`

2. **Ajoutez vos credentials Cloudinary**
   ```env
   # Cloudinary Storage
   CLOUDINARY_CLOUD_NAME="votre-cloud-name"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz12345"
   ```

3. **Remplacez les valeurs** par vos vraies credentials copiées à l'étape 2

4. **Enregistrez le fichier**

---

## 🔄 Étape 4 : Redémarrer le serveur

Une fois les credentials ajoutés, redémarrez votre serveur de développement :

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis redémarrer :
npm run dev
```

---

## ✅ Étape 5 : Tester l'upload

1. **Accédez à la page de test**
   - URL : [http://localhost:3000/admin/test-upload](http://localhost:3000/admin/test-upload)

2. **Uploadez une image**
   - Cliquez sur la zone de dépôt
   - Sélectionnez une image (max 10MB)
   - L'image sera automatiquement uploadée vers Cloudinary

3. **Vérifiez le résultat**
   - L'URL de l'image doit commencer par `https://res.cloudinary.com/...`
   - Cliquez sur le lien pour voir l'image en taille réelle

4. **Vérifiez dans le Dashboard Cloudinary**
   - Retournez sur [cloudinary.com/console/media_library](https://cloudinary.com/console/media_library)
   - Cliquez sur **"Media Library"** dans le menu
   - Vous devriez voir votre image dans le dossier **"cozetik"**

---

## 📁 Structure Cloudinary

Les images sont organisées dans un dossier `cozetik/` :

```
Cloudinary
└── cozetik/
    ├── image1.jpg
    ├── image2.png
    └── image3.webp
```

Vous pouvez changer le nom du dossier dans :
- [app/api/upload/route.ts:69](../app/api/upload/route.ts#L69)
- [lib/blob.ts:35](../lib/blob.ts#L35)

---

## 🎨 Fonctionnalités Cloudinary

### Optimisation automatique
Les images sont automatiquement optimisées pour :
- **Qualité** : ajustée automatiquement selon le contenu
- **Format** : conversion vers WebP ou AVIF si le navigateur le supporte
- **Taille** : compression intelligente sans perte de qualité visible

### Transformations d'images
Vous pouvez transformer les images via l'URL :

**Exemples :**
```
# Image originale
https://res.cloudinary.com/cozetik-prod/image/upload/v123/cozetik/image.jpg

# Redimensionner en 300x200
https://res.cloudinary.com/cozetik-prod/image/upload/w_300,h_200,c_fill/v123/cozetik/image.jpg

# Convertir en WebP
https://res.cloudinary.com/cozetik-prod/image/upload/f_webp/v123/cozetik/image.jpg

# Appliquer un filtre
https://res.cloudinary.com/cozetik-prod/image/upload/e_blur:300/v123/cozetik/image.jpg
```

Documentation : [cloudinary.com/documentation/image_transformations](https://cloudinary.com/documentation/image_transformations)

---

## 🚨 Résolution de problèmes

### Erreur : "Configuration serveur manquante"

**Cause :** Les credentials Cloudinary ne sont pas configurés

**Solution :**
1. Vérifiez que vous avez ajouté les 3 variables dans `.env.local`
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Redémarrez le serveur (`npm run dev`)

### Erreur : "Invalid credentials"

**Cause :** Les credentials sont incorrects

**Solution :**
1. Retournez sur [cloudinary.com/console](https://cloudinary.com/console)
2. Vérifiez vos credentials (Cloud Name, API Key, API Secret)
3. Copiez-collez à nouveau dans `.env.local`
4. Assurez-vous de ne pas avoir de guillemets en trop

### L'image ne s'affiche pas

**Cause :** URL incorrecte ou image supprimée

**Solution :**
1. Vérifiez que l'URL commence bien par `https://res.cloudinary.com/`
2. Collez l'URL dans un navigateur pour voir si elle fonctionne
3. Vérifiez que l'image existe dans votre Media Library Cloudinary

---

## 📊 Surveillance de l'usage

### Vérifier votre quota

1. Accédez au Dashboard : [cloudinary.com/console](https://cloudinary.com/console)
2. En haut à droite, vous verrez vos quotas :
   - **Storage** : X GB / 25 GB
   - **Bandwidth** : X GB / 25 GB (ce mois-ci)

### Recevoir des alertes

1. Allez dans **Settings** > **Account**
2. Section **"Usage Notifications"**
3. Activez les notifications par email quand vous approchez de la limite

---

## 🎯 Bonnes pratiques

### 1. Optimisez vos images avant upload
- Utilisez des images de taille raisonnable (pas de 10000x10000px)
- Privilégiez JPEG pour les photos, PNG pour les logos/icônes

### 2. Nommez vos fichiers proprement
- Utilisez des noms descriptifs (ex: `formation-react-cover.jpg`)
- Évitez les caractères spéciaux et espaces

### 3. Organisez par dossiers
Vous pouvez créer des sous-dossiers :
- `cozetik/formations/`
- `cozetik/blog/`
- `cozetik/partners/`

Modifiez le paramètre `folder` dans le code pour cela.

### 4. Supprimez les images inutilisées
- Allez régulièrement dans Media Library
- Supprimez les anciennes images pour libérer de l'espace

---

## 🔗 Liens utiles

- **Dashboard** : [cloudinary.com/console](https://cloudinary.com/console)
- **Media Library** : [cloudinary.com/console/media_library](https://cloudinary.com/console/media_library)
- **Documentation** : [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Pricing** : [cloudinary.com/pricing](https://cloudinary.com/pricing)
- **Support** : [support.cloudinary.com](https://support.cloudinary.com)

---

## ✨ C'est terminé !

Votre système d'upload d'images Cloudinary est maintenant configuré et 100% gratuit !

Vous pouvez maintenant :
- ✅ Uploader des images depuis le backoffice
- ✅ Gérer vos images dans la Media Library Cloudinary
- ✅ Bénéficier du CDN global pour des chargements rapides
- ✅ Utiliser 25GB de stockage gratuitement

**Profitez bien de votre plateforme Cozetik ! 🎉**
