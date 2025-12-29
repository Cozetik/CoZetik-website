import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Candidater à une formation',
  description:
    'Postulez à une formation Cozetik en quelques minutes. Complétez votre dossier de candidature en ligne avec vos informations personnelles, votre projet professionnel et vos documents.',
  keywords: [
    'candidater formation',
    'inscription formation',
    'dossier candidature',
    'postuler formation professionnelle',
    'candidature cozetik',
  ],
  openGraph: {
    title: 'Candidater à une formation | Cozetik',
    description:
      'Complétez votre dossier de candidature en ligne. Notre équipe pédagogique étudiera votre candidature et vous contactera sous 48 heures.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/candidater',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Candidater à une formation | Cozetik',
    description: 'Postulez à une formation Cozetik en quelques minutes.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cozetik.com/candidater',
  },
}

export default function CandidaterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

