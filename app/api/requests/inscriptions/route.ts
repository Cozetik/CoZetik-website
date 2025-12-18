import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as z from 'zod'

const inscriptionSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  formationId: z.string().min(1, 'La formation est requise'),
})

// GET - Récupérer toutes les inscriptions formations
export async function GET() {
  try {
    const inscriptions = await prisma.formationInscription.findMany({
      include: {
        formation: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(inscriptions)
  } catch (error) {
    console.error('Error fetching formation inscriptions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des inscriptions' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle inscription formation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = inscriptionSchema.parse(body)

    // Vérifier que la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id: validatedData.formationId },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      )
    }

    const inscription = await prisma.formationInscription.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        formationId: validatedData.formationId,
        status: 'NEW',
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

    return NextResponse.json(inscription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating formation inscription:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
