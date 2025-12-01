/**
 * WavesBackground Component
 * Animated wave background effect (Premium feature)
 */

'use client'

import { useEffect, useRef } from 'react'

export function WavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Wave parameters
    let time = 0
    const waves = [
      { amplitude: 50, frequency: 0.01, speed: 0.02, yOffset: canvas.height * 0.6, color: 'rgba(102, 126, 234, 0.3)' },
      { amplitude: 40, frequency: 0.012, speed: 0.025, yOffset: canvas.height * 0.65, color: 'rgba(118, 75, 162, 0.25)' },
      { amplitude: 60, frequency: 0.008, speed: 0.015, yOffset: canvas.height * 0.7, color: 'rgba(240, 147, 251, 0.2)' },
    ]

    // Animation loop
    let animationId: number

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(1, '#764ba2')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw each wave
      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        // Draw wave curve
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = wave.yOffset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Complete the shape
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        // Fill the wave
        ctx.fillStyle = wave.color
        ctx.fill()
      })

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
