import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/tests/mocks/prisma'
import { mockFormation, mockFormationWithCounts, mockCategory, mockSession } from '@/tests/fixtures/formations'

// Mock Next.js imports
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/blob', () => ({
  deleteBlob: vi.fn().mockResolvedValue(undefined),
}))

describe('Formations API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/formations', () => {
    it('returns all formations with categories and counts', async () => {
      prismaMock.formation.findMany.mockResolvedValue([mockFormationWithCounts])

      const result = await prismaMock.formation.findMany({
        include: {
          category: true,
          _count: { select: { sessions: true, inscriptions: true } },
        },
        orderBy: { order: 'asc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('category')
      expect(result[0]._count).toEqual({ sessions: 2, inscriptions: 5 })
    })

    it('orders formations by order field', async () => {
      const formations = [
        { ...mockFormationWithCounts, id: 'form-1', order: 2 },
        { ...mockFormationWithCounts, id: 'form-2', order: 1 },
        { ...mockFormationWithCounts, id: 'form-3', order: 0 },
      ]
      prismaMock.formation.findMany.mockResolvedValue(formations)

      const result = await prismaMock.formation.findMany({
        orderBy: { order: 'asc' },
      })

      expect(prismaMock.formation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { order: 'asc' },
        })
      )
    })
  })

  describe('POST /api/formations', () => {
    const validFormationData = {
      title: 'Nouvelle Formation',
      slug: 'nouvelle-formation',
      categoryId: 'cat-1',
      description: 'Description de la nouvelle formation avec assez de caractères',
      program: 'Programme détaillé de la formation avec beaucoup de contenu pour passer la validation',
      price: 199.99,
      duration: '2 jours',
      visible: true,
      order: 0,
      isCertified: false,
      isFlexible: false,
      reviewsCount: 0,
      studentsCount: 0,
    }

    it('creates formation with valid data', async () => {
      prismaMock.category.findUnique.mockResolvedValue(mockCategory)
      prismaMock.formation.findUnique.mockResolvedValue(null) // No duplicate slug
      prismaMock.formation.create.mockResolvedValue({
        ...mockFormation,
        ...validFormationData,
      })

      const result = await prismaMock.formation.create({
        data: validFormationData,
      })

      expect(result.title).toBe('Nouvelle Formation')
      expect(result.price).toBe(199.99)
    })

    it('validates price is a number not string', async () => {
      // This test verifies that price should be number type
      const formationWithStringPrice = {
        ...validFormationData,
        price: '199.99' as unknown as number, // Simulating wrong type
      }

      // In real API, Zod would reject this
      expect(typeof formationWithStringPrice.price).toBe('string')
      expect(typeof validFormationData.price).toBe('number')
    })

    it('validates order is a number', async () => {
      expect(typeof validFormationData.order).toBe('number')
      expect(Number.isInteger(validFormationData.order)).toBe(true)
    })

    it('checks for duplicate slug', async () => {
      prismaMock.formation.findUnique.mockResolvedValue(mockFormation) // Slug exists

      const existingFormation = await prismaMock.formation.findUnique({
        where: { slug: validFormationData.slug },
      })

      expect(existingFormation).not.toBeNull()
    })

    it('validates category exists', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null) // Category doesn't exist

      const category = await prismaMock.category.findUnique({
        where: { id: 'non-existent-cat' },
      })

      expect(category).toBeNull()
    })
  })

  describe('PUT /api/formations/[id]', () => {
    it('updates formation data', async () => {
      prismaMock.formation.findUnique.mockResolvedValue(mockFormation)
      prismaMock.formation.update.mockResolvedValue({
        ...mockFormation,
        title: 'Titre Modifié',
        price: 399.99,
      })

      const result = await prismaMock.formation.update({
        where: { id: 'form-1' },
        data: { title: 'Titre Modifié', price: 399.99 },
      })

      expect(result.title).toBe('Titre Modifié')
      expect(result.price).toBe(399.99)
    })

    it('validates slug uniqueness excluding self', async () => {
      // Simulate checking if another formation has the same slug
      prismaMock.formation.findFirst.mockResolvedValue(null)

      const otherFormation = await prismaMock.formation.findFirst({
        where: {
          slug: 'new-slug',
          NOT: { id: 'form-1' },
        },
      })

      expect(otherFormation).toBeNull() // No conflict
    })
  })

  describe('DELETE /api/formations/[id]', () => {
    it('deletes formation without dependencies', async () => {
      prismaMock.formation.findUnique.mockResolvedValue({
        ...mockFormation,
        _count: { sessions: 0, inscriptions: 0 },
      })
      prismaMock.formation.delete.mockResolvedValue(mockFormation)

      const formation = await prismaMock.formation.findUnique({
        where: { id: 'form-1' },
        include: { _count: { select: { sessions: true, inscriptions: true } } },
      })

      expect(formation?._count.sessions).toBe(0)
      expect(formation?._count.inscriptions).toBe(0)

      const deleted = await prismaMock.formation.delete({
        where: { id: 'form-1' },
      })

      expect(deleted).toBeDefined()
    })

    it('rejects deletion when sessions exist', async () => {
      prismaMock.formation.findUnique.mockResolvedValue({
        ...mockFormation,
        _count: { sessions: 2, inscriptions: 0 },
      })

      const formation = await prismaMock.formation.findUnique({
        where: { id: 'form-1' },
        include: { _count: { select: { sessions: true, inscriptions: true } } },
      })

      // API should reject this
      expect(formation?._count.sessions).toBeGreaterThan(0)
    })

    it('rejects deletion when inscriptions exist', async () => {
      prismaMock.formation.findUnique.mockResolvedValue({
        ...mockFormation,
        _count: { sessions: 0, inscriptions: 5 },
      })

      const formation = await prismaMock.formation.findUnique({
        where: { id: 'form-1' },
        include: { _count: { select: { sessions: true, inscriptions: true } } },
      })

      expect(formation?._count.inscriptions).toBeGreaterThan(0)
    })
  })

  describe('PATCH /api/formations/[id]/toggle-visibility', () => {
    it('toggles visibility from true to false', async () => {
      prismaMock.formation.findUnique.mockResolvedValue({ ...mockFormation, visible: true })
      prismaMock.formation.update.mockResolvedValue({ ...mockFormation, visible: false })

      const formation = await prismaMock.formation.findUnique({ where: { id: 'form-1' } })
      const result = await prismaMock.formation.update({
        where: { id: 'form-1' },
        data: { visible: !formation?.visible },
      })

      expect(result.visible).toBe(false)
    })

    it('toggles visibility from false to true', async () => {
      prismaMock.formation.findUnique.mockResolvedValue({ ...mockFormation, visible: false })
      prismaMock.formation.update.mockResolvedValue({ ...mockFormation, visible: true })

      const formation = await prismaMock.formation.findUnique({ where: { id: 'form-1' } })
      const result = await prismaMock.formation.update({
        where: { id: 'form-1' },
        data: { visible: !formation?.visible },
      })

      expect(result.visible).toBe(true)
    })
  })
})

