import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const menuLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/formations', label: 'Formations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/entreprises', label: 'Entreprises' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const contactLinks = [
  { href: 'mailto:contact@cozetik.com', label: 'Email' },
  { href: 'tel:+33123456789', label: 'Téléphone' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Confidentialité' },
]

async function getFooterFormations() {
  try {
    const formations = await prisma.formation.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
      take: 5,
      select: { title: true, slug: true },
    })
    return formations
  } catch (error) {
    console.error('Error fetching footer formations:', error)
    return []
  }
}

export async function Footer() {
  const formations = await getFooterFormations()

  return (
    <footer className="w-full bg-cozetik-black">
      <div className="container mx-auto max-w-[1440px] px-4 py-12 md:px-6 lg:px-[120px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-[32px] text-cozetik-white">
                COZETIK
              </span>
            </Link>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
              MENU
            </h3>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
              FORMATION
            </h3>
            <ul className="space-y-3">
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <li key={formation.slug}>
                    <Link
                      href={`/formations/${formation.slug}`}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                    >
                      {formation.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="font-sans text-sm text-gray-400">
                  Aucune formation disponible
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
              CONTACT
            </h3>
            <ul className="space-y-3">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-10">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-sans text-sm font-normal text-[#888888]">
              ©Cozétik {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="font-sans text-sm font-normal text-[#888888]">
              4 Rue Sarah Bernhart
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
