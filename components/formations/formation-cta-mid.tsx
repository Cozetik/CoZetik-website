"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface FormationCTAMidProps {
  rating: number | null;
  reviewsCount: number;
  studentsCount: number;
}

export default function FormationCTAMid({
  rating,
  reviewsCount,
  studentsCount,
  categoryId,
  formationId,
}: FormationCTAMidProps & { categoryId: string; formationId: string }) {
  return (
    <section className="bg-cozetik-green py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
        {/* Titre */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-10">
          PRÊT À TRANSFORMER
          <br className="hidden md:block" /> VOTRE PRODUCTIVITÉ ?
        </h2>

        {/* Bouton CTA */}
        <Button
          size="lg"
          className="bg-cozetik-black font-sans hover:bg-[#363636] text-white font-bold text-xl px-12 py-6 rounded-none transition-all duration-300 hover:scale-105 w-full md:w-1/2"
        >
          <Link
            href={`/candidater?categoryId=${categoryId}&formationId=${formationId}`}
            className="flex items-center"
          >
            COMMENCER MAINTENANT
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </Button>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-2 mt-6 font-sans text-white/90">
          {studentsCount > 0 && (
            <p className="font-semibold">
              + de {studentsCount} professionnels formés
            </p>
          )}

          {rating && reviewsCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-semibold">
                {rating}/5 ({reviewsCount} avis)
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
