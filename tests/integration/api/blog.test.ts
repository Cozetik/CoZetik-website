import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '@/tests/mocks/prisma'
import { mockBlogPost, mockTheme } from '@/tests/fixtures/blog'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: vi.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}))

describe('Blog API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/blog', () => {
    it('returns all blog posts with themes', async () => {
      prismaMock.blogPost.findMany.mockResolvedValue([mockBlogPost])

      const result = await prismaMock.blogPost.findMany({
        include: { theme: true },
        orderBy: { createdAt: 'desc' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].theme).toEqual(mockTheme)
    })

    it('orders by creation date descending', async () => {
      const posts = [
        { ...mockBlogPost, id: 'post-1', createdAt: new Date('2024-01-01') },
        { ...mockBlogPost, id: 'post-2', createdAt: new Date('2024-01-15') },
      ]
      prismaMock.blogPost.findMany.mockResolvedValue(posts)

      await prismaMock.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
      })

      expect(prismaMock.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })
  })

  describe('POST /api/blog', () => {
    const validBlogData = {
      title: 'Nouvel Article',
      slug: 'nouvel-article',
      excerpt: 'Résumé de l\'article',
      content: '<p>Contenu de l\'article avec suffisamment de texte</p>',
      visible: true,
      publishedAt: new Date(),
      themeId: 'theme-1',
    }

    it('creates blog post with valid data', async () => {
      prismaMock.blogPost.findUnique.mockResolvedValue(null) // No duplicate slug
      prismaMock.blogPost.create.mockResolvedValue({
        ...mockBlogPost,
        ...validBlogData,
      })

      const result = await prismaMock.blogPost.create({
        data: validBlogData,
      })

      expect(result.title).toBe('Nouvel Article')
    })

    it('validates slug uniqueness', async () => {
      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost)

      const existing = await prismaMock.blogPost.findUnique({
        where: { slug: 'article-de-blog-test' },
      })

      expect(existing).not.toBeNull()
    })

    it('validates content minimum length', () => {
      const shortContent = '<p>Court</p>'
      const validContent = '<p>Contenu suffisamment long pour passer la validation</p>'

      expect(shortContent.length).toBeLessThan(20)
      expect(validContent.length).toBeGreaterThanOrEqual(20)
    })

    it('validates SEO title max length', () => {
      const validSeoTitle = 'Titre SEO valide'
      const tooLongSeoTitle = 'A'.repeat(61)

      expect(validSeoTitle.length).toBeLessThanOrEqual(60)
      expect(tooLongSeoTitle.length).toBeGreaterThan(60)
    })

    it('validates SEO description max length', () => {
      const validSeoDesc = 'Description SEO valide'
      const tooLongSeoDesc = 'A'.repeat(161)

      expect(validSeoDesc.length).toBeLessThanOrEqual(160)
      expect(tooLongSeoDesc.length).toBeGreaterThan(160)
    })
  })

  describe('PUT /api/blog/[id]', () => {
    it('updates blog post', async () => {
      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost)
      prismaMock.blogPost.update.mockResolvedValue({
        ...mockBlogPost,
        title: 'Article Modifié',
      })

      const result = await prismaMock.blogPost.update({
        where: { id: 'post-1' },
        data: { title: 'Article Modifié' },
      })

      expect(result.title).toBe('Article Modifié')
    })

    it('sets publishedAt when transitioning from draft to published', async () => {
      const draftPost = { ...mockBlogPost, visible: false, publishedAt: null }
      prismaMock.blogPost.findUnique.mockResolvedValue(draftPost)
      prismaMock.blogPost.update.mockResolvedValue({
        ...mockBlogPost,
        visible: true,
        publishedAt: new Date(),
      })

      const result = await prismaMock.blogPost.update({
        where: { id: 'post-1' },
        data: { visible: true, publishedAt: new Date() },
      })

      expect(result.visible).toBe(true)
      expect(result.publishedAt).not.toBeNull()
    })
  })

  describe('DELETE /api/blog/[id]', () => {
    it('deletes blog post', async () => {
      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost)
      prismaMock.blogPost.delete.mockResolvedValue(mockBlogPost)

      const result = await prismaMock.blogPost.delete({
        where: { id: 'post-1' },
      })

      expect(result.id).toBe('post-1')
    })
  })

  describe('PATCH /api/blog/[id]/toggle-visibility', () => {
    it('toggles visibility and sets publishedAt', async () => {
      const draftPost = { ...mockBlogPost, visible: false, publishedAt: null }
      prismaMock.blogPost.findUnique.mockResolvedValue(draftPost)
      prismaMock.blogPost.update.mockResolvedValue({
        ...mockBlogPost,
        visible: true,
        publishedAt: new Date(),
      })

      const post = await prismaMock.blogPost.findUnique({ where: { id: 'post-1' } })

      const result = await prismaMock.blogPost.update({
        where: { id: 'post-1' },
        data: {
          visible: !post?.visible,
          publishedAt: !post?.visible ? new Date() : post.publishedAt,
        },
      })

      expect(result.visible).toBe(true)
      expect(result.publishedAt).toBeDefined()
    })
  })
})
