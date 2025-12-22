import Link from 'next/link'
import Image from 'next/image'
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

async function getFooterCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
      take: 5,
      select: { name: true, slug: true },
    })
    return categories
  } catch (error) {
    console.error('Error fetching footer categories:', error)
    return []
  }
}

export async function Footer() {
  const categories = await getFooterCategories()

  return (
    <footer className="w-full bg-cozetik-black">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-12 md:px-8 lg:px-12">
        {/* Logo à gauche + Grid 3 colonnes collées à droite */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo à gauche - isolé */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block">
              <Image
                src="/logo footer.png"
                alt="CoZétik Logo"
                width={300}
                height={120}
                className="h-auto w-[250px] md:w-[280px] lg:w-[320px]"
              />
            </Link>
          </div>

          {/* Grid 3 colonnes compactes collées à droite */}
          <div className="grid w-full grid-cols-1 gap-12 md:w-auto md:grid-cols-3 md:gap-6 lg:gap-8">
            {/* Colonne 1 : Menu */}
            <div>
              <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
                MENU
              </h3>
              <ul className="space-y-3">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 2 : Formation (Catégories) */}
            <div>
              <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
                FORMATION
              </h3>
              <ul className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/formations?category=${category.slug}`}
                        className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-green"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="font-sans text-sm text-gray-400">
                    Aucune catégorie disponible
                  </li>
                )}
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div>
              <h3 className="mb-4 font-sans text-base font-bold text-cozetik-white">
                CONTACT
              </h3>
              <ul className="space-y-3">
                {contactLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Une ligne centrée */}
        <div className="mt-10 border-t border-white/10 pt-10">
          <p className="text-center font-sans text-sm font-normal text-[#888888]">
            ©Cozétik {new Date().getFullYear()} All rights reserved. - 4 Rue Sarah Bernhart, 92600 Asnières-sur-Seine
          </p>
        </div>
      </div>
    </footer>
  )
}
