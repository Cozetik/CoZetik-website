import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'
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
  id: z.string().optional(), // ID facultatif pour les étapes existantes
  order: z.number().int().min(0),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  duration: z.string().optional().nullable(),
  keyPoints: z.array(z.string()).optional().default([]),
})

const updateFormationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  description: z.string().min(10, 'Description trop courte').max(1000),
  program: z.string().min(20, 'Le programme doit être détaillé'),
  duration: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0),
  previousImageUrl: z.string().optional().nullable(),
  // Nouveaux champs
  level: z.string().optional().nullable(),
  maxStudents: z.number().int().positive().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  objectives: z.array(z.string()).optional().default([]),
  isCertified: z.boolean(),
  isFlexible: z.boolean(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewsCount: z.number().int().min(0),
  studentsCount: z.number().int().min(0),
  packs: z.array(packSchema).optional().default([]),
  steps: z.array(stepSchema).optional().default([]),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        category: true,
        packs: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(formation)
  } catch (error) {
    console.error('Error fetching formation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la formation' },
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
    const validatedData = updateFormationSchema.parse(body)

    // Récupérer la formation existante
    const existingFormation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Paralléliser les vérifications de slug et catégorie
    const [slugExists, categoryExists] = await Promise.all([
      validatedData.slug !== existingFormation.slug
        ? prisma.formation.findUnique({ where: { slug: validatedData.slug } })
        : Promise.resolve(null),
      prisma.category.findUnique({ where: { id: validatedData.categoryId } })
    ])

    if (slugExists) {
      return NextResponse.json(
        { error: 'Une formation avec ce titre existe déjà' },
        { status: 400 }
      )
    }

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 400 }
      )
    }

    // Supprimer l'ancienne image si elle a changé (non bloquant)
    if (
      validatedData.previousImageUrl &&
      validatedData.previousImageUrl !== validatedData.imageUrl &&
      validatedData.previousImageUrl.trim() !== ''
    ) {
      deleteImage(validatedData.previousImageUrl).catch(err =>
        console.error('Background image deletion failed:', err)
      )
    }

    // Mettre à jour la formation, les packs et les steps dans une transaction
    const { previousImageUrl, packs, steps, ...dataToUpdate } = validatedData

    const formation = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour la formation
      const updatedFormation = await tx.formation.update({
        where: { id },
        data: {
          ...dataToUpdate,
          imageUrl: dataToUpdate.imageUrl || null,
        },
        include: {
          category: true,
        },
      })

      // 2. Supprimer les packs et steps existants
      await Promise.all([
        tx.formationPack.deleteMany({ where: { formationId: id } }),
        tx.formationStep.deleteMany({ where: { formationId: id } }),
      ])

      // 3. Créer les nouveaux packs et steps
      const createPromises = []

      if (packs && packs.length > 0) {
        createPromises.push(
          tx.formationPack.createMany({
            data: packs.map((pack) => ({
              ...pack,
              formationId: id,
            })),
          })
        )
      }

      if (steps && steps.length > 0) {
        createPromises.push(
          tx.formationStep.createMany({
            data: steps.map((step) => ({
              order: step.order,
              title: step.title,
              description: step.description,
              duration: step.duration,
              keyPoints: step.keyPoints,
              formationId: id,
            })),
          })
        )
      }

      if (createPromises.length > 0) {
        await Promise.all(createPromises)
      }

      return updatedFormation
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(formation)
  } catch (error) {
    console.error('Error updating formation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la formation' },
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

    // Paralléliser les vérifications (formation + counts)
    const [formation, sessionsCount, inscriptionsCount] = await Promise.all([
      prisma.formation.findUnique({
        where: { id },
        select: { id: true, imageUrl: true }
      }),
      prisma.formationSession.count({ where: { formationId: id } }),
      prisma.formationInscription.count({ where: { formationId: id } })
    ])

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si des sessions sont liées
    if (sessionsCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette formation. ${sessionsCount} session(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Vérifier si des inscriptions sont liées
    if (inscriptionsCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette formation. ${inscriptionsCount} inscription(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Supprimer l'image si elle existe (non bloquant)
    if (formation.imageUrl) {
      deleteImage(formation.imageUrl).catch(err =>
        console.error('Background image deletion failed:', err)
      )
    }

    // Supprimer la formation
    await prisma.formation.delete({
      where: { id },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting formation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la formation' },
      { status: 500 }
    )
  }
}
