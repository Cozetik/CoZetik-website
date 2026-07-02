/**
 * Logique du diagnostic d'éligibilité CPF (/eligibilite-cpf).
 *
 * ⚠️ RÈGLE ANTI-HALLUCINATION : aucune promesse de financement absolue.
 * Le CPF finance dans la limite du solde du titulaire, et une participation
 * forfaitaire légale s'applique (décret n° 2024-394 du 29 avril 2024) :
 *   - 150 € par dossier depuis le 2 avril 2026 (décret du 1er avril 2026) ;
 *   - 0 € pour les demandeurs d'emploi et en cas d'abondement employeur.
 * Si ce montant évolue, mettre à jour UNIQUEMENT les constantes ci-dessous.
 *
 * Les formations recommandées proviennent de lib/certifications.ts
 * (source de vérité CPF) — ne jamais référencer un slug absent de
 * VALIDATED_BY_SLUG ici.
 */

import { VALIDATED_BY_SLUG } from "@/lib/certifications";

export const PARTICIPATION_FORFAITAIRE = "150 €";
export const PARTICIPATION_DEPUIS = "2 avril 2026";

export type Statut =
  | "salarie"
  | "demandeur-emploi"
  | "independant"
  | "fonctionnaire"
  | "autre";

export type Projet = "creation" | "reseaux-sociaux" | "les-deux";

export type Echeance = "maintenant" | "trois-mois" | "explore";

export type DiagnosticAnswers = {
  statut: Statut;
  projet: Projet;
  echeance: Echeance;
};

export const STATUT_OPTIONS: { value: Statut; label: string }[] = [
  { value: "salarie", label: "Salarié(e) du secteur privé" },
  { value: "demandeur-emploi", label: "Demandeur / demandeuse d'emploi" },
  { value: "independant", label: "Indépendant(e), freelance ou dirigeant(e) de TPE" },
  { value: "fonctionnaire", label: "Agent(e) de la fonction publique" },
  { value: "autre", label: "Autre situation" },
];

export const PROJET_OPTIONS: { value: Projet; label: string }[] = [
  { value: "creation", label: "Créer ou reprendre une entreprise" },
  { value: "reseaux-sociaux", label: "Développer la visibilité de mon activité sur les réseaux sociaux" },
  { value: "les-deux", label: "Les deux m'intéressent / je ne sais pas encore" },
];

export const ECHEANCE_OPTIONS: { value: Echeance; label: string }[] = [
  { value: "maintenant", label: "Dès que possible" },
  { value: "trois-mois", label: "Dans les 3 prochains mois" },
  { value: "explore", label: "J'explore, pas de date précise" },
];

export type DiagnosticResult = {
  /** true = peut mobiliser son CPF sur Mon Compte Formation en autonomie */
  cpfDirect: boolean;
  /** Verdict affiché en titre du résultat */
  verdict: string;
  /** Explication du financement, factuelle et sourcée */
  financement: string;
  /** Slug de la formation recommandée (clé de VALIDATED_BY_SLUG), ou null */
  formationSlug: string | null;
  /** Slug de la formation secondaire à mentionner, ou null */
  formationSecondaireSlug: string | null;
};

const SLUG_CREATION = "conduire-un-projet-de-creation-dentreprise";
const SLUG_RESEAUX = "reseaux-sociaux-tpe";

function recoSlugs(projet: Projet): {
  principal: string;
  secondaire: string | null;
} {
  if (projet === "reseaux-sociaux") {
    return { principal: SLUG_RESEAUX, secondaire: null };
  }
  if (projet === "les-deux") {
    return { principal: SLUG_CREATION, secondaire: SLUG_RESEAUX };
  }
  return { principal: SLUG_CREATION, secondaire: null };
}

export function computeDiagnostic(answers: DiagnosticAnswers): DiagnosticResult {
  const { principal, secondaire } = recoSlugs(answers.projet);

  switch (answers.statut) {
    case "demandeur-emploi":
      return {
        cpfDirect: true,
        verdict: "Bonne nouvelle : ton CPF peut financer ta formation, sans participation forfaitaire.",
        financement:
          "En tant que demandeur d'emploi, tu es exonéré(e) de la participation forfaitaire légale : tes droits CPF financent la formation dans la limite de ton solde, visible sur moncompteformation.gouv.fr.",
        formationSlug: principal,
        formationSecondaireSlug: secondaire,
      };
    case "salarie":
      return {
        cpfDirect: true,
        verdict: "Ton CPF peut financer ta formation.",
        financement:
          `Tes droits CPF (alimentés chaque année travaillée) financent la formation dans la limite de ton solde. Une participation forfaitaire légale de ${PARTICIPATION_FORFAITAIRE} par dossier s'applique depuis le ${PARTICIPATION_DEPUIS} — elle tombe à 0 € si ton employeur abonde ta formation.`,
        formationSlug: principal,
        formationSecondaireSlug: secondaire,
      };
    case "independant":
      return {
        cpfDirect: true,
        verdict: "Ton CPF peut financer ta formation.",
        financement:
          `Les indépendants à jour de leur contribution à la formation professionnelle (CFP) cumulent des droits CPF depuis 2018. Tes droits financent la formation dans la limite de ton solde, avec une participation forfaitaire légale de ${PARTICIPATION_FORFAITAIRE} par dossier (en vigueur depuis le ${PARTICIPATION_DEPUIS}).`,
        formationSlug: principal,
        formationSecondaireSlug: secondaire,
      };
    case "fonctionnaire":
      return {
        cpfDirect: false,
        verdict: "Ta situation mérite un point personnalisé.",
        financement:
          "Le CPF des agents publics fonctionne en heures et suit un circuit de financement différent de Mon Compte Formation. D'autres dispositifs peuvent s'appliquer : nous te rappelons pour étudier la solution adaptée.",
        formationSlug: principal,
        formationSecondaireSlug: secondaire,
      };
    default:
      return {
        cpfDirect: false,
        verdict: "Ta situation mérite un point personnalisé.",
        financement:
          "Selon ta situation, tes droits CPF ou d'autres dispositifs de financement peuvent s'appliquer. Nous te rappelons pour faire le point, sans engagement.",
        formationSlug: principal,
        formationSecondaireSlug: secondaire,
      };
  }
}

/** Libellés lisibles pour le récap envoyé en base / par email. */
export function labelOf<T extends string>(
  options: { value: T; label: string }[],
  value: T
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Récap structuré du diagnostic, stocké dans ContactRequest.message. */
export function buildLeadRecap(
  answers: DiagnosticAnswers,
  phone: string | undefined,
  result: DiagnosticResult
): string {
  const cert = result.formationSlug
    ? VALIDATED_BY_SLUG[result.formationSlug]
    : null;
  const lines = [
    "[Diagnostic CPF — lead entrant via /eligibilite-cpf]",
    `Statut : ${labelOf(STATUT_OPTIONS, answers.statut)}`,
    `Projet : ${labelOf(PROJET_OPTIONS, answers.projet)}`,
    `Échéance : ${labelOf(ECHEANCE_OPTIONS, answers.echeance)}`,
    `Téléphone : ${phone || "non renseigné"}`,
    cert
      ? `Formation recommandée : ${cert.rsCode} — ${cert.officialTitle}`
      : "Formation recommandée : à qualifier",
    `Mobilisation CPF directe : ${result.cpfDirect ? "oui" : "non — rappel nécessaire"}`,
  ];
  return lines.join("\n");
}
