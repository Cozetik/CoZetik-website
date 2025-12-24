import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { subject, message } = body

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Le sujet et le message sont requis' },
        { status: 400 }
      )
    }

    // Récupérer la candidature
    const candidature = await prisma.candidature.findUnique({
      where: { id },
    })

    if (!candidature) {
      return NextResponse.json(
        { error: 'Candidature non trouvée' },
        { status: 404 }
      )
    }

    // Envoyer l'email
    try {
      const emailResult = await sendEmail(
        candidature.email,
        subject,
        `
          <h1>Bonjour ${candidature.firstName} ${candidature.lastName},</h1>
          <div style="white-space: pre-wrap;">${message}</div>
          <p style="margin-top: 20px;">Cordialement,<br>L'équipe Cozetik</p>
        `
      )

      if (!emailResult.success) {
        // Vérifier si c'est une erreur de domaine non vérifié
        const errorMessage = emailResult.error instanceof Error 
          ? emailResult.error.message 
          : String(emailResult.error);
        
        if (errorMessage.includes('verify a domain') || errorMessage.includes('testing emails')) {
          return NextResponse.json(
            { 
              error: 'Pour envoyer des emails à d\'autres destinataires que votre adresse de test, vous devez vérifier un domaine sur resend.com/domains. Actuellement, seuls les emails vers nicoleoproject@gmail.com sont autorisés.',
              requiresDomainVerification: true 
            },
            { status: 403 }
          );
        }
        
        throw new Error(errorMessage);
      }

      return NextResponse.json({ message: 'Email envoyé avec succès' })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      return NextResponse.json(
        { error: emailError instanceof Error ? emailError.message : 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}

