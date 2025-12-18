import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation type MIME
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Type de fichier non supporté. Formats acceptés : JPG, PNG, WEBP, GIF',
        },
        { status: 400 }
      )
    }

    // Validation taille (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB en bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale : 10MB' },
        { status: 400 }
      )
    }

    // Vérifier que les credentials Cloudinary existent
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('Cloudinary credentials are not configured')
      return NextResponse.json(
        {
          error:
            'Configuration serveur manquante. Veuillez configurer les credentials Cloudinary',
        },
        { status: 500 }
      )
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Cloudinary via Promise
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cozetik', // Dossier dans Cloudinary
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }, // Optimisation automatique
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string; public_id: string })
          }
        )

        uploadStream.end(buffer)
      }
    )

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
