'use client'

import { useState, useEffect, useRef } from 'react'

type ScrollDirection = 'up' | 'down' | 'none'

interface UseScrollDirectionOptions {
  threshold?: number
}

export function useScrollDirection({
  threshold = 100,
}: UseScrollDirectionOptions = {}): {
  scrollDirection: ScrollDirection
  isScrolled: boolean
} {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none')
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false
        return
      }

      setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up')
      setIsScrolled(scrollY > 10)
      lastScrollY.current = scrollY > 0 ? scrollY : 0
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return { scrollDirection, isScrolled }
}
