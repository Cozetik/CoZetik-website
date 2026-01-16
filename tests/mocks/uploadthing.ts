import { vi } from 'vitest'

// Mock pour Uploadthing UTApi
export const uploadthingMock = {
  uploadFiles: vi.fn().mockResolvedValue({
    data: {
      url: 'https://utfs.io/f/test-file-key.jpg',
      key: 'test-file-key',
    },
    error: null,
  }),
  deleteFiles: vi.fn().mockResolvedValue({ success: true }),
}

// Mock du module uploadthing/server
vi.mock('uploadthing/server', () => ({
  UTApi: vi.fn().mockImplementation(() => uploadthingMock),
}))

// Reset des mocks avant chaque test
beforeEach(() => {
  vi.clearAllMocks()
})
