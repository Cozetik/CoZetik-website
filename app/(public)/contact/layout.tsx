import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Une question ? Un projet de formation ? Contactez notre équipe Cozetik. Nous sommes à votre écoute pour vous accompagner dans votre démarche.',
  openGraph: {
    title: 'Contactez-nous | Cozetik',
    description:
      'Notre équipe est à votre écoute pour répondre à vos questions sur nos formations professionnelles.',
    images: ['/og-image.jpg'],
    url: 'https://cozetik.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contactez-nous | Cozetik',
    description: 'Notre équipe répond à vos questions sur nos formations.',
    images: ['/og-image.jpg'],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
