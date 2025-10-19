/**
 * Site Editor Client Component
 * Main editor interface for admin template creation
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DraggableBlock } from "@/components/editor/DraggableBlock"
import { BlockEditor } from "@/components/editor/BlockEditor"
import { BlockLibrarySidebar } from "@/components/editor/BlockLibrarySidebar"
import { EditorCanvas } from "@/components/editor/EditorCanvas"
import { ThemeEditor } from "@/components/editor/ThemeEditor"
import {
  Plus,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  ArrowLeft,
  Settings,
  Palette,
  Layout
} from "lucide-react"
import { Block } from "@/types"
import { BLOCK_REGISTRY, getAllBlockTypes, generateDefaultProps } from "@/components/blocks/registry"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"
import { generateId } from "@/lib/utils"
import Link from "next/link"
import { TemplateManifest } from "@/types/template"

interface SiteEditorClientProps {
  site?: any
  user: any
  mode?: 'edit' | 'create'
  initialTemplate?: TemplateManifest
  onSave?: (manifest: TemplateManifest, cssVars: Record<string, string>) => void
}

export function SiteEditorClient({
  site,
  user,
  mode = 'create',
  initialTemplate,
  onSave
}: SiteEditorClientProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activePanel, setActivePanel] = useState<"blocks" | "theme">("blocks")
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Template metadata
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateCategory, setTemplateCategory] = useState<"free" | "premium" | "pro">("free")

  // CSS Variables for theming - Professional style default
  const [cssVars, setCssVars] = useState<Record<string, string>>({
    '--shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '--background': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    '--text-color': '#1E293B',
    '--border-radius': '8px',
    '--primary-color': '#1E40AF',
    '--card-background': '#FFFFFF',
    '--secondary-color': '#64748B'
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize with template data
  useEffect(() => {
    const initializeBlocks = () => {
      if (initialTemplate) {
        // Convert TemplateManifest to blocks
        const templateBlocks: Block[] = []
        const layoutBlocks = [
          ...(initialTemplate.layout.header || []),
          ...(initialTemplate.layout.body || []),
          ...(initialTemplate.layout.footer || [])
        ]

        layoutBlocks.forEach((blockType, index) => {
          const defaultProps = initialTemplate.defaults?.blockProps?.[blockType] || generateDefaultProps(blockType)
          templateBlocks.push({
            id: generateId(),
            type: blockType,
            props: defaultProps,
            order: index,
            isVisible: true
          })
        })

        if (templateBlocks.length > 0) {
          setBlocks(templateBlocks)

          // Set template metadata
          setTemplateName(initialTemplate.name || '')
          setTemplateDescription(initialTemplate.description || '')

          // Set CSS variables from tokens
          if (initialTemplate.defaults?.tokens) {
            setCssVars(initialTemplate.defaults.tokens)
          }
        }
      } else if (mode === 'create') {
        // Default Professional template structure
        const defaultBlocks: Block[] = [
          {
            id: generateId(),
            type: 'bio',
            props: {
              spacing: 'normal',
              nameStyle: 'default',
              textAlign: 'center',
              avatarSize: 'lg',
              showAvatar: true,
              avatarStyle: 'circle'
            },
            order: 0,
            isVisible: true
          },
          {
            id: generateId(),
            type: 'link-list',
            props: {
              style: 'pill',
              gap: 'md',
              items: [
                {
                  id: "1",
                  title: "My Website",
                  url: "https://yoursite.com",
                  isActive: true
                }
              ]
            },
            order: 1,
            isVisible: true
          },
          {
            id: generateId(),
            type: 'analytics',
            props: {
              showViews: true,
              timeframe: '30d',
              showClicks: true
            },
            order: 2,
            isVisible: true
          },
          {
            id: generateId(),
            type: 'social-icons',
            props: {
              size: 'sm',
              style: 'minimal'
            },
            order: 3,
            isVisible: true
          }
        ]
        setBlocks(defaultBlocks)

        // Set default template metadata
        setTemplateName('Professional')
        setTemplateDescription('')
      }

      // Mark initialization as complete
      setIsInitializing(false)
    }

    // Run initialization immediately, not dependent on blocks.length
    initializeBlocks()
  }, [initialTemplate, mode])

  const editingBlock = editingBlockId ? blocks.find(b => b.id === editingBlockId) || null : null

  // Handle sheet state when editingBlock changes
  useEffect(() => {
    if (!editingBlock) {
      setIsSheetOpen(false)
    }
  }, [editingBlock])

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
    // Trigger animation after state is set
    setTimeout(() => setIsSheetOpen(true), 10)
  }, [])

  const handleSaveBlock = useCallback((blockId: string, props: any) => {
    setBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, props } : block
    ))
  }, [])

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    if (blocks.length === 0) {
      alert('Please add at least one block to your template')
      return
    }

    setSaving(true)
    try {
      // Generate the correct TemplateManifest format
      const blockTypes = blocks.map(block => block.type)
      const uniqueBlockTypes = [...new Set(blockTypes)]

      // Organize blocks by logical structure
      const bioBlocks = blocks.filter(b => b.type === 'bio')
      const linkBlocks = blocks.filter(b => b.type === 'link-list')
      const socialBlocks = blocks.filter(b => b.type === 'social-icons')
      const analyticsBlocks = blocks.filter(b => b.type === 'analytics')
      const galleryBlocks = blocks.filter(b => b.type === 'gallery')
      const otherBlocks = blocks.filter(b => !['bio', 'link-list', 'social-icons', 'analytics', 'gallery'].includes(b.type))

      const manifest = {
        name: templateName,
        version: "1.0.0",
        description: templateDescription,
        isPaid: templateCategory !== 'free',
        layout: {
          header: bioBlocks.length > 0 ? ['bio'] : [],
          body: [
            ...linkBlocks.length > 0 ? ['link-list'] : [],
            ...analyticsBlocks.length > 0 ? ['analytics'] : [],
            ...galleryBlocks.length > 0 ? ['gallery'] : [],
            ...otherBlocks.map(b => b.type)
          ],
          footer: socialBlocks.length > 0 ? ['social-icons'] : []
        },
        defaults: {
          meta: {
            title: 'Professional Profile',
            description: 'Connect with me professionally'
          },
          tokens: cssVars,
          blockProps: blocks.reduce((acc, block) => {
            if (!acc[block.type]) {
              acc[block.type] = block.props;
            }
            return acc;
          }, {} as Record<string, any>)
        },
        maxBlocks: uniqueBlockTypes.reduce((acc, type) => {
          acc[type] = type === 'bio' ? 1 : type === 'social-icons' ? 1 : 10;
          return acc;
        }, {} as Record<string, number>),
        priceCents: templateCategory === 'pro' ? 2000 : templateCategory === 'premium' ? 1500 : 0,
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'analytics', 'gallery'],
        requiredFeatures: ['analytics', 'custom-domain', 'remove-branding']
      }


      if (onSave) {
        onSave(manifest, cssVars)
      } else {
        // Default save to API
        // Generate a proper slug
        const slug = templateName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

        if (!slug) {
          throw new Error('Template name must contain at least some letters or numbers')
        }

        const requestData = {
          name: templateName.trim(),
          slug: slug,
          description: templateDescription.trim() || `Template: ${templateName}`, // Ensure description is not empty
          category: templateCategory,
          manifestJson: manifest,
          cssVarsJson: cssVars,
          isPaid: templateCategory !== 'free',
          priceCents: templateCategory === 'pro' ? 2000 : templateCategory === 'premium' ? 1000 : 0,
          requiredPlan: templateCategory === 'pro' ? 'PRO' : templateCategory === 'premium' ? 'STARTER' : 'FREE'
        }

        console.log('Sending template data:', requestData)

        const response = await fetch('/api/admin/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(`Failed to save template: ${errorData.error?.message || 'Unknown error'}`)
        }

        await response.json()
        alert('Template saved successfully!')

        // Redirect to template list
        window.location.href = '/admin/templates'
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save template')
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/templates">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {mode === 'create' ? 'Create Template' : 'Edit Template'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={activePanel === "blocks" ? "default" : "ghost"}
                onClick={() => setActivePanel("blocks")}
                className="h-7"
              >
                <Layout className="h-3 w-3 mr-1" />
                Blocks
              </Button>
              <Button
                size="sm"
                variant={activePanel === "theme" ? "default" : "ghost"}
                onClick={() => setActivePanel("theme")}
                className="h-7"
              >
                <Palette className="h-3 w-3 mr-1" />
                Theme
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={saving || !templateName.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>

        {/* Template Metadata Bar */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="h-8 text-sm bg-white border-gray-300"
              />
            </div>
            <div className="flex-1">
              <Input
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Description"
                className="h-8 text-sm bg-white border-gray-300"
              />
            </div>
            <div className="w-32">
              <select
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value as any)}
                className="h-8 w-full text-sm bg-white border border-gray-300 rounded-md px-2"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">

        {/* Dynamic Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          {activePanel === "blocks" ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-900 mb-1">Block Library</h2>
                <p className="text-xs text-gray-500">Drag blocks to build your template</p>
              </div>
              <BlockLibrarySidebar
                onAddBlock={handleAddBlock}
                userRole="admin"
                className="flex-1"
              />
            </>
          ) : (
            <div className="flex-1 overflow-hidden">
              <ThemeEditor
                cssVars={cssVars}
                onChange={setCssVars}
                className="border-0 shadow-none h-full"
              />
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h2 className="text-sm font-medium text-gray-900">Canvas</h2>
              <div className="text-xs text-gray-500">
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
              </div>
            </div>

            {/* Viewport Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
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

          <EditorCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            viewport={viewport}
            onViewportChange={setViewport}
            onSelectBlock={setSelectedBlockId}
            onEditBlock={handleEditBlock}
            onDeleteBlock={handleDeleteBlock}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            className="flex-1"
            showAddBlock={handleAddBlock}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">Preview</h2>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Smartphone className="h-3 w-3" />
                <span>Mobile</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
            {/* iPhone Frame */}
            <div className="relative">
              <div className="w-64 h-[500px] bg-black rounded-[2rem] p-2 shadow-xl">
                <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-6 bg-black flex items-center justify-center relative">
                    <div className="w-16 h-2 bg-black rounded-full absolute top-2"></div>
                    <div className="absolute top-1.5 left-3 text-white text-xs">9:41</div>
                  </div>

                  {/* Content */}
                  <div className="h-[470px] overflow-y-auto">
                    {isInitializing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                          <div className="text-xs text-gray-500">Loading preview...</div>
                        </div>
                      </div>
                    ) : (
                      <DynamicTemplateRenderer
                        siteData={{
                          blocks: blocks.map(block => ({
                            id: block.id,
                            type: block.type,
                            props: block.props
                          })),
                          meta: {
                            title: templateName || 'Template Preview',
                            description: templateDescription || 'Template preview',
                            theme: cssVars
                          }
                        }}
                        isPreview={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block Editor Sheet */}
      {editingBlock && (
        <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-out z-50 ${
          editingBlock.type === 'link-list' 
            ? 'w-[600px]' 
            : 'w-96'
        } ${isSheetOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <BlockEditor
            block={editingBlock}
            onSave={handleSaveBlock}
            onClose={() => {
              setIsSheetOpen(false)
              setTimeout(() => setEditingBlockId(null), 300) // Wait for animation
            }}
          />
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[400px] h-[700px] overflow-hidden relative shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-8 h-8 p-0"
              >
                ✕
              </Button>
            </div>
            {isInitializing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <div className="text-sm text-gray-500">Loading template...</div>
                </div>
              </div>
            ) : (
              <DynamicTemplateRenderer
                siteData={{
                  blocks: blocks.map(block => ({
                    id: block.id,
                    type: block.type,
                    props: block.props
                  })),
                  meta: {
                    title: templateName || 'Template Preview',
                    description: templateDescription || 'Template preview',
                    theme: cssVars
                  }
                }}
                isPreview={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}