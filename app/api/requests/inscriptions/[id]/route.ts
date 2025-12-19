import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Supprimer une inscription formation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que l'inscription existe
    const existingInscription = await prisma.formation_inscriptions.findUnique({
      where: { id },
    })

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer l'inscription
    await prisma.formation_inscriptions.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Inscription supprimée avec succès' })
  } catch (error) {
    console.error('Error deleting inscription:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
