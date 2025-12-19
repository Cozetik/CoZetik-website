# 🎥 Compression et Upload de la vidéo Hero

## Problème identifié
La vidéo actuelle (`Dehong School FPV Fly-Through.mp4`) fait **154 MB**, ce qui pose plusieurs problèmes :
- ❌ Trop volumineuse pour upload Cloudinary gratuit (limite ~100 MB)
- ❌ Temps de chargement très long (LCP > 10 secondes)
- ❌ Consommation excessive de bande passante mobile

## Solutions disponibles

### Option 1 : Compression avec FFmpeg (RECOMMANDÉ)

**Étape 1 - Installer FFmpeg (si pas déjà installé) :**
```bash
# macOS
brew install ffmpeg

# Vérifier l'installation
ffmpeg -version
```

**Étape 2 - Compresser la vidéo (objectif : 5-10 MB) :**
```bash
# Depuis le dossier racine du projet
cd public

# Compression optimisée pour le web (qualité excellente, taille réduite ~5-8 MB)
ffmpeg -i "Dehong School FPV Fly-Through.mp4" \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1920:-2" \
  -movflags +faststart \
  -an \
  hero-video-optimized.mp4

# Explication des paramètres :
# -c:v libx264       : Codec H.264 (compatibilité maximale)
# -crf 28            : Qualité (18=excellent, 28=très bon, 32=bon)
# -preset medium     : Équilibre vitesse/compression
# -vf scale=1920:-2  : Resize 1920px largeur (garde ratio)
# -movflags +faststart : Optimise pour streaming web
# -an                : Supprime audio (vidéo muted de toute façon)
```

**Résultat attendu :** Fichier ~5-10 MB au lieu de 154 MB

**Étape 3 - Vérifier la qualité :**
```bash
# Comparer taille
ls -lh "Dehong School FPV Fly-Through.mp4" hero-video-optimized.mp4

# Lire la vidéo compressée pour vérifier qualité visuelle
open hero-video-optimized.mp4
```

**Étape 4 - Uploader sur Cloudinary :**
Une fois la vidéo compressée à <100 MB, modifier le script d'upload :
```bash
# Dans scripts/upload-hero-video.ts, ligne 31, changer :
const videoPath = path.join(process.cwd(), 'public', 'hero-video-optimized.mp4')

# Puis lancer l'upload
npm run upload:hero-video
```

---

### Option 2 : Utiliser la vidéo locale (solution temporaire)

**Avantages :** Aucune compression nécessaire
**Inconvénients :** Temps de chargement très long, mauvais LCP

La vidéo est déjà configurée dans `hero-section.tsx` :
```tsx
<source src="/Dehong School FPV Fly-Through.mp4" type="video/mp4" />
```

✅ **Fonctionne déjà**, mais non optimisé pour production.

---

### Option 3 : Hébergement externe (YouTube/Vimeo)

**Avantages :**
- CDN ultra-rapide gratuit
- Compression automatique
- Formats adaptatifs (WebM, MP4)

**Inconvénients :**
- Moins de contrôle
- Branding Vimeo/YouTube (sauf plan payant)

**Si choisi :**
1. Uploader sur Vimeo (plan gratuit : vidéos privées OK)
2. Récupérer l'URL embed
3. Utiliser un composant `<iframe>` ou `react-player`

---

## 🎯 Recommandation finale

**Pour production :** **Option 1 (Compression FFmpeg + Cloudinary)**

**Raisons :**
- Réduction drastique du poids (154 MB → 5-10 MB)
- CDN Cloudinary ultra-rapide
- Optimisations automatiques (formats adaptatifs, qualité auto)
- LCP < 2.5s garanti
- Gratuit (plan Cloudinary Free supporte vidéos <100 MB)

**Commande complète à exécuter :**
```bash
# 1. Aller dans public
cd public

# 2. Compresser (qualité excellente)
ffmpeg -i "Dehong School FPV Fly-Through.mp4" \
  -c:v libx264 -crf 28 -preset medium \
  -vf "scale=1920:-2" -movflags +faststart \
  -an hero-video-optimized.mp4

# 3. Vérifier taille
ls -lh hero-video-optimized.mp4

# 4. Retour racine projet
cd ..

# 5. Modifier scripts/upload-hero-video.ts ligne 31 :
# const videoPath = path.join(process.cwd(), 'public', 'hero-video-optimized.mp4')

# 6. Uploader
npm run upload:hero-video
```

Une fois uploadée, l'URL Cloudinary sera automatiquement affichée dans le terminal.

---

## 📊 Comparaison performances

| Solution | Taille | Temps chargement 4G | LCP | CDN |
|----------|--------|---------------------|-----|-----|
| Vidéo actuelle (154 MB) | 154 MB | ~30-40s | ❌ 15s+ | ❌ Non |
| Compression FFmpeg + local | 5-10 MB | ~3-5s | ⚠️ 3s | ❌ Non |
| **Compression + Cloudinary** | **5-10 MB** | **~1-2s** | **✅ <2s** | **✅ Oui** |
| YouTube/Vimeo embed | Auto | ~2-3s | ✅ <2.5s | ✅ Oui |

---

## ⚡ Actions immédiates

1. ✅ Script d'upload créé (`scripts/upload-hero-video.ts`)
2. ⏳ **VOUS DEVEZ** : Compresser la vidéo avec FFmpeg
3. ⏳ **ENSUITE** : Uploader avec `npm run upload:hero-video`
4. ⏳ **ENFIN** : Mettre à jour `hero-section.tsx` avec l'URL Cloudinary

Voulez-vous que je vous guide pour la compression FFmpeg ?
