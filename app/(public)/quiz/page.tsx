'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function QuizIntroPage() {
  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#9A80B8] pb-10">
        <div className="container mx-auto px-6 md:px-20">
          <div className="relative">
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#9A80B8] opacity-30 blur-3xl"></div>
            <div className="relative w-full md:w-fit overflow-hidden bg-[#2C2C2C] px-8 md:pl-[70px] md:pr-[150px] py-16 md:py-[100px] translate-y-20 md:translate-y-40 lg:translate-y-60">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-[#5E985E]" />
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                    QUIZ COZETIK
                  </h1>
                </div>
                <p className="font-sans max-w-4xl text-xl md:text-2xl lg:text-3xl leading-relaxed text-white mb-4" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                  « Par où commencer pour changer quelque chose, vraiment ? »
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="pb-8 pt-32 md:pt-52 lg:pt-60">
        <div className="container mx-auto px-6 md:px-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-[#F5F5F5] border-l-4 border-[#9A80B8] p-6 md:p-8">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                <span className="font-bold">Réponds vite. Sans trop réfléchir.</span>
                <br />
                La bonne réponse, c&apos;est celle qui te ressemble aujourd&apos;hui.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                À la fin, tu obtiens :
              </h2>
              <ul className="space-y-4">
                {[
                  'ton profil Cozetik',
                  'ton Programme Signature recommandé',
                  '1 à 2 modules complémentaires qui accélèrent ta transformation'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#5E985E]">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-lg md:text-xl text-gray-800" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="bg-[#EFEFEF] rounded-lg p-6 md:p-8">
              <p className="text-base md:text-lg text-gray-700 italic" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                💡 <span className="font-semibold">Comment ça marche ?</span>
                <br />
                À chaque question, choisis A, B, C, D, E, F, G ou H.
                <br />
                À la fin, regarde la lettre qui revient le plus souvent. C&apos;est ton profil.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8"
            >
              <Link
                href="/quiz/questions"
                className="group inline-flex items-center gap-3 bg-[#5E985E] px-8 py-4 text-lg md:text-xl font-bold text-white transition-all duration-300 hover:bg-[#4a7a4a] hover:gap-4 hover:shadow-lg"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
              >
                Commencer le quiz
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-sm text-gray-600" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
                ⏱️ Temps estimé : 2-3 minutes
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Citation finale */}
      <section className="pb-20 pt-12">
        <div className="container mx-auto px-6 md:px-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="border-t-2 border-gray-200 pt-12 text-center"
          >
            <p className="text-xl md:text-2xl font-semibold text-[#2C2C2C] italic" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              « Une bonne formation n&apos;ajoute pas une couche.
              <br />
              Elle enlève ce qui bloque. »
            </p>
            <p className="mt-4 text-base text-gray-600" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>
              — Cozetik
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
