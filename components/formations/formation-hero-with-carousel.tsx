'use client'

import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FormationCarousel from './formation-carousel'

interface FormationStep {
  id: string
  order: number
  title: string
  description: string
  duration: string | null
  keyPoints: string[]
}

interface FormationHeroWithCarouselProps {
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

export default function FormationHeroWithCarousel({
  formation,
  steps
}: FormationHeroWithCarouselProps) {
  const scrollToForm = () => {
    document.getElementById('formulaire-inscription')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

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

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge Catégorie */}
          <Badge className="mb-6 bg-cozetik-green text-white font-semibold text-xs uppercase px-4 py-1.5 rounded-none">
            {formation.category.name}
          </Badge>

          {/* Titre */}
          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight mb-6 max-w-[900px] mx-auto">
            {formation.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-[700px] mx-auto">
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

        {/* Carousel intégré dans le Hero */}
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FormationCarousel steps={steps} darkMode />
          </motion.div>
        )}

        {/* Autographe Violet (placeholder SVG) */}
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
