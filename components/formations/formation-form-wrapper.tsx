"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FormationFormWrapperProps {
  formationId: string;
  formationTitle: string;
  categoryId: string;
}

export default function FormationFormWrapper({
  formationId,
  formationTitle,
  categoryId,
}: FormationFormWrapperProps) {
  return (
    <section
      id="formulaire-inscription"
      className="bg-cozetik-beige py-20 md:py-24"
    >
      <div className="w-full px-4 md:px-10 lg:px-20">
        {/* Titre */}
        <h2 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl text-cozetik-black text-center mb-12">
          INSCRIVEZ-VOUS
        </h2>

        {/* Description */}
        <p className="text-center text-lg md:text-xl font-bricolage text-cozetik-black/80 mb-12 max-w-3xl mx-auto">
          Prêt à démarrer votre formation{" "}
          <span className="font-bold">{formationTitle}</span> ? Complétez votre
          candidature en quelques minutes.
        </p>

        {/* Bouton de redirection */}
        <div className="flex justify-center">
          <Link
            href={`/candidater?categoryId=${categoryId}&formationId=${formationId}`}
            className="inline-flex items-center font-sans justify-center bg-cozetik-black px-12 py-5 text-lg uppercase text-white transition-all duration-300 hover:bg-cozetik-black/90 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Candidater maintenant
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
