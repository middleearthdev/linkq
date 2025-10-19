/**
 * Editor Canvas Component
 * Main canvas area for drag & drop block editing
 */

"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  SensorDescriptor
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DraggableBlock } from "@/components/editor/DraggableBlock"
import { Plus, Eye, Smartphone, Monitor, Tablet, Layout, Layers } from "lucide-react"
import { Block } from "@/types"
import { BLOCK_REGISTRY } from "@/components/blocks/registry"
import { cn } from "@/lib/utils"

interface EditorCanvasProps {
  blocks: Block[]
  selectedBlockId: string | null
  viewport: "mobile" | "tablet" | "desktop"
  onViewportChange: (viewport: "mobile" | "tablet" | "desktop") => void
  onSelectBlock: (blockId: string) => void
  onEditBlock: (blockId: string) => void
  onDeleteBlock: (blockId: string) => void
  onDragEnd: (event: DragEndEvent) => void
  sensors: SensorDescriptor<any>[]
  className?: string
  showAddBlock?: (blockType: string) => void
}

export function EditorCanvas({
  blocks,
  selectedBlockId,
  viewport,
  onViewportChange,
  onSelectBlock,
  onEditBlock,
  onDeleteBlock,
  onDragEnd,
  sensors,
  className,
  showAddBlock
}: EditorCanvasProps) {
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null)

  const getViewportClass = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-md"
      case "desktop":
        return "max-w-lg"
      default:
        return "max-w-sm"
    }
  }

  const getViewportIcon = (vp: typeof viewport) => {
    switch (vp) {
      case "mobile":
        return <Smartphone className="h-3 w-3" />
      case "tablet":
        return <Tablet className="h-3 w-3" />
      case "desktop":
        return <Monitor className="h-3 w-3" />
    }
  }

  const renderBlockPreview = (block: Block) => {
    const BlockComponent = BLOCK_REGISTRY[block.type]
    if (!BlockComponent) {
      return (
        <div className="bg-gray-50 rounded border min-h-[40px] flex items-center justify-center">
          <span className="text-xs text-gray-600">Unknown: {block.type}</span>
        </div>
      )
    }

    return (
      <div className="pointer-events-none">
        <div className="bg-white rounded border min-h-[40px] flex items-center relative overflow-hidden">
          {/* Compact Preview Content */}
          <div className="flex items-center gap-2 w-full px-2 py-1">
            <div className="flex-shrink-0">
              <div 
                className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center"
              >
                <span className="text-xs text-blue-600 font-bold">
                  {block.type.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">
                {BLOCK_REGISTRY[block.type]?.name || block.type}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {block.props.name || block.props.title || 'Click to configure'}
              </div>
            </div>
            <div className="flex-shrink-0 text-xs text-gray-400">
              {Object.keys(block.props).length} props
            </div>
          </div>
        </div>
      </div>
    )
  }

  const quickAddBlocks = [
    { type: 'bio', name: 'Bio', icon: '👤' },
    { type: 'link-list', name: 'Links', icon: '🔗' },
    { type: 'social-icons', name: 'Social', icon: '📱' },
    { type: 'cta', name: 'CTA', icon: '📢' },
  ]

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className={`mx-auto transition-all duration-200 ${getViewportClass()}`}>
            <div className="min-h-[400px] bg-gray-50 rounded border border-dashed border-gray-300 relative">
              
              {/* Empty State */}
              {blocks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <Layout className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Start Building
                  </h3>
                  <p className="text-gray-500 text-xs mb-6">
                    Add blocks from the sidebar
                  </p>
                  
                  {/* Compact Quick Add */}
                  {showAddBlock && (
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600 mb-2">Quick Start:</div>
                      <div className="grid grid-cols-2 gap-2 max-w-32 mx-auto">
                        {quickAddBlocks.slice(0, 4).map((block) => (
                          <Button
                            key={block.type}
                            onClick={() => showAddBlock(block.type)}
                            variant="outline"
                            size="sm"
                            className="h-12 flex flex-col gap-1 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-xs"
                          >
                            <span className="text-lg">{block.icon}</span>
                            <span className="text-xs">{block.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Blocks */
                <div className="p-3">
                  <DndContext
                    sensors={sensors}
                    onDragEnd={onDragEnd}
                    onDragStart={(event) => {
                      const block = blocks.find(b => b.id === event.active.id)
                      setDraggedBlock(block || null)
                    }}
                    onDragCancel={() => setDraggedBlock(null)}
                  >
                    <SortableContext
                      items={blocks.map(block => block.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {blocks.map((block) => (
                          <DraggableBlock
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            isVisible={block.isVisible}
                            onSelect={() => onSelectBlock(block.id)}
                            onEdit={() => onEditBlock(block.id)}
                            onDelete={() => onDeleteBlock(block.id)}
                            onToggleVisibility={() => {
                              // TODO: Implement visibility toggle
                            }}
                          >
                            {renderBlockPreview(block)}
                          </DraggableBlock>
                        ))}
                      </div>
                    </SortableContext>

                    {/* Drag Overlay */}
                    <DragOverlay>
                      {draggedBlock ? (
                        <div className="opacity-90 scale-105 shadow-2xl">
                          <DraggableBlock
                            block={draggedBlock}
                            isSelected={false}
                            isVisible={true}
                            onSelect={() => {}}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onToggleVisibility={() => {}}
                          >
                            {renderBlockPreview(draggedBlock)}
                          </DraggableBlock>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>

                  {/* Compact Add Block Zone */}
                  {showAddBlock && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-2">Add more blocks</p>
                        <div className="flex justify-center gap-1 flex-wrap">
                          {quickAddBlocks.map((block) => (
                            <Button
                              key={block.type}
                              onClick={() => showAddBlock(block.type)}
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                            >
                              <span className="mr-1">{block.icon}</span>
                              {block.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}