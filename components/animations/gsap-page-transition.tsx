'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

interface GSAPPageTransitionProps {
  isOpen: boolean
  targetUrl: string
  onComplete?: () => void
}

export function GSAPPageTransition({
  isOpen,
  targetUrl,
  onComplete,
}: GSAPPageTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      // Timeline GSAP pour animation séquentielle
      const tl = gsap.timeline({
        onComplete: () => {
          // Navigation après l'animation
          router.push(targetUrl)
          onComplete?.()
        },
      })

      // Animation du cercle qui grandit en carré
      tl.fromTo(
        overlayRef.current,
        {
          scale: 0,
          borderRadius: '50%',
          opacity: 0,
        },
        {
          scale: 3.5,
          borderRadius: '0%',
          opacity: 1,
          duration: 2, // 2 secondes TRÈS LENT
          ease: 'power2.inOut', // Easing smooth
        }
      )

      // Cleanup
      return () => {
        tl.kill()
      }
    }
  }, [isOpen, targetUrl, router, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        ref={overlayRef}
        className="bg-cozetik-beige"
        style={{
          width: '100vw',
          height: '100vh',
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}
