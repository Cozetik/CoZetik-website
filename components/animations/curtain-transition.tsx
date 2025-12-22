'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

interface CurtainTransitionProps {
  isOpen: boolean
  targetUrl: string
  onComplete?: () => void
}

export function CurtainTransition({
  isOpen,
  targetUrl,
  onComplete,
}: CurtainTransitionProps) {
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && leftCurtainRef.current && rightCurtainRef.current && containerRef.current) {
      // Timeline GSAP pour orchestrer les animations
      const tl = gsap.timeline({
        onComplete: () => {
          // Navigation après l'animation
          router.push(targetUrl)
          onComplete?.()
        },
      })

      // Animation d'ouverture des rideaux + effets
      tl.fromTo(
        [leftCurtainRef.current, rightCurtainRef.current],
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: 0.1, // Légère cascade entre les deux rideaux
        }
      )
      .to(
        containerRef.current,
        {
          backdropFilter: 'blur(10px)',
          duration: 0.4,
        },
        '-=0.3' // Overlap avec l'animation précédente
      )
      .to(
        [leftCurtainRef.current, rightCurtainRef.current],
        {
          scale: 1.05, // Légère expansion pour effet de profondeur
          duration: 0.2,
          ease: 'power2.out',
        },
        '-=0.2'
      )

      // Cleanup
      return () => {
        tl.kill()
      }
    }
  }, [isOpen, targetUrl, router, onComplete])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Rideau gauche - Violet */}
      <div
        ref={leftCurtainRef}
        className="w-1/2 h-full bg-cozetik-violet origin-right"
        style={{
          transformOrigin: 'right center',
        }}
      />

      {/* Rideau droit - Beige */}
      <div
        ref={rightCurtainRef}
        className="w-1/2 h-full bg-cozetik-beige origin-left"
        style={{
          transformOrigin: 'left center',
        }}
      />
    </div>
  )
}
