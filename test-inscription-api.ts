async function testInscriptionAPI() {
    console.log('🚀 Test API Inscription Formation...\n');
  
    // ⚠️ IMPORTANT : Remplace par un ID de formation qui existe dans ta DB
    const testData = {
      name: 'Marie Martin',
      email: 'nicoleoproject@gmail.com', // ⚠️ Remplace par ton email si différent
      phone: '0612345678',
      message: 'Je suis très intéressée par cette formation et j\'aimerais en savoir plus sur le contenu.',
      formationId: 'cmjb87jdq0002zhj8wgybvy8h' // ID de la formation "Savoir utilser un ordinateur"
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/public/inscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
  
      const data = await response.json();
  
      console.log('📊 Statut:', response.status);
      console.log('📦 Réponse:', data);
  
      if (response.ok) {
        console.log('\n✅ Test réussi ! Vérifie :');
        console.log('   - Ta boîte mail (2 emails : user + admin)');
        console.log('   - La base de données (nouvelle entrée FormationInscription)');
      } else {
        console.log('\n❌ Test échoué');
      }
  
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  testInscriptionAPI();