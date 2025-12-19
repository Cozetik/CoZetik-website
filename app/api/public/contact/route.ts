import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations/contact'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data

    // Create contact request
    const contactRequest = await prisma.contact_requests.create({
      data: {
        name,
        email,
        message,
        status: 'NEW',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a été envoyé avec succès',
        requestId: contactRequest.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contact request:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de votre message' },
      { status: 500 }
    )
  }
}
