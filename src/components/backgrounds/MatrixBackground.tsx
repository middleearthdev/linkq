/**
 * MatrixBackground Component
 * Matrix rain background effect (Premium feature)
 */

'use client'

import { useEffect, useRef } from 'react'

interface MatrixColumn {
  x: number
  y: number
  speed: number
  characters: string[]
}

export function MatrixBackground() {
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

    // Matrix characters (katakana, numbers, symbols)
    const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)

    // Create matrix columns
    const matrixColumns: MatrixColumn[] = []
    for (let i = 0; i < columns; i++) {
      matrixColumns.push({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        characters: [],
      })
    }

    // Get random character
    const getRandomChar = () => {
      return matrixChars[Math.floor(Math.random() * matrixChars.length)]
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      // Add trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.font = `${fontSize}px monospace`

      // Draw each column
      matrixColumns.forEach((column, index) => {
        // Random character for this frame
        const char = getRandomChar()

        // Calculate color (green with varying brightness)
        const brightness = Math.random() * 155 + 100
        const greenShade = Math.floor(brightness)

        // Leading character (brighter)
        ctx.fillStyle = `rgb(${greenShade * 0.3}, ${greenShade}, ${greenShade * 0.3})`
        ctx.fillText(char, column.x, column.y)

        // Add some glitch effect randomly
        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgb(255, 255, 255)`
          ctx.fillText(char, column.x, column.y)
        }

        // Update position
        column.y += column.speed

        // Reset column when it goes off screen
        if (column.y > canvas.height) {
          column.y = 0
          column.speed = Math.random() * 2 + 1

          // Occasionally reset column at different positions
          if (Math.random() > 0.9) {
            column.y = -Math.random() * canvas.height
          }
        }

        // Occasionally change character
        if (Math.random() > 0.95) {
          column.characters.push(char)
          if (column.characters.length > 20) {
            column.characters.shift()
          }
        }
      })

      // Add some random flashes
      if (Math.random() > 0.97) {
        const flashX = Math.random() * canvas.width
        const flashY = Math.random() * canvas.height
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'
        ctx.fillText(getRandomChar(), flashX, flashY)
      }

      animationId = requestAnimationFrame(animate)
    }

    // Initial black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

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
