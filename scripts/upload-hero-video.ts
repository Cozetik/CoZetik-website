import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadHeroVideo() {
  try {
    console.log('🎥 Upload de la vidéo Hero vers Cloudinary...\n')

    // Vérifier que les credentials existent
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error('❌ Cloudinary credentials manquants dans .env.local')
    }

    console.log('✅ Configuration Cloudinary OK')
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}\n`)

    // Chemin de la vidéo
    const videoPath = path.join(process.cwd(), 'public', 'Dehong School FPV Fly-Through.mp4')

    // Vérifier que le fichier existe
    if (!fs.existsSync(videoPath)) {
      throw new Error(`❌ Fichier vidéo introuvable : ${videoPath}`)
    }

    const stats = fs.statSync(videoPath)
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
    console.log(`📁 Fichier trouvé : ${videoPath}`)
    console.log(`📊 Taille : ${fileSizeMB} MB\n`)

    console.log('⏳ Upload en cours (cela peut prendre plusieurs minutes pour 154 MB)...\n')

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(videoPath, {
      folder: 'cozetik',
      resource_type: 'video',
      public_id: 'hero-video',
      overwrite: true,
      // Optimisations Cloudinary pour la vidéo
      eager: [
        {
          quality: 'auto:good', // Qualité automatique optimisée
          fetch_format: 'auto', // Format optimal (mp4, webm selon navigateur)
        },
      ],
      eager_async: true, // Génération asynchrone des transformations
    })

    console.log('✅ Upload réussi !\n')
    console.log('📋 Informations vidéo :')
    console.log(`   - URL publique : ${result.secure_url}`)
    console.log(`   - Public ID : ${result.public_id}`)
    console.log(`   - Format : ${result.format}`)
    console.log(`   - Durée : ${result.duration} secondes`)
    console.log(`   - Dimensions : ${result.width}x${result.height}`)
    console.log(`   - Taille uploadée : ${(result.bytes / (1024 * 1024)).toFixed(2)} MB\n`)

    console.log('🎬 URL à utiliser dans hero-section.tsx :')
    console.log(`   ${result.secure_url}\n`)

    console.log('💡 Cloudinary optimise automatiquement la vidéo pour :')
    console.log('   - Compression intelligente')
    console.log('   - Format adaptatif (MP4/WebM selon navigateur)')
    console.log('   - Streaming optimisé')
    console.log('   - CDN mondial ultra-rapide\n')

    return result.secure_url
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload :', error)
    throw error
  }
}

// Exécuter le script
uploadHeroVideo()
  .then((url) => {
    console.log('✨ Script terminé avec succès !')
    console.log(`\n🔗 URL finale : ${url}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Échec de l\'upload')
    process.exit(1)
  })