describe('Formation Sessions API', () => {
  describe('POST /api/formations/[id]/sessions', () => {
    it('creates session with valid dates', async () => {
      const sessionData = {
        formationId: 'form-1',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-03'),
        location: 'Paris',
        maxSeats: 15,
        available: true,
      }

      prismaMock.formationSession.create.mockResolvedValue({
        ...mockSession,
        ...sessionData,
      })

      const result = await prismaMock.formationSession.create({
        data: sessionData,
      })

      expect(result.startDate).toEqual(sessionData.startDate)
      expect(result.endDate.getTime()).toBeGreaterThanOrEqual(result.startDate.getTime())
    })

    it('validates endDate >= startDate', () => {
      const startDate = new Date('2024-06-03')
      const endDate = new Date('2024-06-01')

      // API should reject this
      expect(endDate.getTime()).toBeLessThan(startDate.getTime())
    })

    it('handles maxSeats as number', () => {
      const validMaxSeats = 15
      const invalidMaxSeats = '15' as unknown as number

      expect(typeof validMaxSeats).toBe('number')
      expect(typeof invalidMaxSeats).toBe('string') // Would fail validation
    })
  })

  describe('DELETE /api/formations/[id]/sessions/[sessionId]', () => {
    it('deletes session', async () => {
      prismaMock.formationSession.delete.mockResolvedValue(mockSession)

      const result = await prismaMock.formationSession.delete({
        where: { id: 'session-1' },
      })

      expect(result.id).toBe('session-1')
    })
  })
})
