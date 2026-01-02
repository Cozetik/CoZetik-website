export const mockPartner = {
  id: 'partner-1',
  name: 'Partenaire Test',
  description: 'Description du partenaire test',
  logoUrl: null,
  websiteUrl: 'https://example.com',
  visible: true,
  order: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const createMockPartner = (overrides = {}) => ({
  ...mockPartner,
  ...overrides,
})
