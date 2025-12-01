/**
 * Custom Hook: useDragDrop
 * Handles drag and drop functionality for both desktop and mobile
 */

import { useState } from 'react'

interface UseDragDropReturn {
  // States
  draggedIndex: number | null
  dragOverIndex: number | null
  isDragging: boolean
  touchStartY: number | null

  // Desktop drag handlers
  handleDragStart: (e: React.DragEvent, index: number) => void
  handleDragEnd: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDragLeave: () => void
  handleDrop: (e: React.DragEvent, dropIndex: number, onReorder: (from: number, to: number) => void) => void

  // Mobile touch handlers
  handleTouchStart: (e: React.TouchEvent, index: number) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: (onReorder: (from: number, to: number) => void) => void

  // Reset
  resetDragState: () => void
}

export function useDragDrop(): UseDragDropReturn {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)

    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5'
      }
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1'
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (
    e: React.DragEvent,
    dropIndex: number,
    onReorder: (from: number, to: number) => void
  ) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return
    }

    onReorder(draggedIndex, dropIndex)

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedIndex(index)

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null || touchStartY === null) return

    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStartY

    // Start dragging if moved more than 10px
    if (Math.abs(deltaY) > 10 && !isDragging) {
      setIsDragging(true)
    }

    if (isDragging) {
      e.preventDefault() // Prevent scrolling

      // Find which element we're hovering over
      const elements = document.querySelectorAll('[data-draggable-index]')
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY)

      elements.forEach((el, idx) => {
        if (el.contains(targetElement)) {
          setDragOverIndex(idx)
        }
      })
    }
  }

  const handleTouchEnd = (onReorder: (from: number, to: number) => void) => {
    if (isDragging && draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorder(draggedIndex, dragOverIndex)

      // Success haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50])
      }
    }

    resetDragState()
  }

  const resetDragState = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    setTouchStartY(null)
    setIsDragging(false)
  }

  return {
    draggedIndex,
    dragOverIndex,
    isDragging,
    touchStartY,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetDragState
  }
}
