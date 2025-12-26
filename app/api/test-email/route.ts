import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import { render } from '@react-email/render'
import ContactAccepted from '@/emails/contact-accepted'
import InscriptionAccepted from '@/emails/inscription-accepted'
import { emailInscriptionUser } from '@/emails/email-inscription-user'
import { emailContactUser } from '@/emails/email-contact-user'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const testEmail = searchParams.get('email') || 'nicoleoproject@gmail.com'
  const emailType = searchParams.get('type') || 'inscription-user' // inscription-user, contact-accepted, inscription-accepted, contact-user

  try {
    console.log('🧪 Test d\'envoi d\'email à:', testEmail)
    console.log('📧 Type d\'email:', emailType)
    
    // Vérifier la configuration
    console.log('🔍 Vérification configuration:')
    console.log('  - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Non configuré')
    console.log('  - RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev (défaut)')
    
    // Sélectionner le type d'email à tester
    let subject = ''
    let html = ''
    
    switch (emailType) {
      case 'contact-accepted':
        subject = 'Votre demande a été acceptée - Cozetik'
        html = await render(ContactAccepted({ name: 'Test User' }))
        break
      case 'inscription-accepted':
        subject = 'Votre inscription a été acceptée - Formation Test'
        html = await render(InscriptionAccepted({
          name: 'Test User',
          formationTitle: 'Formation Test',
          sessionDate: '15 février 2025'
        }))
        break
      case 'contact-user':
        subject = 'Confirmation de votre demande - Cozetik'
        html = emailContactUser('Test User', 'Ceci est un message de test pour vérifier l\'envoi d\'emails.')
        break
      case 'inscription-user':
      default:
        subject = 'Test email - Cozetik'
        html = emailInscriptionUser('Test User', 'Formation Test', '2025-02-15')
        break
    }
    
    // Tester l'envoi
    const result = await sendEmail(testEmail, subject, html)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email de test (${emailType}) envoyé avec succès à ${testEmail}`,
        type: emailType,
        data: result.data,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Échec de l\'envoi de l\'email',
        type: emailType,
        error: result.error instanceof Error ? result.error.message : String(result.error),
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Erreur test email:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors du test',
      type: emailType,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
