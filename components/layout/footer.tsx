import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/formations', label: 'Formations' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/entreprise', label: 'Entreprise' },
  ],
  ressources: [
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/politique-confidentialite', label: 'Politique de confidentialité' },
  ],
  social: [
    { href: '#', label: 'LinkedIn', icon: 'linkedin' },
    { href: '#', label: 'Twitter', icon: 'twitter' },
    { href: '#', label: 'Facebook', icon: 'facebook' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Cozetik
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre partenaire de confiance pour des formations professionnelles
              de qualité. Développez vos compétences et atteignez vos objectifs.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Nous contacter</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Email:{' '}
                <a
                  href="mailto:contact@cozetik.com"
                  className="transition-colors hover:text-foreground"
                >
                  contact@cozetik.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Tél:{' '}
                <a
                  href="tel:+33123456789"
                  className="transition-colors hover:text-foreground"
                >
                  +33 1 23 45 67 89
                </a>
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              {footerLinks.social.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.label}
                >
                  <span className="sr-only">{link.label}</span>
                  <div className="h-5 w-5">
                    {link.icon === 'linkedin' && (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    )}
                    {link.icon === 'twitter' && (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    )}
                    {link.icon === 'facebook' && (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Cozetik. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link
              href="/mentions-legales"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
