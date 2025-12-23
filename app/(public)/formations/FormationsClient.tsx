"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
    <section className="relative bg-[#ADA6DB] pb-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative">
          <div className="absolute -right-16 top-2 h-64 w-64 rounded-full bg-[#ADA6DB] opacity-30 blur-3xl" />

          <div className="relative max-w-5xl translate-y-24 overflow-hidden bg-[#262626] px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
            <h1 className="mb-4 font-['Bricolage_Grotesque'] uppercase text-4xl font-extrabold text-white md:text-6xl lg:text-8xl">
              Nos formations
            </h1>
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
              : "bg-white text-[#262626] hover:bg-[#f3f0fa]"
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
                : "bg-white text-[#262626] hover:bg-[#f3f0fa]"
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
    <div className="flex h-full flex-col bg-[#262626] px-8 py-10 text-white">
      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ADA6DB]">
        {formation.category?.name || "Formation"}
      </div>
      <h3 className="mt-4 font-['Bricolage_Grotesque'] text-2xl font-extrabold md:text-3xl">
        {formation.title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-white/80">
        {formation.description || ""}
      </p>
      <div className="mt-auto flex items-center justify-between pt-8">
        <div className="text-sm uppercase tracking-wide text-white/60">
          En savoir plus
        </div>
        <Link
          href={`/formations/${formation.slug}`}
          className="flex items-center gap-2 bg-[#ADA6DB] px-4 py-3 text-base font-semibold uppercase text-white transition-colors hover:bg-[#bdb7e3]"
        >
          Découvrir
          <ArrowRight className="h-4 w-4" />
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

  const [showTransitionCurtain, setShowTransitionCurtain] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransitionCurtain(false);
    }, 800);
    return () => clearTimeout(timer);
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

      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col gap-10">
            <Filters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredFormations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}

              {filteredFormations.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-10">
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
