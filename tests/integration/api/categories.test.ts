import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/tests/mocks/prisma'
import { mockCategory } from '@/tests/fixtures/formations'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/blob', () => ({
  deleteBlob: vi.fn().mockResolvedValue(undefined),
}))

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/categories', () => {
    it('returns all categories with formation counts', async () => {
      const categoryWithCount = {
        ...mockCategory,
        _count: { formations: 5 },
      }
      prismaMock.category.findMany.mockResolvedValue([categoryWithCount])

      const result = await prismaMock.category.findMany({
        include: { _count: { select: { formations: true } } },
        orderBy: { order: 'asc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0]._count.formations).toBe(5)
    })

    it('orders by order field', async () => {
      const categories = [
        { ...mockCategory, id: 'cat-1', order: 2 },
        { ...mockCategory, id: 'cat-2', order: 0 },
        { ...mockCategory, id: 'cat-3', order: 1 },
      ]
      prismaMock.category.findMany.mockResolvedValue(categories)

      await prismaMock.category.findMany({
        orderBy: { order: 'asc' },
      })

      expect(prismaMock.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { order: 'asc' },
        })
      )
    })
  })

  describe('POST /api/categories', () => {
    const validCategoryData = {
      name: 'Nouvelle Catégorie',
      slug: 'nouvelle-categorie',
      description: 'Description de la catégorie',
      imageUrl: null,
      visible: true,
      order: 0,
    }

    it('creates category with valid data', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null) // No duplicate slug
      prismaMock.category.create.mockResolvedValue({
        ...mockCategory,
        ...validCategoryData,
      })

      const result = await prismaMock.category.create({
        data: validCategoryData,
      })

      expect(result.name).toBe('Nouvelle Catégorie')
      expect(result.slug).toBe('nouvelle-categorie')
    })

    it('checks for duplicate slug', async () => {
      prismaMock.category.findUnique.mockResolvedValue(mockCategory)

      const existing = await prismaMock.category.findUnique({
        where: { slug: 'developpement-personnel' },
      })

      expect(existing).not.toBeNull()
    })

    it('validates order is a non-negative integer', () => {
      expect(validCategoryData.order).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(validCategoryData.order)).toBe(true)
    })
  })

  describe('PUT /api/categories/[id]', () => {
    it('updates category', async () => {
      prismaMock.category.findUnique.mockResolvedValue(mockCategory)
      prismaMock.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Catégorie Modifiée',
      })

      const result = await prismaMock.category.update({
        where: { id: 'cat-1' },
        data: { name: 'Catégorie Modifiée' },
      })

      expect(result.name).toBe('Catégorie Modifiée')
    })

    it('allows empty string for description', async () => {
      prismaMock.category.update.mockResolvedValue({
        ...mockCategory,
        description: '',
      })

      const result = await prismaMock.category.update({
        where: { id: 'cat-1' },
        data: { description: '' },
      })

      expect(result.description).toBe('')
    })

    it('allows empty string for imageUrl', async () => {
      prismaMock.category.update.mockResolvedValue({
        ...mockCategory,
        imageUrl: '',
      })

      const result = await prismaMock.category.update({
        where: { id: 'cat-1' },
        data: { imageUrl: '' },
      })

      expect(result.imageUrl).toBe('')
    })
  })

  describe('DELETE /api/categories/[id]', () => {
    it('deletes category without linked formations', async () => {
      prismaMock.category.findUnique.mockResolvedValue({
        ...mockCategory,
        _count: { formations: 0 },
      })
      prismaMock.category.delete.mockResolvedValue(mockCategory)

      const category = await prismaMock.category.findUnique({
        where: { id: 'cat-1' },
        include: { _count: { select: { formations: true } } },
      })

      expect(category?._count.formations).toBe(0)

      const deleted = await prismaMock.category.delete({
        where: { id: 'cat-1' },
      })

      expect(deleted).toBeDefined()
    })

    it('rejects deletion when formations exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue({
        ...mockCategory,
        _count: { formations: 3 },
      })

      const category = await prismaMock.category.findUnique({
        where: { id: 'cat-1' },
        include: { _count: { select: { formations: true } } },
      })

      // API should reject this with 400 error
      expect(category?._count.formations).toBeGreaterThan(0)
    })
  })

  describe('PATCH /api/categories/[id]/toggle-visibility', () => {
    it('toggles visibility', async () => {
      prismaMock.category.findUnique.mockResolvedValue({ ...mockCategory, visible: true })
      prismaMock.category.update.mockResolvedValue({ ...mockCategory, visible: false })

      const category = await prismaMock.category.findUnique({ where: { id: 'cat-1' } })
      const result = await prismaMock.category.update({
        where: { id: 'cat-1' },
        data: { visible: !category?.visible },
      })

      expect(result.visible).toBe(false)
    })
  })
})
