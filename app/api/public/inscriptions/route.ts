import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { inscriptionSchema } from '@/lib/validations/inscription'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = inscriptionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { name, email, phone, message, formationId } = validationResult.data

    // Verify formation exists and is visible
    const formation = await prisma.formation.findFirst({
      where: {
        id: formationId,
        visible: true,
      },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      )
    }

    // Create inscription
    const inscription = await prisma.formation_inscriptions.create({
      data: {
        name,
        email,
        phone,
        message,
        formationId,
        status: 'NEW',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Votre demande d\'inscription a été envoyée avec succès',
        inscriptionId: inscription.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de votre demande' },
      { status: 500 }
    )
  }
}
