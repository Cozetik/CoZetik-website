import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedQuiz() {
  console.log('🌱 Seeding Quiz data...')

  // 1. Créer les 10 questions avec leurs 8 options (A-H)
  const questions = [
    {
      order: 1,
      question: "Aujourd'hui, ton problème numéro 1, c'est…",
      options: [
        { letter: 'A', text: "Je sais des choses, mais je n'arrive pas à les dire comme je veux", order: 1 },
        { letter: 'B', text: "Je manque de temps, je suis noyé(e) sous les tâches", order: 2 },
        { letter: 'C', text: "Je gère en apparence, mais intérieurement je suis souvent tendu(e)", order: 3 },
        { letter: 'D', text: "Les gens autour de moi me fatiguent / collaboration compliquée", order: 4 },
        { letter: 'E', text: "Je veux évoluer, mais je ne sais pas comment me vendre", order: 5 },
        { letter: 'F', text: "J'ai envie de créer un projet, mais c'est flou et ça n'avance pas", order: 6 },
        { letter: 'G', text: "Je veux maîtriser l'IA, mais je ne sais pas l'utiliser efficacement", order: 7 },
        { letter: 'H', text: "Je manque d'aisance dans mon corps / présence / social", order: 8 },
      ],
    },
    {
      order: 2,
      question: "Dans une situation importante (réunion, entretien, présentation) tu…",
      options: [
        { letter: 'A', text: "Perds tes mots ou tu parles trop vite", order: 1 },
        { letter: 'B', text: "Penses à tout ce que tu dois faire après, ça te parasite", order: 2 },
        { letter: 'C', text: "Sens le stress monter et ça te fatigue avant même d'y être", order: 3 },
        { letter: 'D', text: "Te tends à cause des autres (ambiance, tensions, personnalités)", order: 4 },
        { letter: 'E', text: "Sais que tu pourrais briller mais tu ne sais pas \"te positionner\"", order: 5 },
        { letter: 'F', text: "Te dis \"j'ai un potentiel énorme\" mais tu manques de structure", order: 6 },
        { letter: 'G', text: "Te dis \"si je maîtrisais l'IA, je gagnerais un temps fou\"", order: 7 },
        { letter: 'H', text: "Te sens pas totalement à l'aise physiquement, ça se voit", order: 8 },
      ],
    },
    {
      order: 3,
      question: "Ce que tu veux ressentir dans 30 jours",
      options: [
        { letter: 'A', text: "Être clair(e), crédible, écouté(e)", order: 1 },
        { letter: 'B', text: "Être organisé(e), léger(ère), moins chargé(e)", order: 2 },
        { letter: 'C', text: "Être calme, stable, apaisé(e)", order: 3 },
        { letter: 'D', text: "Être fluide avec les autres, à ta place en équipe", order: 4 },
        { letter: 'E', text: "Être plus visible, mieux valorisé(e), plus \"choisi(e)\"", order: 5 },
        { letter: 'F', text: "Être lancé(e) sur un projet concret", order: 6 },
        { letter: 'G', text: "Être à l'aise avec l'IA et l'utiliser pour produire vite", order: 7 },
        { letter: 'H', text: "Être plus à l'aise socialement et dans ton corps", order: 8 },
      ],
    },
    {
      order: 4,
      question: "La phrase qui te décrit le mieux",
      options: [
        { letter: 'A', text: "« J'ai une bonne tête, mais je n'imprime pas toujours. »", order: 1 },
        { letter: 'B', text: "« J'ai trop de choses en tête, je n'arrête jamais. »", order: 2 },
        { letter: 'C', text: "« Je prends sur moi… mais ça me coûte. »", order: 3 },
        { letter: 'D', text: "« Les gens me prennent de l'énergie. »", order: 4 },
        { letter: 'E', text: "« Je suis capable, mais je ne sais pas me vendre. »", order: 5 },
        { letter: 'F', text: "« J'ai des idées, mais je pars dans tous les sens. »", order: 6 },
        { letter: 'G', text: "« Je sens que l'IA peut changer ma vie, mais je suis largué(e). »", order: 7 },
        { letter: 'H', text: "« Je suis à l'aise par moments, mais pas \"stablement\". »", order: 8 },
      ],
    },
    {
      order: 5,
      question: "Ton obstacle le plus fréquent",
      options: [
        { letter: 'A', text: "Le regard des autres me bloque", order: 1 },
        { letter: 'B', text: "Je suis dispersé(e), je papillonne, je m'épuise", order: 2 },
        { letter: 'C', text: "Je rumine / je m'inquiète / je me mets la pression", order: 3 },
        { letter: 'D', text: "Je n'ose pas poser de limites ou cadrer en équipe", order: 4 },
        { letter: 'E', text: "Je n'ai pas une stratégie claire pour avancer pro", order: 5 },
        { letter: 'F', text: "Je n'arrive pas à transformer mon idée en plan", order: 6 },
        { letter: 'G', text: "Je perds trop de temps à faire des tâches répétitives", order: 7 },
        { letter: 'H', text: "Je me sens souvent tendu(e) ou pas aligné(e) physiquement", order: 8 },
      ],
    },
    {
      order: 6,
      question: "Quand tu veux progresser, tu préfères…",
      options: [
        { letter: 'A', text: "Des exercices concrets avec feedback sur ta manière de parler", order: 1 },
        { letter: 'B', text: "Des outils qui simplifient ta vie et te font gagner du temps", order: 2 },
        { letter: 'C', text: "Des méthodes pour retrouver un équilibre intérieur", order: 3 },
        { letter: 'D', text: "Des méthodes d'équipe et d'organisation collective", order: 4 },
        { letter: 'E', text: "Des outils pour te positionner et te rendre attractif(ve)", order: 5 },
        { letter: 'F', text: "Un cadre pour construire un projet solide", order: 6 },
        { letter: 'G', text: "Des automatisations et des workflows IA clairs", order: 7 },
        { letter: 'H', text: "Une expérience corporelle, pratique, qui te transforme", order: 8 },
      ],
    },
    {
      order: 7,
      question: "Ton \"vrai désir\" (celui que tu dis rarement)",
      options: [
        { letter: 'A', text: "Qu'on m'écoute vraiment et qu'on me respecte", order: 1 },
        { letter: 'B', text: "Retrouver de l'air dans ma tête", order: 2 },
        { letter: 'C', text: "Être solide émotionnellement, même quand c'est dur", order: 3 },
        { letter: 'D', text: "Être à l'aise avec les gens sans y laisser mon énergie", order: 4 },
        { letter: 'E', text: "Avoir une carrière qui me ressemble, pas juste un job", order: 5 },
        { letter: 'F', text: "Être libre et créer quelque chose à moi", order: 6 },
        { letter: 'G', text: "Être en avance et produire plus vite que les autres", order: 7 },
        { letter: 'H', text: "Me sentir bien dans mon corps et dans ma présence", order: 8 },
      ],
    },
    {
      order: 8,
      question: "Si tu pouvais supprimer une douleur tout de suite",
      options: [
        { letter: 'A', text: "La peur de parler / d'être jugé(e)", order: 1 },
        { letter: 'B', text: "Le manque de temps et la surcharge", order: 2 },
        { letter: 'C', text: "Le stress et la pression interne", order: 3 },
        { letter: 'D', text: "Les tensions relationnelles", order: 4 },
        { letter: 'E', text: "L'impression d'être invisible professionnellement", order: 5 },
        { letter: 'F', text: "Le flou, l'inaction, la procrastination sur ton projet", order: 6 },
        { letter: 'G', text: "Les tâches répétitives qui te bouffent la vie", order: 7 },
        { letter: 'H', text: "La tension dans ton corps et l'inconfort social", order: 8 },
      ],
    },
    {
      order: 9,
      question: "Ton meilleur scénario dans 6 mois",
      options: [
        { letter: 'A', text: "Je m'exprime avec aisance, je suis respecté(e)", order: 1 },
        { letter: 'B', text: "Je suis efficace, organisé(e), je gère sans subir", order: 2 },
        { letter: 'C', text: "Je suis stable, serein(e), plus en paix", order: 3 },
        { letter: 'D', text: "Je suis fluide avec les gens, j'ai de meilleures relations", order: 4 },
        { letter: 'E', text: "J'ai franchi un cap carrière / salaire / opportunité", order: 5 },
        { letter: 'F', text: "Mon projet existe, il est structuré, il avance", order: 6 },
        { letter: 'G', text: "Je maîtrise l'IA et je m'en sers tous les jours", order: 7 },
        { letter: 'H', text: "Je suis confiant(e), présent(e), à l'aise socialement", order: 8 },
      ],
    },
    {
      order: 10,
      question: "Ton style naturel (même si tu ne l'assumes pas toujours)",
      options: [
        { letter: 'A', text: "Impact / expression", order: 1 },
        { letter: 'B', text: "Efficacité / structure", order: 2 },
        { letter: 'C', text: "Profondeur / sensibilité", order: 3 },
        { letter: 'D', text: "Collectif / adaptabilité", order: 4 },
        { letter: 'E', text: "Ambition / progression", order: 5 },
        { letter: 'F', text: "Création / autonomie", order: 6 },
        { letter: 'G', text: "Innovation / digital", order: 7 },
        { letter: 'H', text: "Présence / énergie", order: 8 },
      ],
    },
  ]

  // Créer les questions et leurs options
  for (const q of questions) {
    const question = await prisma.quizQuestion.create({
      data: {
        order: q.order,
        question: q.question,
        visible: true,
        options: {
          create: q.options,
        },
      },
      include: {
        options: true,
      },
    })
    console.log(`✅ Question ${q.order} créée avec ${q.options.length} options`)
  }

  // 2. Créer les 8 profils (A-H)
  const profiles = [
    {
      letter: 'A',
      name: 'Le Communicateur Invisible',
      emoji: '🗣️',
      color: '#3B82F6',
      blocageRacine: "l'exposition (regard, trac, sur-contrôle)",
      desir: 'être écouté(e), respecté(e), crédible',
      phraseMiroir: "Tu ne manques pas de talent. Tu manques d'aisance à l'oral. Et c'est exactement ce qu'on va débloquer.",
      programmeSignature: 'Prise de Parole — Charisme, Clarté & Confiance',
      modulesComplementaires: [
        'Communication non verbale & charisme naturel',
        'Simulation d\'entretien',
      ],
    },
    {
      letter: 'B',
      name: 'Le Stratège Débordé',
      emoji: '⚡',
      color: '#10B981',
      blocageRacine: 'la dispersion (trop de tâches, pas assez de système)',
      desir: 'reprendre le contrôle, être efficace sans s\'épuiser',
      phraseMiroir: "Tu n'es pas paresseux(se). Tu manques d'outils. Et on va te les donner.",
      programmeSignature: 'IA & Productivité — ChatGPT Pro',
      modulesComplementaires: [
        'IA No-Code',
        'IA Créative',
      ],
    },
    {
      letter: 'C',
      name: 'Le Sage Émotionnel',
      emoji: '🧘',
      color: '#8B5CF6',
      blocageRacine: "l'hyper-sensibilité (tout est intense, trop fort)",
      desir: 'trouver la stabilité, la sérénité, la maîtrise',
      phraseMiroir: "Tu ne t'écroules pas. Tu ressens. Et c'est une force qu'on va structurer.",
      programmeSignature: 'Intelligence Émotionnelle',
      modulesComplementaires: [
        'Stress & conflits',
        'Leadership émotionnel',
      ],
    },
    {
      letter: 'D',
      name: 'Le Collaborateur Isolé',
      emoji: '🤝',
      color: '#F59E0B',
      blocageRacine: "l'incompréhension (décalage, solitude en équipe)",
      desir: 'être compris(e), aligné(e), en harmonie',
      phraseMiroir: "Tu n'es pas le problème. C'est la manière de collaborer qui ne te convient pas.",
      programmeSignature: 'Prise de Parole (pour s\'affirmer en équipe)',
      modulesComplementaires: [
        'Collaboration moderne',
        'Gestion de projet à distance',
      ],
    },
    {
      letter: 'E',
      name: 'Le Booster de Carrière',
      emoji: '🚀',
      color: '#EC4899',
      blocageRacine: "l'invisibilité (tu vaux plus que ce que tu montres)",
      desir: 'être vu(e), reconnu(e), recruté(e)',
      phraseMiroir: "Tu as la valeur. Il te manque la vitrine.",
      programmeSignature: 'Prise de Parole (pour réussir les entretiens)',
      modulesComplementaires: [
        'CV & marque personnelle',
        'LinkedIn professionnel',
      ],
    },
    {
      letter: 'F',
      name: "L'Entrepreneur Flou",
      emoji: '💡',
      color: '#EF4444',
      blocageRacine: "l'absence de structure (trop d'idées, pas de méthode)",
      desir: 'passer à l\'action, structurer, lancer',
      phraseMiroir: "Tu n'es pas perdu(e). Tu es dans le brouillard. Et on va le dissiper.",
      programmeSignature: 'IA & Productivité (pour structurer et produire)',
      modulesComplementaires: [
        'Lancer son projet',
        'Marketing & acquisition',
      ],
    },
    {
      letter: 'G',
      name: 'Le Créateur Digital',
      emoji: '🎨',
      color: '#06B6D4',
      blocageRacine: "le manque d'outils (tu veux créer mais tu rames)",
      desir: 'produire, publier, rayonner',
      phraseMiroir: "Tu as les idées. Il te manque la machine.",
      programmeSignature: 'IA & Productivité',
      modulesComplementaires: [
        'IA Créative',
        'Marketing & acquisition',
      ],
    },
    {
      letter: 'H',
      name: "L'Âme Confiante",
      emoji: '💚',
      color: '#5E985E',
      blocageRacine: 'la déconnexion (du corps, de soi, des autres)',
      desir: 'se sentir bien, ancré(e), vivant(e)',
      phraseMiroir: "Tu n'es pas cassé(e). Tu es juste déconnecté(e). Et on va te reconnecter.",
      programmeSignature: 'Kizomba Bien-Être & Connexion',
      modulesComplementaires: [
        'Communication non verbale & charisme naturel',
        'Intelligence Émotionnelle',
      ],
    },
  ]

  for (const p of profiles) {
    const profile = await prisma.quizProfile.create({
      data: p,
    })
    console.log(`✅ Profil ${p.letter} - ${p.name} créé`)
  }

  console.log('✅ Quiz seed completed!')
}

async function main() {
  try {
    // Vérifier si les données existent déjà
    const existingQuestions = await prisma.quizQuestion.count()
    const existingProfiles = await prisma.quizProfile.count()

    if (existingQuestions > 0 || existingProfiles > 0) {
      console.log('⚠️  Des données Quiz existent déjà. Suppression...')
      await prisma.quizOption.deleteMany()
      await prisma.quizQuestion.deleteMany()
      await prisma.quizProfile.deleteMany()
      console.log('✅ Données existantes supprimées')
    }

    await seedQuiz()
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
