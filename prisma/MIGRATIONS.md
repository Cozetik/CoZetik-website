# Guide des Migrations Prisma avec Neon

## 🚨 Important : Neon et Shadow Database

Neon (PostgreSQL serverless) ne supporte pas bien les **shadow databases** utilisées par `prisma migrate dev`.

### Symptômes du problème :
```
Error: P3006
Migration failed to apply cleanly to the shadow database.
Error: The underlying table for model 'xxx' does not exist.
```

---

## ✅ Solution : Deux workflows selon l'environnement

### 🔧 En DÉVELOPPEMENT (local)

Utilisez **`prisma db push`** au lieu de `prisma migrate dev` :

```bash
# Après avoir modifié le schema.prisma
npx prisma db push

# Génère automatiquement le client Prisma
npx prisma generate
```

**Avantages** :
- ✅ Pas de shadow database requise
- ✅ Synchronisation rapide du schema
- ✅ Parfait pour le prototypage

**Inconvénient** :
- ❌ Ne crée pas de fichiers de migration

---

### 🚀 En PRODUCTION (Vercel, Railway, etc.)

Utilisez **`prisma migrate deploy`** :

```bash
# Dans votre script de build (package.json)
"postinstall": "prisma generate && prisma migrate deploy"
```

**Avantages** :
- ✅ Applique les migrations en ordre
- ✅ Pas de shadow database requise
- ✅ Idempotent (peut être rejoué)

---

## 📝 Comment créer des migrations pour la production ?

Lorsque vous avez finalisé vos changements en développement :

### Option 1 : Migration manuelle (RECOMMANDÉ)

```bash
# 1. Créer le dossier de migration
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_nom_de_la_migration

# 2. Écrire le SQL manuellement
cat > prisma/migrations/YYYYMMDDHHMMSS_nom_de_la_migration/migration.sql << 'EOF'
-- Votre SQL ici
CREATE INDEX IF NOT EXISTS "Model_field_idx" ON "Model"("field");
EOF

# 3. Marquer comme appliquée
npx prisma migrate resolve --applied YYYYMMDDHHMMSS_nom_de_la_migration
```

### Option 2 : `db push` puis générer la migration

```bash
# 1. Appliquer les changements
npx prisma db push

# 2. Créer une migration vide pour documenter
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_nom_de_la_migration
touch prisma/migrations/YYYYMMDDHHMMSS_nom_de_la_migration/migration.sql

# 3. Marquer comme appliquée
npx prisma migrate resolve --applied YYYYMMDDHHMMSS_nom_de_la_migration
```

---

## 🛠️ Migrations Défensives (Pattern SAFE)

Pour éviter les erreurs en production, TOUJOURS utiliser des migrations **idempotentes** :

```sql
-- ✅ BON : Vérification avant création
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'MyTable' AND column_name = 'newColumn'
  ) THEN
    ALTER TABLE "MyTable" ADD COLUMN "newColumn" TEXT;
  END IF;
END $$;

-- ✅ BON : Index avec IF NOT EXISTS
CREATE INDEX IF NOT EXISTS "MyTable_field_idx" ON "MyTable"("field");

-- ❌ MAUVAIS : Échouera si déjà appliqué
ALTER TABLE "MyTable" ADD COLUMN "newColumn" TEXT;
CREATE INDEX "MyTable_field_idx" ON "MyTable"("field");
```

---

## 📦 Configuration `package.json`

```json
{
  "scripts": {
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:status": "prisma migrate status"
  }
}
```

---

## 🔍 Commandes utiles

```bash
# Vérifier l'état des migrations
npx prisma migrate status

# Déployer les migrations (production)
npx prisma migrate deploy

# Pousser le schema (développement)
npx prisma db push

# Ouvrir Prisma Studio
npx prisma studio

# Générer le client Prisma
npx prisma generate
```

---

## 🚧 Problèmes corrigés dans ce projet

### Migration `20251219142616_convert_inscription_status_to_enum`
- **Problème** : Table `formation_inscriptions` non existante en shadow DB
- **Solution** : Ajout de `IF EXISTS` check dans le SQL

### Migration `20251229181616_migrate_blog_theme_to_one_to_many`
- **Problème** : Table `_BlogPostToTheme` non existante en shadow DB
- **Solution** : Toutes les opérations wrapped dans `DO $$ BEGIN ... END $$` avec checks

### Migration `20251230_fix_indexes`
- **Objectif** : Ajout d'index pour optimiser les requêtes de visibilité
- **Index créés** :
  - `Category(visible, order)`
  - `Formation(visible, order)` + `Formation(categoryId, visible)`
  - `Partner(visible, order)`
  - `BlogPost(visible, publishedAt)` + `BlogPost(themeId, visible)`

---

## 📚 Ressources

- [Prisma + Neon Guide](https://neon.tech/docs/guides/prisma)
- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Shadow Database Issues](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development#shadow-database-errors)

---

## 🎯 Best Practices

1. ✅ **Toujours utiliser `db push` en développement avec Neon**
2. ✅ **Créer des migrations manuellement pour documenter les changements**
3. ✅ **Rendre toutes les migrations idempotentes**
4. ✅ **Tester les migrations en local avant de déployer**
5. ✅ **Utiliser `migrate deploy` en production**
6. ❌ **Ne jamais utiliser `migrate dev` avec Neon**
