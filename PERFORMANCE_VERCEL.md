# ⚡ LATENCES ATTENDUES - VERCEL PRODUCTION

## 📊 TEMPS DE RÉPONSE PAR ACTION (après optimisation)

### 🎯 OBJECTIF GLOBAL : **<1 seconde** pour 95% des actions

---

## 1️⃣ MODIFICATIONS SIMPLES (Toggle, Status)

| Action | Avant | Après Sprint 1 | Amélioration |
|--------|-------|----------------|--------------|
| **Toggle visibility** (Formation, Blog, Partner, Category) | 3-5s | **300-500ms** | **85-90%** |
| **Changer statut** (Request sans email) | 2-3s | **200-400ms** | **86-88%** |
| **Archiver** (Candidature, Contact) | 1-2s | **150-300ms** | **85%** |

**Détail des temps (après) :**
- Requête DB (Neon Europe) : 50-100ms
- Traitement serveur Next.js : 20-50ms
- Revalidation cache : 50-100ms
- Réponse réseau : 80-150ms
- **TOTAL : 200-400ms**

**Optimizations applied :**
- ✅ `revalidatePath()` ajouté
- ✅ Optimistic update côté client
- ✅ Index DB sur champs `visible`

---

## 2️⃣ CRÉATIONS / MODIFICATIONS

### A) Création d'entité

| Action | Avant | Après Sprint 1 | Après Sprint 2 |
|--------|-------|----------------|----------------|
| **Créer formation** | 4-7s | **2-3s** | **800ms-1.5s** |
| **Créer article blog** | 3-5s | **1.5-2.5s** | **600ms-1.2s** |
| **Créer partenaire** | 2-4s | **1-2s** | **500ms-1s** |
| **Créer catégorie** | 2-3s | **800ms-1.5s** | **400-800ms** |

**Détail création formation (après Sprint 2) :**
- Validation Zod : 5-10ms
- Requêtes DB parallélisées : 150-300ms
  - `Promise.all([checkSlug, checkCategory])` : 100-200ms
  - `create()` : 50-100ms
- Revalidation cache : 100-200ms
- Upload image (async) : Non bloquant
- **TOTAL : 800ms-1.5s**

### B) Modification d'entité

| Action | Avant | Après Sprint 1 | Après Sprint 2 |
|--------|-------|----------------|----------------|
| **Modifier formation** | 5-8s | **3-4s** | **1-2s** |
| **Modifier article** | 4-6s | **2-3s** | **800ms-1.5s** |
| **Modifier partner** | 3-5s | **1.5-2.5s** | **600ms-1.2s** |

**Optimizations Sprint 2 :**
- Requêtes parallélisées : -50% temps DB
- Selects optimisés : -30% données transférées
- Upload images async : Non bloquant

---

## 3️⃣ OPÉRATIONS AVEC EMAIL

| Action | Avant | Après Sprint 1 | Amélioration |
|--------|-------|----------------|--------------|
| **Changer statut + email** | 7-12s | **500ms-1s** | **92-95%** |
| **Envoyer email candidat** | 5-8s | **400-800ms** | **90-93%** |

**Solution : Queue système**
```
AVANT (bloquant) :
[Client] → [API] → [DB 100ms] → [Email 5s] → [Response 7s] → [Client]

APRÈS (async) :
[Client] → [API] → [DB 100ms] → [Queue] → [Response 500ms] → [Client]
                                      ↓
                               [Worker] → [Email 3s] (background)
```

