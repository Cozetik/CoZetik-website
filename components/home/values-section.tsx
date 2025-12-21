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
    <section className="w-full bg-cozetik-black px-5 py-10 md:px-[60px] md:py-[60px] lg:px-[120px] lg:py-[100px]">
      <div className="container mx-auto max-w-[1440px]">
        {/* Desktop: 2 columns 50/50 | Mobile/Tablet: 1 column stack */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-center"
          >
            {/* Title */}
            <h2 className="mb-8 font-display text-5xl font-normal leading-[100%] text-cozetik-white md:mb-12 md:text-center md:text-7xl lg:text-right lg:text-[90px]">
              NOS
              <br />
              VALEURS
            </h2>

            {/* Values List */}
            <ul className="space-y-6 md:text-center lg:text-right">
              {values.map((value, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.1,
                    ease: 'easeOut',
                  }}
                  className="font-sans text-xl leading-tight text-cozetik-white md:text-2xl lg:text-[28px]"
                >
                  <span className="inline-block">- {value}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <div className="relative h-[240px] w-[240px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px]">
              <Image
                src="/illustrations/values-placeholder.svg"
                alt="Illustration des valeurs Cozetik"
                fill
                className="object-contain"
                priority={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
