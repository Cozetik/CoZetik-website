import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const { id, sessionId } = await context.params

    // Vérifier que la session existe
    const session = await prisma.formationSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session introuvable' },
        { status: 404 }
      )
    }

    // Vérifier que la session appartient bien à la formation
    if (session.formationId !== id) {
      return NextResponse.json(
        { error: 'Session non liée à cette formation' },
        { status: 400 }
      )
    }

    // Supprimer la session
    await prisma.formationSession.delete({
      where: { id: sessionId },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la session' },
      { status: 500 }
    )
  }
}
