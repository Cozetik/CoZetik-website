import { vi } from 'vitest'

export const resendMock = {
  emails: {
    send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
  },
}

vi.mock('@/lib/resend', () => ({
  resend: resendMock,
}))

beforeEach(() => {
  vi.clearAllMocks()
})
