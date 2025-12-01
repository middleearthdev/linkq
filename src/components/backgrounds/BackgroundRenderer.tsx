/**
 * BackgroundRenderer Component
 * Renders background based on type from registry
 */

'use client'

import { useEffect, useState } from 'react'
import { getBackground, getBackgroundStyles } from '@/lib/backgrounds/registry'
import { ParticlesBackground } from './ParticlesBackground'
import { WavesBackground } from './WavesBackground'
import { StarsBackground } from './StarsBackground'
import { MatrixBackground } from './MatrixBackground'
import { VideoBackground } from './VideoBackground'

interface BackgroundRendererProps {
  backgroundKey: string
  className?: string
  children?: React.ReactNode
}

export function BackgroundRenderer({
  backgroundKey,
  className = '',
  children,
}: BackgroundRendererProps) {
  const [mounted, setMounted] = useState(false)
  const background = getBackground(backgroundKey)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render animated backgrounds on server
  if (!mounted && background?.type === 'animated') {
    return (
      <div className={className} style={{ background: '#000000' }}>
        {children}
      </div>
    )
  }

  // Handle animated backgrounds with React components
  if (background?.type === 'animated' && background.component) {
    const styles = getBackgroundStyles(backgroundKey)

    return (
      <div className={`relative ${className}`} style={styles}>
        {/* Animated background component */}
        {background.component === 'ParticlesBackground' && (
          <ParticlesBackground />
        )}
        {background.component === 'WavesBackground' && (
          <WavesBackground />
        )}
        {background.component === 'StarsBackground' && (
          <StarsBackground />
        )}
        {background.component === 'MatrixBackground' && (
          <MatrixBackground />
        )}

        {/* Content overlay */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  // Handle video backgrounds
  if (background?.type === 'video') {
    const styles = getBackgroundStyles(backgroundKey)

    return (
      <div className={`relative ${className}`} style={styles}>
        {/* Video background component */}
        <VideoBackground
          src={background.value}
          poster={background.poster}
          overlay={background.overlay}
          loop={background.loop}
          muted={background.muted}
          playbackRate={background.playbackRate}
        />

        {/* Content overlay */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  // Handle regular backgrounds (solid, gradient, pattern, image)
  const styles = getBackgroundStyles(backgroundKey)

  // Add background-size animation for animated gradients
  if (background?.type === 'animated' && background.animation) {
    styles.backgroundSize = '400% 400%'
  }

  return (
    <div className={className} style={styles}>
      {/* Background overlay for images */}
      {background?.type === 'image' && background.overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: background.overlay,
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes gradient-flow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes aurora-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `
  document.head.appendChild(style)
}
