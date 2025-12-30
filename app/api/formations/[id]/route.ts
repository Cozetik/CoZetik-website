import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'
import { z } from 'zod'

const updateFormationSchema = z.object({
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
  previousImageUrl: z.string().optional(),
  // Nouveaux champs
  level: z.string().nullable(),
  maxStudents: z.number().int().positive().nullable(),
  prerequisites: z.string().nullable(),
  objectives: z.array(z.string()),
  isCertified: z.boolean(),
  isFlexible: z.boolean(),
  rating: z.number().min(0).max(5).nullable(),
  reviewsCount: z.number().int().min(0),
  studentsCount: z.number().int().min(0),
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

    // Vérifier l'unicité du slug (si modifié)
    if (validatedData.slug !== existingFormation.slug) {
      const slugExists = await prisma.formation.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Une formation avec ce titre existe déjà' },
          { status: 400 }
        )
      }
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

    // Supprimer l'ancienne image si elle a changé
    if (
      validatedData.previousImageUrl &&
      validatedData.previousImageUrl !== validatedData.imageUrl &&
      validatedData.previousImageUrl.trim() !== ''
    ) {
      try {
        await deleteImage(validatedData.previousImageUrl)
      } catch (error) {
        console.error('Error deleting old image:', error)
        // Continue même si la suppression échoue
      }
    }

    // Mettre à jour la formation
    const { previousImageUrl, ...dataToUpdate } = validatedData

    const formation = await prisma.formation.update({
      where: { id },
      data: {
        title: dataToUpdate.title,
        slug: dataToUpdate.slug,
        categoryId: dataToUpdate.categoryId,
        description: dataToUpdate.description,
        program: dataToUpdate.program,
        price: dataToUpdate.price,
        duration: dataToUpdate.duration,
        imageUrl: dataToUpdate.imageUrl || null,
        visible: dataToUpdate.visible,
        order: dataToUpdate.order,
        level: dataToUpdate.level,
        maxStudents: dataToUpdate.maxStudents,
        prerequisites: dataToUpdate.prerequisites,
        objectives: dataToUpdate.objectives,
        isCertified: dataToUpdate.isCertified,
        isFlexible: dataToUpdate.isFlexible,
        rating: dataToUpdate.rating,
        reviewsCount: dataToUpdate.reviewsCount,
        studentsCount: dataToUpdate.studentsCount,
      },
      include: {
        category: true,
      },
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

    // Vérifier si la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sessions: true, inscriptions: true },
        },
      },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si des sessions sont liées
    if (formation._count.sessions > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette formation. ${formation._count.sessions} session(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Vérifier si des inscriptions sont liées
    if (formation._count.inscriptions > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette formation. ${formation._count.inscriptions} inscription(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Supprimer l'image si elle existe
    if (formation.imageUrl) {
      try {
        await deleteImage(formation.imageUrl)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Continue même si la suppression de l'image échoue
      }
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
