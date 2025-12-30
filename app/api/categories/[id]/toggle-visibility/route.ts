import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Récupérer la catégorie actuelle
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Toggle la visibilité
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { visible: !category.visible },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/categories')
    revalidatePath('/formations')
    revalidatePath('/')

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error toggling category visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
