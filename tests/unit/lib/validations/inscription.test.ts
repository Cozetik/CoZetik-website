import { describe, it, expect } from 'vitest'
import { inscriptionSchema } from '@/lib/validations/inscription'

describe('inscriptionSchema', () => {
  const validData = {
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    phone: '0612345678',
    message: 'Je souhaite m\'inscrire à cette formation.',
    formationId: 'clxxxxxxxxxxxxxxxxxxxxxxxxxx', // CUID format
  }

  it('validates correct data', () => {
    const result = inscriptionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  describe('name validation', () => {
    it('rejects name shorter than 2 characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, name: 'A' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 caractères')
      }
    })

    it('rejects name longer than 100 characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, name: 'A'.repeat(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('100 caractères')
      }
    })

    it('accepts valid name', () => {
      const result = inscriptionSchema.safeParse({ ...validData, name: 'Jean-Pierre Dupont' })
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('rejects invalid email', () => {
      const result = inscriptionSchema.safeParse({ ...validData, email: 'not-an-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('invalide')
      }
    })

    it('accepts valid email formats', () => {
      const validEmails = ['test@example.com', 'user+tag@domain.fr', 'name.surname@company.co.uk']
      validEmails.forEach((email) => {
        const result = inscriptionSchema.safeParse({ ...validData, email })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('phone validation', () => {
    it('rejects phone shorter than 10 characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, phone: '0612345' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 caractères')
      }
    })

    it('rejects phone with invalid characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, phone: '06-12-34-56-78-abc' })
      expect(result.success).toBe(false)
    })

    it('accepts valid phone formats', () => {
      const validPhones = ['0612345678', '+33612345678', '06 12 34 56 78', '06-12-34-56-78', '(+33) 6 12 34 56 78']
      validPhones.forEach((phone) => {
        const result = inscriptionSchema.safeParse({ ...validData, phone })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('message validation', () => {
    it('rejects message shorter than 10 characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, message: 'court' })
      expect(result.success).toBe(false)
    })

    it('rejects message longer than 1000 characters', () => {
      const result = inscriptionSchema.safeParse({ ...validData, message: 'A'.repeat(1001) })
      expect(result.success).toBe(false)
    })

    it('accepts message with valid length', () => {
      const result = inscriptionSchema.safeParse({ ...validData, message: 'A'.repeat(500) })
      expect(result.success).toBe(true)
    })
  })

  describe('formationId validation', () => {
    it('rejects invalid CUID', () => {
      const result = inscriptionSchema.safeParse({ ...validData, formationId: 'invalid-id' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('invalide')
      }
    })

    it('accepts valid CUID', () => {
      const result = inscriptionSchema.safeParse({ ...validData, formationId: 'clxxxxxxxxxxxxxxxxxxxxxxxxxx' })
      expect(result.success).toBe(true)
    })
  })
})
