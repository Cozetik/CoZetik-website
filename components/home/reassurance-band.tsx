import { Award, BadgeCheck, Clock } from "lucide-react";
import Image from "next/image";

const items = [
  {
    icon: Award,
    title: "Certifié Qualiopi",
    description: "Processus qualité certifié pour vos formations.",
  },
  {
    icon: BadgeCheck,
    title: "Éligible CPF",
    description: "Financez votre parcours via Mon Compte Formation.",
  },
  {
    icon: Clock,
    title: "Réponse sous 48h",
    description: "Un conseiller revient vers vous rapidement.",
  },
];

/**
 * Bande de réassurance affichée sur l'accueil avant la candidature.
 * Mentions génériques (Qualiopi, CPF, 48h) — aucun chiffre inventé.
 */
export function ReassuranceBand() {
  return (
    <section className="relative z-0 bg-cozetik-beige px-4 py-10 md:px-6 md:py-12 lg:px-[120px]">
      <div className="container mx-auto max-w-[1200px]">
        {/* Logos officiels — Qualiopi + Mon Compte Formation */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-10 md:mb-10 md:gap-16">
          <div className="relative h-14 w-44 md:h-16 md:w-52">
            <Image
              src="/qualiopi.png"
              alt="Certification Qualiopi"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative h-16 w-28 md:h-20 md:w-32">
            <Image
              src="/CPF.png"
              alt="Éligible Mon Compte Formation"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
            >
              <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cozetik-green/10 text-cozetik-green sm:mb-0 sm:mr-4">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p
                  className="font-display text-lg font-bold text-cozetik-black md:text-xl"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  {title}
                </p>
                <p className="mt-1 font-sans text-sm text-cozetik-black/70 md:text-base">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ligne de preuve sociale - mention générique, sans chiffre inventé */}
        <p className="mt-8 text-center font-sans text-sm text-cozetik-black/80 md:text-base">
          Des formations conçues avec des experts du secteur et reconnues sur le
          marché de l&apos;emploi.
        </p>
      </div>
    </section>
  );
}
