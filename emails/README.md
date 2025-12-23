# 📧 Emails Cozetik - React Email

Système d'emailing moderne basé sur **React Email** pour le site Cozetik.

## 🎨 Design System

### Charte Graphique Cozetik 2025

```typescript
// Couleurs
#262626 - Noir Cozetik (header/footer)
#F2E7D8 - Beige Cozetik (sections/highlights)
#5E985E - Vert Cozetik (CTA/accents)
#C792DF - Violet Cozetik (highlights spéciaux)
#FDFDFD - Blanc cassé (background)

// Typographie
Borel - Display (titres)
Inter - Body (texte)

// Style
Borders : rounded-none (signature carrée Cozetik)
Shadows : subtiles (0 2px 8px rgba(0,0,0,0.06))
Responsive : max-width 600px
```

---

## 📂 Structure

```
emails/
├── _components/
│   ├── CozetikLayout.tsx       # Layout principal (Header noir + Footer)
│   ├── CozetikButton.tsx       # Bouton CTA vert carré
│   └── CozetikFooter.tsx       # Footer branded
├── contact-accepted.tsx        # Email acceptation demande contact
├── inscription-accepted.tsx    # Email acceptation inscription formation
└── README.md                   # Documentation
```

---

## 🚀 Utilisation

### Preview Mode (Développement)

Lancer le serveur de preview React Email :

```bash
npm run email
```

Accéder à : http://localhost:3000/preview

Visualiser en temps réel :
- `contact-accepted.tsx`
- `inscription-accepted.tsx`

### Tester Envoi Email

```bash
# Test email contact accepté
curl "http://localhost:3000/api/test-email?type=contact-accepted&email=votreemail@example.com"

# Test email inscription acceptée
curl "http://localhost:3000/api/test-email?type=inscription-accepted&email=votreemail@example.com"
```

---

## 📝 Templates Disponibles

### 1. Contact Accepté (`contact-accepted.tsx`)

**Usage** :
```typescript
import { render } from '@react-email/render'
import ContactAccepted from '@/emails/contact-accepted'

const html = await render(ContactAccepted({ name: 'John Doe' }))
```

**Props** :
- `name` (string) : Nom du demandeur

**Sections** :
- Hero beige avec titre "✅ Demande Acceptée"
- Message personnalisé
- Box prochaines étapes (beige + border vert)
- CTA "Consulter ma demande"
- Footer noir branded

---

### 2. Inscription Acceptée (`inscription-accepted.tsx`)

**Usage** :
```typescript
import { render } from '@react-email/render'
import InscriptionAccepted from '@/emails/inscription-accepted'

const html = await render(
  InscriptionAccepted({
    name: 'Jane Doe',
    formationTitle: 'Formation React Avancé',
    sessionDate: '15 février 2025'
  })
)
```

**Props** :
- `name` (string) : Nom de l'inscrit
- `formationTitle` (string) : Titre de la formation
- `sessionDate` (string, optionnel) : Date de la session

**Sections** :
- Hero beige "✅ Inscription Acceptée"
- Félicitations personnalisées
- Card formation (border vert gauche 4px)
- Box prochaines étapes (violet #C792DF)
- CTA "Accéder à mon espace"
- Footer noir branded

---

## 🔧 Variables d'Environnement

Configurer dans `.env.local` et variables Vercel :

```bash
# Resend API
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@cozetik.fr"
RESEND_REPLY_TO="nicoleoproject@gmail.com"
```

---

## ✅ Checklist Création Nouveau Template

1. **Créer fichier** `emails/mon-template.tsx`
2. **Importer composants** :
   ```typescript
   import { CozetikLayout } from './_components/CozetikLayout'
   import { CozetikButton } from './_components/CozetikButton'
   ```
3. **Définir props** avec TypeScript
4. **Utiliser charte Cozetik** (couleurs, fonts)
5. **Tester preview** : `npm run email`
6. **Tester envoi** : `/api/test-email?type=mon-type`
7. **Vérifier rendu** Gmail / Outlook / Apple Mail

---

## 🌍 Déploiement Vercel

### Configuration DNS (OVH/Gandi)

Ajouter les enregistrements fournis par Resend Dashboard :

```
Type: MX     | Nom: @           | Valeur: feedback-smtp.eu-west-1.amazonses.com
Type: TXT    | Nom: @           | Valeur: v=spf1 include:amazonses.com ~all
Type: TXT    | Nom: _dmarc      | Valeur: v=DMARC1; p=none
Type: CNAME  | Nom: resend._domainkey | Valeur: [fourni par Resend]
```

### Variables Vercel

Settings → Environment Variables :

```
RESEND_API_KEY = re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL = noreply@cozetik.fr
RESEND_REPLY_TO = nicoleoproject@gmail.com
```

---

## 📚 Documentation React Email

- [Documentation officielle](https://react.email/)
- [Composants disponibles](https://react.email/docs/components/overview)
- [Exemples](https://demo.react.email/)

---

## 🐛 Troubleshooting

### Email ne s'envoie pas

1. Vérifier `RESEND_API_KEY` configuré
2. Vérifier domaine vérifié sur Resend Dashboard
3. Vérifier DNS propagés (5-10 min après config)
4. Consulter logs : `console.log` dans routes API

### Preview mode ne démarre pas

```bash
# Vérifier installation
npm list react-email

# Réinstaller si nécessaire
npm install react-email @react-email/components
```

### Rendu cassé dans Gmail/Outlook

- Utiliser uniquement styles inline
- Éviter flexbox/grid (préférer tables)
- Tester avec [Litmus](https://www.litmus.com/) ou [Email on Acid](https://www.emailonacid.com/)

---

✅ **Système emailing Cozetik configuré et opérationnel !**
