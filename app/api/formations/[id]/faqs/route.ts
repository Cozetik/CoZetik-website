import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const faqSchema = z.object({
  order: z.number().int().min(1),
  question: z.string().min(1, 'La question est requise').max(500),
  answer: z.string().min(1, 'La réponse est requise'),
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

    const faqs = await prisma.formationFAQ.findMany({
      where: { formationId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des FAQs' },
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
    const validatedData = faqSchema.parse(body)

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
    const existingFaq = await prisma.formationFAQ.findUnique({
      where: {
        formationId_order: {
          formationId: id,
          order: validatedData.order,
        },
      },
    })

    if (existingFaq) {
      return NextResponse.json(
        { error: `Une FAQ avec l'ordre ${validatedData.order} existe déjà` },
        { status: 400 }
      )
    }

    // Créer la FAQ
    const faq = await prisma.formationFAQ.create({
      data: {
        formationId: id,
        order: validatedData.order,
        question: validatedData.question,
        answer: validatedData.answer,
      },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la FAQ' },
      { status: 500 }
    )
  }
}
