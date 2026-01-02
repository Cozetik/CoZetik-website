import { mockFormation } from './formations'

export const mockContactRequest = {
  id: 'contact-1',
  name: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  message: 'Message de contact avec suffisamment de caractères',
  status: 'NEW' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockInscription = {
  id: 'inscription-1',
  name: 'Marie Martin',
  email: 'marie.martin@example.com',
  phone: '0612345678',
  message: 'Je souhaite m\'inscrire à cette formation',
  formationId: 'form-1',
  status: 'NEW' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  formation: {
    id: 'form-1',
    title: mockFormation.title,
    slug: mockFormation.slug,
  },
}

export const mockCandidature = {
  id: 'candidature-1',
  firstName: 'Pierre',
  lastName: 'Durand',
  email: 'pierre.durand@example.com',
  phone: '0698765432',
  cv: 'https://example.com/cv.pdf',
  motivation: 'Lettre de motivation détaillée',
  status: 'NEW' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const createMockContactRequest = (overrides = {}) => ({
  ...mockContactRequest,
  ...overrides,
})

export const createMockInscription = (overrides = {}) => ({
  ...mockInscription,
  ...overrides,
})

export const createMockCandidature = (overrides = {}) => ({
  ...mockCandidature,
  ...overrides,
})
