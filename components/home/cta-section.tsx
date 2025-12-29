import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Mail, Phone } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8 md:p-12 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              {/* Heading */}
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Prêt à développer vos compétences ?
              </h2>

              {/* Subheading */}
              <p className="mb-8 text-lg opacity-90 md:text-xl">
                Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins en formation et découvrir comment nous pouvons vous accompagner dans votre projet professionnel.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base"
                >
                  <Link href="/contact">
                    <Mail className="h-5 w-5" />
                    Nous contacter
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground/20 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="tel:+33123456789">
                    <Phone className="h-5 w-5" />
                    +33 1 23 45 67 89
                  </Link>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-10 flex flex-col gap-4 text-sm opacity-75 sm:flex-row sm:justify-center sm:gap-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-none bg-primary-foreground" />
                  <span>Réponse sous 24h</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-none bg-primary-foreground" />
                  <span>Devis gratuit</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-none bg-primary-foreground" />
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
