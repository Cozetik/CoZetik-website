'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'VOUS POSTULEZ',
    description: 'Remplissez le formulaire en ligne avec votre information exact',
  },
  {
    number: '02',
    title: 'ON VOUS CONTACTE',
    description: 'Votre référent pédagogique vous contacte',
  },
  {
    number: '03',
    title: 'PRÉPAREZ-VOUS',
    description: 'Commencez votre formation enthousiasmé',
  },
]

export function JoinAdventureSection() {
  return (
    <section className="w-full bg-cozetik-violet px-5 py-28 md:px-[60px] md:py-40 lg:px-[120px] lg:py-52">
      <div className="container mx-auto max-w-[1200px]">
        {/* Title + Autographe Noir */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-20 text-center"
        >
          <h2 className="font-display text-5xl font-black leading-[110%] text-cozetik-black md:text-7xl lg:text-[100px]" style={{ fontWeight: 950, fontFamily: 'var(--font-bricolage), sans-serif' }}>
            REJOINS L&apos;AVENTURE !
          </h2>

          {/* Autographe Noir style marqueur organique */}
          <svg
            className="absolute -bottom-6 left-1/2 w-[320px] -translate-x-1/2 md:w-[400px] lg:w-[500px]"
            style={{
              opacity: 0,
              animation: 'fadeIn 0.5s ease-in-out 0.5s forwards',
            }}
            viewBox="0 0 500 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 30 Q50 15, 100 28 T200 32 Q250 28, 300 35 T400 30 Q430 25, 480 32"
              stroke="#262626"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-zigzag"
              style={{
                filter: 'url(#marker-blur)',
              }}
            />
            <defs>
              <filter id="marker-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
              </filter>
            </defs>
          </svg>
        </motion.div>

        {/* 3 Steps - Layout Horizontal avec séparateurs */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: 'easeOut',
              }}
              className={`flex flex-col gap-4 py-8 md:flex-row md:items-center md:gap-6 lg:py-10 ${
                index < steps.length - 1
                  ? 'border-b border-cozetik-black/20'
                  : ''
              }`}
            >
              {/* Number - aligné au centre verticalement */}
              <div className="flex flex-shrink-0 items-center font-display text-5xl font-extrabold leading-[0.8] text-cozetik-black md:text-6xl lg:text-7xl">
                {step.number}
              </div>

              {/* Title + Description - alignés au centre */}
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <h3 className="flex flex-shrink-0 items-center font-sans text-xl font-bold uppercase leading-tight tracking-[0] text-cozetik-black md:text-2xl lg:text-3xl">
                  {step.title}
                </h3>

                <p className="flex items-center font-sans text-base leading-tight text-cozetik-black md:text-lg lg:text-xl">
                  {step.description}
                </p>
              </div>

              {/* Arrow Icon - alignée au centre */}
              <ArrowUpRight
                className="h-7 w-7 flex-shrink-0 text-cozetik-black md:h-8 md:w-8 lg:h-10 lg:w-10"
                strokeWidth={2.5}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
