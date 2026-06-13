/**
 * Paires question/réponse (texte brut) de la FAQ de l'accueil.
 * Module de données neutre (pas de "use client") pour pouvoir être importé
 * à la fois par le composant client `FAQSection` et par la page serveur
 * (génération du JSON-LD `FAQPage` — rich results Google).
 */
export const homeFaqItems = [
  {
    question:
      "Formations professionnelles certifiantes : développez vos compétences avec Cozetik",
    answer:
      "Cozetik est un centre de formation professionnelle spécialisé dans l'accompagnement des talents d'avenir. Nous proposons des formations certifiantes de qualité adaptées aux besoins du marché actuel. Que vous souhaitiez développer vos compétences en informatique, en business, en communication, en intelligence émotionnelle ou en bien-être, nos parcours post-bac sont conçus pour vous accompagner vers la réussite professionnelle.",
  },
  {
    question: "Pourquoi choisir nos formations professionnelles ?",
    answer:
      "Nos formations professionnelles certifiantes allient excellence technique et développement personnel. Chaque parcours est pensé pour être immédiatement applicable dans votre environnement professionnel. Nous formons aux compétences clés du monde numérique et humain : intelligence artificielle, automatisation, communication, leadership et bien-être au travail.",
  },
  {
    question: "Des formations adaptées à vos objectifs professionnels",
    answer:
      "Que vous soyez en reconversion professionnelle, en recherche d'emploi ou en activité, nos formations en ligne et en présentiel s'adaptent à votre rythme. Nos experts reconnus vous accompagnent tout au long de votre parcours pour garantir votre réussite. Chaque formation délivre une certification professionnelle reconnue, valorisant votre profil sur le marché de l'emploi.",
  },
  {
    question: "Catalogue de formations professionnelles complet",
    answer:
      "Découvrez notre catalogue de formations couvrant 5 domaines d'expertise : informatique et IA, business et entrepreneuriat, communication et prise de parole, intelligence émotionnelle et bien-être & connexion. Chaque formation est structurée en modules progressifs, avec des objectifs pédagogiques clairs et des mises en pratique concrètes. Nos formations post-bac sont accessibles à tous les niveaux, du débutant à l'expert. Grâce à notre quiz d'orientation personnalisé, trouvez la formation qui correspond parfaitement à votre profil et à vos ambitions professionnelles.",
  },
] as const
