'use client'

import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormationStep {
  id: string
  order: number
  title: string
  description: string
  duration: string | null
  keyPoints: string[]
}

interface FormationHeroSimpleProps {
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

export default function FormationHeroSimple({
  formation,
  steps
}: FormationHeroSimpleProps) {
  const scrollToForm = () => {
    document.getElementById('formulaire-inscription')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!carouselRef.current || steps.length === 0) return

    const handleScroll = () => {
      if (!carouselRef.current) return

      const rect = carouselRef.current.getBoundingClientRect()
      const scrollProgress = 1 - (rect.top / window.innerHeight)

      if (scrollProgress > 0 && scrollProgress < 1) {
        const newIndex = Math.min(
          Math.floor(scrollProgress * steps.length),
          steps.length - 1
        )
        setActiveIndex(Math.max(0, newIndex))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [steps.length])

  if (steps.length === 0) return null

  return (
    <section className="relative bg-cozetik-black overflow-hidden">
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
        <div className="grid lg:grid-cols-2 gap-12 items-start">

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

            {/* Progress Indicator */}
            <div className="mt-12">
              <p className="text-white/60 text-sm mb-3">Parcours de formation</p>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1 transition-all duration-300 rounded-full",
                      index <= activeIndex
                        ? "w-12 bg-cozetik-green"
                        : "w-8 bg-white/20"
                    )}
                  />
                ))}
              </div>
              <p className="text-white/80 text-sm mt-3 font-semibold">
                Étape {activeIndex + 1} / {steps.length}
              </p>
            </div>
          </motion.div>

          {/* Colonne Droite - Carousel */}
          <div ref={carouselRef} className="relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Cards Stack */}
              <div className="relative h-[520px]">
                {steps.map((step, index) => {
                  const isActive = index === activeIndex
                  const offset = (index - activeIndex) * 20
                  const zIndex = steps.length - Math.abs(index - activeIndex)

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "absolute top-0 left-0 w-full transition-all duration-500 ease-out",
                        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                      )}
                      style={{
                        transform: `translateX(${offset}px)`,
                        zIndex
                      }}
                    >
                      {/* Card */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg h-[500px] flex flex-col">
                        {/* Icon avec numéro */}
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
                        <p className="text-white/70 leading-relaxed mb-6 line-clamp-4 flex-grow">
                          {step.description}
                        </p>

                        {/* Durée */}
                        {step.duration && (
                          <div className="flex items-center gap-2 mb-4 text-white/60">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{step.duration}</span>
                          </div>
                        )}

                        {/* Key Points */}
                        {step.keyPoints.length > 0 && (
                          <ul className="space-y-2">
                            {step.keyPoints.slice(0, 3).map((point, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-cozetik-green flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-white/70 line-clamp-1">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Navigation Manuelle */}
              <div className="flex gap-3 mt-6 justify-center">
                <button
                  onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeIndex === 0}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  aria-label="Étape précédente"
                >
                  ←
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={activeIndex === steps.length - 1}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  aria-label="Étape suivante"
                >
                  →
                </button>
              </div>
            </motion.div>
          </div>
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
