'use client'

import { QuizStepper } from '@/components/quiz/quiz-stepper'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function QuizQuestionsPage() {
  const router = useRouter()

  const handleQuizComplete = (answers: Record<string, string>) => {
    // Stocker les réponses dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('quiz_answers', JSON.stringify(answers))
    }

    // Rediriger vers la page résultats
    router.push('/quiz/resultats')
  }

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#9A80B8] pb-10">
        <div className="container mx-auto px-6 md:px-20">
          <div className="relative">
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#9A80B8] opacity-30 blur-3xl"></div>
            <div className="relative w-full md:w-fit overflow-hidden bg-[#2C2C2C] px-8 md:pl-[70px] md:pr-[150px] py-16 md:py-[100px] translate-y-20 md:translate-y-40 lg:translate-y-60">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
              >
                Quiz Cozetik
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Container */}
      <section className="pb-16 pt-32 md:pt-52 lg:pt-60">
        <div className="container mx-auto px-6 md:px-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#EFEFEF] rounded-lg p-6 md:p-12"
          >
            <QuizStepper onComplete={handleQuizComplete} />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
