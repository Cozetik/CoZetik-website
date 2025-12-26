import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateQuestionSchema = z.object({
  order: z.number().int().min(1),
  question: z.string().min(1, 'La question est requise'),
  visible: z.boolean(),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const question = await prisma.quizQuestion.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching quiz question:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la question' },
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
    const validatedData = updateQuestionSchema.parse(body)

    // Vérifier que la question existe
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    // Si l'ordre a changé, vérifier qu'il n'y a pas de conflit
    if (validatedData.order !== existingQuestion.order) {
      const conflictingQuestion = await prisma.quizQuestion.findUnique({
        where: { order: validatedData.order },
      })

      if (conflictingQuestion) {
        return NextResponse.json(
          { error: `Une question avec l'ordre ${validatedData.order} existe déjà` },
          { status: 400 }
        )
      }
    }

    // Mettre à jour la question
    const question = await prisma.quizQuestion.update({
      where: { id },
      data: {
        order: validatedData.order,
        question: validatedData.question,
        visible: validatedData.visible,
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error updating quiz question:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la question' },
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

    // Vérifier que la question existe
    const question = await prisma.quizQuestion.findUnique({
      where: { id },
      include: {
        _count: {
          select: { options: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si des options sont liées
    if (question._count.options > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette question. ${question._count.options} option(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Supprimer la question
    await prisma.quizQuestion.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz question:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la question' },
      { status: 500 }
    )
  }
}
