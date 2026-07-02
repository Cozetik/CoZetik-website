import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz d\'orientation Cozetik',
  description:
    'Découvre ton profil et obtiens une recommandation personnalisée de formation. Réponds à notre quiz d\'orientation en 2-3 minutes et reçois ton Programme Signature recommandé.',
  keywords: [
    'quiz orientation formation',
    'test personnalité professionnelle',
    'quiz métier',
    'orientation professionnelle',
    'recommandation formation',
  ],
  openGraph: {
    title: 'Quiz d\'orientation Cozetik - Découvre ton profil',
    description:
      'Réponds à notre quiz en 2-3 minutes et obtiens une recommandation personnalisée de formation adaptée à ton profil.',
    images: ['/og-image.jpg'],
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/quiz`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz d\'orientation Cozetik',
    description: 'Découvre ton profil et ta formation recommandée en 2-3 minutes.',
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

