import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (class name utility)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar')).toBe('foo bar')
    expect(cn('foo', false && 'bar')).toBe('foo')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    expect(cn('foo', null, 'bar')).toBe('foo bar')
  })

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('merges Tailwind classes correctly', () => {
    // twMerge should keep the last conflicting class
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })

  it('handles complex combinations', () => {
    expect(
      cn(
        'base-class',
        true && 'conditional-true',
        false && 'conditional-false',
        { active: true, disabled: false },
        ['array-class']
      )
    ).toBe('base-class conditional-true active array-class')
  })
})
