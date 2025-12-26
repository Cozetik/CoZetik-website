import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting formation demo seed...')

  // Récupérer la première formation visible
  const formation = await prisma.formation.findFirst({
    where: { visible: true },
    include: { category: true }
  })

  if (!formation) {
    console.log('❌ Aucune formation trouvée. Créez d\'abord une formation.')
    return
  }

  console.log(`📚 Formation trouvée: ${formation.title}`)

  // Mettre à jour les champs de la formation
  await prisma.formation.update({
    where: { id: formation.id },
    data: {
      level: 'Débutant',
      maxStudents: 24,
      studentsCount: 12,
      prerequisites: 'Aucun prérequis. Cette formation est accessible à tous.',
      objectives: [
        'Maîtriser les fondamentaux de l\'IA et de l\'automatisation',
        'Créer des workflows automatisés avec ChatGPT et Make.com',
        'Optimiser votre productivité quotidienne de 40%',
        'Développer des assistants IA personnalisés pour vos besoins'
      ],
      isCertified: true,
      rating: 4.8,
      reviewsCount: 124,
      isFlexible: true
    }
  })

  console.log('✅ Formation mise à jour avec succès')

  // Supprimer les steps existants pour cette formation
  await prisma.formationStep.deleteMany({
    where: { formationId: formation.id }
  })

  // Créer 5 étapes pédagogiques
  const steps = [
    {
      order: 1,
      title: 'Fondamentaux de l\'IA',
      description: 'Découvrez les concepts clés de l\'intelligence artificielle moderne et comprenez comment l\'IA peut transformer votre façon de travailler.',
      duration: '2 heures',
      keyPoints: [
        'Comprendre les bases de l\'IA et du machine learning',
        'Identifier les cas d\'usage pertinents pour votre métier',
        'Découvrir les principaux outils IA disponibles'
      ]
    },
    {
      order: 2,
      title: 'Maîtriser ChatGPT',
      description: 'Apprenez à utiliser ChatGPT comme un pro : rédaction, analyse, recherche, et bien plus encore.',
      duration: '3 heures',
      keyPoints: [
        'Techniques de prompting avancées',
        'Automatiser la rédaction de contenu',
        'Créer des assistants personnalisés',
        'Analyser et synthétiser des documents'
      ]
    },
    {
      order: 3,
      title: 'Automatisation avec Make.com',
      description: 'Connectez vos outils favoris et créez des workflows automatisés sans coder.',
      duration: '4 heures',
      keyPoints: [
        'Créer votre premier scénario d\'automatisation',
        'Intégrer ChatGPT dans vos workflows',
        'Connecter Gmail, Notion, Slack et plus',
        'Gérer les erreurs et optimiser vos scénarios'
      ]
    },
    {
      order: 4,
      title: 'Projets Pratiques',
      description: 'Mettez en pratique vos connaissances avec 3 projets concrets adaptés à votre métier.',
      duration: '5 heures',
      keyPoints: [
        'Projet 1: Assistant email automatisé',
        'Projet 2: Veille informationnelle intelligente',
        'Projet 3: Génération de rapports automatiques'
      ]
    },
    {
      order: 5,
      title: 'Certification & Suivi',
      description: 'Validez vos compétences et bénéficiez d\'un suivi personnalisé pour continuer à progresser.',
      duration: '1 heure',
      keyPoints: [
        'Quiz de certification final',
        'Accès à la communauté privée',
        'Ressources exclusives et mises à jour',
        'Sessions de questions-réponses mensuelles'
      ]
    }
  ]

  for (const step of steps) {
    await prisma.formationStep.create({
      data: {
        formationId: formation.id,
        ...step
      }
    })
  }

  console.log('✅ 5 étapes créées avec succès')

  // Supprimer les FAQs existantes
  await prisma.formationFAQ.deleteMany({
    where: { formationId: formation.id }
  })

  // Créer 5 FAQs
  const faqs = [
    {
      order: 1,
      question: 'Pour qui est cette formation ?',
      answer: 'Cette formation s\'adresse à tous les professionnels souhaitant gagner en productivité grâce à l\'IA : entrepreneurs, managers, assistants, marketeurs, développeurs, etc. Aucun prérequis technique n\'est nécessaire.'
    },
    {
      order: 2,
      question: 'Combien de temps dure la formation ?',
      answer: 'La formation complète représente environ 15 heures de contenu réparti sur 5 modules. Vous pouvez suivre la formation à votre rythme, avec un accès illimité à vie au contenu et aux mises à jour.'
    },
    {
      order: 3,
      question: 'Aurai-je un certificat à la fin ?',
      answer: 'Oui ! Après avoir complété tous les modules et réussi le quiz final, vous recevrez un certificat de réussite officiel que vous pourrez ajouter à votre profil LinkedIn.'
    },
    {
      order: 4,
      question: 'Quels outils vais-je apprendre à utiliser ?',
      answer: 'Vous maîtriserez ChatGPT (GPT-4), Make.com pour l\'automatisation, ainsi que diverses intégrations avec Gmail, Notion, Slack, Google Sheets, et d\'autres outils professionnels courants.'
    },
    {
      order: 5,
      question: 'Y a-t-il un support après la formation ?',
      answer: 'Absolument ! Vous aurez accès à notre communauté privée Discord, à des sessions de questions-réponses mensuelles en direct, et à un support par email pour toute question technique.'
    }
  ]

  for (const faq of faqs) {
    await prisma.formationFAQ.create({
      data: {
        formationId: formation.id,
        ...faq
      }
    })
  }

  console.log('✅ 5 FAQs créées avec succès')

  console.log('\n🎉 Seed terminé avec succès!')
  console.log(`\n📍 Testez la formation ici: http://localhost:3002/formations/${formation.slug}`)
  console.log('\n💡 Le carousel GSAP devrait maintenant être visible!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
