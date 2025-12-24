import { prisma } from '@/lib/prisma'
import FormationsClientPage from './FormationsClient'

export const metadata = {
  title: 'Nos formations',
  description: 'Des parcours post-bac adaptés à vos ambitions professionnelles',
  openGraph: {
    title: 'Nos formations | Cozetik',
    description: 'Des parcours post-bac adaptés à vos ambitions professionnelles',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/formations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nos formations | Cozetik',
    description: 'Des parcours post-bac adaptés à vos ambitions professionnelles',
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
