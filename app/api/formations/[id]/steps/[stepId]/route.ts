import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().min(1, 'La description est requise'),
  duration: z.string().nullable(),
  keyPoints: z.array(z.string()),
})

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const { id, stepId } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = updateStepSchema.parse(body)

    // Vérifier que le step existe
    const existingStep = await prisma.formationStep.findUnique({
      where: { id: stepId },
    })

    if (!existingStep) {
      return NextResponse.json(
        { error: 'Step introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que le step appartient bien à cette formation
    if (existingStep.formationId !== id) {
      return NextResponse.json(
        { error: 'Ce step n\'appartient pas à cette formation' },
        { status: 400 }
      )
    }

    // Si l'ordre a changé, vérifier qu'il n'y a pas de conflit
    if (validatedData.order !== existingStep.order) {
      const conflictingStep = await prisma.formationStep.findUnique({
        where: {
          formationId_order: {
            formationId: id,
            order: validatedData.order,
          },
        },
      })

      if (conflictingStep) {
        return NextResponse.json(
          { error: `Un step avec l'ordre ${validatedData.order} existe déjà` },
          { status: 400 }
        )
      }
    }

    // Mettre à jour le step
    const step = await prisma.formationStep.update({
      where: { id: stepId },
      data: {
        order: validatedData.order,
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        keyPoints: validatedData.keyPoints,
      },
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Error updating step:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification du step' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const { id, stepId } = await context.params

    // Vérifier que le step existe
    const step = await prisma.formationStep.findUnique({
      where: { id: stepId },
    })

    if (!step) {
      return NextResponse.json(
        { error: 'Step introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que le step appartient bien à cette formation
    if (step.formationId !== id) {
      return NextResponse.json(
        { error: 'Ce step n\'appartient pas à cette formation' },
        { status: 400 }
      )
    }

    // Supprimer le step
    await prisma.formationStep.delete({
      where: { id: stepId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting step:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du step' },
      { status: 500 }
    )
  }
}
