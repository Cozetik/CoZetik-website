/**
 * Méta-descriptions SEO par formation (<= 155 caractères), rédigées puis
 * contrôlées (QA anti-hallucination). Utilisées par generateMetadata de la
 * page formation. Source : workflow « cozetik-seo-textes ».
 */
export const FORMATION_META_DESCRIPTION: Record<string, string> = {
  "creer-et-gerer-le-site-internet-de-sa-tpe-a-laide-dun-cms":
    "Formation à Bordeaux pour créer et gérer le site de sa TPE via un CMS, sans coder. Indépendants, présentiel ou à distance.",
  "ia-productivite-tpe":
    "Formation Intelligence Artificielle à Bordeaux pour TPE et indépendants : automatisez vos tâches, gagnez du temps et gagnez en productivité.",
  "conduire-un-projet-de-creation-dentreprise":
    "Formation certifiante à Bordeaux pour créer votre entreprise : étude de marché, statut, business plan. Éligible CPF, à distance ou en présentiel.",
  "creation-micro-entreprise":
    "Formation à Bordeaux pour créer votre micro-entreprise : démarches, fiscalité et premiers clients. À distance ou en présentiel, pour indépendants et TPE.",
  "reseaux-sociaux-tpe":
    "Formation réseaux sociaux pour TPE et indépendants à Bordeaux, à distance ou en présentiel. Certifiante et éligible CPF (RS7200).",
};

export function getFormationMetaDescription(slug: string): string | undefined {
  return FORMATION_META_DESCRIPTION[slug];
}
