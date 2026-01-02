import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier que la valeur existe
    const existingValue = await prisma.value.findUnique({
      where: { id },
    })

    if (!existingValue) {
      return NextResponse.json(
        { error: 'Valeur introuvable' },
        { status: 404 }
      )
    }

    // Toggle la visibilité
    const value = await prisma.value.update({
      where: { id },
      data: {
        visible: !existingValue.visible,
      },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/values')
    revalidatePath('/')

    return NextResponse.json(value)
  } catch (error) {
    console.error('Error toggling value visibility:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la visibilité' },
      { status: 500 }
    )
  }
}
