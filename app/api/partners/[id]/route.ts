import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'
import { z } from 'zod'

const updatePartnerSchema = z.object({
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
  previousLogoUrl: z.string().optional(),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const partner = await prisma.partner.findUnique({
      where: { id },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'Partenaire introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du partenaire' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validation avec Zod
    const validatedData = updatePartnerSchema.parse(body)

    // Récupérer le partenaire existant
    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    })

    if (!existingPartner) {
      return NextResponse.json(
        { error: 'Partenaire introuvable' },
        { status: 404 }
      )
    }

    // Supprimer l'ancien logo si il a changé
    if (
      validatedData.previousLogoUrl &&
      validatedData.previousLogoUrl !== validatedData.logoUrl &&
      validatedData.previousLogoUrl.trim() !== ''
    ) {
      try {
        await deleteImage(validatedData.previousLogoUrl)
      } catch (error) {
        console.error('Error deleting old logo:', error)
        // Continue même si la suppression échoue
      }
    }

    // Mettre à jour le partenaire
    const { previousLogoUrl, ...dataToUpdate } = validatedData

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: dataToUpdate.name,
        description: dataToUpdate.description || null,
        logoUrl: dataToUpdate.logoUrl || null,
        websiteUrl: dataToUpdate.websiteUrl || null,
        visible: dataToUpdate.visible,
        order: dataToUpdate.order,
      },
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error updating partner:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification du partenaire' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Vérifier si le partenaire existe
    const partner = await prisma.partner.findUnique({
      where: { id },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'Partenaire introuvable' },
        { status: 404 }
      )
    }

    // Supprimer le logo si il existe
    if (partner.logoUrl) {
      try {
        await deleteImage(partner.logoUrl)
      } catch (error) {
        console.error('Error deleting logo:', error)
        // Continue même si la suppression du logo échoue
      }
    }

    // Supprimer le partenaire
    await prisma.partner.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du partenaire' },
      { status: 500 }
    )
  }
}
