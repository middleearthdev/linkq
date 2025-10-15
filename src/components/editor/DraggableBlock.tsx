/**
 * Draggable Block Component
 * Wraps blocks with drag & drop functionality
 */

"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Block } from "@/types"

interface DraggableBlockProps {
  block: Block
  children: React.ReactNode
  isSelected: boolean
  isVisible: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}

export function DraggableBlock({
  block,
  children,
  isSelected,
  isVisible,
  onSelect,
  onEdit,
  onDelete,
  onToggleVisibility
}: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50",
        !isVisible && "opacity-60"
      )}
    >
      {/* Block Content */}
      <Card
        className={cn(
          "relative cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2",
          "hover:shadow-md"
        )}
        onClick={onSelect}
      >
        {/* Drag Handle & Controls */}
        <div className={cn(
          "absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity",
          "flex flex-col gap-1 z-10"
        )}>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
        </div>

        {/* Top Controls */}
        <div className={cn(
          "absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity",
          "flex gap-1 bg-white rounded border shadow-sm p-1 z-10"
        )}>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility()
            }}
          >
            {isVisible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Block Content */}
        <div className={cn(
          "transition-opacity",
          !isVisible && "opacity-50"
        )}>
          {children}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {block.type}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}