export const mockTheme = {
  id: 'theme-1',
  name: 'Bien-être',
  slug: 'bien-etre',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockBlogPost = {
  id: 'post-1',
  title: 'Article de blog test',
  slug: 'article-de-blog-test',
  excerpt: 'Résumé de l\'article de blog',
  content: '<p>Contenu de l\'article de blog avec suffisamment de texte pour passer la validation</p>',
  imageUrl: null,
  seoTitle: 'SEO Title',
  seoDescription: 'SEO Description pour le moteur de recherche',
  visible: true,
  publishedAt: new Date('2024-01-15'),
  themeId: 'theme-1',
  theme: mockTheme,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const createMockBlogPost = (overrides = {}) => ({
  ...mockBlogPost,
  ...overrides,
})
