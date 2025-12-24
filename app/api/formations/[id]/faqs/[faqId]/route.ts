import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateFaqSchema = z.object({
  order: z.number().int().min(1),
  question: z.string().min(1, 'La question est requise').max(500),
  answer: z.string().min(1, 'La réponse est requise'),
})

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; faqId: string }> }
) {
  try {
    const { id, faqId } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = updateFaqSchema.parse(body)

    // Vérifier que la FAQ existe
    const existingFaq = await prisma.formationFAQ.findUnique({
      where: { id: faqId },
    })

    if (!existingFaq) {
      return NextResponse.json(
        { error: 'FAQ introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que la FAQ appartient bien à cette formation
    if (existingFaq.formationId !== id) {
      return NextResponse.json(
        { error: 'Cette FAQ n\'appartient pas à cette formation' },
        { status: 400 }
      )
    }

    // Si l'ordre a changé, vérifier qu'il n'y a pas de conflit
    if (validatedData.order !== existingFaq.order) {
      const conflictingFaq = await prisma.formationFAQ.findUnique({
        where: {
          formationId_order: {
            formationId: id,
            order: validatedData.order,
          },
        },
      })

      if (conflictingFaq) {
        return NextResponse.json(
          { error: `Une FAQ avec l'ordre ${validatedData.order} existe déjà` },
          { status: 400 }
        )
      }
    }

    // Mettre à jour la FAQ
    const faq = await prisma.formationFAQ.update({
      where: { id: faqId },
      data: {
        order: validatedData.order,
        question: validatedData.question,
        answer: validatedData.answer,
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating FAQ:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la FAQ' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; faqId: string }> }
) {
  try {
    const { id, faqId } = await context.params

    // Vérifier que la FAQ existe
    const faq = await prisma.formationFAQ.findUnique({
      where: { id: faqId },
    })

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que la FAQ appartient bien à cette formation
    if (faq.formationId !== id) {
      return NextResponse.json(
        { error: 'Cette FAQ n\'appartient pas à cette formation' },
        { status: 400 }
      )
    }

    // Supprimer la FAQ
    await prisma.formationFAQ.delete({
      where: { id: faqId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la FAQ' },
      { status: 500 }
    )
  }
}
