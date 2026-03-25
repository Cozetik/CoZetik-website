import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const packSchema = z.object({
  name: z.string().min(1, 'Le nom du pack est requis'),
  description: z.string().optional().nullable(),
  price: z.number().min(0, 'Le prix doit être positif ou zéro'),
  originalPrice: z.number().positive().optional().nullable(),
  savings: z.string().optional().nullable(),
  features: z.array(z.string()).min(1, 'Au moins une inclusion est requise'),
  isPopular: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
})

const stepSchema = z.object({
  order: z.number().int().min(0),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  duration: z.string().optional().nullable(),
  keyPoints: z.array(z.string()).optional().default([]),
})

const formationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  description: z.string().min(10, 'Description trop courte').max(1000),
  program: z.string().min(20, 'Le programme doit être détaillé'),
  duration: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0).default(0),
  // Nouveaux champs
  level: z.string().optional().nullable(),
  maxStudents: z.number().int().positive().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  objectives: z.array(z.string()).optional().default([]),
  isCertified: z.boolean().default(false),
  isFlexible: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewsCount: z.number().int().min(0).default(0),
  studentsCount: z.number().int().min(0).default(0),
  packs: z.array(packSchema).optional().default([]),
  steps: z.array(stepSchema).optional().default([]),
})

export async function GET() {
  try {
    const formations = await prisma.formation.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        packs: {
          orderBy: { order: 'asc' },
        },
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

    // Créer la formation avec ses packs et steps
    const { packs, steps, ...formationData } = validatedData

    const formation = await prisma.formation.create({
      data: {
        ...formationData,
        objectives: validatedData.objectives,
        packs: {
          create: packs.map((pack) => ({
            ...pack,
            features: pack.features,
          })),
        },
        steps: {
          create: steps.map((step) => ({
            ...step,
            keyPoints: step.keyPoints,
          })),
        },
      },
      include: {
        packs: true,
        steps: true,
      },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(formation, { status: 201 })
  } catch (error) {
    console.error('Error creating formation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    )
  }
}
