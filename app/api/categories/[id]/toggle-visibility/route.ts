import { NextResponse } from 'next/server'
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
      select: { visible: true },
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

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error toggling category visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
