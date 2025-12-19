import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as z from 'zod'

const statusSchema = z.object({
  status: z.enum(['NEW', 'TREATED', 'ARCHIVED']),
})

// PATCH - Changer le statut d'une inscription formation
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = statusSchema.parse(body)

    // Vérifier que l'inscription existe
    const existingInscription = await prisma.formationInscription.findUnique({
      where: { id },
    })

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut
    const updatedInscription = await prisma.formationInscription.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        formation: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(updatedInscription)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating inscription status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
