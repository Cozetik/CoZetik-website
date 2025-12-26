'use client'

import { ArrowRight, Clock, Award, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface FormationHeroProps {
  formation: {
    title: string
    description: string
    price: number | null
    duration: string | null
    level: string | null
    maxStudents: number | null
    studentsCount: number
    category: {
      name: string
      slug: string
    }
  }
}

export default function FormationHero({ formation }: FormationHeroProps) {
  const scrollToForm = () => {
    document.getElementById('formulaire-inscription')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const placesRestantes = formation.maxStudents
    ? formation.maxStudents - formation.studentsCount
    : null

  return (
    <section className="relative bg-cozetik-black overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-20 lg:py-32 min-h-[600px]">

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

        <div className="relative grid lg:grid-cols-[60%_40%] gap-12 items-start">

          {/* Colonne Gauche - Contenu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge Catégorie */}
            <Badge className="mb-4 bg-cozetik-green text-white font-semibold text-xs uppercase px-4 py-1.5 rounded-none">
              {formation.category.name}
            </Badge>

            {/* Titre */}
            <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight mb-6 max-w-[700px]">
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
              className="bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg px-10 py-6 rounded-none transition-all duration-300 hover:scale-105 w-full md:w-auto"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Colonne Droite - Card Info Clés */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 space-y-6">

              {/* Prix */}
              {formation.price && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Prix</p>
                  <p className="font-display font-bold text-4xl text-cozetik-green">
                    {formation.price}€ <span className="text-lg text-white/60">HT</span>
                  </p>
                </div>
              )}

              {/* Durée */}
              {formation.duration && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Durée</p>
                    <p className="text-white font-medium">{formation.duration}</p>
                  </div>
                </div>
              )}

              {/* Niveau */}
              {formation.level && (
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Niveau</p>
                    <p className="text-white font-medium">{formation.level}</p>
                  </div>
                </div>
              )}

              {/* Places restantes */}
              {placesRestantes && placesRestantes > 0 && (
                <div className="flex items-center gap-3 bg-cozetik-violet/20 -mx-8 -mb-8 mt-6 px-8 py-4">
                  <Users className="w-5 h-5 text-cozetik-violet" />
                  <div>
                    <p className="text-sm font-semibold text-cozetik-violet">
                      {placesRestantes}/{formation.maxStudents} places restantes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Autographe Violet (placeholder SVG) */}
        <div className="absolute bottom-8 left-8 opacity-30 hidden lg:block">
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
