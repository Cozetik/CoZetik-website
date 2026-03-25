import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const packSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().optional().nullable(),
  price: z.number().positive('Le prix doit être positif'),
  originalPrice: z.number().positive().optional().nullable(),
  savings: z.string().optional().nullable(),
  features: z.array(z.string()),
  isPopular: z.boolean().default(false),
  order: z.number().int().min(0),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    const packs = await prisma.formationPack.findMany({
      where: { formationId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(packs)
  } catch (error) {
    console.error('Error fetching packs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des packs' },
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

    const validatedData = packSchema.parse(body)

    const formation = await prisma.formation.findUnique({
      where: { id },
    })

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation introuvable' },
        { status: 404 }
      )
    }

    const existingPack = await prisma.formationPack.findUnique({
      where: {
        formationId_order: {
          formationId: id,
          order: validatedData.order,
        },
      },
    })

    if (existingPack) {
      return NextResponse.json(
        { error: `Un pack avec l'ordre ${validatedData.order} existe déjà` },
        { status: 400 }
      )
    }

    const pack = await prisma.formationPack.create({
      data: {
        formationId: id,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        savings: validatedData.savings,
        features: validatedData.features,
        isPopular: validatedData.isPopular,
        order: validatedData.order,
      },
    })

    revalidatePath('/admin/formations')
    revalidatePath('/formations')
    revalidatePath('/(public)/formations', 'page')

    return NextResponse.json(pack, { status: 201 })
  } catch (error) {
    console.error('Error creating pack:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du pack' },
      { status: 500 }
    )
  }
}
