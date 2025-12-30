import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Récupérer le partenaire actuel
    const partner = await prisma.partner.findUnique({
      where: { id },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'Partenaire introuvable' },
        { status: 404 }
      )
    }

    // Toggle la visibilité
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { visible: !partner.visible },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/partners')
    revalidatePath('/')

    return NextResponse.json(updatedPartner)
  } catch (error) {
    console.error('Error toggling partner visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
