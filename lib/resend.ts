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
    return { success: false, error };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
    
    console.log('✅ Email envoyé:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error };
  }
}