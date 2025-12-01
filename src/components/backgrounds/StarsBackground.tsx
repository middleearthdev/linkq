/**
 * StarsBackground Component
 * Animated starfield background effect (Premium feature)
 */

'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

export function StarsBackground() {
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

    // Create stars
    const stars: Star[] = []
    const starCount = 200

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      // Create deep space background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      )
      gradient.addColorStop(0, '#0a0a1e')
      gradient.addColorStop(0.5, '#050510')
      gradient.addColorStop(1, '#000000')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      stars.forEach((star) => {
        // Move star towards viewer
        star.z -= 2

        // Reset star if it's too close
        if (star.z <= 0) {
          star.z = canvas.width
          star.x = Math.random() * canvas.width
          star.y = Math.random() * canvas.height
        }

        // Calculate 3D perspective
        const k = 128.0 / star.z
        const px = (star.x - canvas.width / 2) * k + canvas.width / 2
        const py = (star.y - canvas.height / 2) * k + canvas.height / 2

        // Skip if star is off screen
        if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) {
          return
        }

        // Calculate size based on distance
        const size = (1 - star.z / canvas.width) * star.size * 3

        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        const opacity = star.opacity * (0.7 + twinkle * 0.3) * (1 - star.z / canvas.width)

        // Draw star
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)

        // Create gradient for glow effect
        const starGradient = ctx.createRadialGradient(px, py, 0, px, py, size * 2)
        starGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        starGradient.addColorStop(0.5, `rgba(200, 200, 255, ${opacity * 0.5})`)
        starGradient.addColorStop(1, `rgba(150, 150, 255, 0)`)

        ctx.fillStyle = starGradient
        ctx.fill()

        // Add shooting stars occasionally
        if (Math.random() > 0.999) {
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px - size * 5, py - size * 5)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`
          ctx.lineWidth = size * 0.5
          ctx.stroke()
        }
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
