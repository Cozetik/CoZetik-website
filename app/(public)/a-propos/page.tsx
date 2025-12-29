import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ValuesSection } from '@/components/a-propos/values-section'

export const metadata: Metadata = {
  title: 'À propos de Cozetik - Qui sommes-nous ?',
  description:
    'Découvrez Cozetik, votre partenaire stratégique pour les talents d\'avenir. Centre de formation professionnelle alliant excellence technique, développement personnel et bien-être. Formations certifiantes en informatique, business, communication et intelligence émotionnelle.',
  keywords: [
    'cozetik',
    'centre formation',
    'formation professionnelle',
    'qui sommes-nous',
    'histoire cozetik',
    'mission cozetik',
    'valeurs cozetik',
    'équipe formation',
  ],
  openGraph: {
    title: 'À propos de Cozetik - Qui sommes-nous ?',
    description:
      'Votre Partenaire Stratégique pour les Talents d\'Avenir. Formations professionnelles alliant excellence technique et développement personnel.',
    images: ['/og-image.jpg'],
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/a-propos`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Cozetik - Qui sommes-nous ?',
    description: 'Votre Partenaire Stratégique pour les Talents d\'Avenir',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cozetik.fr'}/a-propos`,
  },
}

export default function AProposPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* SECTION 1 - HERO */}
      <section className="relative h-[300px] w-full md:h-[400px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/2 femme qui travail.png"
            alt="Personnes qui travaillent ensemble"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Rectangle violet en bas à gauche avec 50px d'écart */}
        <div className="absolute -bottom-[15px] left-4 z-10 h-auto min-h-[120px] w-[calc(100%-2rem)] bg-[#B4A5D5] flex flex-col items-start justify-center px-4 py-6 md:-bottom-[20px] md:left-8 md:w-[calc(100%-4rem)] md:px-6 md:py-8 lg:-bottom-[30px] lg:left-[50px] lg:h-[219px] lg:w-[1052px] lg:px-[70px]">
          <h1 className="text-5xl font-bold uppercase tracking-wide text-white leading-none text-left font-display sm:text-7xl md:text-7xl lg:text-7xl xl:text-[80px]">
            QUI SOMMES NOUS ?
          </h1>
          <p className="text-sm text-white md:text-base lg:text-lg xl:text-xl mt-2 text-left font-sans">
            Votre Partenaire Stratégique pour les Talents d&apos;Avenir
          </p>
        </div>
      </section>


      {/* SECTION 2 - DÉVELOPPER VOS COMPÉTENCES - Fond beige uniquement sur le texte */}
      <section className="w-full pt-48 md:pt-64 lg:pt-50 px-4 md:px-6 lg:px-0">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-[1400px] mx-auto lg:pl-[20%]">
          {/* GAUCHE : Texte */}
          <div className="relative z-10 flex flex-col justify-center bg-[#F5EDE4] h-auto min-h-[450px] px-8 py-12 text-center md:px-12 md:py-16 md:text-center lg:h-full lg:min-h-[500px] lg:px-20 lg:py-20 lg:text-left">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-black md:text-3xl lg:text-4xl leading-tight font-display">
                Développer vos compétences Clés du monde numérique et humain
              </h2>
              <p className="mb-4 text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Cozétik est né de la convergence entre transformation numérique et
                évolution humaine. Dans un contexte où l&apos;IA, l&apos;automatisation
                et la communication deviennent des compétences stratégiques, la formation
                doit être à la fois technique, humaine et immédiatement applicable.
              </p>
            </div>
            <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              Notre vision est de proposer des formations trouvables en ligne,
              compréhensibles par les moteurs de recherche et les intelligences
              artificielles, tout en restant profondément utiles aux individus et aux
              organisations.
            </p>
          </div>

          {/* DROITE : Image - format portrait - Visible uniquement sur desktop */}
          <div className="hidden lg:block lg:relative lg:h-full lg:min-h-[500px]">
            <div className="absolute left-20 top-1/3 z-20 -translate-y-1/2">
              <Image
                src="/d292b6262cf70d7c263077b598135207333c6c32.png"
                alt="Femme dans une bibliothèque lisant un livre"
                width={350}
                height={800}
                className="object-cover object-top"
                style={{ transform: 'translateX(-40%)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - GALERIE DÉCALÉE - Sans shadow */}

      {/* SECTION 4 - FORMER POUR UN MONDE */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">
            {/* GAUCHE : Image conférence */}
            <div className="relative h-[280px] lg:h-[650px] lg:col-span-2">
              <Image
                src="/foule dans salle.png"
                alt="Conférence amphithéâtre vue d'en haut"
                fill
                className="object-cover"
              />
            </div>

            {/* DROITE : Texte */}
            <div className="flex flex-col justify-center space-y-5 lg:col-span-3 max-w-[500px]">
              <h2 className="text-2xl font-medium text-black md:text-3xl lg:text-5xl leading-tight font-display">
                Former pour un monde technologique, humain en constante évolution
              </h2>
              <p className="text-base leading-relaxed text-gray-800 font-sans">
                Cozétik est né de la convergence entre transformation numérique et
                évolution humaine. Dans un contexte où l&apos;IA, l&apos;automatisation
                et la communication deviennent des compétences stratégiques, la formation
                doit être à la fois technique, humaine et immédiatement applicable.
              </p>
              <p className="text-base leading-relaxed text-gray-800 font-sans">
                Notre vision est de proposer des formations trouvables en ligne,
                compréhensibles par les moteurs de recherche et les intelligences
                artificielles, tout en restant profondément utiles aux individus et aux
                organisations.
              </p>
              
              {/* Bouton NOUS CONTACTER - coins carrés */}
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-black px-7 py-3 text-sm font-semibold uppercase text-white transition-all duration-200 hover:bg-gray-800 tracking-wide"
                  style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
                >
                  NOUS CONTACTER
                  <span className="ml-3 text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 7 - NOS VALEURS */}
      <ValuesSection />


      {/* SECTION 9 - CHIFFRES CLÉS */}
      <section className="w-full bg-[#262626] py-16 md:py-40">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-5xl font-normal text-white md:text-6xl lg:text-7xl font-display">
                90%
              </h3>
              <p className="mt-2 text-base text-white font-normal font-sans">
                de reconversion réussie
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-5xl font-normal text-white md:text-6xl lg:text-7xl font-display">
                5
              </h3>
              <p className="mt-2 text-base text-white font-normal font-sans">
                formations certifiantes
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-5xl font-normal text-white md:text-6xl lg:text-7xl font-display">
                + 100h
              </h3>
              <p className="mt-2 text-base text-white font-normal font-sans">
                de formations
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 11 - CTA FINAL */}
      <section className="w-full bg-[#ADA6DB] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl font-display">
            Envie de nous rejoindre ?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/formations"
              className="inline-flex items-center justify-center bg-black px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-gray-800"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              Découvrir nos formations
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#ADA6DB]"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}