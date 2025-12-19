import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const resend = getResend();
  
  if (!resend) {
    const error = new Error('RESEND_API_KEY is not configured. Please add it to your .env.local file.');
    console.error('❌ Erreur envoi email:', error.message);
    console.error('❌ Vérifiez que RESEND_API_KEY est configuré dans les variables d\'environnement Vercel');
    return { success: false, error };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  
  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn('⚠️ RESEND_FROM_EMAIL non configuré, utilisation de l\'email par défaut:', fromEmail);
  }

  try {
    console.log('📧 Tentative d\'envoi email à:', to);
    console.log('📧 Depuis:', fromEmail);
    console.log('📧 Sujet:', subject);
    
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
    
    console.log('✅ Email envoyé avec succès:', data);
    if (data.error) {
      console.error('❌ Erreur dans la réponse Resend:', data.error);
      return { success: false, error: data.error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    if (error instanceof Error) {
      console.error('❌ Message d\'erreur:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    return { success: false, error };
  }
}