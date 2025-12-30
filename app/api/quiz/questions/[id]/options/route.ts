import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const optionSchema = z.object({
  letter: z.string().min(1).max(1, 'La lettre doit faire 1 caractère'),
  text: z.string().min(1, 'Le texte est requis'),
  order: z.number().int().min(1),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Vérifier que la question existe
    const question = await prisma.quizQuestion.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    const options = await prisma.quizOption.findMany({
      where: { questionId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error('Error fetching quiz options:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des options' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = optionSchema.parse(body)

    // Vérifier que la question existe
    const question = await prisma.quizQuestion.findUnique({
      where: { id },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question introuvable' },
        { status: 404 }
      )
    }

    // Vérifier l'unicité de la lettre pour cette question
    const existingOption = await prisma.quizOption.findUnique({
      where: {
        questionId_letter: {
          questionId: id,
          letter: validatedData.letter.toUpperCase(),
        },
      },
    })

    if (existingOption) {
      return NextResponse.json(
        { error: `Une option avec la lettre ${validatedData.letter} existe déjà pour cette question` },
        { status: 400 }
      )
    }

    // Créer l'option
    const option = await prisma.quizOption.create({
      data: {
        questionId: id,
        letter: validatedData.letter.toUpperCase(),
        text: validatedData.text,
        order: validatedData.order,
      },
    })

    revalidatePath('/admin/quiz/questions')

    return NextResponse.json(option, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz option:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'option' },
      { status: 500 }
    )
  }
}
