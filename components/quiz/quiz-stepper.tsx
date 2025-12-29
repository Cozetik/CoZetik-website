'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { QuizQuestionComponent } from './quiz-question'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

// Types pour les questions de la BDD
interface QuizOption {
  id: string
  questionId: string
  letter: string
  text: string
  order: number
}

interface QuizQuestionFromDB {
  id: string
  order: number
  question: string
  visible: boolean
  options: QuizOption[]
}

// Schema dynamique pour valider chaque question
const createQuestionSchema = (questionId: string) => {
  return z.object({
    [questionId]: z.string().min(1, 'Veuillez sélectionner une réponse'),
  })
}

interface QuizStepperProps {
  onComplete: (answers: Record<string, string>) => void
}

export function QuizStepper({ onComplete }: QuizStepperProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questions, setQuestions] = useState<QuizQuestionFromDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les questions depuis l'API au montage du composant
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quiz/questions')

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des questions')
        }

        const data = await response.json()

        if (!data || data.length === 0) {
          throw new Error('Aucune question disponible')
        }

        setQuestions(data)
      } catch (err) {
        console.error('Error fetching quiz questions:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        toast.error('Impossible de charger les questions du quiz')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const currentQuestion = questions[currentStep]
  const hasQuestions = questions.length > 0

  // Form pour la question actuelle (toujours appeler le hook)
  const form = useForm({
    resolver: hasQuestions ? zodResolver(createQuestionSchema(currentQuestion?.id || 'default')) : undefined,
    defaultValues: hasQuestions ? {
      [currentQuestion?.id || 'default']: answers[currentQuestion?.id || ''] || '',
    } : {},
  })

  // Réinitialiser le form quand on change de question
  useEffect(() => {
    if (hasQuestions && currentQuestion) {
      form.reset({
        [currentQuestion.id]: answers[currentQuestion.id] || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, hasQuestions])

  // Attendre le chargement des questions
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#03120E] mb-4" />
        <p className="text-sm text-muted-foreground">Chargement des questions...</p>
      </div>
    )
  }

  // Afficher l'erreur si le chargement a échoué
  if (error || !hasQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 font-semibold mb-2">Erreur</p>
        <p className="text-sm text-muted-foreground">{error || 'Aucune question disponible'}</p>
      </div>
    )
  }

  const totalSteps = questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = (data: any) => {
    // Sauvegarder la réponse
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: data[currentQuestion.id],
    }
    setAnswers(newAnswers)

    if (currentStep < totalSteps - 1) {
      // Passer à la question suivante
      setCurrentStep(currentStep + 1)
      // Reset le form avec la réponse précédente si elle existe
      const nextQuestion = questions[currentStep + 1]
      form.reset({
        [nextQuestion.id]: newAnswers[nextQuestion.id] || '',
      })
    } else {
      // Quiz terminé
      onComplete(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      const prevQuestion = questions[currentStep - 1]
      form.reset({
        [prevQuestion.id]: answers[prevQuestion.id] || '',
      })
    }
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <motion.span
            key={`question-${currentStep}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold text-[#2C2C2C]"
            style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
          >
            Question {currentStep + 1} / {totalSteps}
          </motion.span>
          <motion.span
            key={`progress-${progress}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-semibold text-[#2C2C2C]"
            style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
        <div className="h-3 w-full bg-[#EFEFEF] rounded-none overflow-hidden">
          <motion.div
            className="h-full bg-[#03120E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Question */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name={currentQuestion.id}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <QuizQuestionComponent
                        question={currentQuestion}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="flex items-center justify-between pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {currentStep > 0 ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="h-14 px-8 text-base font-bold border-2 border-[#2C2C2C] bg-white text-[#2C2C2C] hover:bg-[#F5F5F5] transition-all"
                  style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Précédent
                </Button>
              </motion.div>
            ) : (
              <div />
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                className="h-14 px-8 text-base font-bold bg-[#03120E] text-white hover:bg-[#0a1f18] transition-all"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
              >
                {currentStep < totalSteps - 1 ? (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Voir mes résultats
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </div>
  )
}
