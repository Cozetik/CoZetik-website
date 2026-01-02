require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Vérification de la configuration Cloudinary\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('CLOUDINARY_CLOUD_NAME:', cloudName ? `✅ Configuré (${cloudName.substring(0, 4)}...)` : '❌ Non configuré');
console.log('CLOUDINARY_API_KEY:', apiKey ? `✅ Configuré (${apiKey.substring(0, 4)}...)` : '❌ Non configuré');
console.log('CLOUDINARY_API_SECRET:', apiSecret ? '✅ Configuré' : '❌ Non configuré');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (cloudName && apiKey && apiSecret) {
  console.log('✅ Toutes les variables sont configurées !');
  console.log('\n💡 Pour tester la connexion, visitez: http://localhost:3000/api/test-cloudinary\n');
} else {
  console.log('❌ Configuration incomplète !');
  console.log('\n📝 Pour configurer Cloudinary:');
  console.log('   1. Créez un compte sur https://cloudinary.com');
  console.log('   2. Récupérez vos credentials depuis le Dashboard');
  console.log('   3. Ajoutez-les dans votre fichier .env.local:\n');
  console.log('   CLOUDINARY_CLOUD_NAME="votre-cloud-name"');
  console.log('   CLOUDINARY_API_KEY="votre-api-key"');
  console.log('   CLOUDINARY_API_SECRET="votre-api-secret"\n');
}

