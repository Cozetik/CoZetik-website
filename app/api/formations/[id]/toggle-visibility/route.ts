import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Récupérer et toggle la visibilité en une seule requête
    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Mettre à jour la formation
    const updatedFormation = await prisma.formation.update({
      where: { id },
      data: { visible: !formation.visible },
    })

    // Invalider le cache Next.js pour forcer le rafraîchissement
    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(updatedFormation)
  } catch (error) {
    console.error('Error toggling formation visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
