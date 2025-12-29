'use client'

import { QuizQuestion } from '@/lib/quiz/questions'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

interface QuizQuestionProps {
  question: QuizQuestion
  value: string
  onChange: (value: string) => void
}

export function QuizQuestionComponent({ question, value, onChange }: QuizQuestionProps) {
  if (question.type === 'single' && question.options) {
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
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index) // A, B, C...
            const optionValue = `${letter}. ${option}`
            const isSelected = value === optionValue
            return (
              <div
                key={`${question.id}-${index}`}
                className={`flex items-start space-x-4 p-4 rounded-none border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#03120E] bg-[#F5F5F5] shadow-md'
                    : 'border-[#E0E0E0] bg-white hover:border-[#9A80B8] hover:shadow-sm'
                }`}
              >
                <RadioGroupItem value={optionValue} id={`${question.id}-${index}`} className="mt-1" />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer flex-1 text-base text-[#2C2C2C] leading-relaxed hover:scale-[1.01] transition-transform"
                  style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
                >
                  <span className="font-bold mr-2">{letter}.</span>
                  {option}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>
    )
  }

  if (question.type === 'scale' && question.scaleMin && question.scaleMax && question.scaleLabels) {
    const scaleValues = Array.from(
      { length: question.scaleMax - question.scaleMin + 1 },
      (_, i) => question.scaleMin! + i
    )

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

        <div className="space-y-6">
          <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
            {scaleValues.map((scaleValue, index) => {
              const optionValue = scaleValue.toString()
              const isSelected = value === optionValue
              return (
                <div
                  key={`${question.id}-${scaleValue}`}
                  className={`flex items-center space-x-4 p-4 rounded-none border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-[#03120E] bg-[#F5F5F5] shadow-md'
                      : 'border-[#E0E0E0] bg-white hover:border-[#9A80B8] hover:shadow-sm'
                  }`}
                >
                  <RadioGroupItem value={optionValue} id={`${question.id}-${scaleValue}`} />
                  <Label
                    htmlFor={`${question.id}-${scaleValue}`}
                    className="cursor-pointer flex-1 text-base text-[#2C2C2C] font-semibold hover:scale-[1.01] transition-transform"
                    style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
                  >
                    {scaleValue}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-between text-sm text-gray-600 pt-2"
            style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
          >
            <span>{question.scaleLabels.min}</span>
            <span>{question.scaleLabels.max}</span>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}
