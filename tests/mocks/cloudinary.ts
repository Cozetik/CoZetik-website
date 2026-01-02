import { vi } from 'vitest'

export const cloudinaryMock = {
  uploader: {
    upload: vi.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
      public_id: 'test-public-id',
    }),
    destroy: vi.fn().mockResolvedValue({ result: 'ok' }),
  },
}

vi.mock('cloudinary', () => ({
  v2: cloudinaryMock,
}))

beforeEach(() => {
  vi.clearAllMocks()
})
