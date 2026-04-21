/**
 * Script pour uploader des fichiers locaux vers Uploadthing
 *
 * Usage:
 *   npx tsx scripts/upload-local-to-uploadthing.ts ./chemin/vers/fichier.jpg
 *   npx tsx scripts/upload-local-to-uploadthing.ts ./dossier/*.jpg
 *
 * Les URLs générées seront affichées pour mise à jour en DB
 */

import { UTApi } from 'uploadthing/server'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const utapi = new UTApi()

async function uploadFile(filePath: string): Promise<string | null> {
  try {
    const absolutePath = path.resolve(filePath)

    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ Fichier non trouvé: ${absolutePath}`)
      return null
    }

    const buffer = fs.readFileSync(absolutePath)
    const filename = path.basename(absolutePath)

    // Déterminer le type MIME
    let contentType = 'application/octet-stream'
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg'
    else if (filename.endsWith('.png')) contentType = 'image/png'
    else if (filename.endsWith('.webp')) contentType = 'image/webp'
    else if (filename.endsWith('.gif')) contentType = 'image/gif'
    else if (filename.endsWith('.mp4')) contentType = 'video/mp4'
    else if (filename.endsWith('.mov')) contentType = 'video/quicktime'
    else if (filename.endsWith('.pdf')) contentType = 'application/pdf'

    const file = new File([buffer], filename, { type: contentType })

    console.log(`📤 Upload: ${filename} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`)

    const response = await utapi.uploadFiles(file)

    if (response.error) {
      console.error(`❌ Erreur: ${response.error.message}`)
      return null
    }

    console.log(`✅ Succès: ${response.data.url}`)
    return response.data.url
  } catch (error) {
    console.error(`❌ Erreur: ${error}`)
    return null
  }
}

async function main() {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════════╗')
  console.log('║     UPLOAD FICHIERS LOCAUX → UPLOADTHING                      ║')
  console.log('╚═══════════════════════════════════════════════════════════════╝')
  console.log()

  if (!process.env.UPLOADTHING_TOKEN) {
    console.error('❌ UPLOADTHING_TOKEN manquant')
    process.exit(1)
  }

  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/upload-local-to-uploadthing.ts <fichier1> [fichier2] ...')
    console.log('')
    console.log('Exemples:')
    console.log('  npx tsx scripts/upload-local-to-uploadthing.ts ./image.jpg')
    console.log('  npx tsx scripts/upload-local-to-uploadthing.ts ./video.mp4')
    console.log('  npx tsx scripts/upload-local-to-uploadthing.ts ~/Downloads/*.jpg')
    process.exit(0)
  }

  console.log(`📁 ${args.length} fichier(s) à uploader\n`)

  const results: { file: string; url: string | null }[] = []

  for (const filePath of args) {
    const url = await uploadFile(filePath)
    results.push({ file: path.basename(filePath), url })

    // Petit délai entre les uploads
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n')
  console.log('═'.repeat(65))
  console.log('RÉSUMÉ')
  console.log('═'.repeat(65))
  console.log()

  const success = results.filter(r => r.url)
  const failed = results.filter(r => !r.url)

  console.log(`✅ Succès: ${success.length}`)
  console.log(`❌ Échecs: ${failed.length}`)

  if (success.length > 0) {
    console.log('\n📋 URLs générées (à copier pour mise à jour DB):')
    console.log('-'.repeat(65))
    success.forEach(r => {
      console.log(`${r.file}:`)
      console.log(`  ${r.url}`)
      console.log()
    })
  }
}

main()
