import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePackSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().optional().nullable(),
  price: z.number().positive('Le prix doit être positif'),
  originalPrice: z.number().positive().optional().nullable(),
  savings: z.string().optional().nullable(),
  features: z.array(z.string()),
  isPopular: z.boolean(),
  order: z.number().int().min(0),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; packId: string }> }
) {
  try {
    const { id, packId } = await context.params

    const pack = await prisma.formationPack.findFirst({
      where: { id: packId, formationId: id },
    })

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(pack)
  } catch (error) {
    console.error('Error fetching pack:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du pack' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; packId: string }> }
) {
  try {
    const { id, packId } = await context.params
    const body = await request.json()

    const validatedData = updatePackSchema.parse(body)

    const existingPack = await prisma.formationPack.findFirst({
      where: { id: packId, formationId: id },
    })

    if (!existingPack) {
      return NextResponse.json(
        { error: 'Pack introuvable' },
        { status: 404 }
      )
    }

    // Vérifier l'unicité de l'ordre si modifié
    if (validatedData.order !== existingPack.order) {
      const orderConflict = await prisma.formationPack.findUnique({
        where: {
          formationId_order: {
            formationId: id,
            order: validatedData.order,
          },
        },
      })

      if (orderConflict) {
        return NextResponse.json(
          { error: `Un pack avec l'ordre ${validatedData.order} existe déjà` },
          { status: 400 }
        )
      }
    }

    const pack = await prisma.formationPack.update({
      where: { id: packId },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        savings: validatedData.savings,
        features: validatedData.features,
        isPopular: validatedData.isPopular,
        order: validatedData.order,
      },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(pack)
  } catch (error) {
    console.error('Error updating pack:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification du pack' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; packId: string }> }
) {
  try {
    const { id, packId } = await context.params

    const pack = await prisma.formationPack.findFirst({
      where: { id: packId, formationId: id },
    })

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack introuvable' },
        { status: 404 }
      )
    }

    await prisma.formationPack.delete({
      where: { id: packId },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pack:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du pack' },
      { status: 500 }
    )
  }
}
