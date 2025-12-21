import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/home/hero-section'
import { AboutSection } from '@/components/home/about-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedFormationsSection } from '@/components/home/featured-formations-section'
import { WhyCozetikSection } from '@/components/home/why-cozetik-section'
import { ValuesSection } from '@/components/home/values-section'
import { PartnersSection } from '@/components/home/partners-section'
import { CTASection } from '@/components/home/cta-section'

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Développez vos compétences avec Cozetik. Formations professionnelles certifiantes de qualité avec des experts reconnus. Découvrez notre catalogue complet.',
  openGraph: {
    title: 'Cozetik - Formations professionnelles certifiantes',
    description:
      'Formations de qualité pour booster votre carrière. Formez-vous avec les meilleurs experts du secteur.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozetik - Formations professionnelles certifiantes',
    description: 'Formations de qualité pour booster votre carrière.',
    images: ['/og-image.jpg'],
  },
}

async function getHomeData() {
  try {
    const [categories, formations, partners] = await Promise.all([
      // Fetch visible categories (limit to 5 for homepage)
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      // Fetch featured visible formations
      prisma.formation.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        take: 4,
        include: {
          category: {
            select: { name: true },
          },
        },
      }),

      // Fetch visible partners
      prisma.partner.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
      }),
    ])

    return { categories, formations, partners }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return { categories: [], formations: [], partners: [] }
  }
}

export default async function Home() {
  const { categories, formations, partners } = await getHomeData()

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full viewport, starts at top (under navbar) */}
      <HeroSection />

      {/* About Section - Regular flow with top padding */}
      <AboutSection />

      <section className="bg-cozetik-beige px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <CategoriesSection categories={categories} />
        </div>
      </section>

      <section className="bg-cozetik-beige px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <FeaturedFormationsSection formations={formations} />
        </div>
      </section>

      <section className="bg-cozetik-beige px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <WhyCozetikSection />
        </div>
      </section>

      {/* Nos Valeurs Section - Fond noir */}
      <ValuesSection />

      <section className="bg-cozetik-beige px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <PartnersSection partners={partners} />
        </div>
      </section>

      <section className="bg-cozetik-beige px-4 py-10 md:px-6 md:py-16 lg:px-[120px] lg:py-[100px]">
        <div className="container mx-auto max-w-[1440px]">
          <CTASection />
        </div>
      </section>
    </div>
  )
}
