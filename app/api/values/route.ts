import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const valueSchema = z.object({
  order: z.number().int().min(1, 'L\'ordre doit être supérieur à 0'),
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().min(10, 'Description trop courte'),
  visible: z.boolean().default(true),
})

export async function GET() {
  try {
    const values = await prisma.value.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(values)
  } catch (error) {
    console.error('Error fetching values:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des valeurs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation avec Zod
    const validatedData = valueSchema.parse(body)

    // Vérifier l'unicité de l'ordre
    const existingValue = await prisma.value.findUnique({
      where: { order: validatedData.order },
    })

    if (existingValue) {
      return NextResponse.json(
        { error: 'Une valeur avec cet ordre existe déjà' },
        { status: 400 }
      )
    }

    // Créer la valeur
    const value = await prisma.value.create({
      data: {
        order: validatedData.order,
        title: validatedData.title,
        description: validatedData.description,
        visible: validatedData.visible,
      },
    })

    // Invalider le cache Next.js
    revalidatePath('/admin/values')
    revalidatePath('/')

    return NextResponse.json(value, { status: 201 })
  } catch (error) {
    console.error('Error creating value:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la valeur' },
      { status: 500 }
    )
  }
}
