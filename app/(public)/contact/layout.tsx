import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactez-nous',
  description:
    'Contactez l\'équipe Cozetik pour toute question sur nos formations professionnelles. Nous répondons rapidement à vos demandes d\'information, devis entreprise ou questions administratives.',
  keywords: [
    'contact cozetik',
    'demande information formation',
    'devis entreprise',
    'contact formation professionnelle',
  ],
  openGraph: {
    title: 'Contactez-nous | Cozetik',
    description:
      'Une question ? Besoin d\'informations ? Notre équipe vous répond rapidement. Contactez-nous pour vos demandes de formation.',
    images: ['/og-image.jpg'],
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contactez-nous | Cozetik',
    description: 'Notre équipe vous répond rapidement à vos questions.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
