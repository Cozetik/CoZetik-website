import Image from 'next/image'
import { Card } from '@/components/ui/card'

interface Partner {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
}

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  if (partners.length === 0) {
    return null
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Nos partenaires nous accompagnent dans notre mission de formation professionnelle
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="group flex items-center justify-center overflow-hidden border bg-background p-6 transition-all hover:shadow-md"
            >
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  {partner.logoUrl ? (
                    <div className="relative h-16 w-full">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain grayscale transition-all group-hover:grayscale-0"
                      />
                    </div>
                  ) : (
                    <span className="text-center text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                      {partner.name}
                    </span>
                  )}
                </a>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {partner.logoUrl ? (
                    <div className="relative h-16 w-full">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain grayscale transition-all group-hover:grayscale-0"
                      />
                    </div>
                  ) : (
                    <span className="text-center text-sm font-semibold text-muted-foreground">
                      {partner.name}
                    </span>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
