import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Récupérer la question
    const question = await prisma.quizQuestion.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    // Toggle visibility
    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id },
      data: {
        visible: !question.visible,
      },
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Error toggling question visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors du changement de visibilité' },
      { status: 500 }
    )
  }
}
