'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { interpolate } from 'flubber'

interface LiquidMorphTransitionProps {
  isOpen: boolean
  targetUrl: string
  onComplete?: () => void
  buttonPosition?: { x: number; y: number }
}

export function LiquidMorphTransition({
  isOpen,
  targetUrl,
  onComplete,
  buttonPosition,
}: LiquidMorphTransitionProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && pathRef.current && containerRef.current) {
      // Position initiale du blob (au niveau du bouton ou centre)
      const startX = buttonPosition?.x ?? 500
      const startY = buttonPosition?.y ?? 600

      // Forme blob initiale (petite, organique) - positionnée au bouton
      const startPath = `M${startX + 25},${startY} C${startX + 25},${startY - 13.8} ${startX + 13.8},${startY - 25} ${startX},${startY - 25} C${startX - 13.8},${startY - 25} ${startX - 25},${startY - 13.8} ${startX - 25},${startY} C${startX - 25},${startY + 13.8} ${startX - 13.8},${startY + 25} ${startX},${startY + 25} C${startX + 13.8},${startY + 25} ${startX + 25},${startY + 13.8} ${startX + 25},${startY} Z`

      // Forme blob finale (fullscreen rectangle avec courbes organiques)
      // Cette forme remplit tout le viewport
      const endPath = 'M0,0 C0,0 200,0 400,0 C600,0 800,0 1000,0 L1000,100 C1000,300 1000,500 1000,700 C1000,900 1000,1100 1000,1200 L800,1200 C600,1200 400,1200 200,1200 C0,1200 0,1200 0,1200 L0,900 C0,700 0,500 0,300 C0,100 0,0 0,0 Z'

      // Flubber interpolator
      const interpolator = interpolate(startPath, endPath, {
        maxSegmentLength: 10,
      })

      // Timeline GSAP
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(targetUrl)
          onComplete?.()
        },
      })

      // Animation du morphing
      tl.to(
        {},
        {
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: function () {
            if (pathRef.current) {
              // Interpoler la forme en fonction du progress
              const progress = this.progress()
              const morphedPath = interpolator(progress)
              pathRef.current.setAttribute('d', morphedPath)
            }
          },
        }
      )
      // Animation de scale pour effet liquide (bounce)
      .to(
        pathRef.current,
        {
          scale: 1.02,
          duration: 0.3,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1,
        },
        0.6 // Start à mi-parcours
      )
      // Fade du container pour effet smooth
      .fromTo(
        containerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        },
        0
      )

      // Cleanup
      return () => {
        tl.kill()
      }
    }
  }, [isOpen, targetUrl, router, onComplete, buttonPosition])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'transparent',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="M50,25 C50,11.2 38.8,0 25,0 C11.2,0 0,11.2 0,25 C0,38.8 11.2,50 25,50 C38.8,50 50,38.8 50,25 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="1"
          style={{
            transformOrigin: buttonPosition
              ? `${buttonPosition.x}px ${buttonPosition.y}px`
              : 'center center',
          }}
        />
      </svg>
    </div>
  )
}