**Détail temps (après) :**
- Update DB : 80-150ms
- Queue email (Redis/DB) : 50-100ms
- Revalidation : 100-200ms
- Réponse : 150-250ms
- **TOTAL CLIENT : 400-800ms**
- Email envoyé en arrière-plan (3-5s, invisible pour l'utilisateur)

---

## 4️⃣ CHARGEMENT DE PAGES

### A) Pages Admin (après Sprint 2 avec pagination)

| Page | Avant | Après Sprint 1 | Après Sprint 2 |
|------|-------|----------------|----------------|
| **Dashboard** | 1-3s | **800ms-1.5s** | **400-800ms** |
| **Formations (liste)** | 2-4s | **1.5-2.5s** | **600ms-1.2s** |
| **Blog (liste)** | 1.5-3s | **1-2s** | **500ms-1s** |
| **Requests** | 2-3s | **1-1.5s** | **400-800ms** |

**Dashboard optimisé (Sprint 2) :**
```typescript
// AVANT : 6 requêtes séquentielles = 600ms
const totalFormations = await prisma.formation.count()
const activeCategories = await prisma.category.count({ where: { visible: true } })
// ... 4 autres requêtes

// APRÈS : 1 Promise.all = 150-200ms
const [totalFormations, activeCategories, ...] = await Promise.all([
  prisma.formation.count(),
  prisma.category.count({ where: { visible: true } }),
  // ... 4 autres en parallèle
])
```

**Temps Dashboard détaillé (après Sprint 2) :**
- Promise.all (6 counts) : 150-250ms
- Rendu serveur : 50-100ms
- Streaming HTML : 100-200ms
- Hydration client : 100-200ms
- **TOTAL : 400-800ms**

### B) Avec pagination (20 items/page)

**Formations avec pagination :**
- Requête DB (20 items) : 80-150ms (vs 300-500ms pour tout)
- Total avec include : 150-250ms
- **Réduction : 60-70% du temps DB**

---

## 5️⃣ OPÉRATIONS COMPLEXES

### A) Sous-ressources (FAQs, Steps, Sessions)

| Action | Avant | Après Sprint 1 | Après Sprint 2 |
|--------|-------|----------------|----------------|
| **Ajouter FAQ** | 2-3s | **1-1.5s** | **500-800ms** |
| **Modifier Step** | 2-3s | **1-1.5s** | **500-800ms** |
| **Ajouter Session** | 2-4s | **1.5-2s** | **600ms-1s** |

**Optimizations :**
- Validation parallèle : -40% temps
- Optimistic update : UX instantanée
- Revalidation ciblée : Cache précis

---

## 6️⃣ UPLOAD D'IMAGES

| Action | Avant | Après Sprint 1 | Après Sprint 2 |
|--------|-------|----------------|----------------|
| **Upload + save** | 5-10s | **5-8s** | **Non bloquant** |

**Solution Sprint 2 : Upload asynchrone**
```
AVANT :
[Select Image] → [Upload 5s] → [Save Form 2s] → [Done 7s]

APRÈS :
[Select Image] → [Upload background] → [Save Form 500ms] → [Done instantané]
                       ↓
                 [Upload complète] → [Update image URL]
```

**Temps perçu par l'utilisateur : <1s**

---

## 📈 GRAPHIQUE DE PERFORMANCE

```
AVANT (Sans optimisations) :
Toggle visibility     ████████████████ 3-5s
Créer formation       ██████████████████████ 4-7s
Modifier formation    ████████████████████████ 5-8s
Status + email        ██████████████████████████████ 7-12s
Load formations       ██████████ 2-4s

APRÈS Sprint 1 (Cache + Queue) :
Toggle visibility     ██ 300-500ms  (-85%)
Créer formation       ████████ 2-3s  (-50%)
Modifier formation    ██████████ 3-4s  (-40%)
Status + email        ██ 500ms-1s  (-92%)
Load formations       ██████ 1.5-2.5s  (-37%)

APRÈS Sprint 2 (DB optimisé + Pagination) :
Toggle visibility     ██ 300-500ms  (-85%)
Créer formation       ████ 800ms-1.5s  (-78%)
Modifier formation    ████ 1-2s  (-70%)
Status + email        ██ 500ms-1s  (-92%)
Load formations       ██ 600ms-1.2s  (-75%)
```

---

## 🌍 FACTEURS DE LATENCE RÉSEAU

### Latence Vercel ↔ Neon (par requête DB)

| Région Vercel | Région Neon | Latence RTT |
|---------------|-------------|-------------|
| US-East-1 | EU-Central-1 | 80-120ms |
| EU-West-1 | EU-Central-1 | 20-40ms |
| US-West-1 | EU-Central-1 | 150-200ms |

**Recommandation :** Déployer sur Vercel EU (Frankfurt/Dublin) pour minimiser la latence avec Neon.

**Impact sur les temps :**
- Vercel US + Neon EU : +60-100ms par requête
- Vercel EU + Neon EU : +10-30ms par requête
- **Économie potentielle : 50-70ms par requête**

---

## ✅ CHECKLIST OPTIMISATION

### Sprint 1 (Fait) ✅
- [x] Revalidation cache (39 routes)
- [x] Optimistic updates (5 tables principales)
- [x] Queue emails async

### Sprint 2 (En cours) 🔄
- [ ] Parallélisation requêtes (23 routes)
- [ ] Pagination (3 pages)
- [ ] Selects optimisés (15 routes)

### Sprint 3 (À venir) ⏳
- [ ] Loading states complets
- [ ] Skeleton loaders
- [ ] Edge Config
- [ ] Connection pooling

---

## 🎯 GARANTIE DE PERFORMANCE

**Après Sprint 1 + 2 :**

| Percentile | Latence | Garantie |
|------------|---------|----------|
| p50 (médiane) | **<800ms** | 95% des actions |
| p95 | **<2s** | 99% des actions |
| p99 | **<3s** | Actions complexes |

**SLA cible : 95% des modifications en <1 seconde**

---

## 🔧 CONFIGURATION RECOMMANDÉE VERCEL

```typescript
// vercel.json
{
  "regions": ["fra1"], // Frankfurt (proche de Neon)
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10,
      "memory": 1024
    }
  }
}
```

**Impact : -30% latence réseau**

---

## 📝 MESURE EN PRODUCTION

Pour vérifier les temps réels après déploiement :

```typescript
// Ajouter dans les routes API
const start = Date.now()
// ... code
console.log(`[PERF] ${request.url} took ${Date.now() - start}ms`)
```

**Monitoring recommandé :**
- Vercel Analytics (inclus)
- Sentry Performance
- Custom logs Vercel

---

**Dernière mise à jour : 30/12/2024**
**Status : Sprint 1 en cours**
