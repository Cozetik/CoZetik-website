import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedFormationsSection } from '@/components/home/featured-formations-section'
import { WhyCozetikSection } from '@/components/home/why-cozetik-section'
import { PartnersSection } from '@/components/home/partners-section'
import { CTASection } from '@/components/home/cta-section'

async function getHomeData() {
  try {
    const [categories, formations, partners] = await Promise.all([
      // Fetch visible categories with formation count
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { formations: true },
          },
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
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection categories={categories} />

      {/* Featured Formations Section */}
      <FeaturedFormationsSection formations={formations} />

      {/* Why Cozetik Section */}
      <WhyCozetikSection />

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
