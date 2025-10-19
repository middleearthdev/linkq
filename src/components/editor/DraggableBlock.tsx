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
        isDragging && "opacity-50 scale-105",
        !isVisible && "opacity-60"
      )}
    >
      {/* Block Content */}
      <div
        className={cn(
          "relative cursor-pointer transition-all duration-200 bg-white border-2 rounded-lg shadow-sm",
          isSelected ? "border-blue-500 shadow-blue-100" : "border-gray-200 hover:border-gray-300",
          "hover:shadow-md group-hover:shadow-lg"
        )}
        onClick={onSelect}
      >
        {/* Compact Drag Handle */}
        <div className={cn(
          "absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
          "z-10"
        )}>
          <div
            className="h-6 w-3 cursor-grab active:cursor-grabbing bg-gray-200 hover:bg-gray-300 rounded-l border border-r-0 border-gray-300 flex items-center justify-center"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-2 w-2 text-gray-500" />
          </div>
        </div>

        {/* Compact Top Controls */}
        <div className={cn(
          "absolute -top-2 right-1 opacity-0 group-hover:opacity-100 transition-opacity",
          "flex gap-0.5 bg-white rounded border border-gray-300 shadow-sm p-0.5 z-10"
        )}>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility()
            }}
          >
            {isVisible ? (
              <Eye className="h-2 w-2 text-gray-600" />
            ) : (
              <EyeOff className="h-2 w-2 text-gray-400" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-2 w-2 text-blue-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-2 w-2 text-red-600" />
          </Button>
        </div>

        {/* Compact Block Type Badge */}
        {isSelected && (
          <div className="absolute top-1 left-1 z-10">
            <div className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded text-xs font-medium">
              {block.type}
            </div>
          </div>
        )}

        {/* Compact Block Content */}
        <div className={cn(
          "transition-opacity p-2",
          !isVisible && "opacity-50"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}