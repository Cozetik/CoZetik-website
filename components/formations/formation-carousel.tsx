'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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

interface FormationCarouselProps {
  steps: FormationStep[]
  darkMode?: boolean // Pour afficher sur fond noir dans le Hero
}

export default function FormationCarousel({ steps, darkMode = false }: FormationCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // Skip GSAP on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track || steps.length === 0) return

    const scrollWidth = track.scrollWidth - window.innerWidth

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${scrollWidth + 500}`, // Extra padding
        onUpdate: (self) => {
          setProgress(self.progress * 100)
          const newIndex = Math.min(
            Math.floor(self.progress * steps.length),
            steps.length - 1
          )
          setActiveIndex(newIndex)
        }
      }
    })

    tl.to(track, {
      x: -scrollWidth,
      ease: 'none'
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [steps])

  if (steps.length === 0) {
    return null
  }

  const textColor = darkMode ? 'text-white' : 'text-cozetik-black'
  const mutedTextColor = darkMode ? 'text-white/70' : 'text-gray-600'
  const progressBg = darkMode ? 'bg-white/20' : 'bg-gray-200'
  const cardBg = darkMode ? 'bg-white/5' : 'bg-white'
  const cardBorder = darkMode ? 'border-white/10' : 'border-gray-200'

  return (
    <div
      ref={sectionRef}
      className="carousel-section overflow-hidden"
    >
      {!darkMode && (
        /* Header - Uniquement si pas en darkMode (car déjà dans le Hero) */
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-cozetik-black mb-4">
            VOTRE PARCOURS D&apos;APPRENTISSAGE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Suivez les étapes progressivement pour maîtriser tous les concepts
          </p>
        </div>
      )}

        {/* Progress Bar - Sticky on Desktop */}
        <div className={cn(
          "sticky top-20 z-40 py-5 mb-12 backdrop-blur-sm",
          darkMode ? "bg-cozetik-black/95" : "bg-white/95 shadow-sm -mx-4 px-4 md:mx-0 md:px-0"
        )}>
          <div className="max-w-3xl mx-auto">
            {/* Progress Track */}
            <div className={cn("relative h-1.5", progressBg)}>
              {/* Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cozetik-green to-[#4A7A4A] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />

              {/* Dots */}
              {steps.map((step, index) => {
                const dotPosition = (index / (steps.length - 1)) * 100
                const isCompleted = index < activeIndex
                const isActive = index === activeIndex

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300",
                      darkMode ? "border-cozetik-black" : "border-white",
                      isCompleted && "bg-cozetik-green",
                      isActive && "bg-cozetik-green ring-4 ring-cozetik-green/30",
                      !isCompleted && !isActive && (darkMode ? "bg-white/30" : "bg-gray-300")
                    )}
                    style={{ left: `${dotPosition}%` }}
                  />
                )
              })}
            </div>

            {/* Progress Text */}
            <p className={cn("text-center text-sm font-semibold mt-3", textColor)}>
              Étape {activeIndex + 1} / {steps.length}
            </p>
          </div>
        </div>

        {/* Carousel Track - Horizontal Scroll on Desktop */}
        <div
          ref={trackRef}
          className="carousel-track flex flex-col md:flex-row gap-8 md:gap-8 md:px-16"
        >
          {steps.map((step, index) => {
            const isActive = index === activeIndex
            const isCompleted = index < activeIndex
            const isLocked = index > activeIndex

            return (
              <div
                key={step.id}
                className={cn(
                  "flex-shrink-0 w-full md:w-[400px] border p-8 md:p-10 transition-all duration-400",
                  cardBg,
                  cardBorder,
                  isActive && "md:scale-105 md:shadow-2xl border-cozetik-green",
                  !isActive && "md:scale-95 opacity-60 md:grayscale-[30%]"
                )}
              >
                {/* Numéro */}
                <div className="relative mb-6">
                  <span
                    className={cn(
                      "font-display font-extrabold text-7xl md:text-8xl leading-none",
                      isCompleted && "text-cozetik-green",
                      isActive && (darkMode ? "text-white" : "text-cozetik-black"),
                      isLocked && (darkMode ? "text-white/30" : "text-gray-300")
                    )}
                  >
                    {String(step.order).padStart(2, '0')}
                  </span>
                </div>

                {/* Titre */}
                <h3 className={cn("font-display font-bold text-2xl md:text-3xl leading-tight mb-4 line-clamp-2", textColor)}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className={cn("leading-relaxed mb-6 line-clamp-4", mutedTextColor)}>
                  {step.description}
                </p>

                {/* Durée */}
                {step.duration && (
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-4 h-4 text-cozetik-green" />
                    <span className={cn("text-sm font-semibold", textColor)}>
                      {step.duration}
                    </span>
                  </div>
                )}

                {/* Key Points */}
                {step.keyPoints.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {step.keyPoints.slice(0, 3).map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-5 h-5 text-cozetik-green flex-shrink-0 mt-0.5" />
                        <span className={cn("text-sm", mutedTextColor)}>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Status Badge */}
                <div className="mt-auto pt-6">
                  <Badge
                    className={cn(
                      "rounded-none font-semibold text-xs uppercase px-4 py-1.5",
                      isCompleted && "bg-cozetik-green text-white",
                      isActive && "bg-cozetik-black text-white",
                      isLocked && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {isCompleted && "✓ Terminé"}
                    {isActive && "En cours"}
                    {isLocked && "🔒 Verrouillé"}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}
