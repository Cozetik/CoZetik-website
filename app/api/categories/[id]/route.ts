import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'
import { z } from 'zod'

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  previousImageUrl: z.string().optional().or(z.literal('')).nullable(),
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

    // Debug: log du body reçu
    console.log('[DEBUG PUT /api/categories] ID:', id)
    console.log('[DEBUG PUT /api/categories] Body reçu:', JSON.stringify(body, null, 2))

    // Validation avec Zod
    const validatedData = updateCategorySchema.parse(body)
    console.log('[DEBUG PUT /api/categories] Validation Zod réussie')

    // Récupérer la catégorie existante
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    console.log('[DEBUG PUT /api/categories] Catégorie existante:', existingCategory ? `Trouvée (slug: ${existingCategory.slug})` : 'Non trouvée')

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Vérifier l'unicité du slug (si modifié)
    if (validatedData.slug !== existingCategory.slug) {
      console.log('[DEBUG PUT /api/categories] Le slug a changé, vérification d\'unicité...')
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists && slugExists.id !== id) {
        console.log('[DEBUG PUT /api/categories] ERREUR: Slug déjà utilisé par une autre catégorie')
        return NextResponse.json(
          { error: 'Une catégorie avec ce nom existe déjà' },
          { status: 400 }
        )
      }
      console.log('[DEBUG PUT /api/categories] Slug unique, OK')
    } else {
      console.log('[DEBUG PUT /api/categories] Slug inchangé, pas de vérification nécessaire')
    }

    // Supprimer l'ancienne image en arrière-plan (non bloquant)
    if (
      validatedData.previousImageUrl &&
      validatedData.previousImageUrl !== validatedData.imageUrl &&
      validatedData.previousImageUrl.trim() !== ''
    ) {
      // Fire & forget - ne pas await
      deleteImage(validatedData.previousImageUrl).catch((error) =>
        console.error('Background image deletion failed:', error)
      )
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

    revalidatePath('/admin/categories')
    revalidatePath('/formations')

    return NextResponse.json(category)
  } catch (error) {
    console.error('[DEBUG PUT /api/categories] ERREUR ATTRAPÉE:', error)

    if (error instanceof z.ZodError) {
      console.error('[DEBUG PUT /api/categories] Erreur de validation Zod:', JSON.stringify(error.issues, null, 2))
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

    // Paralléliser : vérification catégorie + count formations
    const [category, formationsCount] = await Promise.all([
      prisma.category.findUnique({
        where: { id },
        select: { id: true, imageUrl: true }, // Seulement les champs nécessaires
      }),
      prisma.formation.count({ where: { categoryId: id } }),
    ])

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si des formations sont liées
    if (formationsCount > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer cette catégorie. ${formationsCount} formation(s) y sont liées.`,
        },
        { status: 400 }
      )
    }

    // Supprimer l'image en arrière-plan (non bloquant)
    if (category.imageUrl) {
      deleteImage(category.imageUrl).catch((error) =>
        console.error('Background image deletion failed:', error)
      )
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/formations')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}
