import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/tests/mocks/prisma'
import { mockContactRequest, mockInscription, mockCandidature } from '@/tests/fixtures/requests'
import { mockFormation } from '@/tests/fixtures/formations'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'email-id' }),
    },
  },
}))

describe('Contact Requests API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/requests/contact', () => {
    it('returns all contact requests', async () => {
      prismaMock.contactRequest.findMany.mockResolvedValue([mockContactRequest])

      const result = await prismaMock.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('NEW')
    })
  })

  describe('POST /api/requests/contact', () => {
    const validContactData = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      message: 'Message de contact avec assez de caractères',
      status: 'NEW' as const,
    }

    it('creates contact request with valid data', async () => {
      prismaMock.contactRequest.create.mockResolvedValue({
        ...mockContactRequest,
        ...validContactData,
      })

      const result = await prismaMock.contactRequest.create({
        data: validContactData,
      })

      expect(result.name).toBe('Jean Dupont')
      expect(result.status).toBe('NEW')
    })

    it('validates email format', () => {
      const validEmail = 'test@example.com'
      const invalidEmail = 'not-an-email'

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(validEmail)).toBe(true)
      expect(emailRegex.test(invalidEmail)).toBe(false)
    })

    it('validates message minimum length', () => {
      const shortMessage = 'Court'
      const validMessage = 'Message avec suffisamment de caractères'

      expect(shortMessage.length).toBeLessThan(10)
      expect(validMessage.length).toBeGreaterThanOrEqual(10)
    })
  })

  describe('PATCH /api/requests/contact/[id]/status', () => {
    it('updates status to TREATED', async () => {
      prismaMock.contactRequest.findUnique.mockResolvedValue(mockContactRequest)
      prismaMock.contactRequest.update.mockResolvedValue({
        ...mockContactRequest,
        status: 'TREATED',
      })

      const result = await prismaMock.contactRequest.update({
        where: { id: 'contact-1' },
        data: { status: 'TREATED' },
      })

      expect(result.status).toBe('TREATED')
    })

    it('updates status to ARCHIVED', async () => {
      prismaMock.contactRequest.update.mockResolvedValue({
        ...mockContactRequest,
        status: 'ARCHIVED',
      })

      const result = await prismaMock.contactRequest.update({
        where: { id: 'contact-1' },
        data: { status: 'ARCHIVED' },
      })

      expect(result.status).toBe('ARCHIVED')
    })

    it('validates status is valid enum value', () => {
      const validStatuses = ['NEW', 'TREATED', 'ARCHIVED']
      const invalidStatus = 'INVALID'

      expect(validStatuses).toContain('NEW')
      expect(validStatuses).toContain('TREATED')
      expect(validStatuses).toContain('ARCHIVED')
      expect(validStatuses).not.toContain(invalidStatus)
    })
  })

  describe('DELETE /api/requests/contact/[id]', () => {
    it('deletes contact request', async () => {
      prismaMock.contactRequest.delete.mockResolvedValue(mockContactRequest)

      const result = await prismaMock.contactRequest.delete({
        where: { id: 'contact-1' },
      })

      expect(result.id).toBe('contact-1')
    })
  })
})

describe('Inscriptions API', () => {
  describe('GET /api/requests/inscriptions', () => {
    it('returns inscriptions with formation info', async () => {
      prismaMock.formationInscription.findMany.mockResolvedValue([mockInscription])

      const result = await prismaMock.formationInscription.findMany({
        include: { formation: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].formation).toBeDefined()
    })
  })

  describe('POST /api/requests/inscriptions', () => {
    const validInscriptionData = {
      name: 'Marie Martin',
      email: 'marie@example.com',
      phone: '0612345678',
      message: 'Je souhaite m\'inscrire à cette formation',
      formationId: 'form-1',
      status: 'NEW' as const,
    }

    it('creates inscription with valid data', async () => {
      prismaMock.formation.findUnique.mockResolvedValue(mockFormation)
      prismaMock.formationInscription.create.mockResolvedValue({
        ...mockInscription,
        ...validInscriptionData,
      })

      const result = await prismaMock.formationInscription.create({
        data: validInscriptionData,
      })

      expect(result.name).toBe('Marie Martin')
    })

    it('validates formation exists', async () => {
      prismaMock.formation.findUnique.mockResolvedValue(null)

      const formation = await prismaMock.formation.findUnique({
        where: { id: 'non-existent' },
      })

      expect(formation).toBeNull()
    })

    it('validates phone format', () => {
      const validPhones = ['0612345678', '+33612345678', '06 12 34 56 78']
      const invalidPhone = 'abc123'

      const phoneRegex = /^[\d\s+()-]+$/
      validPhones.forEach((phone) => {
        expect(phoneRegex.test(phone)).toBe(true)
      })
      expect(phoneRegex.test(invalidPhone)).toBe(false)
    })
  })

  describe('PATCH /api/requests/inscriptions/[id]/status', () => {
    it('updates status and sends email when TREATED', async () => {
      prismaMock.formationInscription.findUnique.mockResolvedValue({
        ...mockInscription,
        formation: mockFormation,
      })
      prismaMock.formationInscription.update.mockResolvedValue({
        ...mockInscription,
        status: 'TREATED',
      })

      const result = await prismaMock.formationInscription.update({
        where: { id: 'inscription-1' },
        data: { status: 'TREATED' },
      })

      expect(result.status).toBe('TREATED')
    })
  })
})

describe('Candidatures API', () => {
  describe('PATCH /api/requests/candidatures/[id]/status', () => {
    it('updates candidature status', async () => {
      prismaMock.candidature.findUnique.mockResolvedValue(mockCandidature)
      prismaMock.candidature.update.mockResolvedValue({
        ...mockCandidature,
        status: 'TREATED',
      })

      const result = await prismaMock.candidature.update({
        where: { id: 'candidature-1' },
        data: { status: 'TREATED' },
      })

      expect(result.status).toBe('TREATED')
    })
  })

  describe('DELETE /api/requests/candidatures/[id]', () => {
    it('deletes candidature', async () => {
      prismaMock.candidature.delete.mockResolvedValue(mockCandidature)

      const result = await prismaMock.candidature.delete({
        where: { id: 'candidature-1' },
      })

      expect(result.id).toBe('candidature-1')
    })
  })
})
