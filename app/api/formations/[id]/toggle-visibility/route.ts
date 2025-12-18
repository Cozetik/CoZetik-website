import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Récupérer la formation actuelle
    const formation = await prisma.formation.findUnique({
      where: { id },
      select: { visible: true },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Toggle la visibilité
    const updatedFormation = await prisma.formation.update({
      where: { id },
      data: { visible: !formation.visible },
    })

    return NextResponse.json(updatedFormation)
  } catch (error) {
    console.error('Error toggling formation visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
