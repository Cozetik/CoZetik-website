import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Handshake, Globe } from 'lucide-react'

async function getPartners() {
  try {
    const partners = await prisma.partner.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })
    return partners
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Nos Partenaires | Cozetik',
  description:
    'Découvrez les entreprises et organisations qui nous font confiance et avec qui nous collaborons pour vous offrir des formations de qualité.',
}

export default async function PartnersPage() {
  const partners = await getPartners()

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Handshake className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Nos partenaires de confiance
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Nous collaborons avec des entreprises et organisations de renom pour
              vous garantir des formations de qualité et adaptées aux besoins du
              marché.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {partners.length > 0 ? (
            <>
              {/* Partners Count */}
              <div className="mb-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {partners.length} partenaire{partners.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {partners.map((partner) => {
                  const CardWrapper = partner.websiteUrl ? 'a' : 'div'
                  const cardProps = partner.websiteUrl
                    ? {
                        href: partner.websiteUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'group block',
                      }
                    : { className: 'group' }

                  return (
                    <CardWrapper key={partner.id} {...cardProps}>
                      <Card className="h-full transition-all hover:shadow-lg">
                        <CardHeader className="pb-4">
                          {/* Logo */}
                          <div className="mb-4 flex h-32 items-center justify-center rounded-md bg-muted p-4">
                            {partner.logoUrl ? (
                              <div className="relative h-full w-full">
                                <Image
                                  src={partner.logoUrl}
                                  alt={partner.name}
                                  fill
                                  className="object-contain grayscale transition-all group-hover:grayscale-0"
                                />
                              </div>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-center text-2xl font-bold text-muted-foreground">
                                  {partner.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <CardTitle className="flex items-center justify-between gap-2">
                            <span className="line-clamp-1 group-hover:text-primary">
                              {partner.name}
                            </span>
                            {partner.websiteUrl && (
                              <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            )}
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          {/* Description */}
                          {partner.description && (
                            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                              {partner.description}
                            </CardDescription>
                          )}

                          {/* Website Link */}
                          {partner.websiteUrl && (
                            <div className="mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full gap-2"
                                asChild
                              >
                                <span className="flex items-center justify-center">
                                  <Globe className="h-4 w-4" />
                                  Visiter le site
                                </span>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  )
                })}
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Handshake className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                Aucun partenaire pour le moment
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Nous travaillons actuellement sur de nouveaux partenariats
                stratégiques. Revenez bientôt pour découvrir notre réseau !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {partners.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                Vous souhaitez devenir partenaire ?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Rejoignez notre réseau de partenaires et développons ensemble des
                formations innovantes et adaptées aux besoins du marché.
              </p>
              <Button size="lg" asChild>
                <a href="/contact">Nous contacter</a>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
