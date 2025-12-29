"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface FormationStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: string | null;
  keyPoints: string[];
}

interface FormationHeroEffortelProps {
  formation: {
    title: string;
    description: string;
    category: {
      name: string;
      slug: string;
    };
  };
  steps: FormationStep[];
}

export default function FormationHeroEffortel({
  formation,
  steps,
}: FormationHeroEffortelProps) {
  const scrollToForm = () => {
    document.getElementById("formulaire-inscription")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      !carouselRef.current ||
      steps.length <= 1
    )
      return;

    const container = containerRef.current;
    const carousel = carouselRef.current;

    // Largeur totale à scroller (basée sur le nombre de cards)
    const cardWidth = 450; // Largeur d'une card + gap
    const totalScrollDistance = cardWidth * (steps.length - 1);

    const mm = gsap.matchMedia();

    // Animation uniquement sur Desktop (lg et plus)
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${totalScrollDistance * 3}`, // Distance de scroll (multiplié pour plus de fluidité)
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = self.progress * 100;
            setProgress(prog);

            // Calculer l'index actif basé sur la progression
            const index = Math.min(
              Math.floor(self.progress * steps.length),
              steps.length - 1
            );
            setActiveIndex(index);
          },
        },
      });

      // Animation du carousel vers la gauche
      tl.to(carousel, {
        x: -totalScrollDistance,
        ease: "none",
      });
    });

    return () => {
      mm.revert();
    };
  }, [steps.length]);

  if (steps.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative bg-cozetik-black overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-20 lg:py-32 min-h-screen flex flex-col justify-center">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm font-sans text-white/60 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span>{">"}</span>
          <Link
            href="/formations"
            className="hover:text-white transition-colors"
          >
            Formations
          </Link>
          <span>{">"}</span>
          <span className="text-white">{formation.category.name}</span>
        </nav>

        {/* Layout Grid Responsive: 1 col mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-start lg:items-center">
          {/* Colonne Gauche - Contenu (sticky seulement sur desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            {/* Badge Catégorie */}
            <Badge className="mb-6 font-sans bg-cozetik-green text-white font-semibold text-xs uppercase px-4 py-1.5 rounded-none">
              {formation.category.name}
            </Badge>

            {/* Titre */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              {formation.title}
            </h1>

            {/* Description */}
            <p className="text-base font-sans md:text-lg text-white/80 leading-relaxed mb-8 max-w-[600px]">
              {formation.description}
            </p>

            {/* Bouton CTA */}
            <Button
              size="lg"
              onClick={scrollToForm}
              className="w-full md:w-auto bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg font-sans px-10 py-6 rounded-none transition-all duration-300 hover:scale-105 mb-12"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Progress Indicator - Masqué sur mobile */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/60 text-sm font-sans">
                  Parcours de formation
                </p>
                <p className="text-white/80 text-sm font-sans font-semibold">
                  {activeIndex + 1}/{steps.length}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-none overflow-hidden mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-cozetik-green transition-all duration-300 rounded-none"
                  style={{
                    width: `${(activeIndex / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 rounded-none transition-all duration-300",
                      index <= activeIndex
                        ? "w-8 bg-cozetik-green"
                        : "w-6 bg-white/20"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Hint */}
            <p className="text-white/40 text-sm mt-8 hidden font-sans lg:block">
              ↓ Scrollez pour découvrir le parcours
            </p>
          </motion.div>

          {/* Colonne Droite - Carousel Horizontal */}
          <div className="relative lg:h-[600px] flex items-center">
            {/* MODIFICATION: overflow-x-auto sur mobile, overflow-hidden sur desktop */}
            <div className="w-full overflow-x-auto lg:overflow-hidden pb-8 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full"
              >
                {/* Carousel Track */}
                {/* MODIFICATION: Ajout de padding horizontal sur mobile pour l'esthétique */}
                <div
                  ref={carouselRef}
                  className="flex gap-4 md:gap-8 px-4 lg:px-0"
                >
                  {steps.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isPast = index < activeIndex;
                    const isFuture = index > activeIndex;

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "flex-shrink-0 w-[85vw] md:w-[420px] snap-center transition-all duration-500",
                          isActive && "scale-100 opacity-100",
                          (isPast || isFuture) && "lg:scale-90 lg:opacity-40"
                        )}
                      >
                        {/* Card */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-10 pt-12 rounded-none min-h-[480px] md:min-h-[560px] flex flex-col relative overflow-hidden">
                          {/* Background Gradient */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-cozetik-green/10 blur-3xl rounded-none" />

                          {/* Icon avec numéro */}
                          <div className="relative w-16 h-16 rounded-none bg-gradient-to-br from-cozetik-green/30 to-cozetik-green/10 flex items-center justify-center mb-6">
                            <span className="text-3xl font-display font-bold text-cozetik-green">
                              {String(step.order).padStart(2, "0")}
                            </span>
                          </div>

                          {/* Titre */}
                          <h3 className="relative font-display  text-2xl md:text-3xl text-white mb-4 leading-tight">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="relative font-sans text-white/70 leading-relaxed mb-6 flex-grow line-clamp-4">
                            {step.description}
                          </p>

                          {/* Durée */}
                          {step.duration && (
                            <div className="relative flex items-center gap-2 mb-4 text-white/60 bg-white/5 rounded-none px-3 py-2 w-fit">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-sans font-medium">
                                {step.duration}
                              </span>
                            </div>
                          )}

                          {/* Key Points */}
                          {step.keyPoints.length > 0 && (
                            <ul className="relative space-y-2 md:space-y-2.5">
                              {step.keyPoints.slice(0, 3).map((point, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5 font-sans"
                                >
                                  <Check className="w-4 h-4 text-cozetik-green flex-shrink-0 mt-0.5" />
                                  <span className="text-xs md:text-sm text-white/70 line-clamp-1">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Autographe Violet */}
        <div className="absolute bottom-8 left-8 opacity-20 hidden lg:block">
          <svg
            width="150"
            height="40"
            viewBox="0 0 150 40"
            className="stroke-cozetik-violet-signature"
            style={{ strokeWidth: 2, fill: "none", strokeLinecap: "round" }}
          >
            <path d="M 10 20 Q 40 10 70 20 T 130 20" />
          </svg>
        </div>
      </div>
    </section>
  );
}
