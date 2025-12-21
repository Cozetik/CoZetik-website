import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Users, Award, TrendingUp, Heart, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Découvrez Cozetik, votre partenaire pour des formations professionnelles de qualité. Notre mission, nos valeurs et notre équipe d\'experts.',
  openGraph: {
    title: 'À propos de Cozetik - Notre mission et nos valeurs',
    description:
      'Cozetik, partenaire de confiance pour développer vos compétences. Formations de qualité avec des experts reconnus.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/a-propos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Cozetik - Notre mission',
    description: 'Formations professionnelles de qualité avec des experts.',
    images: ['/og-image.jpg'],
  },
}

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Nous nous engageons à fournir des formations de la plus haute qualité, avec des contenus actualisés et des formateurs experts.',
  },
  {
    icon: Heart,
    title: 'Accompagnement',
    description:
      'Chaque apprenant bénéficie d\'un suivi personnalisé pour garantir sa réussite et l\'atteinte de ses objectifs.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Nous adoptons les dernières méthodes pédagogiques et technologies pour offrir une expérience d\'apprentissage optimale.',
  },
  {
    icon: Users,
    title: 'Communauté',
    description:
      'Nous créons un réseau de professionnels qui partagent leurs connaissances et s\'enrichissent mutuellement.',
  },
]

const stats = [
  { label: 'Années d\'expérience', value: '10+' },
  { label: 'Formations disponibles', value: '50+' },
  { label: 'Apprenants formés', value: '1000+' },
  { label: 'Taux de satisfaction', value: '95%' },
]

export default function AProposPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              À propos de Cozetik
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Votre partenaire de confiance pour développer vos compétences et
              atteindre vos objectifs professionnels.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Notre mission</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Chez Cozetik, nous croyons que la formation professionnelle est un
                levier essentiel pour la réussite individuelle et collective. Notre
                mission est de rendre accessible des formations de qualité, adaptées
                aux besoins du marché et aux aspirations de chacun.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-semibold">Notre vision</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Devenir la référence en matière de formation professionnelle en
                    proposant des parcours innovants, personnalisés et en phase avec
                    les évolutions du monde du travail.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-semibold">Notre approche</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Une pédagogie active basée sur la pratique, l&apos;accompagnement
                    personnalisé et la mise en situation réelle pour garantir une
                    montée en compétences efficace et durable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nos valeurs</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="border-none bg-background shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Cozetik en chiffres</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Des résultats concrets qui témoignent de notre engagement
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="mb-2 text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Notre équipe</h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Une équipe passionnée de formateurs experts, pédagogues et
              professionnels du secteur, dédiée à votre réussite. Chaque membre de
              notre équipe apporte son expertise et son expérience pour vous offrir
              les meilleures formations possibles.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
              >
                Nous contacter
              </a>
              <Link
                href="/formations"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Découvrir nos formations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
