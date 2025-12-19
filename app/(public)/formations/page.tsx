import { prisma } from '@/lib/prisma'
import { FormationsList } from '@/components/formations/formations-list'
import { BookOpen } from 'lucide-react'

async function getFormationsData() {
  try {
    const [formations, categories] = await Promise.all([
      // Fetch all visible formations
      prisma.formation.findMany({
        where: { visible: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),

      // Fetch all visible categories
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ])

    return { formations, categories }
  } catch (error) {
    console.error('Error fetching formations data:', error)
    return { formations: [], categories: [] }
  }
}

export const metadata = {
  title: 'Nos Formations',
  description:
    'Découvrez toutes nos formations professionnelles et développez vos compétences avec Cozetik. Catalogue complet de formations certifiantes.',
  openGraph: {
    title: 'Nos Formations professionnelles | Cozetik',
    description:
      'Explorez notre catalogue complet de formations professionnelles certifiantes adaptées à vos objectifs de carrière.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/formations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nos Formations professionnelles | Cozetik',
    description: 'Catalogue complet de formations certifiantes.',
    images: ['/og-image.jpg'],
  },
}

export default async function FormationsPage() {
  const { formations, categories } = await getFormationsData()

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Nos formations
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Explorez notre catalogue complet de formations professionnelles et
              trouvez celle qui correspond parfaitement à vos objectifs de carrière.
            </p>
          </div>
        </div>
      </section>

      {/* Formations List Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {formations.length > 0 || categories.length > 0 ? (
            <FormationsList formations={formations} categories={categories} />
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                Aucune formation disponible
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Nous travaillons actuellement sur de nouvelles formations
                passionnantes. Revenez bientôt pour découvrir notre catalogue !
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
