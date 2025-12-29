import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz d\'orientation Cozetik',
  description:
    'Découvrez votre profil et obtenez une recommandation personnalisée de formation. Répondez à notre quiz d\'orientation en 2-3 minutes et recevez votre Programme Signature recommandé.',
  keywords: [
    'quiz orientation formation',
    'test personnalité professionnelle',
    'quiz métier',
    'orientation professionnelle',
    'recommandation formation',
  ],
  openGraph: {
    title: 'Quiz d\'orientation Cozetik - Découvrez votre profil',
    description:
      'Répondez à notre quiz en 2-3 minutes et obtenez une recommandation personnalisée de formation adaptée à votre profil.',
    images: ['/og-image.jpg'],
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/quiz`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz d\'orientation Cozetik',
    description: 'Découvrez votre profil et votre formation recommandée en 2-3 minutes.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/quiz`,
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

