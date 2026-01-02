import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que la candidature existe
    const candidature = await prisma.candidature.findUnique({
      where: { id },
    })

    if (!candidature) {
      return NextResponse.json(
        { error: 'Candidature introuvable' },
        { status: 404 }
      )
    }

    await prisma.candidature.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Candidature supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

