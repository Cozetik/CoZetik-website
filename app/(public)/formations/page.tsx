export const metadata = {
  title: 'Catalogue des formations',
  description: 'Retrouvez nos 4 parcours phares, classés par thématiques professionnelles et personnelles, pour progresser en profondeur',
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

import FormationsClientPage from './FormationsClient'

export default function FormationsPage() {
  return <FormationsClientPage />
}
