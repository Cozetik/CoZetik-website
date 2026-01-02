import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations/contact'

describe('contactSchema', () => {
  const validData = {
    name: 'Dupont',
    firstName: 'Jean',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    subject: 'Demande de renseignements',
    message: 'Je souhaite avoir plus d\'informations sur vos formations.',
    acceptPrivacy: true,
  }

  it('validates correct data', () => {
    const result = contactSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  describe('name validation', () => {
    it('rejects name shorter than 2 characters', () => {
      const result = contactSchema.safeParse({ ...validData, name: 'A' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 caractères')
      }
    })

    it('accepts name with 2+ characters', () => {
      const result = contactSchema.safeParse({ ...validData, name: 'AB' })
      expect(result.success).toBe(true)
    })
  })

  describe('firstName validation', () => {
    it('rejects firstName shorter than 2 characters', () => {
      const result = contactSchema.safeParse({ ...validData, firstName: 'A' })
      expect(result.success).toBe(false)
    })
  })

  describe('email validation', () => {
    it('rejects invalid email', () => {
      const result = contactSchema.safeParse({ ...validData, email: 'invalid-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('invalide')
      }
    })

    it('accepts valid email', () => {
      const result = contactSchema.safeParse({ ...validData, email: 'test@test.com' })
      expect(result.success).toBe(true)
    })
  })

  describe('phone validation', () => {
    it('allows optional phone', () => {
      const { phone, ...dataWithoutPhone } = validData
      const result = contactSchema.safeParse(dataWithoutPhone)
      expect(result.success).toBe(true)
    })
  })

  describe('subject validation', () => {
    it('rejects empty subject', () => {
      const result = contactSchema.safeParse({ ...validData, subject: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('message validation', () => {
    it('rejects message shorter than 10 characters', () => {
      const result = contactSchema.safeParse({ ...validData, message: 'court' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 caractères')
      }
    })

    it('accepts message with 10+ characters', () => {
      const result = contactSchema.safeParse({ ...validData, message: '1234567890' })
      expect(result.success).toBe(true)
    })
  })

  describe('acceptPrivacy validation', () => {
    it('rejects when privacy not accepted', () => {
      const result = contactSchema.safeParse({ ...validData, acceptPrivacy: false })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('politique de confidentialité')
      }
    })

    it('accepts when privacy is accepted', () => {
      const result = contactSchema.safeParse({ ...validData, acceptPrivacy: true })
      expect(result.success).toBe(true)
    })
  })
})
