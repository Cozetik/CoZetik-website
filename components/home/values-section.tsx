'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const values = [
  'Humain au cœur du recrutement',
  'Excellence et expertise métier RPO',
  'Employabilité durable et concrète',
  'Recrutement éthique et responsable',
  'Innovation et agilité terrain',
]


export function ValuesSection() {
  return (
    <section className="overflow-hidden relative py-28 w-full md:py-40 lg:py-56">
      {/* Split Background: Noir gauche / Beige droite */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full bg-cozetik-black lg:w-1/2">
          {/* Signature violette - Décalée vers la gauche */}
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
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-[60px] lg:px-[120px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-28">
          {/* Left Column - Titre + Illustrations décoratives (Fond Noir) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex relative flex-col justify-center"
          >
            {/* Personnage violet - Haut gauche */}
            <Image
              src="/Bonhomme violet.png"
              alt="Bonhomme violet"
              width={110}
              height={123}
              className="absolute left-0 -top-12 h-18 w-auto md:-top-16 md:h-24 lg:-top-20 lg:h-[123px]"
            />

            {/* Title NOS VALEURS avec bonhomme vert intégré */}
            <div className="relative z-10 font-display text-5xl font-extrabold uppercase leading-none tracking-[0] text-cozetik-white md:text-7xl lg:text-[105px]">
              {/* Ligne 1: NOS + Bonhomme vert inline */}
              <div className="flex items-start">
                <span>NOS</span>
                <Image
                  src="/Bonhomme vert .png"
                  alt="Bonhomme vert"
                  width={135}
                  height={158}
                  className="-mt-[25px] ml-3 h-13 w-auto md:-mt-[45px] md:ml-5 md:h-20 lg:-mt-[65px] lg:ml-8 lg:h-32"
                />
              </div>
              {/* Ligne 2: VALEURS collé en dessous, décalé à droite */}
              <div className="ml-10 md:ml-16 lg:ml-20">VALEURS</div>
            </div>
          </motion.div>

          {/* Right Column - Liste valeurs (Fond Beige) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-center px-8 md:px-12 lg:px-20"
          >
            <ul className="space-y-10 text-left">
              {values.map((value, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + index * 0.08,
                    ease: 'easeOut',
                  }}
                  className="font-sans font-normal text-xl leading-relaxed tracking-[-0.02em] text-cozetik-black whitespace-nowrap md:text-2xl lg:text-[28px]"
                >
                  - {value}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
