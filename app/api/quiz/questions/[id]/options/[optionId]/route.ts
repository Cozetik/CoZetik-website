import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateOptionSchema = z.object({
  letter: z.string().min(1).max(1, 'La lettre doit faire 1 caractère'),
  text: z.string().min(1, 'Le texte est requis'),
  order: z.number().int().min(1),
})

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { id, optionId } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = updateOptionSchema.parse(body)

    // Vérifier que l'option existe
    const existingOption = await prisma.quizOption.findUnique({
      where: { id: optionId },
    })

    if (!existingOption) {
      return NextResponse.json(
        { error: 'Option introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que l'option appartient bien à cette question
    if (existingOption.questionId !== id) {
      return NextResponse.json(
        { error: 'Cette option n\'appartient pas à cette question' },
        { status: 400 }
      )
    }

    // Si la lettre a changé, vérifier qu'il n'y a pas de conflit
    const letterUpper = validatedData.letter.toUpperCase()
    if (letterUpper !== existingOption.letter) {
      const conflictingOption = await prisma.quizOption.findUnique({
        where: {
          questionId_letter: {
            questionId: id,
            letter: letterUpper,
          },
        },
      })

      if (conflictingOption) {
        return NextResponse.json(
          { error: `Une option avec la lettre ${letterUpper} existe déjà pour cette question` },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'option
    const option = await prisma.quizOption.update({
      where: { id: optionId },
      data: {
        letter: letterUpper,
        text: validatedData.text,
        order: validatedData.order,
      },
    })

    return NextResponse.json(option)
  } catch (error) {
    console.error('Error updating quiz option:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'option' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; optionId: string }> }
) {
  try {
    const { id, optionId } = await context.params

    // Vérifier que l'option existe
    const option = await prisma.quizOption.findUnique({
      where: { id: optionId },
    })

    if (!option) {
      return NextResponse.json(
        { error: 'Option introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que l'option appartient bien à cette question
    if (option.questionId !== id) {
      return NextResponse.json(
        { error: 'Cette option n\'appartient pas à cette question' },
        { status: 400 }
      )
    }

    // Supprimer l'option
    await prisma.quizOption.delete({
      where: { id: optionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz option:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'option' },
      { status: 500 }
    )
  }
}
