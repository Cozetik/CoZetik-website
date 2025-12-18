import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const formationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  description: z.string().min(10, 'Description trop courte').max(1000),
  program: z.string().min(20, 'Le programme doit être détaillé'),
  price: z.number().positive('Le prix doit être positif').nullable(),
  duration: z.string().nullable(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0),
})

export async function GET() {
  try {
    const formations = await prisma.formation.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        _count: {
          select: { sessions: true, inscriptions: true },
        },
      },
    })

    return NextResponse.json(formations)
  } catch (error) {
    console.error('Error fetching formations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des formations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation avec Zod
    const validatedData = formationSchema.parse(body)

    // Vérifier l'unicité du slug
    const existingFormation = await prisma.formation.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingFormation) {
      return NextResponse.json(
        { error: 'Une formation avec ce titre existe déjà' },
        { status: 400 }
      )
    }

    // Vérifier que la catégorie existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 400 }
      )
    }

    // Créer la formation
    const formation = await prisma.formation.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        categoryId: validatedData.categoryId,
        description: validatedData.description,
        program: validatedData.program,
        price: validatedData.price,
        duration: validatedData.duration,
        imageUrl: validatedData.imageUrl || null,
        visible: validatedData.visible,
        order: validatedData.order,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(formation, { status: 201 })
  } catch (error) {
    console.error('Error creating formation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    )
  }
}
