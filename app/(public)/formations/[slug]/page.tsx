import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InscriptionForm } from '@/components/formations/inscription-form'
import {
  Clock,
  Euro,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface FormationPageProps {
  params: Promise<{ slug: string }>
}

async function getFormation(slug: string) {
  try {
    const formation = await prisma.formation.findFirst({
      where: {
        slug,
        visible: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        sessions: {
          where: {
            available: true,
            startDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
      },
    })

    return formation
  } catch (error) {
    console.error('Error fetching formation:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: FormationPageProps): Promise<Metadata> {
  const { slug } = await params
  const formation = await getFormation(slug)

  if (!formation) {
    return {
      title: 'Formation non trouvée | Cozetik',
    }
  }

  const title = formation.title.length > 60 ? formation.title.substring(0, 57) + '...' : formation.title
  const description = formation.description?.length > 160
    ? formation.description.substring(0, 157) + '...'
    : formation.description || `Découvrez notre formation ${formation.title} et développez vos compétences professionnelles.`

  return {
    title,
    description,
    openGraph: {
      title: `${formation.title} | Cozetik`,
      description,
      images: formation.imageUrl ? [formation.imageUrl] : ['/og-image.jpg'],
      url: `https://cozetik.com/formations/${formation.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formation.title} | Cozetik`,
      description,
      images: formation.imageUrl ? [formation.imageUrl] : ['/og-image.jpg'],
    },
  }
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params
  const formation = await getFormation(slug)

  if (!formation) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section with Image */}
      <section className="relative h-[400px] w-full bg-muted">
        {formation.imageUrl ? (
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="h-24 w-24 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <Badge variant="secondary" className="mb-4">
              {formation.category.name}
            </Badge>
            <h1 className="text-4xl font-bold md:text-5xl">{formation.title}</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Content */}
            <div className="lg:col-span-2">
              {/* Quick Info */}
              <div className="mb-8 flex flex-wrap gap-6">
                {formation.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">{formation.duration}</span>
                  </div>
                )}
                {formation.price !== null && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {formation.price.toFixed(2)} €
                    </span>
                  </div>
                )}
                {formation.sessions.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {formation.sessions.length} session
                      {formation.sessions.length > 1 ? 's' : ''} disponible
                      {formation.sessions.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Description</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {formation.description}
                </p>
              </div>

              <Separator className="my-8" />

              {/* Program */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Programme de la formation</h2>
                <div
                  className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-muted-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: formation.program }}
                />
              </div>

              {/* Sessions */}
              {formation.sessions.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <div className="mb-8">
                    <h2 className="mb-6 text-2xl font-bold">
                      Prochaines sessions disponibles
                    </h2>
                    <div className="space-y-4">
                      {formation.sessions.map((session) => (
                        <Card key={session.id}>
                          <CardContent className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                              {/* Date Range */}
                              <div className="flex items-start gap-3">
                                <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                <div>
                                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                                    Dates
                                  </div>
                                  <div className="font-semibold">
                                    {format(new Date(session.startDate), 'PPP', {
                                      locale: fr,
                                    })}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    au{' '}
                                    {format(new Date(session.endDate), 'PPP', {
                                      locale: fr,
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Location */}
                              {session.location && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                      Lieu
                                    </div>
                                    <div className="font-semibold">
                                      {session.location}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Max Seats */}
                              {session.maxSeats && (
                                <div className="flex items-start gap-3">
                                  <Users className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                                      Places disponibles
                                    </div>
                                    <div className="font-semibold">
                                      {session.maxSeats} places
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Benefits */}
              <Separator className="my-8" />
              <div>
                <h2 className="mb-6 text-2xl font-bold">
                  Ce que vous allez apprendre
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Expertise reconnue et certifiée',
                    'Accompagnement personnalisé',
                    'Supports de cours complets',
                    'Accès à vie aux ressources',
                    'Certificat de fin de formation',
                    'Réseau professionnel',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Inscription Form */}
            <div className="lg:col-span-1">
              <InscriptionForm
                formationId={formation.id}
                formationTitle={formation.title}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
