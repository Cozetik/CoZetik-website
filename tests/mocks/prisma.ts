import { vi } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient } from '@prisma/client'

export const prismaMock = mockDeep<PrismaClient>()

vi.mock('@/lib/prisma', () => ({
  default: prismaMock,
  prisma: prismaMock,
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export type PrismaMock = DeepMockProxy<PrismaClient>
