import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world')
  })

  it('removes accents', () => {
    expect(slugify('café résumé')).toBe('cafe-resume')
    expect(slugify('développement')).toBe('developpement')
    expect(slugify('être')).toBe('etre')
  })

  it('removes special characters', () => {
    expect(slugify('hello & world')).toBe('hello-world')
    expect(slugify('IA & Machine Learning')).toBe('ia-machine-learning')
    expect(slugify('test@email.com')).toBe('testemailcom')
  })

  it('handles multiple spaces', () => {
    expect(slugify('hello    world')).toBe('hello-world')
  })

  it('handles multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })

  it('trims whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('removes leading and trailing hyphens', () => {
    expect(slugify('-hello world-')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles French characters', () => {
    expect(slugify('Développement personnel')).toBe('developpement-personnel')
    expect(slugify('Bien-être')).toBe('bien-etre')
    expect(slugify('Thérapie holistique')).toBe('therapie-holistique')
  })

  it('handles numbers', () => {
    expect(slugify('Formation niveau 2')).toBe('formation-niveau-2')
    expect(slugify('123 test')).toBe('123-test')
  })

  it('handles mixed content', () => {
    expect(slugify('Bien-être & Développement (Niveau 1)')).toBe('bien-etre-developpement-niveau-1')
  })
})
