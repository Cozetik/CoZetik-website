import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Supprimer une demande de contact
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que la demande existe
    const existingRequest = await prisma.contact_requests.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la demande
    await prisma.contact_requests.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Demande supprimée avec succès' })
  } catch (error) {
    console.error('Error deleting contact request:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
