import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['NEW', 'TREATED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Vérifier que la candidature existe
    const existingCandidature = await prisma.candidature.findUnique({
      where: { id },
    })

    if (!existingCandidature) {
      return NextResponse.json(
        { error: 'Candidature introuvable' },
        { status: 404 }
      )
    }

    const candidature = await prisma.candidature.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/admin/requests/candidatures')

    return NextResponse.json({ status: candidature.status })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    )
  }
}

