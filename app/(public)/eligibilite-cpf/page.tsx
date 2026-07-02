import Image from "next/image";
import { Metadata } from "next";
import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import { EligibiliteForm } from "@/components/eligibilite/eligibilite-form";
import {
  PARTICIPATION_DEPUIS,
  PARTICIPATION_FORFAITAIRE,
} from "@/lib/cpf-diagnostic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Testez votre éligibilité CPF en 2 minutes",
  description:
    "Répondez à 3 questions et découvrez si votre CPF peut financer une formation certifiante Cozetik (création d'entreprise, réseaux sociaux). Diagnostic gratuit, organisme certifié Qualiopi.",
  alternates: { canonical: `${baseUrl}/eligibilite-cpf` },
  openGraph: {
    title: "Testez votre éligibilité CPF en 2 minutes | Cozetik",
    description:
      "3 questions pour savoir si votre CPF finance votre formation certifiante. Diagnostic gratuit et sans engagement.",
    url: `${baseUrl}/eligibilite-cpf`,
    images: ["/og-image.jpg"],
  },
};

const points = [
  {
    icon: Clock,
    text: "2 minutes, 3 questions, résultat immédiat",
  },
  {
    icon: BadgeCheck,
    text: "Certifications enregistrées à France Compétences (RS7004 · RS7200)",
  },
  {
    icon: ShieldCheck,
    text: "Organisme certifié Qualiopi — diagnostic gratuit et sans engagement",
  },
];

export default function EligibiliteCpfPage() {
  return (
    <main className="bg-cozetik-beige">
      {/* Hero */}
      <section className="bg-cozetik-black px-4 py-16 md:px-10 md:py-24 lg:px-20">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
            <BadgeCheck className="h-4 w-4 text-cozetik-green" aria-hidden="true" />
            Diagnostic gratuit · 2 minutes
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold text-white md:text-6xl">
            Votre CPF peut-il financer votre formation&nbsp;?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base text-white/80 md:text-lg">
            Répondez à 3 questions : nous vous disons si vos droits CPF peuvent
            financer une formation certifiante Cozetik, et laquelle correspond à
            votre projet.
          </p>
        </div>
      </section>

      {/* Diagnostic */}
      <section className="px-4 py-12 md:px-10 md:py-16 lg:px-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <div className="border-2 border-cozetik-black bg-cozetik-beige p-6 md:p-10">
            <EligibiliteForm />
          </div>
          <aside className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              {points.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 bg-white p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cozetik-green" aria-hidden="true" />
                  <span className="font-sans text-sm text-cozetik-black/80">{text}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center bg-white p-6">
              <div className="relative h-20 w-52">
                <Image
                  src="/qualiopi.png"
                  alt="Certification Qualiopi"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="font-sans text-sm leading-relaxed text-cozetik-black/75">
              Le CPF finance votre formation dans la limite de vos droits
              disponibles. Une participation forfaitaire légale de{" "}
              {PARTICIPATION_FORFAITAIRE} par dossier s&apos;applique depuis le{" "}
              {PARTICIPATION_DEPUIS} (décret n°&nbsp;2024-394 modifié) — sauf
              pour les demandeurs d&apos;emploi et en cas d&apos;abondement de
              votre employeur.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
