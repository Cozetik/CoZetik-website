import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  letter: z.string().min(1).max(1, 'La lettre doit faire 1 caractère'),
  name: z.string().min(1, 'Le nom est requis'),
  emoji: z.string().min(1, 'L\'emoji est requis'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide'),
  blocageRacine: z.string().min(1, 'Le blocage racine est requis'),
  desir: z.string().min(1, 'Le désir est requis'),
  phraseMiroir: z.string().min(1, 'La phrase miroir est requise'),
  programmeSignature: z.string().min(1, 'Le programme signature est requis'),
  modulesComplementaires: z.string(), // Sera converti en array
  visible: z.boolean(),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Si l'ID est une lettre seule (A-H), chercher par lettre
    const profile = id.length === 1
      ? await prisma.quizProfile.findUnique({
          where: { letter: id.toUpperCase() },
        })
      : await prisma.quizProfile.findUnique({
          where: { id },
        })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching quiz profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = updateProfileSchema.parse(body)

    // Convertir modulesComplementaires string → array
    const modulesArray = validatedData.modulesComplementaires
      .split('\n')
      .map(m => m.trim())
      .filter(m => m !== '')

    // Vérifier que le profil existe
    const existingProfile = await prisma.quizProfile.findUnique({
      where: { id },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profil introuvable' },
        { status: 404 }
      )
    }

    // Si la lettre a changé, vérifier qu'il n'y a pas de conflit
    const letterUpper = validatedData.letter.toUpperCase()
    if (letterUpper !== existingProfile.letter) {
      const conflictingProfile = await prisma.quizProfile.findUnique({
        where: { letter: letterUpper },
      })

      if (conflictingProfile) {
        return NextResponse.json(
          { error: `Un profil avec la lettre ${letterUpper} existe déjà` },
          { status: 400 }
        )
      }
    }

    // Mettre à jour le profil
    const profile = await prisma.quizProfile.update({
      where: { id },
      data: {
        letter: letterUpper,
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

    revalidatePath('/admin/quiz/profiles')

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating quiz profile:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification du profil' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Vérifier que le profil existe
    const profile = await prisma.quizProfile.findUnique({
      where: { id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil introuvable' },
        { status: 404 }
      )
    }

    // Supprimer le profil
    await prisma.quizProfile.delete({
      where: { id },
    })

    revalidatePath('/admin/quiz/profiles')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du profil' },
      { status: 500 }
    )
  }
}
