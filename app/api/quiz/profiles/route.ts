import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
  letter: z.string().min(1).max(1, 'La lettre doit faire 1 caractère'),
  name: z.string().min(1, 'Le nom est requis'),
  emoji: z.string().min(1, 'L\'emoji est requis'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide'),
  blocageRacine: z.string().min(1, 'Le blocage racine est requis'),
  desir: z.string().min(1, 'Le désir est requis'),
  phraseMiroir: z.string().min(1, 'La phrase miroir est requise'),
  programmeSignature: z.string().min(1, 'Le programme signature est requis'),
  modulesComplementaires: z.string(), // Sera converti en array
  visible: z.boolean().default(true),
})

export async function GET() {
  try {
    const profiles = await prisma.quizProfile.findMany({
      where: { visible: true },
      orderBy: { letter: 'asc' },
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching quiz profiles:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des profils' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation avec Zod
    const validatedData = profileSchema.parse(body)

    // Convertir modulesComplementaires string → array
    const modulesArray = validatedData.modulesComplementaires
      .split('\n')
      .map(m => m.trim())
      .filter(m => m !== '')

    // Vérifier l'unicité de la lettre
    const existingProfile = await prisma.quizProfile.findUnique({
      where: { letter: validatedData.letter.toUpperCase() },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: `Un profil avec la lettre ${validatedData.letter} existe déjà` },
        { status: 400 }
      )
    }

    // Créer le profil
    const profile = await prisma.quizProfile.create({
      data: {
        letter: validatedData.letter.toUpperCase(),
        name: validatedData.name,
        emoji: validatedData.emoji,
        color: validatedData.color,
        blocageRacine: validatedData.blocageRacine,
        desir: validatedData.desir,
        phraseMiroir: validatedData.phraseMiroir,
        programmeSignature: validatedData.programmeSignature,
        modulesComplementaires: modulesArray,
        visible: validatedData.visible,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz profile:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du profil' },
      { status: 500 }
    )
  }
}
