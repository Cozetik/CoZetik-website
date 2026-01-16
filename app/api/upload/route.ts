import { UTApi } from 'uploadthing/server'
import { NextResponse } from 'next/server'

const utapi = new UTApi()

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

    // Vérifier que le token Uploadthing existe
    if (!process.env.UPLOADTHING_TOKEN) {
      console.error('UPLOADTHING_TOKEN is not configured')
      return NextResponse.json(
        {
          error:
            'Configuration serveur manquante. Veuillez configurer le token Uploadthing',
        },
        { status: 500 }
      )
    }

    // Upload vers Uploadthing
    const response = await utapi.uploadFiles(file)

    if (response.error) {
      console.error('Uploadthing error:', response.error)
      return NextResponse.json(
        { error: "Erreur lors de l'upload. Veuillez réessayer." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: response.data.url,
      key: response.data.key,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
