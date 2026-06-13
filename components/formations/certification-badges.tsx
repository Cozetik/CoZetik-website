import Image from "next/image";
import { getCertification } from "@/lib/certifications";
import { CpfFinanceButton } from "./certification-status";

/**
 * Bloc certification d'une page formation.
 * - Qualiopi : certification de l'ORGANISME (COZETIK) → toujours affiché.
 * - Logo CPF + référence France Compétences + bouton de financement :
 *   UNIQUEMENT si la formation est réellement enregistrée + finançable CPF
 *   (présente dans lib/certifications.ts). Sinon, mention honnête « à venir ».
 */
export function CertificationBadges({ slug }: { slug: string }) {
  const cert = getCertification(slug);

  return (
    <div className="mt-8 flex flex-col items-center gap-8 pb-12">
      <div className="flex flex-col items-center justify-center gap-12 md:flex-row">
        {/* Qualiopi — niveau organisme, valable pour toutes les formations */}
        <div className="relative h-32 w-80">
          <Image
            src="/qualiopi.png"
            alt="Qualiopi - Processus certifié"
            fill
            className="object-contain"
          />
        </div>

        {/* Logo Mon Compte Formation — seulement si certif validée + finançable */}
        {cert && (
          <div className="relative h-48 w-48">
            <Image
              src="/CPF.png"
              alt="Éligible Mon Compte Formation"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {cert ? (
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="font-sans text-sm text-cozetik-black/80 md:text-base">
            Certification{" "}
            <a
              href={cert.franceCompetencesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cozetik-black underline decoration-cozetik-green decoration-2 underline-offset-2"
            >
              {cert.rsCode}
            </a>{" "}
            — «&nbsp;{cert.officialTitle}&nbsp;» · Certificateur {cert.certifier}{" "}
            · Enregistrée au Répertoire France Compétences.
          </p>
          <CpfFinanceButton slug={slug} />
        </div>
      ) : (
        <p className="max-w-2xl text-center font-sans text-sm text-cozetik-black/70 md:text-base">
          Cette formation prépare à une certification professionnelle{" "}
          <strong>en cours d&apos;enregistrement</strong>. Son éligibilité au CPF
          sera indiquée ici dès sa publication officielle.
        </p>
      )}
    </div>
  );
}
