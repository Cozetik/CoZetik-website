import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Formations entreprise - Solutions de formation sur mesure',
  description:
    'Développez les talents de vos équipes avec des formations professionnelles sur mesure. Cozetik propose des parcours adaptés à vos enjeux business : informatique, communication, intelligence émotionnelle, leadership. Devis personnalisé disponible.',
  keywords: [
    'formation entreprise',
    'formation professionnelle entreprise',
    'formation sur mesure',
    'formation équipe',
    'devis formation entreprise',
    'formation informatique entreprise',
    'formation management',
    'formation leadership',
  ],
  openGraph: {
    title: 'Formations entreprise sur mesure | Cozetik',
    description:
      'Formations professionnelles sur mesure pour vos équipes. Parcours adaptés à vos enjeux business avec devis personnalisé.',
    images: ['/og-image.jpg'],
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/entreprises`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formations entreprise sur mesure | Cozetik',
    description: 'Formations professionnelles sur mesure pour développer les talents de vos équipes',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/entreprises`,
  },
}

export default function EntreprisesPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <section className="relative bg-[#ADA6DB] pb-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="relative">
            <div className="absolute -right-16 top-2 h-64 w-64 rounded-none bg-[#ADA6DB] opacity-30 blur-3xl" />
            <div className="relative max-w-5xl translate-y-24 overflow-hidden bg-[#262626] px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
              <h1 className="mb-4 text-4xl font-extrabold text-white md:text-6xl lg:text-8xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Développez les talents de vos équipes
              </h1>
              <p className="mt-4 text-lg text-white md:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des formations professionnelles sur mesure, adaptées à vos enjeux
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Présentation */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Cozetik accompagne votre performance collective
          </h2>
          <p className="text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Vos collaborateurs sont votre premier atout. Nous concevons avec vous des parcours de formation qui répondent précisément à vos besoins : montée en compétences techniques, développement du leadership, amélioration de la communication, bien-être au travail... Nos formateurs experts s&apos;adaptent à votre culture d&apos;entreprise pour créer des programmes qui génèrent un impact durable.
          </p>
        </div>
      </section>

      {/* Section Nos solutions */}
      <section className="w-full bg-[#F5EDE4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Notre offre entreprise
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                1. Formation intra-entreprise
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des sessions dédiées à vos équipes dans vos locaux ou les nôtres
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                2. Parcours personnalisés
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Co-construction de programmes adaptés à vos objectifs stratégiques
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                3. Coaching individuel et collectif
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Accompagnement sur-mesure de vos managers et collaborateurs clés
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                4. Formats flexibles
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Présentiel, distanciel ou hybride selon vos contraintes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Domaines d'intervention */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Thématiques de formation
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-l-4 border-[#ADA6DB] pl-6">
              <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Transformation digitale
              </h3>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Développement web, outils numériques, cybersécurité
              </p>
            </div>
            <div className="border-l-4 border-[#ADA6DB] pl-6">
              <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Leadership & management
              </h3>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Intelligence émotionnelle, gestion d&apos;équipe, posture managériale
              </p>
            </div>
            <div className="border-l-4 border-[#ADA6DB] pl-6">
              <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Communication
              </h3>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Prise de parole, présentation, négociation
              </p>
            </div>
            <div className="border-l-4 border-[#ADA6DB] pl-6">
              <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Performance commerciale
              </h3>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Techniques de vente, business development, stratégie
              </p>
            </div>
            <div className="border-l-4 border-[#ADA6DB] pl-6">
              <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Bien-être au travail
              </h3>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Gestion du stress, cohésion d&apos;équipe, QVT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="w-full bg-[#F5EDE4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Pourquoi choisir Cozetik ?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Diagnostic personnalisé
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Analyse de vos besoins en amont pour des formations ciblées
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Co-construction
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Vous êtes partie prenante de la conception des programmes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Suivi et évaluation
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Mesure des acquis et de l&apos;impact des formations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Financement facilité
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Prise en charge OPCO possible, nous vous accompagnons dans les démarches
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Process */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Comment ça marche ?
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none bg-[#ADA6DB] text-white font-bold">1</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Échange
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Nous discutons de vos besoins et objectifs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none bg-[#ADA6DB] text-white font-bold">2</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Diagnostic
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Nous analysons votre contexte et vos enjeux
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none bg-[#ADA6DB] text-white font-bold">3</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Proposition
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Nous vous soumettons un programme sur-mesure
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none bg-[#ADA6DB] text-white font-bold">4</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Formation
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Déploiement des sessions avec vos équipes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none bg-[#ADA6DB] text-white font-bold">5</span>
              <div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Suivi
                </h3>
                <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  Évaluation des résultats et ajustements si nécessaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="w-full bg-[#ADA6DB] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Parlons de votre projet
          </h2>
          <p className="mb-8 text-lg text-white md:text-xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Que vous ayez un besoin précis ou souhaitiez explorer les possibilités, notre équipe est à votre écoute.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact?type=entreprise"
              className="inline-flex items-center justify-center bg-black px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-gray-800"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              Demander un devis
            </Link>
            <Link
              href="/contact?type=rappel"
              className="inline-flex items-center justify-center border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#ADA6DB]"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              Être rappelé
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            <Link href="/catalogue-entreprise.pdf" className="underline hover:text-white">
              Télécharger notre catalogue entreprise
            </Link>
          </p>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-6 text-2xl font-bold text-black md:text-3xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Informations de contact
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                📍 <strong>Adresse :</strong> 4 Rue Sarah Bernhardt, 92600 Asnières-sur-Seine
              </p>
              <p className="mb-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                📞 <strong>Téléphone :</strong> [numéro]
              </p>
              <p className="mb-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                📧 <strong>Email :</strong> entreprises@cozetik.fr
              </p>
            </div>
            <div>
              <p className="text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                📅 <Link href="#" className="underline hover:text-[#ADA6DB]">Ou prenez rendez-vous directement</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

