import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sessionSchema = z
  .object({
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    location: z.string().nullable().optional(),
    maxSeats: z.coerce
      .number()
      .int()
      .positive('Le nombre de places doit être positif')
      .nullable()
      .optional(),
    available: z.boolean().default(true),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'La date de fin doit être après ou égale à la date de début',
    path: ['endDate'],
  })

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const sessions = await prisma.formationSession.findMany({
      where: { formationId: id },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sessions' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = sessionSchema.parse(body)

    // Vérifier que la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    // Créer la session
    const session = await prisma.formationSession.create({
      data: {
        formationId: id,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        location: validatedData.location || null,
        maxSeats: validatedData.maxSeats || null,
        available: validatedData.available,
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
