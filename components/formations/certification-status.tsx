import { BadgeCheck, Clock3 } from "lucide-react";
import { getCertification } from "@/lib/certifications";

/**
 * Pastille de statut de certification, pilotée par lib/certifications.ts.
 * - Formation VALIDÉE  → « Éligible CPF · RSxxxx » (icône verte)
 * - Formation À VENIR  → « Certification à venir » (icône ambre)
 *
 * Fond blanc + texte quasi-noir → contraste AA garanti sur fond clair comme
 * sur fond sombre (hero noir, cartes au survol). Composant synchrone →
 * utilisable côté serveur comme côté client.
 */
export function CertificationPill({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const cert = getCertification(slug);

  if (cert) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-cozetik-green/50 bg-white px-3 py-1 text-xs font-semibold text-cozetik-black ${className}`}
      >
        <BadgeCheck className="h-3.5 w-3.5 text-cozetik-green" aria-hidden="true" />
        Éligible CPF · {cert.rsCode}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-white px-3 py-1 text-xs font-semibold text-cozetik-black ${className}`}
    >
      <Clock3 className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
      Certification à venir
    </span>
  );
}

/**
 * Bouton « Financer avec mon CPF » → lien Mon Compte Formation.
 * Ne s'affiche QUE pour une formation validée disposant d'un lien CPF.
 * Bleu « France » (#000091) + texte blanc → contraste AA largement respecté.
 */
export function CpfFinanceButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const cert = getCertification(slug);
  if (!cert?.cpfUrl) return null;

  return (
    <a
      href={cert.cpfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-none bg-[#000091] px-6 py-3 font-sans text-base font-semibold text-white transition-colors hover:bg-[#00006b] ${className}`}
    >
      <BadgeCheck className="h-5 w-5" aria-hidden="true" />
      Financer avec mon CPF
    </a>
  );
}
