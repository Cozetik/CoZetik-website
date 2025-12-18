import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Award className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Formations professionnelles certifiantes</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Développez vos{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              compétences
            </span>
            <br />
            avec Cozetik
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Des formations de qualité pour booster votre carrière et atteindre vos objectifs professionnels. Formez-vous avec les meilleurs experts du secteur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/formations">
                Découvrir les formations
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 text-base">
              <Link href="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Formations disponibles</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-muted-foreground">Apprenants satisfaits</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
