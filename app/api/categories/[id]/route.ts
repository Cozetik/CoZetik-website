import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  previousImageUrl: z.string().optional(),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la catégorie' },
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
    const validatedData = updateCategorySchema.parse(body)

    // Récupérer la catégorie existante
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Vérifier l'unicité du slug (si modifié)
    if (validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Une catégorie avec ce nom existe déjà' },
          { status: 400 }
        )
      }
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

    // Mettre à jour la catégorie
    const { previousImageUrl, ...dataToUpdate } = validatedData

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: dataToUpdate.name,
        slug: dataToUpdate.slug,
        description: dataToUpdate.description || null,
        imageUrl: dataToUpdate.imageUrl || null,
        visible: dataToUpdate.visible,
        order: dataToUpdate.order,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la catégorie' },
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

    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { formations: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si des formations sont liées
    if (category._count.formations > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette catégorie. ${category._count.formations} formation(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Supprimer l'image si elle existe
    if (category.imageUrl) {
      try {
        await deleteImage(category.imageUrl)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Continue même si la suppression de l'image échoue
      }
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}
