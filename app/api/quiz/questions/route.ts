import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const questionSchema = z.object({
  order: z.number().int().min(1),
  question: z.string().min(1, 'La question est requise'),
  visible: z.boolean().default(true),
})

export async function GET() {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation avec Zod
    const validatedData = questionSchema.parse(body)

    // Vérifier l'unicité de l'ordre
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { order: validatedData.order },
    })

    if (existingQuestion) {
      return NextResponse.json(
        { error: `Une question avec l'ordre ${validatedData.order} existe déjà` },
        { status: 400 }
      )
    }

    // Créer la question
    const question = await prisma.quizQuestion.create({
      data: {
        order: validatedData.order,
        question: validatedData.question,
        visible: validatedData.visible,
      },
      include: {
        options: true,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz question:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la question' },
      { status: 500 }
    )
  }
}
