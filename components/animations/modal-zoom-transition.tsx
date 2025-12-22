'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface ModalZoomTransitionProps {
  isOpen: boolean
  targetUrl: string
  onComplete?: () => void
}

export function ModalZoomTransition({
  isOpen,
  targetUrl,
  onComplete,
}: ModalZoomTransitionProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Navigation déclenché à ~80% de l'animation (1600ms sur 2000ms)
      // Permet de voir presque toute l'animation avant la transition
      const timer = setTimeout(() => {
        router.push(targetUrl)
        onComplete?.()
      }, 1600)

      return () => clearTimeout(timer)
    }
  }, [isOpen, targetUrl, router, onComplete])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cercle qui s'agrandit LENTEMENT comme une caméra qui zoom dans un livre */}
          <motion.div
            className="bg-cozetik-beige"
            initial={{
              scale: 0,
              opacity: 0,
              borderRadius: '50%', // Commence comme un cercle parfait
            }}
            animate={{
              scale: 3.5, // Scale plus grand pour effet "plongée"
              opacity: 1,
              borderRadius: '0%', // Se transforme en carré progressivement
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.0, // Animation TRÈS LENTE (2 secondes)
              ease: [0.33, 0, 0.1, 1], // Cubic bezier ultra smooth (easeOutQuint)
              scale: {
                duration: 2.0,
                ease: [0.22, 0.61, 0.36, 1], // Ease spécial pour effet "zoom caméra"
              },
              borderRadius: {
                duration: 1.4, // Transition cercle → carré encore plus lente
                ease: [0.65, 0, 0.35, 1],
              },
            }}
            style={{
              width: '100vw',
              height: '100vh',
              transformOrigin: 'center center',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
