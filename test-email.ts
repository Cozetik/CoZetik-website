import { config } from 'dotenv';
import { sendEmail } from './lib/resend';

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' });

async function testEmail() {
  console.log('🚀 Test envoi email...');
  
  const result = await sendEmail(
    'nicoleoproject@gmail.com', // ⚠️ Remplace par TON vrai email
    'Test Resend - Formulaires',
    '<h1>Ça marche ! 🎉</h1><p>L\'intégration Resend fonctionne correctement.</p>'
  );
  
  if (result.success) {
    console.log('✅ Test réussi !');
  } else {
    console.log('❌ Test échoué');
  }
}

testEmail();