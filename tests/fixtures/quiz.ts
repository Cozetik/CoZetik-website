export const mockQuizProfile = {
  id: 'profile-1',
  letter: 'A',
  name: 'Profil Analytique',
  emoji: '🧠',
  color: '#3B82F6',
  blocageRacine: 'Blocage racine du profil',
  desir: 'Désir du profil',
  phraseMiroir: 'Phrase miroir du profil',
  programmeSignature: 'Programme signature',
  modulesComplementaires: ['Module 1', 'Module 2'],
  visible: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockQuizQuestion = {
  id: 'question-1',
  order: 1,
  question: 'Quelle est votre principale motivation ?',
  visible: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockQuizOption = {
  id: 'option-1',
  questionId: 'question-1',
  letter: 'A',
  text: 'Option A - Réponse possible',
  order: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockQuestionWithOptions = {
  ...mockQuizQuestion,
  options: [
    mockQuizOption,
    { ...mockQuizOption, id: 'option-2', letter: 'B', text: 'Option B', order: 2 },
    { ...mockQuizOption, id: 'option-3', letter: 'C', text: 'Option C', order: 3 },
  ],
}

export const createMockQuestion = (overrides = {}) => ({
  ...mockQuizQuestion,
  ...overrides,
})

export const createMockProfile = (overrides = {}) => ({
  ...mockQuizProfile,
  ...overrides,
})
