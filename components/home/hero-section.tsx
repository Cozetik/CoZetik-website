'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background Layer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dqmsyqdc4/video/upload/q_auto,f_auto/Dehong_School_FPV_Fly-Through_x72ykd.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Layer - 20% opacity for readability */}
      <div className="absolute inset-0 bg-black/[0.20]" />

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          {/* Main Title */}
          <h1 className="font-display text-[80px] font-normal leading-[100%] tracking-[0] text-cozetik-white md:text-[140px] lg:text-[230px]">
            COZÉTIK
          </h1>

          {/* Autographe SVG Vert - Animated */}
          <svg
            className="absolute bottom-6 -right-8 z-20 w-32 md:bottom-12 md:-right-12 md:w-48 lg:bottom-18 lg:-right-16 lg:w-64"
            style={{
              opacity: 0,
              animation: 'fadeIn 3s ease-in-out 0.5s forwards',
            }}
            viewBox="0 0 241 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M226.252 44.1806C226.639 44.1326 225.506 46.0417 212.415 54.7662C201.117 62.2966 178.514 73.146 162.292 80.6959C146.069 88.2457 136.439 91.4051 130.124 93.2007C123.808 94.9963 121.099 95.3323 119.195 95.3719C117.291 95.4115 116.276 95.1444 117.556 93.7024C118.836 92.2604 122.442 89.6515 128.584 85.6147C134.726 81.5779 143.294 76.1921 160.186 63.9115C177.078 51.6309 202.035 32.6187 217.928 21.1706C233.822 9.72241 239.896 6.41445 219.567 12.8271C199.238 19.2398 152.321 35.4734 121.4 47.2282C90.4789 58.9829 76.9752 65.7668 71.4703 69.0815C65.9653 72.3963 68.8683 72.0362 96.4123 61.6442C123.956 51.2521 176.054 30.8389 203.993 19.6952C231.932 8.55148 234.134 7.29581 234.749 6.41865C235.364 5.5415 234.324 5.08092 197.266 15.3667C160.208 25.6525 87.163 46.6986 48.3725 57.6845C9.58212 68.6705 7.25975 68.9585 6.40244 68.6718C5.54513 68.3851 6.22324 67.515 6.9219 66.6185"
              stroke="#5E985E"
              strokeWidth="12"
              strokeLinecap="round"
              className="animate-draw-signature"
            />
          </svg>
        </div>

        {/* Subtitle */}
        <p className="mt-8 font-sans text-lg font-semibold text-cozetik-white md:text-xl lg:text-2xl">
          DÉCOUVREZ NOS FORMATIONS
        </p>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-3 rounded-lg bg-black/80 p-3 backdrop-blur-lg md:bottom-10 md:left-auto md:right-10 md:translate-x-0">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          onKeyDown={(e) => handleKeyDown(e, togglePlay)}
          aria-label={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
          className="cursor-pointer text-cozetik-white transition-opacity duration-200 hover:opacity-70 active:scale-95"
          tabIndex={0}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          onKeyDown={(e) => handleKeyDown(e, toggleMute)}
          aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
          className="cursor-pointer text-cozetik-white transition-opacity duration-200 hover:opacity-70 active:scale-95"
          tabIndex={0}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </section>
  )
}
