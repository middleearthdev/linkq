/**
 * Custom Hook: useDragDrop
 * Handles drag and drop functionality for both desktop and mobile
 * Features: auto-scroll, smooth animations
 */

import { useState, useRef, useEffect } from 'react'

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
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDragOverIndex = useRef<number | null>(null)
  const touchOffsetY = useRef<number>(0) // Offset from block top to initial touch

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

  // Auto-scroll when near viewport edges
  const handleAutoScroll = (clientY: number) => {
    const scrollZone = 80
    const scrollSpeed = 8
    const viewportHeight = window.innerHeight

    // Clear existing interval
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }

    // Scroll up
    if (clientY < scrollZone) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, -scrollSpeed)
      }, 16)
    }
    // Scroll down
    else if (clientY > viewportHeight - scrollZone) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, scrollSpeed)
      }, 16)
    }
  }

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setDraggedIndex(index)

    // Calculate offset from block top to touch point
    const draggedElement = document.querySelector(`[data-draggable-index="${index}"]`)
    if (draggedElement) {
      const rect = draggedElement.getBoundingClientRect()
      touchOffsetY.current = touch.clientY - rect.top
    }

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
      // Prevent scrolling immediately when dragging starts
      e.preventDefault()
    }

    if (isDragging) {
      e.preventDefault() // Prevent scrolling during drag

      // Handle auto-scroll
      handleAutoScroll(touch.clientY)

      // Find which element we're hovering over - Y-position based detection
      const elements = document.querySelectorAll('[data-draggable-index]')

      // Adjust touch Y to represent block center position (not finger position!)
      // This compensates for the fact that user touches the drag handle at the top
      const adjustedTouchY = touch.clientY - touchOffsetY.current

      let targetIndex: number | null = null

      // Convert NodeList to Array and sort by Y position
      const sortedElements = Array.from(elements).map((el, idx) => ({
        element: el,
        index: idx,
        rect: el.getBoundingClientRect()
      })).sort((a, b) => a.rect.top - b.rect.top)

      // Find which block the touch Y falls into (using adjusted position)
      for (let i = 0; i < sortedElements.length; i++) {
        const { rect, index } = sortedElements[i]
        const isFirstBlock = i === 0
        const isLastBlock = i === sortedElements.length - 1

        // For first block: from top to middle
        if (isFirstBlock && adjustedTouchY < rect.top + rect.height / 2) {
          targetIndex = index
          break
        }

        // For last block: from middle to bottom
        if (isLastBlock && adjustedTouchY >= rect.top + rect.height / 2) {
          targetIndex = index
          break
        }

        // For middle blocks: check if touch is in the half-zone between blocks
        if (!isLastBlock) {
          const nextRect = sortedElements[i + 1].rect
          const currentBottom = rect.top + rect.height / 2
          const nextTop = nextRect.top + nextRect.height / 2

          if (adjustedTouchY >= currentBottom && adjustedTouchY < nextTop) {
            // Closer to which block?
            const distToCurrent = Math.abs(adjustedTouchY - rect.top - rect.height / 2)
            const distToNext = Math.abs(adjustedTouchY - nextRect.top - nextRect.height / 2)
            targetIndex = distToCurrent < distToNext ? index : sortedElements[i + 1].index
            break
          }
        }
      }

      // Fallback: if no match, find absolute closest by center Y
      if (targetIndex === null) {
        let minDistance = Infinity
        sortedElements.forEach(({ rect, index }) => {
          const centerY = rect.top + rect.height / 2
          const distance = Math.abs(adjustedTouchY - centerY)
          if (distance < minDistance) {
            minDistance = distance
            targetIndex = index
          }
        })
      }

      // Only update if we found a valid different target
      if (targetIndex !== null && targetIndex !== dragOverIndex) {
        setDragOverIndex(targetIndex)

        // Haptic feedback when crossing to new block position
        if (lastDragOverIndex.current !== targetIndex && targetIndex !== draggedIndex) {
          if ('vibrate' in navigator) {
            navigator.vibrate(20)
          }
        }
        lastDragOverIndex.current = targetIndex
      }
    }
  }

  const handleTouchEnd = (onReorder: (from: number, to: number) => void) => {
    // Clear auto-scroll interval
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }

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
    lastDragOverIndex.current = null
    touchOffsetY.current = 0

    // Clear auto-scroll interval
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [])

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
