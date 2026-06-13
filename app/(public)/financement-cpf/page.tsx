import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { VALIDATED_BY_SLUG } from "@/lib/certifications";
import { CpfFinanceButton } from "@/components/formations/certification-status";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Financer sa formation avec le CPF | Cozetik",
  description:
    "Cozetik est un organisme de formation certifié Qualiopi à Bordeaux. Financez nos formations certifiantes éligibles au CPF via Mon Compte Formation.",
  alternates: { canonical: `${baseUrl}/financement-cpf` },
  openGraph: {
    title: "Financer sa formation avec le CPF | Cozetik",
    description:
      "Formations certifiantes éligibles au CPF, finançables via Mon Compte Formation. Organisme certifié Qualiopi à Bordeaux.",
    url: `${baseUrl}/financement-cpf`,
    images: ["/og-image.jpg"],
  },
};

const etapes = [
  {
    n: "1",
    titre: "Connectez-vous à Mon Compte Formation",
    texte:
      "Rendez-vous sur moncompteformation.gouv.fr et identifiez-vous avec FranceConnect+. Vous voyez le montant de droits CPF disponible.",
  },
  {
    n: "2",
    titre: "Choisissez votre formation Cozetik",
    texte:
      "Cliquez sur « Financer avec mon CPF » ci-dessous pour ouvrir directement la formation sur Mon Compte Formation.",
  },
  {
    n: "3",
    titre: "Validez votre inscription",
    texte:
      "Mobilisez vos droits CPF en quelques clics. Si le solde ne couvre pas tout, un reste à charge peut être réglé en ligne.",
  },
  {
    n: "4",
    titre: "Démarrez votre parcours",
    texte:
      "Nous vous accompagnons jusqu'au passage de la certification, à distance comme en présentiel.",
  },
];

export default function FinancementCpfPage() {
  const formationsCpf = Object.entries(VALIDATED_BY_SLUG);

  return (
    <main className="bg-cozetik-beige">
      {/* Hero */}
      <section className="bg-cozetik-black px-4 py-20 md:px-10 md:py-28 lg:px-20">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
            <BadgeCheck className="h-4 w-4 text-cozetik-green" aria-hidden="true" />
            Organisme certifié Qualiopi
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold text-white md:text-6xl">
            Financez votre formation avec votre CPF
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base text-white/80 md:text-lg">
            Cozetik est un organisme de formation certifié <strong>Qualiopi</strong>{" "}
            à Bordeaux. Nos formations certifiantes sont éligibles au{" "}
            <strong>Compte Personnel de Formation</strong> et finançables
            directement via Mon Compte Formation — sans avance de frais.
          </p>
        </div>
      </section>

      {/* Formations éligibles */}
      <section className="px-4 py-16 md:px-10 md:py-20 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-bold text-cozetik-black md:text-4xl">
            Nos formations éligibles au CPF
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {formationsCpf.map(([slug, cert]) => (
              <div
                key={slug}
                className="flex flex-col gap-4 border-2 border-cozetik-black bg-white p-6 md:p-8"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cozetik-green/50 px-3 py-1 text-xs font-semibold text-cozetik-black">
                  <BadgeCheck className="h-3.5 w-3.5 text-cozetik-green" aria-hidden="true" />
                  Éligible CPF · {cert.rsCode}
                </span>
                <h3 className="font-display text-xl font-bold text-cozetik-black md:text-2xl">
                  {cert.officialTitle}
                </h3>
                <p className="font-sans text-sm text-cozetik-black/70">
                  Certification{" "}
                  <a
                    href={cert.franceCompetencesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline decoration-cozetik-green decoration-2 underline-offset-2"
                  >
                    {cert.rsCode}
                  </a>{" "}
                  · Certificateur {cert.certifier} · Enregistrée à France
                  Compétences.
                </p>
                <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                  <CpfFinanceButton slug={slug} className="flex-1" />
                  <Link
                    href={`/formations/${slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-cozetik-black px-6 py-3 font-sans text-base font-semibold text-cozetik-black transition-colors hover:bg-cozetik-black hover:text-white"
                  >
                    La formation
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-sans text-sm text-cozetik-black/70">
            D&apos;autres certifications (intelligence artificielle, création de
            site internet, micro-entreprise) sont{" "}
            <strong>en cours d&apos;enregistrement</strong> : leur éligibilité CPF
            sera publiée ici dès leur validation officielle.
          </p>
        </div>
      </section>

      {/* Étapes */}
      <section className="bg-white px-4 py-16 md:px-10 md:py-20 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-bold text-cozetik-black md:text-4xl">
            Comment ça marche ?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e) => (
              <div key={e.n} className="flex flex-col gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cozetik-green/15 font-display text-2xl font-bold text-cozetik-green">
                  {e.n}
                </div>
                <h3 className="font-display text-lg font-bold text-cozetik-black">
                  {e.titre}
                </h3>
                <p className="font-sans text-sm text-cozetik-black/70">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réassurance + CTA */}
      <section className="px-4 py-16 md:px-10 md:py-20 lg:px-20">
        <div className="container mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <div className="relative h-24 w-64">
            <Image
              src="/qualiopi.png"
              alt="Certification Qualiopi"
              fill
              className="object-contain"
            />
          </div>
          <p className="font-sans text-base text-cozetik-black/80 md:text-lg">
            La certification Qualiopi atteste de la qualité de nos processus de
            formation et conditionne l&apos;accès aux financements publics et
            mutualisés, dont le CPF.
          </p>
          <Link
            href="/candidater"
            className="inline-flex items-center justify-center gap-2 bg-cozetik-green px-8 py-4 font-sans text-lg font-semibold text-white transition-all hover:bg-[#4A7A4A]"
          >
            Être accompagné dans ma démarche
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
