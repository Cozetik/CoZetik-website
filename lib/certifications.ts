/**
 * Source de vérité UNIQUE des certifications COZETIK.
 *
 * ⚠️ RÈGLE ANTI-HALLUCINATION (non négociable) :
 *   N'inscrire ici une formation QUE si sa certification est :
 *     1. réellement enregistrée au Répertoire France Compétences, ET
 *     2. finançable via le CPF (Mon Compte Formation).
 *   Chaque entrée a été vérifiée sur francecompetences.fr avant publication.
 *   Toute formation ABSENTE de VALIDATED_BY_SLUG est automatiquement affichée
 *   « À venir » (pastille) et ne revendique NI certif RS NI éligibilité CPF.
 *
 * Pour passer une formation en « validée » : ajouter son entrée ici (1 ligne),
 * après vérification France Compétences + obtention du lien Mon Compte Formation.
 */

export type Certification = {
  /** Code du Répertoire Spécifique, ex. "RS7200" */
  rsCode: string;
  /** Intitulé officiel France Compétences, repris mot pour mot */
  officialTitle: string;
  /** Certificateur enregistré */
  certifier: string;
  /** Fiche France Compétences (preuve d'enregistrement) */
  franceCompetencesUrl: string;
  /** Date de fin d'enregistrement (YYYY-MM-DD) */
  registeredUntil: string;
  /** Lien Mon Compte Formation pour s'inscrire / financer (à fournir par Nicolas) */
  cpfUrl?: string;
};

/**
 * Certifications VALIDÉES, indexées par le slug exact de la formation en base.
 * Vérifié le 13/06/2026 sur francecompetences.fr.
 */
export const VALIDATED_BY_SLUG: Record<string, Certification> = {
  "reseaux-sociaux-tpe": {
    rsCode: "RS7200",
    officialTitle:
      "Communiquer sur les réseaux sociaux pour promouvoir sa TPE",
    certifier: "CréActifs",
    franceCompetencesUrl: "https://www.francecompetences.fr/recherche/rs/7200/",
    registeredUntil: "2028-06-25",
    cpfUrl:
      "https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche/98257467500012_COZETIK-RS7200-RS-2026/98257467500012_COZETIK-RS7200-RS-2026?contexteFormation=ACTIVITE_PROFESSIONNELLE",
  },
  "conduire-un-projet-de-creation-dentreprise": {
    rsCode: "RS7004",
    officialTitle: "Conduire un projet de création d'entreprise",
    certifier: "CréActifs",
    franceCompetencesUrl: "https://www.francecompetences.fr/recherche/rs/7004/",
    registeredUntil: "2028-01-31",
    cpfUrl:
      "https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche/98257467500012_COZETIK-RS7004-CE-2026/98257467500012_COZETIK-RS7004-CE-2026?contexteFormation=ACTIVITE_PROFESSIONNELLE",
  },
};

/** Retourne la certification validée d'une formation, ou null si « à venir ». */
export function getCertification(slug: string): Certification | null {
  return VALIDATED_BY_SLUG[slug] ?? null;
}

/** true si la formation est certifiante + finançable CPF (validée). */
export function isCertificationValidated(slug: string): boolean {
  return slug in VALIDATED_BY_SLUG;
}
