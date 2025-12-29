'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const values = [
  {
    title: 'INNOVATION',
    description: 'Des méthodes pédagogiques modernes, interactives et efficaces qui favorisent l\'apprentissage par la pratique',
    position: 'top-left',
  },
  {
    title: 'EXCELLENCE',
    description: 'Des formations de qualité, certifiantes et reconnues qui répondent aux standards les plus exigeants',
    position: 'top-right',
  },
  {
    title: 'OUVERTURE',
    description: 'Des formations accessibles, inclusives et bienveillantes qui accueillent tous les profils',
    position: 'bottom-left',
  },
  {
    title: 'ACCOMPAGNEMENT',
    description: 'Un suivi personnalisé de chaque apprenant parce que nous croyons aux parcours individualisés',
    position: 'bottom-right',
  },
]

export function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      // Animation du titre
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Animation de l'image centrale (uniquement sur desktop)
      if (window.innerWidth >= 1024 && imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Animation des valeurs avec stagger
      const valueElements = valuesRef.current?.querySelectorAll('.value-item')
      if (valueElements) {
        gsap.from(valueElements, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="valeurs"
      className="w-full bg-white py-16 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-2 md:px-4 lg:px-6 max-w-[1400px]">
        {/* Titre */}
        <h2
          ref={titleRef}
          className="mb-6 text-center text-3xl font-bold uppercase tracking-wide text-black md:mb-8 md:text-4xl lg:mb-12 lg:text-5xl font-display"
        >
          NOS VALEURS
        </h2>

        {/* Conteneur principal avec image centrale et valeurs autour */}
        <div className="relative">
          {/* Layout responsive avec image au centre sur desktop */}
          <div className="relative mx-auto max-w-5xl lg:min-h-[800px]">
            {/* Image centrale - masquée sur mobile et tablette, visible uniquement sur desktop */}
            <div
              ref={imageRef}
              className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:block lg:h-[600px] lg:w-[350px] lg:-translate-x-1/2 lg:-translate-y-1/2"
            >
              <Image
                src="/Image-nos-valeur.png"
                alt="Groupe de personnes dans un espace commun"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Grille des valeurs - responsive avec positionnement autour de l'image sur desktop */}
            <div
              ref={valuesRef}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-2 lg:gap-12"
            >
              {/* Top Left - Innovation */}
              <div className="value-item text-center lg:max-w-[240px] lg:pt-4 lg:text-right lg:justify-self-start">
                <h3 className="mb-3 text-xl font-bold uppercase text-black md:text-2xl font-display">
                  {values[0].title}
                </h3>
                <p className="text-base leading-relaxed text-black font-sans">
                  {values[0].description}
                </p>
              </div>

              {/* Top Right - Excellence */}
              <div className="value-item text-center lg:max-w-[240px] lg:pt-4 lg:text-left lg:justify-self-end">
                <h3 className="mb-3 text-xl font-bold uppercase text-black md:text-2xl font-display">
                  {values[1].title}
                </h3>
                <p className="text-base leading-relaxed text-black font-sans">
                  {values[1].description}
                </p>
              </div>

              {/* Bottom Left - Ouverture */}
              <div className="value-item text-center lg:max-w-[240px] lg:pb-4 lg:text-right lg:justify-self-start">
                <h3 className="mb-3 text-xl font-bold uppercase text-black md:text-2xl font-display">
                  {values[2].title}
                </h3>
                <p className="text-base leading-relaxed text-black font-sans">
                  {values[2].description}
                </p>
              </div>

              {/* Bottom Right - Accompagnement */}
              <div className="value-item text-center lg:max-w-[240px] lg:pb-4 lg:text-left lg:justify-self-end">
                <h3 className="mb-3 text-xl font-bold uppercase text-black md:text-2xl font-display">
                  {values[3].title}
                </h3>
                <p className="text-base leading-relaxed text-black font-sans">
                  {values[3].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

