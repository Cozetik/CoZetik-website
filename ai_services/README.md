# Quiz AI Backend - FastAPI + Mistral AI

Ce backend FastAPI fournit les recommandations de formations personnalisées pour le Quiz Cozetik.

## 🚀 Déploiement sur Railway

### 1. Prérequis
- Compte Railway : [railway.app](https://railway.app)
- Clé API Mistral AI : [console.mistral.ai](https://console.mistral.ai)

### 2. Déploiement

#### Option A : Via GitHub (Recommandé)

1. **Pusher le code sur GitHub** (déjà fait si vous êtes sur la branche `integration-quiz`)

2. **Créer un nouveau projet Railway**
   - Aller sur [railway.app/new](https://railway.app/new)
   - Cliquer "Deploy from GitHub repo"
   - Sélectionner `Cozetik/CoZetik-website`
   - **Important** : Dans les paramètres, définir le **Root Directory** : `ai_services`

3. **Configurer les variables d'environnement**
   - Dans le dashboard Railway, aller dans "Variables"
   - Ajouter :
     ```
     MISTRAL_API_KEY=<votre-clé-mistral-ai>
     ```

4. **Railway va automatiquement :**
   - Détecter `requirements.txt`
   - Installer les dépendances
   - Lancer l'application avec Uvicorn
   - Générer une URL : `https://votre-app.railway.app`

#### Option B : Via Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Depuis le dossier ai_services/
cd ai_services
railway init
railway up

# Ajouter la variable d'env
railway variables set MISTRAL_API_KEY=<votre-clé>
```

### 3. Configurer Next.js

Une fois déployé, copier l'URL Railway dans votre `.env.local` Next.js :

```bash
FASTAPI_URL=https://votre-app.railway.app
```

Et dans Vercel (pour la production) :
1. Aller dans Settings → Environment Variables
2. Ajouter `FASTAPI_URL` avec l'URL Railway

## 🧪 Tester le Backend

### En local

```bash
cd ai_services
pip install -r requirements.txt
uvicorn app.main:app --reload
```

L'API sera disponible sur `http://localhost:8000`

### Test avec curl

```bash
curl -X POST http://localhost:8000/api/recommander \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "q1": "B. Je manque de temps, je suis noyé(e) sous les tâches",
      "q2": "B. Retrouver du temps, de l'\''organisation et du calme",
      "q3": "B. Être organisé(e), efficace et léger(e)",
      "q10": "B. Pour m'\''améliorer au travail"
    }
  }'
```

Réponse attendue :
```json
{
  "profil_letter": "B",
  "profil_analysis": "...",
  "principal_program": {
    "name": "IA & Productivité — ChatGPT Pro",
    "reason": "..."
  },
  "complementary_modules": [...],
  "motivation_message": "..."
}
```

## 📁 Structure

```
ai_services/
├── app/
│   ├── agents/
│   │   └── quiz/
│   │       ├── __init__.py
│   │       ├── context.txt       # Prompt IA avec catalogue formations
│   │       ├── logic.py           # Logique Mistral AI
│   │       └── schemas.py         # Schémas Pydantic
│   ├── __init__.py
│   └── main.py                    # Application FastAPI
├── tests/
│   └── test_main.py
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MISTRAL_API_KEY` | Clé API Mistral AI | `abc123...` |
| `PORT` (optionnel) | Port du serveur | `8000` (défaut) |

### Modèle IA utilisé

- **Modèle** : `labs-mistral-small-creative`
- **Provider** : Mistral AI
- **Température** : 0 (déterministe)
- **Output** : JSON structuré (Pydantic)

## 📊 Endpoints

### `POST /api/recommander`

Génère des recommandations personnalisées basées sur les réponses au quiz.

**Request Body :**
```typescript
{
  "answers": {
    [questionId: string]: string  // Ex: "q1": "A. Texte de la réponse"
  }
}
```

**Response :**
```typescript
{
  "profil_letter": string,           // A-H
  "profil_analysis": string,
  "principal_program": {
    "name": string,
    "reason": string
  },
  "complementary_modules": Array<{
    "name": string,
    "reason": string
  }>,
  "motivation_message": string
}
```

## 🐛 Troubleshooting

### Erreur 500 "Mistral API Error"
- Vérifier que `MISTRAL_API_KEY` est bien configurée
- Vérifier les crédits Mistral AI restants

### Erreur CORS
- Le middleware CORS est configuré pour accepter toutes les origines (`allow_origins=["*"]`)
- En production, restreindre aux domaines autorisés

### Déploiement Railway échoue
- Vérifier que le **Root Directory** est bien `ai_services`
- Vérifier que `requirements.txt` existe et est valide

## 💰 Coûts

- **Railway** :
  - Plan gratuit : $5 de crédit/mois
  - Suffisant pour ~500-1000 requêtes/mois

- **Mistral AI** :
  - Plan gratuit : Quelques crédits offerts
  - Ensuite : ~0.001€ par requête (très bon marché)

## 📝 Notes

- Le backend est **stateless** : il ne stocke aucune donnée
- Les réponses sont traitées en temps réel
- Le tracking des réponses se fait côté Next.js (modèle `QuizResponse` dans Prisma)
