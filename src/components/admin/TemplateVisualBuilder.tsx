/**
 * Template Visual Builder Component
 * Visual builder for creating templates with drag & drop
 */

"use client"

import { useState, useCallback, useEffect } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DraggableBlock } from "@/components/editor/DraggableBlock"
import { BlockEditor } from "@/components/editor/BlockEditor"
import { Plus, Eye, Smartphone, Monitor, Tablet } from "lucide-react"
import { Block } from "@/types"
import { BLOCK_REGISTRY, getAllBlockTypes, generateDefaultProps } from "@/components/blocks/registry"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { generateId } from "@/lib/utils"


interface TemplateBuilderManifest {
  layout: string
  maxWidth: string
  backgroundColor: string
  blocks: Array<{
    id: string
    type: string
    order: number
    required: boolean
    config: any
  }>
}

interface TemplateVisualBuilderProps {
  manifestJson: TemplateBuilderManifest
  cssVarsJson: Record<string, string>
  onManifestChange: (manifest: TemplateBuilderManifest) => void
  onCssVarsChange?: (cssVars: Record<string, string>) => void
  templateName: string
  templateDescription: string
}

export function TemplateVisualBuilder({
  manifestJson,
  cssVarsJson,
  onManifestChange,
  templateName,
  templateDescription
}: TemplateVisualBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [showPreview, setShowPreview] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Convert manifest to blocks (only on initial load)
  useEffect(() => {
    if (manifestJson?.blocks && blocks.length === 0) {
      const convertedBlocks: Block[] = manifestJson.blocks.map(block => ({
        id: block.id,
        type: block.type,
        props: { ...generateDefaultProps(block.type), ...block.config },
        order: block.order,
        isVisible: true
      }))
      setBlocks(convertedBlocks)
    }
  }, [manifestJson?.blocks, blocks.length])

  // Convert blocks back to manifest (debounced)
  useEffect(() => {
    // Only update if blocks actually changed and avoid initial empty state
    if (blocks.length === 0) return

    const timeoutId = setTimeout(() => {
      const newManifest: TemplateBuilderManifest = {
        layout: manifestJson?.layout || "vertical",
        maxWidth: manifestJson?.maxWidth || "600px",
        backgroundColor: manifestJson?.backgroundColor || "#ffffff",
        blocks: blocks.map((block, index) => ({
          id: block.id,
          type: block.type,
          order: index,
          required: index === 0, // First block is usually required
          config: block.props
        }))
      }
      onManifestChange(newManifest)
    }, 100) // 100ms debounce

    return () => clearTimeout(timeoutId)
  }, [blocks, manifestJson?.layout, manifestJson?.maxWidth, manifestJson?.backgroundColor])

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
  }, [blocks.length])

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
    if (editingBlockId === blockId) setEditingBlockId(null)
  }, [selectedBlockId, editingBlockId])

  const handleEditBlock = useCallback((blockId: string) => {
    setEditingBlockId(blockId)
    setSelectedBlockId(blockId)
  }, [])

  const handleSaveBlock = useCallback((blockId: string, props: any) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, props } : block
    ))
  }, [])

  const renderBlock = (block: Block) => {
    const BlockComponent = BLOCK_REGISTRY[block.type]
    if (!BlockComponent) return null

    return (
      <div className="pointer-events-none">
        {/* Preview rendering would go here */}
        <div className="p-4 bg-gray-50 rounded border min-h-[60px] flex items-center justify-center">
          <span className="text-sm text-gray-600">{BLOCK_REGISTRY[block.type]?.name || block.type}</span>
        </div>
      </div>
    )
  }

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

  const availableBlocks = getAllBlockTypes()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Block Library Sidebar */}
      <Card className="border-gray-700 lg:col-span-1" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="text-white text-sm">Block Library</CardTitle>
          <CardDescription className="text-gray-400 text-xs">
            Drag blocks to build your template
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[700px]">
            <div className="p-4 space-y-2">
              {availableBlocks.map((blockType) => {
                const definition = BLOCK_REGISTRY[blockType]
                if (!definition) return null

                return (
                  <Card
                    key={blockType}
                    className="cursor-pointer hover:bg-gray-700 transition-colors border-gray-600"
                    style={{ backgroundColor: '#2A3441' }}
                    onClick={() => handleAddBlock(blockType)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm font-medium">{definition.name}</div>
                          <div className="text-gray-400 text-xs">{definition.description}</div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {definition.isPremium && (
                        <Badge variant="outline" className="text-xs text-purple-400 border-purple-400 mt-2">
                          {definition.requiredPlan}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Visual Builder Canvas */}
      <Card className="border-gray-700 lg:col-span-2" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-sm">Template Builder</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Drag to reorder blocks
              </CardDescription>
            </div>

            {/* Viewport Controls */}
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewport === "mobile" ? "default" : "ghost"}
                onClick={() => setViewport("mobile")}
                className="h-7 w-7 p-0"
              >
                <Smartphone className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={viewport === "tablet" ? "default" : "ghost"}
                onClick={() => setViewport("tablet")}
                className="h-7 w-7 p-0"
              >
                <Tablet className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={viewport === "desktop" ? "default" : "ghost"}
                onClick={() => setViewport("desktop")}
                className="h-7 w-7 p-0"
              >
                <Monitor className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[650px]">
            <div className={`mx-auto transition-all duration-200 ${getViewportClass()}`}>
              <div className="min-h-[500px] p-4 bg-gray-900 rounded-lg">
                {blocks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-500 mb-4">
                      <Monitor className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">
                      Start Building Your Template
                    </h3>
                    <p className="text-gray-500 text-xs mb-4">
                      Add blocks from the sidebar to create your template layout
                    </p>
                    <Button onClick={() => handleAddBlock("bio")} size="sm">
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
                      <div className="space-y-3">
                        {blocks.map((block) => (
                          <DraggableBlock
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            isVisible={block.isVisible}
                            onSelect={() => setSelectedBlockId(block.id)}
                            onEdit={() => handleEditBlock(block.id)}
                            onDelete={() => handleDeleteBlock(block.id)}
                            onToggleVisibility={() => { }}
                          >
                            {renderBlock(block)}
                          </DraggableBlock>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Live Preview Panel */}
      <Card className="border-gray-700 lg:col-span-1" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">Live Preview</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="text-gray-300 hover:text-white"
            >
              <Eye className="h-3 w-3 mr-1" />
              {showPreview ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {showPreview && (
            <div className="bg-gray-900 rounded-lg p-2 shadow-xl">
              <div className="bg-white rounded-lg w-full h-[600px] overflow-hidden relative">
                {/* Mobile Status Bar */}
                <div className="h-6 bg-black flex items-center justify-center relative">
                  <div className="w-16 h-3 bg-black rounded-full absolute top-1.5"></div>
                  <div className="absolute top-1.5 left-2 text-white text-xs font-medium">9:41</div>
                </div>

                {/* Template Content */}
                <div className="h-[574px] overflow-y-auto">
                  <DynamicTemplateRenderer
                    siteData={{
                      blocks: blocks.map(block => ({
                        id: block.id,
                        type: block.type,
                        props: block.props
                      })),
                      meta: {
                        title: templateName || 'Template Preview',
                        description: templateDescription || 'Template description',
                        theme: cssVarsJson
                      }
                    }}
                    isPreview={true}
                  />
                </div>
              </div>
            </div>
          )}

          {!showPreview && (
            <div className="text-center py-16">
              <Eye className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">Click "Show" to preview</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Block Editor */}
      <BlockEditor
        block={editingBlock}
        onSave={handleSaveBlock}
        onClose={() => setEditingBlockId(null)}
      />
    </div>
  )
}