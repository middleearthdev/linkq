/**
 * VideoBackground Component
 * Video background with overlay support
 */

'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  src: string
  poster?: string
  overlay?: string
  loop?: boolean
  muted?: boolean
  playbackRate?: number
}

export function VideoBackground({
  src,
  poster,
  overlay = 'rgba(0, 0, 0, 0.3)',
  loop = true,
  muted = true,
  playbackRate = 1.0,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set playback rate
    video.playbackRate = playbackRate

    // Play video when loaded
    const handleLoadedData = () => {
      setIsLoaded(true)
      video.play().catch((error) => {
        console.error('Video autoplay failed:', error)
        // Fallback: try to play on user interaction
        const playOnInteraction = () => {
          video.play().catch(() => {})
          document.removeEventListener('click', playOnInteraction)
          document.removeEventListener('touchstart', playOnInteraction)
        }
        document.addEventListener('click', playOnInteraction)
        document.addEventListener('touchstart', playOnInteraction)
      })
    }

    const handleError = () => {
      console.error('Video failed to load')
      setHasError(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [playbackRate, src])

  if (hasError) {
    // Fallback to gradient if video fails
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: 1,
        }}
      />
    )
  }

  return (
    <>
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 1 }}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: overlay,
            zIndex: 2,
          }}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-900"
          style={{ zIndex: 1 }}
        >
          <div className="text-white text-sm">Loading video...</div>
        </div>
      )}
    </>
  )
}
