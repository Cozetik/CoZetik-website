export type QuestionType = 'single' | 'multiple' | 'scale';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'defi_principal',
    question: 'Quel est votre principal défi professionnel actuellement ?',
    type: 'single',
    options: [
      'Prendre la parole en public avec confiance',
      'Gagner du temps et être plus productif',
      'Gérer mon stress et mes émotions',
      'Améliorer ma collaboration en équipe',
      'Réussir mes entretiens et booster ma carrière',
      'Lancer ou développer mon projet entrepreneurial',
      'Créer du contenu et développer ma marque',
      'Retrouver confiance en moi et bien-être',
    ],
  },
  {
    id: 'objectif_prioritaire',
    question: 'Qu\'est-ce que vous voulez améliorer en priorité ?',
    type: 'single',
    options: [
      'Mon charisme et ma communication',
      'Mon organisation et mes outils de travail',
      'Ma stabilité émotionnelle et mon leadership',
      'Mes compétences de travail en équipe',
      'Mon CV et mon profil professionnel',
      'Ma stratégie business et mon pitch',
      'Ma créativité et ma production de contenu',
      'Mon bien-être corporel et mental',
    ],
  },
  {
    id: 'niveau_stress',
    question: 'Sur une échelle de 1 à 5, comment évaluez-vous votre niveau de stress au quotidien ?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: 'Très faible',
      max: 'Très élevé',
    },
  },
  {
    id: 'situation_actuelle',
    question: 'Quelle situation décrit le mieux votre contexte actuel ?',
    type: 'single',
    options: [
      'Je dois présenter des projets ou parler en réunion',
      'Je croule sous les tâches répétitives',
      'Je gère difficilement les conflits et les émotions',
      'Je travaille beaucoup en équipe à distance',
      'Je cherche un emploi ou je change de carrière',
      'Je monte ma boîte ou je veux entreprendre',
      'Je crée du contenu (vidéos, articles, designs)',
      'Je ressens un besoin de reconnexion à moi-même',
    ],
  },
  {
    id: 'competence_priorite',
    question: 'Si vous pouviez développer UNE compétence dès maintenant, ce serait :',
    type: 'single',
    options: [
      'Parler avec impact et convaincre',
      'Automatiser et optimiser mon travail avec l\'IA',
      'Comprendre et gérer mes émotions',
      'Collaborer efficacement et créer ensemble',
      'Me vendre et réussir mes entretiens',
      'Pitcher mon projet et trouver des clients',
      'Produire du contenu de qualité rapidement',
      'Être plus présent et confiant dans mon corps',
    ],
  },
  {
    id: 'blocage_actuel',
    question: 'Quel est votre plus grand blocage en ce moment ?',
    type: 'single',
    options: [
      'La peur de parler devant les autres',
      'Le manque de temps et d\'organisation',
      'Le stress, l\'anxiété ou les conflits',
      'Les difficultés de communication en équipe',
      'L\'incertitude sur mon avenir professionnel',
      'L\'absence de stratégie pour mon projet',
      'Le manque d\'inspiration créative',
      'Le manque de confiance en moi',
    ],
  },
  {
    id: 'temps_disponible',
    question: 'Combien de temps pouvez-vous consacrer à votre formation par semaine ?',
    type: 'single',
    options: [
      'Moins de 2 heures',
      '2 à 5 heures',
      '5 à 10 heures',
      'Plus de 10 heures',
    ],
  },
  {
    id: 'motivation',
    question: 'Qu\'est-ce qui vous motive le plus à vous former ?',
    type: 'single',
    options: [
      'Gagner en crédibilité et en influence',
      'Gagner du temps et travailler mieux',
      'Gagner en sérénité et en équilibre',
      'Mieux collaborer et créer des liens',
      'Décrocher un meilleur poste',
      'Réussir mon projet entrepreneurial',
      'Développer mon activité créative',
      'Retrouver du bien-être et de la connexion',
    ],
  },
];

// Fonction pour mapper les réponses au format attendu par le backend
export function formatQuizAnswers(answers: Record<string, string>): Record<string, string> {
  return answers;
}
