import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const stepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().min(1, 'La description est requise'),
  duration: z.string().nullable(),
  keyPoints: z.array(z.string()),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Vérifier que la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    const steps = await prisma.formationStep.findMany({
      where: { formationId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(steps)
  } catch (error) {
    console.error('Error fetching steps:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des steps' },
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
    const validatedData = stepSchema.parse(body)

    // Vérifier que la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Vérifier l'unicité de l'ordre pour cette formation
    const existingStep = await prisma.formationStep.findUnique({
      where: {
        formationId_order: {
          formationId: id,
          order: validatedData.order,
        },
      },
    })

    if (existingStep) {
      return NextResponse.json(
        { error: `Un step avec l'ordre ${validatedData.order} existe déjà` },
        { status: 400 }
      )
    }

    // Créer le step
    const step = await prisma.formationStep.create({
      data: {
        formationId: id,
        order: validatedData.order,
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        keyPoints: validatedData.keyPoints,
      },
    })

    return NextResponse.json(step, { status: 201 })
  } catch (error) {
    console.error('Error creating step:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du step' },
      { status: 500 }
    )
  }
}
