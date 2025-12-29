import { prisma } from '@/lib/prisma'
import FormationsClientPage from './FormationsClient'

export const metadata = {
  title: 'Nos formations professionnelles certifiantes',
  description:
    'Découvrez notre catalogue complet de formations professionnelles certifiantes. Parcours post-bac en informatique, business, communication, intelligence émotionnelle et bien-être. Formations adaptées à vos ambitions professionnelles.',
  keywords: [
    'formations professionnelles',
    'formations certifiantes',
    'formation post-bac',
    'formation informatique',
    'formation business',
    'formation communication',
    'formation intelligence émotionnelle',
    'catalogue formations',
  ],
  openGraph: {
    title: 'Nos formations professionnelles certifiantes | Cozetik',
    description:
      'Catalogue complet de formations professionnelles certifiantes. Parcours post-bac adaptés à vos ambitions professionnelles.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/formations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nos formations professionnelles certifiantes | Cozetik',
    description: 'Catalogue complet de formations certifiantes adaptées à vos ambitions.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cozetik.com/formations',
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
