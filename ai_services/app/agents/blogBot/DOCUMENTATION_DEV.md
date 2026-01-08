# Documentation Intégration BlogBot API

Cette documentation est destinée aux développeurs Frontend/Fullstack pour intégrer le bot de génération d'articles CoZetik.

## Lancement de l'API

### Linux/Mac :

```bash
cd ai_services/app/agents/blogBot
source ../../../venv/bin/activate
python3 api.py
```

### Windows PowerShell :

```powershell
cd ai_services\app\agents\blogBot
..\..\..\venv\Scripts\Activate.ps1
python api.py
```

L'API sera disponible sur `http://localhost:8000`.
Documentation Swagger interactive : `http://localhost:8000/docs`.

---

## 🏗 Mise à jour du Schéma Prisma

Afin de stocker les preuves de performance de l'IA, les champs suivants doivent être ajoutés au modèle `BlogPost` dans votre `schema.prisma` :

```prisma
model BlogPost {
  // ... vos champs actuels (id, title, etc.)

  // NOUVEAUX CHAMPS AI
  aiScore          Float?    // Score de cohérence globale (ex: 0.94)
  aiMetadata       Json?     // Contient l'objet expertise_report et les sources
  featuredProg     String?   // Le programme signature recommandé par le bot
  isReviewRequired Boolean   @default(true) // Statut de validation humaine
}
```

---

## 🛠 Endpoints

### 1. Générer un article

**POST** `/api/v1/generate`

**Payload (JSON) :**

```json
{
  "subject": "Titre ou sujet de l'article"
}
```

**Réponse (JSON) :**

```json
{
  "subject": "Titre ou sujet de l'article",
  "markdown": "# Titre généré\n\nContenu en markdown...",
  "expertise_report": {
    "adn_cozetik": 0.94,
    "expertise_tech": 0.95,
    "wording_humain": 0.96,
    "structure_seo": 0.9,
    "cta_impact": 0.85
  },
  "sources": [
    "Extrait du document source 1 ayant servi à la génération...",
    "Extrait du document source 2..."
  ]
}
```

---

## Recommandations UI/UX pour l'intégration

1. **Rendu Markdown** : Utilisez une librairie comme `react-markdown` ou `marked.js` pour afficher le champ `markdown`.
2. **Dashboard Expertise** :
   - Utilisez les données de `expertise_report` pour alimenter un **Radar Chart** (type Chart.js ou Recharts).
   - Affichez des **Jauges** pour `adn_cozetik` et `structure_seo`.
3. **Dashboard Manager** : Prévoyez une vue "Brouillon" où le contenu peut être édité avant d'être sauvegardé en base de données (Prisma).

---

## 📋 Dépendances Python requises

- `fastapi`, `uvicorn`, `pydantic`
- `llama-index` (Core, LLMs MistralAI, Embeddings MistralAI)
- `numpy`, `scipy` (Calcul des scores NLP)
- `fpdf2` (Génération des rapports exportables)

---

_Développé pour CoZetik - Système AI Copywriter_
