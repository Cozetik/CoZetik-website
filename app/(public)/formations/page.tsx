import { prisma } from '@/lib/prisma'
import FormationsClientPage from './FormationsClient'

export const metadata = {
  title: 'Catalogue des formations',
  description: 'Retrouvez nos parcours phares, classés par thématiques professionnelles et personnelles, pour progresser en profondeur',
  openGraph: {
    title: 'Catalogue des formations | Cozetik',
    description: 'Explorez nos parcours Développement professionnel et Développement personnel',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/formations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalogue des formations | Cozetik',
    description: 'Catalogue complet, filtres par thématique',
    images: ['/og-image.jpg'],
  },
}

export default async function FormationsPage() {
  const [formations, categories] = await Promise.all([
    prisma.formation.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    }),
  ])

  return <FormationsClientPage formations={formations} categories={categories} />
}
