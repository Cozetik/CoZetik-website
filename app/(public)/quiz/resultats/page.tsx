'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, Heart, Sparkles, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react'

interface RecommendationResponse {
  profil_analysis: string
  principal_program: {
    name: string
    reason: string
  }
  complementary_modules: Array<{
    name: string
    reason: string
  }>
  motivation_message: string
}

export default function QuizResultatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        // Récupérer les réponses du localStorage
        const answersJson = localStorage.getItem('quiz_answers')

        if (!answersJson) {
          setError('Aucune réponse trouvée. Veuillez refaire le quiz.')
          setLoading(false)
          return
        }

        const answers = JSON.parse(answersJson)

        // Appeler l'API
        const response = await fetch('/api/quiz/recommandation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la recommandation')
        }

        const data = await response.json()
        setRecommendation(data)
      } catch (err) {
        console.error('Error fetching recommendation:', err)
        setError('Une erreur est survenue. Veuillez réessayer.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendation()
  }, [])

  if (loading) {
    return (
      <div className="bg-white font-sans">
        {/* Hero Skeleton */}
        <section className="relative bg-cozetik-black pb-10">
          <div className="container mx-auto px-20">
            <div className="relative">
              <div className="relative w-fit overflow-hidden bg-cozetik-black pl-[70px] pr-[150px] py-[100px] translate-y-40 md:translate-y-60">
                <Skeleton className="h-20 w-96 mb-6 bg-gray-700" />
                <Skeleton className="h-6 w-80 bg-gray-700" />
              </div>
            </div>
          </div>
        </section>

        <div className="pb-16 pt-50 md:pt-60">
          <div className="container mx-auto px-20 max-w-5xl space-y-12">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !recommendation) {
    return (
      <div className="bg-white font-sans min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-20 max-w-2xl text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              {error || 'Une erreur est survenue'}
            </h2>
          </div>
          <Button
            onClick={() => router.push('/quiz')}
            className="bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg px-10 py-6 rounded-none"
            style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Refaire le quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white font-sans">
      {/* 1. Hero Section - Fond Noir */}
      <section className="relative bg-cozetik-black pb-10">
        <div className="container mx-auto px-20">
          <div className="relative">
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-none bg-cozetik-violet opacity-30 blur-3xl"></div>
            <div className="relative w-fit overflow-hidden bg-cozetik-black pl-[70px] pr-[150px] py-[100px] translate-y-40 md:translate-y-60">
              <h1 className="mb-6 text-5xl font-extrabold text-white md:text-6xl lg:text-8xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Votre parcours personnalisé
              </h1>
              <p className="font-sans max-w-4xl text-lg leading-relaxed text-white md:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Basé sur votre profil et vos objectifs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Profil Analysis - Fond Beige */}
      <section className="bg-cozetik-beige py-20 md:py-24 pt-50 md:pt-60">
        <div className="container mx-auto px-20 max-w-5xl">
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-none bg-cozetik-violet/20 flex items-center justify-center">
              <Brain className="h-8 w-8 text-cozetik-violet" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-cozetik-black mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Votre profil
              </h2>
            </div>
          </div>
          <div className="border-l-4 border-cozetik-green pl-8 py-4 bg-white/50 rounded-r-lg">
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed italic" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              {recommendation.profil_analysis}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Section Formation Principale - Fond Blanc */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-20 max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-cozetik-green text-white font-semibold text-sm uppercase px-6 py-2 rounded-none">
              Recommandation prioritaire
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-cozetik-black mb-6" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              {recommendation.principal_program.name}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              {recommendation.principal_program.reason}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg px-12 py-7 rounded-none transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              <Link href="/candidater">
                <CheckCircle className="mr-2 h-5 w-5" />
                Je m&apos;inscris
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Section Modules Complémentaires - Fond Beige */}
      {recommendation.complementary_modules.length > 0 && (
        <section className="bg-cozetik-beige py-20 md:py-24">
          <div className="container mx-auto px-20 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-cozetik-black mb-12 text-center" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Modules complémentaires recommandés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendation.complementary_modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-none shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-cozetik-violet"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-cozetik-black mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                    {module.name}
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                    {module.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Section Message Motivation - Fond Vert */}
      <section className="bg-cozetik-green py-20 md:py-24">
        <div className="container mx-auto px-20 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-none bg-white/20 mb-8">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed italic" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              &ldquo;{recommendation.motivation_message}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 6. Section CTA Final - Fond Noir */}
      <section className="bg-cozetik-black py-20 md:py-24">
        <div className="container mx-auto px-20 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Prêt à commencer ?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Lancez-vous dès maintenant dans votre parcours de formation personnalisé
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="bg-cozetik-green hover:bg-[#4A7A4A] text-white font-semibold text-lg px-12 py-7 rounded-none transition-all duration-300 hover:scale-105 w-full md:w-auto"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              <Link href="/candidater">
                Candidater maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cozetik-black font-semibold text-lg px-12 py-7 rounded-none transition-all duration-300 w-full md:w-auto"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              <Link href="/quiz">
                <RefreshCw className="mr-2 h-5 w-5" />
                Refaire le quiz
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
