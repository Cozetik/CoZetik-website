"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const values = [
  {
    number: '01',
    title: 'HUMAIN AU CŒUR DU RECRUTEMENT',
    description:
      'Nous plaçons l\'humain au centre de chaque recrutement. Chaque candidat est unique et mérite une attention personnalisée pour trouver le poste qui lui correspond parfaitement.',
  },
  {
    number: '02',
    title: 'EXCELLENCE ET EXPERTISE MÉTIER RPO',
    description:
      'Notre expertise en Recruitment Process Outsourcing (RPO) nous permet d\'accompagner les entreprises avec des solutions sur-mesure et des processus optimisés pour recruter les meilleurs talents.',
  },
  {
    number: '03',
    title: 'EMPLOYABILITÉ DURABLE ET CONCRÈTE',
    description:
      'Nous formons nos candidats aux compétences recherchées par les entreprises d\'aujourd\'hui et de demain, pour une employabilité durable et des carrières épanouissantes.',
  },
  {
    number: '04',
    title: 'RECRUTEMENT ÉTHIQUE ET RESPONSABLE',
    description:
      'Nous respectons des standards éthiques élevés dans tous nos processus de recrutement, garantissant transparence, équité et respect de la diversité.',
  },
  {
    number: '05',
    title: 'INNOVATION ET AGILITÉ TERRAIN',
    description:
      'Nous adoptons les dernières technologies et méthodologies agiles pour rester à la pointe du recrutement moderne et répondre rapidement aux besoins du marché.',
  },
]

export function ValuesSection() {
  return (
    <section className="overflow-hidden relative py-28 w-full md:py-40 lg:py-56">
      {/* Split Background: Noir gauche / Beige droite */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full bg-cozetik-black lg:w-1/2">
          {/* Signature verte - Décalée vers la gauche */}
          <Image
            src="/signature verte.png"
            alt="Signature verte"
            width={300}
            height={1000}
            className="absolute bottom-0 -left-12 h-52 w-auto md:-left-16 md:h-[400px] lg:-left-20 lg:h-[1000px]"
          />
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-cozetik-beige lg:w-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] min-h-screen  max-h-screen px-5 md:px-[60px] lg:px-[120px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-28">
          {/* Left Column - Titre + Illustrations décoratives (Fond Noir) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex relative flex-col justify-center min-h-[600px]"
          >
            {/* Personnage violet - Position fixe en haut */}
            <Image
              src="/Bonhomme violet.png"
              alt="Bonhomme violet"
              width={110}
              height={123}
              className="absolute left-0 top-16 h-18 w-auto md:top-20 md:h-24 lg:top-24 lg:h-[123px]"
            />

            {/* Title NOS VALEURS */}
            <div className="relative z-10 font-display text-5xl font-extrabold uppercase leading-none tracking-[0] text-cozetik-white md:text-7xl lg:text-[105px]">
              <div className="flex items-start">
                <span>NOS</span>
                <Image
                  alt="Bonhomme vert"
                  src="/Bonhomme vert .png"
                  width={135}
                  height={158}
                  className="-mt-[25px] ml-3 h-13 w-auto md:-mt-[45px] md:ml-5 md:h-20 lg:-mt-[65px] lg:ml-8 lg:h-32"
                  loading="lazy"
                />
              </div>
              <div className="ml-10 md:ml-16 lg:ml-20">VALEURS</div>
              <p
                className="mt-4 font-sans text-base text-cozetik-white/80 md:text-lg"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Une approche unique de la formation
              </p>
            </div>
          </motion.div>

          {/* Right Column - Liste valeurs avec numéros (Fond Beige) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-center px-8 md:px-12 lg:px-0"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + index * 0.08,
                    ease: 'easeOut',
                  }}
                  className="flex flex-col gap-3 md:flex-row md:gap-6"
                >
                  {/* Numéro - à gauche */}
                  <div className="flex flex-shrink-0 items-start text-4xl font-extrabold font-display text-cozetik-green md:text-5xl lg:text-6xl">
                    {value.number}
                  </div>

                  {/* Titre + Description - à droite */}
                  <div className="flex flex-col flex-1 gap-2">
                    <h3 className="font-sans text-base font-bold leading-tight uppercase text-cozetik-black md:text-lg lg:text-xl">
                      {value.title}
                    </h3>

                    <p className="font-sans text-sm leading-relaxed text-cozetik-black/80 md:text-base">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
