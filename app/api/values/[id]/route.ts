import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateValueSchema = z.object({
  order: z.number().int().min(1, 'L\'ordre doit être supérieur à 0').optional(),
  title: z.string().min(1, 'Le titre est requis').max(200).optional(),
  description: z.string().min(10, 'Description trop courte').optional(),
  visible: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const value = await prisma.value.findUnique({
      where: { id },
    })

    if (!value) {
      return NextResponse.json(
        { error: 'Valeur introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(value)
  } catch (error) {
    console.error('Error fetching value:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la valeur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Vérifier que la valeur existe
    const existingValue = await prisma.value.findUnique({
      where: { id },
    })

    if (!existingValue) {
      return NextResponse.json(
        { error: 'Valeur introuvable' },
        { status: 404 }
      )
    }

    // Validation avec Zod
    const validatedData = updateValueSchema.parse(body)

    // Si l'ordre change, vérifier l'unicité
    if (validatedData.order && validatedData.order !== existingValue.order) {
      const orderConflict = await prisma.value.findUnique({
        where: { order: validatedData.order },
      })

      if (orderConflict) {
        return NextResponse.json(
          { error: 'Une valeur avec cet ordre existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour la valeur
    const value = await prisma.value.update({
      where: { id },
      data: validatedData,
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/values')
    revalidatePath('/')

    return NextResponse.json(value)
  } catch (error) {
    console.error('Error updating value:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la valeur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que la valeur existe
    const existingValue = await prisma.value.findUnique({
      where: { id },
    })

    if (!existingValue) {
      return NextResponse.json(
        { error: 'Valeur introuvable' },
        { status: 404 }
      )
    }

    // Supprimer la valeur
    await prisma.value.delete({
      where: { id },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/values')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting value:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la valeur' },
      { status: 500 }
    )
  }
}
