import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'
import { emailContactAccepted } from '@/emails/email-contact-accepted'
import * as z from 'zod'

const statusSchema = z.object({
  status: z.enum(['NEW', 'TREATED', 'ARCHIVED']),
})

// PATCH - Changer le statut d'une demande de contact
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = statusSchema.parse(body)

    // Vérifier que la demande existe
    const existingRequest = await prisma.contactRequest.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut
    const updatedRequest = await prisma.contactRequest.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
    })

    // Envoyer un email à l'utilisateur si le statut passe à TREATED
    let emailSent = false
    let emailError = null
    
    if (validatedData.status === 'TREATED' && existingRequest.status !== 'TREATED') {
      console.log('📧 Tentative d\'envoi email d\'acceptation à:', existingRequest.email)
      try {
        const emailResult = await sendEmail(
          existingRequest.email,
          'Votre demande a été acceptée - Cozetik',
          emailContactAccepted(existingRequest.name)
        )
        
        if (emailResult.success) {
          console.log('✅ Email d\'acceptation envoyé avec succès à:', existingRequest.email)
          emailSent = true
        } else {
          console.error('❌ Échec envoi email d\'acceptation:', emailResult.error)
          emailError = emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
          // On continue même si l'email échoue pour ne pas bloquer la mise à jour
        }
      } catch (emailErrorException) {
        console.error('❌ Erreur exception envoi email d\'acceptation:', emailErrorException)
        if (emailErrorException instanceof Error) {
          emailError = emailErrorException.message
          console.error('❌ Message:', emailErrorException.message)
          console.error('❌ Stack:', emailErrorException.stack)
        } else {
          emailError = String(emailErrorException)
        }
        // On continue même si l'email échoue
      }
    }

    return NextResponse.json({
      ...updatedRequest,
      emailSent,
      emailError: emailError || undefined,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating contact request status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
