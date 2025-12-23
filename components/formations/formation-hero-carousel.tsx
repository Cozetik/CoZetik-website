'use client'

import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface FormationStep {
  id: string
  order: number
  title: string
  description: string
  duration: string | null
  keyPoints: string[]
}

interface FormationHeroCarouselProps {
  formation: {
    title: string
    description: string
    category: {
      name: string
      slug: string
    }
  }
  steps: FormationStep[]
}

export default function FormationHeroCarousel({
  formation,
  steps
}: FormationHeroCarouselProps) {
  const scrollToForm = () => {
    document.getElementById('formulaire-inscription')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!carouselRef.current || steps.length === 0) return

    // Auto-scroll carousel toutes les 4 secondes
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [steps.length])

  if (steps.length === 0) return null

  const currentStep = steps[activeIndex]

  return (
    <section className="relative bg-cozetik-black overflow-hidden min-h-[700px]">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-20 lg:py-32">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span>{'>'}</span>
          <Link href="/formations" className="hover:text-white transition-colors">
            Formations
          </Link>
          <span>{'>'}</span>
          <span className="text-white">{formation.category.name}</span>
        </nav>

        {/* Layout Grid 50/50 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Colonne Gauche - Contenu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge Catégorie */}
            <Badge className="mb-6 bg-cozetik-green text-white font-semibold text-xs uppercase px-4 py-1.5 rounded-none">
              {formation.category.name}
            </Badge>

            {/* Titre */}
            <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              {formation.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-[600px]">
              {formation.description}
            </p>

            {/* Bouton CTA */}
            <Button
              size="lg"
              onClick={scrollToForm}
              className="bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg px-10 py-6 rounded-none transition-all duration-300 hover:scale-105"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Colonne Droite - Carousel Cards Horizontal */}
          <motion.div
            ref={carouselRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Progress Dots */}
            <div className="flex gap-2 mb-6 justify-center lg:justify-start">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-1 transition-all duration-300 rounded-full",
                    index === activeIndex
                      ? "w-12 bg-cozetik-green"
                      : "w-8 bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Aller à l'étape ${index + 1}`}
                />
              ))}
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    {/* Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg h-[450px] flex flex-col">
                      {/* Icon Placeholder */}
                      <div className="w-16 h-16 rounded-lg bg-cozetik-green/20 flex items-center justify-center mb-6">
                        <span className="text-3xl font-display font-bold text-cozetik-green">
                          {String(step.order).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Titre */}
                      <h3 className="font-display font-bold text-2xl text-white mb-4 line-clamp-2">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/70 leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {step.description}
                      </p>

                      {/* Durée */}
                      {step.duration && (
                        <div className="flex items-center gap-2 mb-4 text-white/60">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{step.duration}</span>
                        </div>
                      )}

                      {/* Key Points (Max 2) */}
                      {step.keyPoints.length > 0 && (
                        <ul className="space-y-2">
                          {step.keyPoints.slice(0, 2).map((point, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-cozetik-green flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-white/70 line-clamp-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows (optionnel) */}
            <div className="flex gap-3 mt-6 justify-center lg:justify-start">
              <button
                onClick={() => setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Étape précédente"
              >
                ←
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % steps.length)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Étape suivante"
              >
                →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Autographe Violet */}
        <div className="absolute bottom-8 left-8 opacity-20 hidden lg:block">
          <svg
            width="150"
            height="40"
            viewBox="0 0 150 40"
            className="stroke-cozetik-violet-signature"
            style={{ strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
          >
            <path d="M 10 20 Q 40 10 70 20 T 130 20" />
          </svg>
        </div>
      </div>
    </section>
  )
}
