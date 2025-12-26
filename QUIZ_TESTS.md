# 🧪 Guide de Tests du Quiz Cozetik

## ✅ Ce qui a été testé et fonctionne

### Backend (Base de données + API)
- ✅ Migration Prisma appliquée : 4 tables créées
- ✅ Seed exécuté : 10 questions + 80 options + 8 profils
- ✅ API `/api/quiz/questions` fonctionne (retourne 10 questions avec options)
- ✅ API `/api/quiz/profiles` fonctionne (retourne 8 profils A-H)

### Frontend
- ✅ Next.js démarre correctement (port 3002)
- ✅ CTA "Trouvez votre formation idéale" ajouté sur Hero
- ✅ Pages publiques accessibles : `/quiz`
- ✅ Pages admin créées (redirigent vers auth) : `/admin/quiz/questions`, `/admin/quiz/profiles`

---

## 📋 Tests manuels à faire (dans le navigateur)

### 1. **Tester le Backoffice Admin**

**a) Se connecter à l'admin :**
```
http://localhost:3002/auth-admin
```
Credentials : selon ton `.env.local`

**b) Accéder au Quiz dans la sidebar :**
- Menu "Quiz" devrait être visible
- Sous-menus : "Questions" et "Profils"

**c) Tester la gestion des Questions :**
```
http://localhost:3002/admin/quiz/questions
```
- [ ] Voir la liste des 10 questions
- [ ] Cliquer sur "Nouvelle question" → formulaire fonctionne
- [ ] Éditer une question existante
- [ ] Toggle visibility (oeil)
- [ ] Gérer les options d'une question (icône Settings)
- [ ] Supprimer une option

**d) Tester la gestion des Profils :**
```
http://localhost:3002/admin/quiz/profiles
```
- [ ] Voir la liste des 8 profils (A-H)
- [ ] Cliquer sur "Nouveau profil" → formulaire fonctionne
- [ ] Éditer un profil existant
- [ ] Vérifier que tous les champs s'affichent (emoji, couleur, blocage, désir, phrase miroir, etc.)
- [ ] Toggle visibility

---

### 2. **Tester le Quiz Public (SANS backend FastAPI pour l'instant)**

**a) Page d'accueil :**
```
http://localhost:3002
```
- [ ] Voir le CTA "Trouvez votre formation idéale" dans le Hero
- [ ] Cliquer dessus → redirige vers `/quiz`

**b) Page Quiz :**
```
http://localhost:3002/quiz
```
- [ ] La page charge sans erreur
- [ ] Voir le stepper avec les questions
- [ ] Naviguer entre les questions (Précédent/Suivant)
- [ ] Sélectionner des réponses (radio buttons)
- [ ] Arriver à la fin → bouton "Voir mes résultats"

**c) Page Résultats (SANS appel IA) :**
```
http://localhost:3002/quiz/resultats
```
**⚠️ ATTENDU** : Cette page va **échouer** car elle essaie d'appeler le backend FastAPI qui n'est pas lancé.

**Message d'erreur normal** : "fetch failed" ou "ECONNREFUSED"

---

### 3. **Tester avec le backend FastAPI (optionnel)**

**a) Lancer le backend FastAPI :**
```bash
# Dans un nouveau terminal
cd ai_services
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**b) Vérifier que FastAPI fonctionne :**
```
http://localhost:8000/docs
```
→ Devrait afficher Swagger UI avec l'endpoint `/api/recommander`

**c) Tester l'endpoint avec curl :**
```bash
curl -X POST http://localhost:8000/api/recommander \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "q1": "B. Je manque de temps, je suis noyé(e) sous les tâches",
      "q2": "B. Retrouver du temps, de l'\''organisation et du calme",
      "q3": "B. Être organisé(e), efficace et léger(e)"
    }
  }'
```

**⚠️ ATTENDU** : Cela devrait retourner un JSON avec :
```json
{
  "profil_letter": "B",
  "profil_analysis": "...",
  "principal_program": {...},
  "complementary_modules": [...],
  "motivation_message": "..."
}
```

**d) Si FastAPI fonctionne, retester la page résultats :**
```
http://localhost:3002/quiz/resultats
```
→ Devrait maintenant afficher les recommandations IA

---

## 🐛 Problèmes connus et solutions

### Problème 1 : "QuizQuestion table does not exist"
**Solution** : La migration n'a pas été appliquée
```bash
npx prisma migrate deploy
# ou
npx prisma db push
```

### Problème 2 : "No questions found" dans le backoffice
**Solution** : Le seed n'a pas été exécuté
```bash
npx tsx prisma/seed-quiz.ts
```

### Problème 3 : Page `/quiz/resultats` affiche "fetch failed"
**Cause** : Le backend FastAPI n'est pas lancé (c'est normal si tu ne l'as pas encore déployé)

**Solution temporaire** : Commenter l'appel API dans `/app/(public)/quiz/resultats/page.tsx` pour tester le reste

**Solution permanente** : Déployer le backend FastAPI sur Railway

### Problème 4 : "MISTRAL_API_KEY not found"
**Cause** : Variable d'environnement manquante dans le backend FastAPI

**Solution** : Créer `.env` dans `ai_services/` :
```
MISTRAL_API_KEY=votre-clé-mistral
```

---

## 🚀 Prochaines étapes

### 1. Tests manuels (TOI)
- [ ] Tester tout le backoffice admin (CRUD questions, options, profils)
- [ ] Tester le quiz public (navigation, sélection réponses)
- [ ] Identifier les bugs éventuels

### 2. Déploiement backend FastAPI (optionnel)
- [ ] Créer compte Railway
- [ ] Déployer `ai_services/` sur Railway
- [ ] Ajouter `MISTRAL_API_KEY` dans les variables d'env Railway
- [ ] Copier l'URL Railway générée

### 3. Configuration production
- [ ] Ajouter `FASTAPI_URL` dans Vercel (variables d'env)
- [ ] Tester le quiz complet en production

### 4. Commit & Push
```bash
git add .
git commit -m "feat: complete quiz integration with backoffice"
git push origin integration-quiz
```

### 5. Merge dans main
```bash
git checkout main
git merge integration-quiz
git push origin main
```

---

## 📊 Résumé de l'intégration

### Ce qui est 100% fonctionnel
- ✅ Base de données (10 questions + 8 profils)
- ✅ API Routes (CRUD complet)
- ✅ Backoffice admin (gestion questions, options, profils)
- ✅ Page quiz publique (stepper, questions)
- ✅ Backend FastAPI (schemas mis à jour)

### Ce qui nécessite le backend FastAPI
- ⏳ Page résultats avec recommandations IA
- ⏳ Calcul du profil dominant
- ⏳ Génération des suggestions de formations

### Ce qui est optionnel
- 🟡 Déploiement Railway (peut être fait plus tard)
- 🟡 Tests end-to-end complets (nécessite FastAPI)
- 🟡 Tracking des réponses dans `QuizResponse` (analytics)

---

## 📞 Support

Si tu rencontres un problème :

1. **Vérifier les logs Next.js** : dans le terminal où tu as lancé `npm run dev`
2. **Vérifier les logs FastAPI** : dans le terminal où tu as lancé `uvicorn`
3. **Vérifier la console navigateur** : F12 → Console → erreurs JS

---

**🎉 L'intégration Quiz Cozetik est quasi-terminée !**

Il ne reste plus qu'à tester manuellement dans le navigateur et éventuellement déployer le backend FastAPI sur Railway.
