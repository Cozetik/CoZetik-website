"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

// Hook pour éviter les warnings SSR avec useLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Formation = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: Category | null;
};

function Hero() {
  return (
    <section className="relative bg-[#ADA6DB] pb-10 ">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dqmsyqdc4/image/upload/v1767109647/cozetik/image-formation.jpg"
          alt="Formations Cozetik"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay violet */}
        <div className="absolute inset-0 bg-[#ADA6DB] opacity-50" />
      </div>

      <div className="container relative z-10 px-6 mx-auto md:px-12 lg:px-20">
        <div className="relative">
          <div className="absolute -right-16 top-2 h-64 w-64 rounded-none bg-[#ADA6DB] opacity-30 blur-3xl" />

          <div className="relative max-w-5xl translate-y-24  bg-[#262626] px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
            <h1
              className="mb-4 text-4xl font-extrabold text-white font-bricolage md:text-6xl lg:text-8xl"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Nos formations
            </h1>
            <p
              className="mt-4 font-sans text-lg text-white md:text-xl"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Des parcours post-bac adaptés à vos ambitions professionnelles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Filters({
  selectedCategory,
  onCategoryChange,
  categories,
}: {
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  categories: Category[];
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryChange("all")}
          className={`rounded-none border border-[#262626] px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors md:px-6 ${
            selectedCategory === "all"
              ? "bg-[#262626] text-white"
              : "bg-white text-[#262626] hover:bg-[#ADA6DB]/10"
          }`}
        >
          Tous
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-none border border-[#262626] px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors md:px-6 ${
              selectedCategory === category.id
                ? "bg-[#262626] text-white"
                : "bg-white text-[#262626] hover:bg-[#ADA6DB]/10"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormationCard({ formation }: { formation: Formation }) {
  return (
    <div className="group flex h-full flex-col bg-white border-2 border-[#262626] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 transition-all duration-300 hover:bg-[#262626]">
      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ADA6DB] transition-colors duration-300 break-words">
        {formation.category?.name || "Formation"}
      </div>
      <h3 className="mt-4 font-bricolage text-xl sm:text-2xl md:text-3xl font-extrabold text-[#262626] transition-colors duration-300 group-hover:text-white break-words">
        {formation.title}
      </h3>
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#262626]/70 transition-colors duration-300 group-hover:text-white/80 break-words">
        {formation.description || ""}
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2 pt-6 sm:pt-8 mt-auto">
        <div className="text-xs sm:text-sm uppercase tracking-wide text-[#262626]/60 transition-colors duration-300 group-hover:text-white/60">
          En savoir plus
        </div>
        <Link
          href={`/formations/${formation.slug}`}
          className="flex items-center justify-center gap-2 bg-[#262626] px-4 py-3 text-sm sm:text-base font-semibold uppercase text-white transition-all duration-300 group-hover:bg-[#ADA6DB] group-hover:text-white whitespace-nowrap"
        >
          Découvrir
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
}

interface FormationsClientPageProps {
  formations: Formation[];
  categories: Category[];
}

export default function FormationsClientPage({
  formations,
  categories,
}: FormationsClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Initialisé à false pour ne pas afficher le rideau par défaut
  const [showTransitionCurtain, setShowTransitionCurtain] = useState(false);

  // Utilisation de useLayoutEffect pour vérifier le flag AVANT le rendu visuel
  useIsomorphicLayoutEffect(() => {
    // Vérifie si le flag posé par la page d'accueil est présent
    const shouldShow = sessionStorage.getItem("from-home-explore") === "true";

    if (shouldShow) {
      // Si oui, on active le rideau immédiatement
      setShowTransitionCurtain(true);
      // On nettoie le flag pour les futurs rechargements
      sessionStorage.removeItem("from-home-explore");

      // On lance le timer pour retirer le rideau (animation de sortie)
      const timer = setTimeout(() => {
        setShowTransitionCurtain(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredFormations = useMemo(() => {
    if (selectedCategory === "all") return formations;
    return formations.filter((f) => f.category?.id === selectedCategory);
  }, [selectedCategory, formations]);

  return (
    <div className="bg-[#FDFDFD] font-sans relative">
      {showTransitionCurtain && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-br from-[#ada6db] to-[#262626] overlay-slide-out" />
        </div>
      )}

      <Hero />

      <section className="pt-32 pb-16 md:pb-24 md:pt-40">
        <div className="container px-6 mx-auto md:px-12 lg:px-20">
          <div className="flex flex-col gap-10">
            <Filters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 max-w-full overflow-hidden">
              {filteredFormations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}

              {filteredFormations.length === 0 && (
                <p className="col-span-full py-10 text-center text-gray-500">
                  Aucune formation trouvée dans cette catégorie.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
