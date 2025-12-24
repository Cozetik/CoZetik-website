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

import FormationsClientPage from './FormationsClient'

export default function FormationsPage() {
  return <FormationsClientPage />
}
