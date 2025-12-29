import { CheckCircle2, Users, Award, HeadphonesIcon, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Award,
    title: 'Formations certifiantes',
    description:
      'Obtenez des certifications reconnues par les professionnels du secteur et valorisez votre parcours.',
  },
  {
    icon: Users,
    title: 'Formateurs experts',
    description:
      'Apprenez auprès de professionnels expérimentés et passionnés par leur domaine d\'expertise.',
  },
  {
    icon: TrendingUp,
    title: 'Accompagnement personnalisé',
    description:
      'Bénéficiez d\'un suivi individuel pour maximiser vos chances de réussite et atteindre vos objectifs.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support réactif',
    description:
      'Notre équipe est à votre écoute pour répondre à toutes vos questions tout au long de votre formation.',
  },
]

export function WhyCozetikSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pourquoi choisir Cozetik ?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Nous nous engageons à vous offrir la meilleure expérience de formation possible
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-none bg-gradient-to-br from-background to-muted/30 shadow-sm transition-all hover:shadow-md"
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-6 text-2xl font-bold">
                    Des résultats concrets
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Méthodologie éprouvée et actualisée régulièrement
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Accès à des ressources pédagogiques de qualité
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Exercices pratiques et mises en situation réelles
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-6 text-2xl font-bold">
                    Une flexibilité totale
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Formations en présentiel et à distance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Sessions adaptées à votre emploi du temps
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">
                        Financement CPF et OPCO disponible
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
