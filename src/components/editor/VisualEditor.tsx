/**
 * Visual Editor Component
 * Main editor interface with drag & drop functionality
 */

"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditorSidebar } from "./EditorSidebar"
import { DraggableBlock } from "./DraggableBlock"
import { BlockEditor } from "./BlockEditor"
import { Save, Eye, Smartphone, Monitor, Tablet } from "lucide-react"
import { Block, SiteData, UserEntitlements } from "@/types"
import { BLOCK_REGISTRY, BLOCK_COMPONENTS } from "@/components/blocks/registry"
import { generateId } from "@/lib/utils"

interface VisualEditorProps {
  siteData: SiteData
  entitlements: UserEntitlements
  onSave: (siteData: SiteData) => void
  onPreview: () => void
}

export function VisualEditor({
  siteData,
  entitlements,
  onSave,
  onPreview
}: VisualEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(siteData.data.blocks || [])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null
  const editingBlock = editingBlockId ? blocks.find(b => b.id === editingBlockId) || null : null

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex(block => block.id === active.id)
        const newIndex = blocks.findIndex(block => block.id === over.id)
        return arrayMove(blocks, oldIndex, newIndex)
      })
    }
  }, [])

  const handleAddBlock = useCallback((blockType: string) => {
    const blockDefinition = BLOCK_REGISTRY[blockType]
    if (!blockDefinition) return

    const newBlock: Block = {
      id: generateId(),
      type: blockType,
      props: blockDefinition.defaultProps || {},
      order: blocks.length,
      isVisible: true
    }

    setBlocks(prev => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
  }, [])

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
    if (editingBlockId === blockId) setEditingBlockId(null)
  }, [selectedBlockId, editingBlockId])

  const handleToggleVisibility = useCallback((blockId: string) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, isVisible: !block.isVisible } : block
    ))
  }, [])

  const handleEditBlock = useCallback((blockId: string) => {
    setEditingBlockId(blockId)
    setSelectedBlockId(blockId)
  }, [])

  const handleSaveBlock = useCallback((blockId: string, props: any) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, props } : block
    ))
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updatedSiteData = {
        ...siteData,
        blocks
      }
      onSave(updatedSiteData)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderBlock = (block: Block) => {
    const BlockComponent = BLOCK_COMPONENTS[block.type]
    if (!BlockComponent) return null

    return (
      <BlockComponent
        {...block.props}
        isEditing={true}
        entitlements={entitlements}
      />
    )
  }

  const getViewportClass = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-2xl"
      case "desktop":
        return "max-w-4xl"
      default:
        return "max-w-4xl"
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <EditorSidebar
        entitlements={entitlements}
        onAddBlock={handleAddBlock}
        onPreview={onPreview}
      />

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                {siteData.title || "Untitled Site"}
              </h1>
              
              {/* Viewport Controls */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewport === "mobile" ? "default" : "ghost"}
                  onClick={() => setViewport("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewport === "tablet" ? "default" : "ghost"}
                  onClick={() => setViewport("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewport === "desktop" ? "default" : "ghost"}
                  onClick={() => setViewport("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onPreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className={`mx-auto transition-all duration-200 ${getViewportClass()}`}>
            <Card className="min-h-[600px] p-6">
              {blocks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Monitor className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Start Building Your Bio Link
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add blocks from the sidebar to create your page
                  </p>
                  <Button onClick={() => handleAddBlock("bio")}>
                    Add Bio Block
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map(block => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 pl-12">
                      {blocks.map((block) => (
                        <DraggableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          isVisible={block.isVisible}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onEdit={() => handleEditBlock(block.id)}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onToggleVisibility={() => handleToggleVisibility(block.id)}
                        >
                          {renderBlock(block)}
                        </DraggableBlock>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Block Editor */}
      <BlockEditor
        block={editingBlock}
        onSave={handleSaveBlock}
        onClose={() => setEditingBlockId(null)}
      />
    </div>
  )
}