'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

// Types pour les questions depuis la BDD
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

interface QuizQuestionProps {
  question: QuizQuestionFromDB
  value: string
  onChange: (value: string) => void
}

export function QuizQuestionComponent({ question, value, onChange }: QuizQuestionProps) {
  // Les questions de la BDD ont toujours des options (type "single")
  if (question.options && question.options.length > 0) {
    return (
      <div className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-[#2C2C2C] mb-8"
          style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
        >
          {question.question}
        </motion.h2>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
          {question.options.map((option) => {
            // Utiliser la lettre stockée dans la BDD
            const optionValue = `${option.letter}. ${option.text}`
            const isSelected = value === optionValue
            return (
              <div
                key={option.id}
                className={`flex items-start space-x-4 p-4 rounded-none border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#03120E] bg-[#F5F5F5] shadow-md'
                    : 'border-[#E0E0E0] bg-white hover:border-[#9A80B8] hover:shadow-sm'
                }`}
              >
                <RadioGroupItem value={optionValue} id={option.id} className="mt-1" />
                <Label
                  htmlFor={option.id}
                  className="cursor-pointer flex-1 text-base text-[#2C2C2C] leading-relaxed hover:scale-[1.01] transition-transform"
                  style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
                >
                  <span className="font-bold mr-2">{option.letter}.</span>
                  {option.text}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>
    )
  }

  // Fallback si pas d'options (ne devrait pas arriver avec les questions de la BDD)
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-[#2C2C2C] mb-8"
        style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
      >
        {question.question}
      </motion.h2>
      <p className="text-sm text-muted-foreground">Aucune option disponible pour cette question.</p>
    </div>
  )
}
