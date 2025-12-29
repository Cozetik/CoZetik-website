import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

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
    url: 'https://cozetik.com/a-propos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos de Cozetik - Qui sommes-nous ?',
    description: 'Votre Partenaire Stratégique pour les Talents d\'Avenir',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://cozetik.com/a-propos',
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
        <div className="absolute -bottom-[30px] left-[50px] z-10 h-[219px] w-[1052px] bg-[#B4A5D5] flex flex-col items-start justify-center pl-[70px]">
          <h1 className="text-[80px] font-bold uppercase tracking-wide text-white leading-none text-left font-display">
            QUI SOMMES NOUS ?
          </h1>
          <p className="text-base text-white md:text-lg lg:text-xl mt-2 text-left" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Votre Partenaire Stratégique pour les Talents d&apos;Avenir
          </p>
        </div>
      </section>

      {/* SECTION 2 - DÉVELOPPER VOS COMPÉTENCES - Fond beige uniquement sur le texte */}
      <section className="w-full pt-48 md:pt-64 lg:pt-80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-[1400px] mx-auto">
          {/* GAUCHE : Texte */}
          <div className="flex flex-col justify-center bg-[#F5EDE4] h-[450px] px-12 py-16 md:px-16 lg:h-full lg:min-h-[500px] lg:px-20 lg:py-20">
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

          {/* DROITE : Image - format portrait */}
          <div className="relative flex items-center justify-center h-[450px] w-full lg:h-full lg:min-h-[500px]">
            <Image
              src="/d292b6262cf70d7c263077b598135207333c6c32.png"
              alt="Femme dans une bibliothèque lisant un livre"
              width={350}
              height={700}
              className="object-cover object-top relative"
              style={{ transform: 'translate(-240px, -70px)' }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3 - GALERIE DÉCALÉE - Sans shadow */}
      <section className="relative bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="relative mx-auto h-[750px] max-w-5xl md:h-[850px]">
            {/* Image 1 (gauche-haut) - SANS SHADOW */}
            <div className="absolute left-0 top-0 z-10">
              <Image
                src="/table de ping pong.png"
                alt="Vue aérienne personnes travaillant"
                width={315}
                height={500}
                className="object-cover"
              />
            </div>

            {/* Image 3 (droite-bas) - SANS SHADOW */}
            <div className="absolute z-20" style={{ right: '100px', bottom: '50px' }}>
              <Image
                src="/velo dans terasse.png"
                alt="Immeuble avec vélos"
                width={315}
                height={500}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - FORMER POUR UN MONDE */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* GAUCHE : Image conférence */}
            <div className="relative h-[280px] lg:h-[480px] lg:col-span-2">
              <Image
                src="/foule dans salle.png"
                alt="Conférence amphithéâtre vue d'en haut"
                fill
                className="object-cover"
              />
            </div>

            {/* DROITE : Texte */}
            <div className="flex flex-col justify-center space-y-5 lg:col-span-3">
              <h2 className="text-2xl font-bold text-black md:text-3xl lg:text-4xl leading-tight font-display">
                Former pour un monde technologique, humain en constante évolution
              </h2>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Cozétik est né de la convergence entre transformation numérique et
                évolution humaine. Dans un contexte où l&apos;IA, l&apos;automatisation
                et la communication deviennent des compétences stratégiques, la formation
                doit être à la fois technique, humaine et immédiatement applicable.
              </p>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
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

      {/* SECTION 5 - NOTRE HISTOIRE */}
      <section id="histoire" className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Qui sommes-nous ?
          </h2>
          <p className="text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Fondé en [année], Cozetik est bien plus qu&apos;un centre de formation : c&apos;est un laboratoire d&apos;innovation pédagogique où convergent excellence technique, développement personnel et bien-être.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Notre conviction ? Dans un monde professionnel en perpétuelle mutation, la réussite ne se résume pas à l&apos;acquisition de compétences techniques. Elle repose sur un équilibre entre savoir-faire, savoir-être et bien-être.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            C&apos;est pourquoi nous avons créé une offre unique qui allie informatique, business, communication, intelligence émotionnelle et connexion corporelle. Chaque année, nous accompagnons des centaines d&apos;apprenants vers la réussite professionnelle et l&apos;épanouissement personnel.
          </p>
        </div>
      </section>

      {/* SECTION 6 - NOTRE MISSION */}
      <section className="w-full bg-[#F5EDE4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Notre mission
          </h2>
          <p className="text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Rendre accessible une formation d&apos;excellence qui prépare aux métiers de demain tout en cultivant l&apos;humain. Nous croyons que chaque personne possède un potentiel unique qui mérite d&apos;être révélé et accompagné.
          </p>
        </div>
      </section>

      {/* SECTION 7 - NOS VALEURS */}
      <section id="valeurs" className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                1. Excellence
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des formations de qualité, certifiantes et reconnues qui répondent aux standards les plus exigeants
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                2. Innovation
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des méthodes pédagogiques modernes, interactives et efficaces qui favorisent l&apos;apprentissage par la pratique
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                3. Accompagnement
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Un suivi personnalisé de chaque apprenant parce que nous croyons aux parcours individualisés
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-xl font-bold text-black" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                4. Ouverture
              </h3>
              <p className="text-base leading-relaxed text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                Des formations accessibles, inclusives et bienveillantes qui accueillent tous les profils
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - L'ÉQUIPE */}
      <section id="equipe" className="w-full bg-[#F5EDE4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Notre équipe
          </h2>
          <p className="text-base leading-relaxed text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            Cozetik, ce sont des formateurs experts, passionnés par la transmission et engagés dans votre réussite. [À développer avec photos et présentation si souhaité]
          </p>
        </div>
      </section>

      {/* SECTION 9 - CHIFFRES CLÉS */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Cozetik en chiffres
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#ADA6DB] md:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                [X]
              </p>
              <p className="mt-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                apprenants formés depuis [année]
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#ADA6DB] md:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                [X]%
              </p>
              <p className="mt-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                de taux de réussite
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#ADA6DB] md:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                [X]%
              </p>
              <p className="mt-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                d&apos;insertion professionnelle
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#ADA6DB] md:text-5xl" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                [X]
              </p>
              <p className="mt-2 text-base text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                entreprises partenaires
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 - PARTENAIRES */}
      <section id="partenaires" className="w-full bg-[#F5EDE4] py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-[1200px]">
          <h2 className="mb-8 text-3xl font-bold text-black md:text-4xl lg:text-5xl font-display">
            Nos partenaires
          </h2>
          <p className="text-base text-gray-800 md:text-lg" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
            [Logos entreprises, organismes, institutions...]
          </p>
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