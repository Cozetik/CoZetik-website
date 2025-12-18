import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Euro, ArrowRight } from 'lucide-react'

interface Formation {
  id: string
  title: string
  slug: string
  description: string
  price: number | null
  duration: string | null
  imageUrl: string | null
  category: {
    name: string
  }
}

interface FeaturedFormationsSectionProps {
  formations: Formation[]
}

export function FeaturedFormationsSection({
  formations,
}: FeaturedFormationsSectionProps) {
  if (formations.length === 0) {
    return null
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Nos formations phares
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Découvrez nos formations les plus populaires et commencez votre parcours d'apprentissage dès aujourd'hui
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {formations.map((formation) => (
            <Card
              key={formation.id}
              className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader className="p-0">
                {/* Formation Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {formation.imageUrl ? (
                    <Image
                      src={formation.imageUrl}
                      alt={formation.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <span className="text-5xl font-bold text-primary/20">
                        {formation.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute left-3 top-3">
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {formation.category.name}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-6">
                <h3 className="mb-3 text-xl font-semibold leading-tight group-hover:text-primary">
                  {formation.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {formation.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {formation.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formation.duration}</span>
                    </div>
                  )}
                  {formation.price !== null && (
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      <span>{formation.price.toFixed(2)} €</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href={`/formations/${formation.slug}`}>
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/formations">
              Voir toutes les formations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
