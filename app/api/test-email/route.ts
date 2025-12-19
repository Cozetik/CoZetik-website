import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import { emailInscriptionUser } from '@/emails/email-inscription-user'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const testEmail = searchParams.get('email') || 'nicoleoproject@gmail.com'

  try {
    console.log('🧪 Test d\'envoi d\'email à:', testEmail)
    
    // Vérifier la configuration
    console.log('🔍 Vérification configuration:')
    console.log('  - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Non configuré')
    console.log('  - RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev (défaut)')
    
    // Tester l'envoi
    const result = await sendEmail(
      testEmail,
      'Test email - Cozetik',
      emailInscriptionUser('Test User', 'Formation Test', '2025-02-15')
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email de test envoyé avec succès à ${testEmail}`,
        data: result.data,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Échec de l\'envoi de l\'email',
        error: result.error instanceof Error ? result.error.message : String(result.error),
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Erreur test email:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur lors du test',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
