# 🎓 COZETIK

**Plateforme de formations professionnelles - IA, Informatique, Business**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

Plateforme moderne de formations professionnelles avec site vitrine public et backoffice d'administration complet.

---

## ✨ Fonctionnalités

### Site Public 🌐

- 🏠 **Page d'accueil dynamique** - Présentation des formations et actualités
- 📚 **Catalogue formations avec filtres** - Navigation intuitive par catégories
- ✍️ **Blog avec éditeur Tiptap** - Articles et actualités
- 🤝 **Page partenaires** - Présentation des entreprises partenaires
- 📞 **Formulaire contact avec emailing** - Communication automatisée
- 📧 **Inscriptions formations automatisées** - Gestion des demandes d'inscription

### Backoffice Admin 🔧

- 🔐 **Authentification sécurisée** - NextAuth.js avec gestion des sessions
- 📊 **Dashboard statistiques** - Métriques et KPIs en temps réel
- 🏷️ **CRUD Catégories** - Gestion complète des catégories de formations
- 📚 **CRUD Formations** - Création et gestion avec calendrier de sessions
- ✍️ **CRUD Blog** - Éditeur Tiptap pour articles riches
- 🤝 **CRUD Partenaires** - Gestion des entreprises partenaires
- 📬 **Gestion demandes contact & inscriptions** - Suivi des leads et inscriptions

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router), React 18, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Base de données** : PostgreSQL (Neon), Prisma ORM
- **Authentification** : NextAuth.js v4
- **Storage** : Vercel Blob (images/fichiers)
- **Emails** : Resend
- **Rich Text Editor** : Tiptap
- **Déploiement** : Vercel

---

## 📋 Prérequis

- Node.js 18+ / npm 9+
- Compte PostgreSQL (Neon recommandé)
- Compte Vercel (pour Blob Storage & déploiement)
- Compte Resend (pour emails)

---

## 🚀 Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/cozetik.git
cd cozetik

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials (voir section Variables d'environnement)

# 4. Configurer la base de données
npx prisma generate
npx prisma migrate dev --name init

# 5. Créer un utilisateur admin
npx prisma db seed
# Note : Modifier prisma/seed.ts avant d'exécuter pour définir vos credentials admin

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Variables d'environnement

Créer un fichier `.env.local` à la racine avec :

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-genere"  # Générer avec: openssl rand -base64 32

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="votre-token-vercel-blob"

# Resend (Emails)
RESEND_API_KEY="votre-api-key-resend"
ADMIN_EMAIL="votre-email-admin@example.com"  # Email pour recevoir notifications
```

**⚠️ Important :** Ne jamais commiter le fichier `.env.local` (déjà dans .gitignore)

---

## 📁 Structure du projet

```
cozetik/
├── app/
│   ├── (public)/           # Routes publiques (site vitrine)
│   ├── admin/              # Routes backoffice admin
│   └── api/                # API routes (public + admin)
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   ├── admin/              # Composants backoffice
│   └── public/             # Composants site public
├── lib/
│   ├── prisma.ts           # Client Prisma
│   ├── auth.ts             # Configuration NextAuth
│   ├── slugify.ts          # Helper slug generation
│   └── blob.ts             # Helper Vercel Blob
├── prisma/
│   ├── schema.prisma       # Schéma base de données
│   └── seed.ts             # Script seed données initiales
├── types/
│   └── next-auth.d.ts      # Types NextAuth étendus
└── public/                 # Assets statiques
```

---

## 📜 Scripts disponibles

```bash
npm run dev          # Démarrer serveur développement
npm run build        # Build production
npm run start        # Démarrer serveur production
npm run lint         # Linter ESLint
npx prisma studio    # Interface Prisma Studio (visualiser DB)
npx prisma generate  # Générer Prisma Client
npx prisma migrate dev  # Créer/appliquer migrations
npx prisma db seed   # Seed données initiales
```

---

## 🔐 Premier accès Admin

Après le seed, un compte super admin est créé.

**⚠️ Modifier le fichier `prisma/seed.ts` AVANT d'exécuter le seed** pour définir :

- Votre email admin
- Votre mot de passe (hashé automatiquement)

Accès backoffice : `/admin/login`

---

## 🚢 Déploiement sur Vercel

1. Push votre code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement (voir section Variables)
4. Vercel build automatiquement
5. Exécuter les migrations en production :

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 📊 Schéma de base de données

Le projet utilise 8 tables principales :

- `User` - Utilisateurs admin
- `Category` - Catégories formations
- `Formation` - Formations
- `FormationSession` - Sessions/calendrier formations
- `Partner` - Partenaires entreprises
- `BlogPost` - Articles blog
- `ContactRequest` - Demandes de contact
- `FormationInscription` - Inscriptions formations

Voir `prisma/schema.prisma` pour le schéma complet.

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteur

Equipe Cozetik

---

## 🎯 Roadmap

- [ ] Paiements en ligne (Stripe)
- [ ] Espace élève avec progression
- [ ] Certificats de formation
- [ ] Messagerie interne
- [ ] Mobile app (React Native)

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [NextAuth.js Guide](https://next-auth.js.org)
