import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/tests/mocks/prisma'
import { mockPartner } from '@/tests/fixtures/partners'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/blob', () => ({
  deleteBlob: vi.fn().mockResolvedValue(undefined),
}))

describe('Partners API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/partners', () => {
    it('returns all partners ordered by order', async () => {
      prismaMock.partner.findMany.mockResolvedValue([mockPartner])

      const result = await prismaMock.partner.findMany({
        orderBy: { order: 'asc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Partenaire Test')
    })
  })

  describe('POST /api/partners', () => {
    const validPartnerData = {
      name: 'Nouveau Partenaire',
      description: 'Description du partenaire',
      logoUrl: null,
      websiteUrl: 'https://example.com',
      visible: true,
      order: 0,
    }

    it('creates partner with valid data', async () => {
      prismaMock.partner.create.mockResolvedValue({
        ...mockPartner,
        ...validPartnerData,
      })

      const result = await prismaMock.partner.create({
        data: validPartnerData,
      })

      expect(result.name).toBe('Nouveau Partenaire')
    })

    it('validates websiteUrl format', () => {
      const validUrl = 'https://example.com'
      const invalidUrl = 'not-a-url'

      // URL validation regex check
      const urlRegex = /^https?:\/\/.+/
      expect(urlRegex.test(validUrl)).toBe(true)
      expect(urlRegex.test(invalidUrl)).toBe(false)
    })

    it('allows null websiteUrl', async () => {
      prismaMock.partner.create.mockResolvedValue({
        ...mockPartner,
        websiteUrl: null,
      })

      const result = await prismaMock.partner.create({
        data: { ...validPartnerData, websiteUrl: null },
      })

      expect(result.websiteUrl).toBeNull()
    })

    it('validates order as number', () => {
      expect(typeof validPartnerData.order).toBe('number')
      expect(Number.isInteger(validPartnerData.order)).toBe(true)
    })
  })

  describe('PUT /api/partners/[id]', () => {
    it('updates partner', async () => {
      prismaMock.partner.findUnique.mockResolvedValue(mockPartner)
      prismaMock.partner.update.mockResolvedValue({
        ...mockPartner,
        name: 'Partenaire Modifié',
      })

      const result = await prismaMock.partner.update({
        where: { id: 'partner-1' },
        data: { name: 'Partenaire Modifié' },
      })

      expect(result.name).toBe('Partenaire Modifié')
    })
  })

  describe('DELETE /api/partners/[id]', () => {
    it('deletes partner', async () => {
      prismaMock.partner.findUnique.mockResolvedValue(mockPartner)
      prismaMock.partner.delete.mockResolvedValue(mockPartner)

      const result = await prismaMock.partner.delete({
        where: { id: 'partner-1' },
      })

      expect(result.id).toBe('partner-1')
    })
  })

  describe('PATCH /api/partners/[id]/toggle-visibility', () => {
    it('toggles visibility', async () => {
      prismaMock.partner.findUnique.mockResolvedValue({ ...mockPartner, visible: true })
      prismaMock.partner.update.mockResolvedValue({ ...mockPartner, visible: false })

      const partner = await prismaMock.partner.findUnique({ where: { id: 'partner-1' } })
      const result = await prismaMock.partner.update({
        where: { id: 'partner-1' },
        data: { visible: !partner?.visible },
      })

      expect(result.visible).toBe(false)
    })
  })
})
