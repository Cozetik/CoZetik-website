import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultValues = [
  {
    order: 1,
    title: "HUMAIN AU CŒUR DU RECRUTEMENT",
    description:
      "Nous plaçons l'humain au centre de chaque recrutement. Chaque candidat est unique et mérite une attention personnalisée pour trouver le poste qui lui correspond parfaitement.",
    visible: true,
  },
  {
    order: 2,
    title: "EXCELLENCE ET EXPERTISE MÉTIER RPO",
    description:
      "Notre expertise en Recruitment Process Outsourcing (RPO) nous permet d'accompagner les entreprises avec des solutions sur-mesure et des processus optimisés pour recruter les meilleurs talents.",
    visible: true,
  },
  {
    order: 3,
    title: "EMPLOYABILITÉ DURABLE ET CONCRÈTE",
    description:
      "Nous formons nos candidats aux compétences recherchées par les entreprises d'aujourd'hui et de demain, pour une employabilité durable et des carrières épanouissantes.",
    visible: true,
  },
  {
    order: 4,
    title: "RECRUTEMENT ÉTHIQUE ET RESPONSABLE",
    description:
      "Nous respectons des standards éthiques élevés dans tous nos processus de recrutement, garantissant transparence, équité et respect de la diversité.",
    visible: true,
  },
  {
    order: 5,
    title: "INNOVATION ET AGILITÉ TERRAIN",
    description:
      "Nous adoptons les dernières technologies et méthodologies agiles pour rester à la pointe du recrutement moderne et répondre rapidement aux besoins du marché.",
    visible: true,
  },
]

async function main() {
  console.log('🌱 Seeding values...')

  // Vérifier si des valeurs existent déjà
  const existingValues = await prisma.value.findMany()

  if (existingValues.length > 0) {
    console.log(`⚠️ ${existingValues.length} valeurs existent déjà dans la base de données.`)
    console.log('Pour éviter les doublons, le seed ne sera pas exécuté.')
    console.log('Si vous voulez réinitialiser les valeurs, supprimez-les d\'abord via l\'admin.')
    return
  }

  // Créer les valeurs
  for (const value of defaultValues) {
    await prisma.value.create({
      data: value,
    })
    console.log(`✅ Valeur créée: ${value.title}`)
  }

  console.log(`\n🎉 ${defaultValues.length} valeurs créées avec succès!`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
