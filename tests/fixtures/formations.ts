export const mockCategory = {
  id: 'cat-1',
  name: 'Développement personnel',
  slug: 'developpement-personnel',
  description: 'Formations de développement personnel',
  imageUrl: null,
  visible: true,
  order: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockFormation = {
  id: 'form-1',
  title: 'Formation Test',
  slug: 'formation-test',
  categoryId: 'cat-1',
  description: 'Description de la formation test qui est suffisamment longue',
  program: 'Programme détaillé de la formation avec beaucoup de contenu',
  price: 299.99,
  duration: '3 jours',
  imageUrl: null,
  visible: true,
  order: 0,
  level: 'Débutant',
  maxStudents: 20,
  prerequisites: null,
  objectives: ['Objectif 1', 'Objectif 2'],
  isCertified: true,
  isFlexible: false,
  rating: 4.5,
  reviewsCount: 10,
  studentsCount: 100,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  category: mockCategory,
}

export const mockFormationWithCounts = {
  ...mockFormation,
  _count: {
    sessions: 2,
    inscriptions: 5,
  },
}

export const mockSession = {
  id: 'session-1',
  formationId: 'form-1',
  startDate: new Date('2024-06-01'),
  endDate: new Date('2024-06-03'),
  location: 'Paris',
  maxSeats: 15,
  available: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockStep = {
  id: 'step-1',
  formationId: 'form-1',
  order: 1,
  title: 'Introduction',
  description: 'Description de l\'étape',
  duration: '2 heures',
  keyPoints: ['Point 1', 'Point 2'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockFaq = {
  id: 'faq-1',
  formationId: 'form-1',
  order: 1,
  question: 'Question fréquemment posée ?',
  answer: 'Réponse à la question',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const createMockFormation = (overrides = {}) => ({
  ...mockFormation,
  ...overrides,
})

export const createMockSession = (overrides = {}) => ({
  ...mockSession,
  ...overrides,
})
