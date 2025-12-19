# Guide d'exécution des migrations Prisma

## 🚀 Solution automatique (recommandée)

Les migrations s'exécuteront **automatiquement** lors du prochain déploiement sur Vercel grâce au script de build modifié.

**Actions à faire :**
1. Commitez et poussez vos changements :
   ```bash
   git add .
   git commit -m "Add Prisma migrations to build script"
   git push
   ```
2. Vercel déploiera automatiquement et exécutera les migrations

## ⚡ Solution immédiate (si vous voulez tester maintenant)

### Option 1 : Via Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **CoZetik-website**
3. Allez dans **Settings** → **Environment Variables**
4. Copiez la valeur de `DATABASE_URL`
5. Dans votre terminal, exécutez :
   ```powershell
   $env:DATABASE_URL="votre_url_copiée"
   npx prisma migrate deploy
   ```

### Option 2 : Via Vercel CLI

1. Installez Vercel CLI (si pas déjà fait) :
   ```bash
   npm i -g vercel
   ```

2. Connectez-vous :
   ```bash
   vercel login
   ```

3. Récupérez les variables d'environnement :
   ```bash
   vercel env pull .env.local
   ```

4. Exécutez les migrations :
   ```bash
   npx prisma migrate deploy
   ```

## ✅ Vérification

Après l'exécution des migrations, vous devriez voir :
```
✅ Applied migration: 20251217133120_init
✅ Applied migration: 20251219105340_add_formation_inscription
✅ Applied migration: 20251219105415_add_formation_inscription
```

Ensuite, testez l'inscription sur Vercel - cela devrait fonctionner ! 🎉
