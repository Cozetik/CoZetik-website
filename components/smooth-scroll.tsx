'use client'

import { useEffect } from 'react'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respecter la préférence "réduire les animations" (accessibilité)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let destroy: (() => void) | undefined
    let cancelled = false

    // Démarrer le smooth-scroll APRÈS le premier affichage (libère le thread pour le LCP),
    // et charger Lenis en import dynamique (hors du bundle critique).
    const timer = window.setTimeout(async () => {
      const Lenis = (await import('lenis')).default
      if (cancelled) return

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      })

      let rafId = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      })

      destroy = () => {
        cancelAnimationFrame(rafId)
        lenis.destroy()
      }
    }, 600)

    return () => {
      cancelled = true
      clearTimeout(timer)
      destroy?.()
    }
  }, [])

  return <div data-lenis-root>{children}</div>
}
