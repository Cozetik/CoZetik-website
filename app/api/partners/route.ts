import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const partnerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  websiteUrl: z
    .string()
    .url('URL invalide')
    .nullable()
    .optional()
    .or(z.literal(null)),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
})

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des partenaires' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation avec Zod
    const validatedData = partnerSchema.parse(body)

    // Créer le partenaire
    const partner = await prisma.partner.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        logoUrl: validatedData.logoUrl || null,
        websiteUrl: validatedData.websiteUrl || null,
        visible: validatedData.visible,
        order: validatedData.order,
      },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error('Error creating partner:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du partenaire' },
      { status: 500 }
    )
  }
}
