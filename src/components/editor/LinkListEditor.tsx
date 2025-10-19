/**
 * Enhanced LinkList Editor Component
 * Advanced editor for link-list blocks with style customization and live preview
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  X,
  Save,
  Plus,
  Trash2,
  Palette,
  Type,
  Settings,
  GripVertical,
  ExternalLink
} from "lucide-react"
import { LinkListBlockProps } from "@/types"
import { generateId } from "@/lib/utils"
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
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface LinkListEditorProps {
  props: LinkListBlockProps
  onChange: (props: LinkListBlockProps) => void
  onSave: () => void
  onClose: () => void
  className?: string
}

// Style templates dengan preview
const STYLE_TEMPLATES = [
  {
    id: 'pill',
    name: 'Pill',
    preview: 'rounded-full bg-blue-500 text-white',
    category: 'basic'
  },
  {
    id: 'card',
    name: 'Card',
    preview: 'rounded-lg border bg-white shadow-sm',
    category: 'basic'
  },
  {
    id: 'underline',
    name: 'Underline',
    preview: 'border-b-2 border-transparent hover:border-blue-500',
    category: 'basic'
  },
  {
    id: 'modern',
    name: 'Modern',
    preview: 'rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    category: 'modern'
  },
  {
    id: 'glass',
    name: 'Glass',
    preview: 'rounded-2xl bg-white/10 backdrop-blur-md border border-white/20',
    category: 'modern'
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: 'rounded-lg bg-black border-2 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    category: 'modern'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    preview: 'border-2 border-amber-800 bg-amber-50 text-amber-800',
    category: 'creative'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    preview: 'bg-black border border-cyan-400 text-cyan-400 font-mono',
    category: 'creative'
  },
  {
    id: 'neomorphism',
    name: 'Neomorphism',
    preview: 'rounded-2xl bg-gray-100 shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
    category: 'creative'
  }
]

// Sortable Link Item Component
function SortableLinkItem({ item, index, onUpdate, onDelete, isActive }: {
  item: any
  index: number
  onUpdate: (index: number, updates: any) => void
  onDelete: (index: number) => void
  isActive: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className={`transition-all ${isDragging ? 'shadow-lg' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center w-6 h-6 mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 space-y-3">
            {/* Title & URL */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => onUpdate(index, { title: e.target.value })}
                  placeholder="Link title"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">URL</Label>
                <Input
                  type="url"
                  value={item.url}
                  onChange={(e) => onUpdate(index, { url: e.target.value })}
                  placeholder="https://example.com"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Icon & Controls */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-xs text-gray-600">Icon</Label>
                <Input
                  value={item.icon || ''}
                  onChange={(e) => onUpdate(index, { icon: e.target.value })}
                  placeholder="🔗 or any emoji"
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => onUpdate(index, { isActive: checked })}
                />
                <Label className="text-xs text-gray-600">Active</Label>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function LinkListEditor({ props, onChange, onSave, onClose }: LinkListEditorProps) {
  const [currentTab, setCurrentTab] = useState("style")
  const [customization, setCustomization] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    textColor: '#FFFFFF',
    shadowIntensity: 0.3,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    padding: 16,
    ...props.customColors
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateProps = (updates: Partial<LinkListBlockProps>) => {
    onChange({ ...props, ...updates })
  }

  const updateCustomization = (updates: any) => {
    const newCustomization = { ...customization, ...updates }
    setCustomization(newCustomization)
    updateProps({
      customColors: {
        primary: newCustomization.primaryColor,
        secondary: newCustomization.secondaryColor,
        text: newCustomization.textColor,
        accent: newCustomization.primaryColor,
        background: newCustomization.secondaryColor
      }
    })
  }

  const handleAddLink = () => {
    const newLink = {
      id: generateId(),
      title: 'New Link',
      url: 'https://example.com',
      isActive: true,
      icon: '🔗'
    }
    updateProps({ items: [...(props.items || []), newLink] })
  }

  const handleUpdateLink = (index: number, updates: any) => {
    const items = [...(props.items || [])]
    items[index] = { ...items[index], ...updates }
    updateProps({ items })
  }

  const handleDeleteLink = (index: number) => {
    const items = [...(props.items || [])]
    items.splice(index, 1)
    updateProps({ items })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const items = [...(props.items || [])]
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      const reorderedItems = arrayMove(items, oldIndex, newIndex)
      updateProps({ items: reorderedItems })
    }
  }

  const filteredStyles = (category?: string) => {
    if (!category) return STYLE_TEMPLATES
    return STYLE_TEMPLATES.filter(template => template.category === category)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Link List</h3>
            <p className="text-sm text-gray-500 mt-1">Customize your link styles and content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 bg-white px-6 py-3">
            <TabsList className="grid w-full grid-cols-4 h-9">
              <TabsTrigger value="style" className="flex items-center gap-2 text-xs">
                <Palette className="w-3 h-3" />
                Style
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2 text-xs">
                <Settings className="w-3 h-3" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2 text-xs">
                <Type className="w-3 h-3" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2 text-xs">
                <ExternalLink className="w-3 h-3" />
                Links
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {currentTab === "style" && (
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 bg-gray-50">
                  <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Basic Styles</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {filteredStyles('basic').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => updateProps({ style: template.id as any })}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${props.style === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <div className={`h-8 rounded mb-2 ${template.preview}`}></div>
                              <div className="text-xs font-medium text-gray-900">{template.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block">Modern Styles</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {filteredStyles('modern').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => updateProps({ style: template.id as any })}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${props.style === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <div className={`h-8 rounded mb-2 ${template.preview}`}></div>
                              <div className="text-xs font-medium text-gray-900">{template.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block">Creative Styles</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {filteredStyles('creative').map((template) => (
                            <button
                              key={template.id}
                              onClick={() => updateProps({ style: template.id as any })}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${props.style === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <div className={`h-8 rounded mb-2 ${template.preview}`}></div>
                              <div className="text-xs font-medium text-gray-900">{template.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            )}

            <TabsContent value="colors" className="mt-0 flex-1 overflow-y-auto">
              <div className="p-6 bg-gray-50">
                <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Color Palette</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">Primary Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={customization.primaryColor}
                              onChange={(e) => updateCustomization({ primaryColor: e.target.value })}
                              className="w-12 h-8 rounded border border-gray-300"
                            />
                            <Input
                              value={customization.primaryColor}
                              onChange={(e) => updateCustomization({ primaryColor: e.target.value })}
                              className="flex-1 h-8 text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">Secondary Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={customization.secondaryColor}
                              onChange={(e) => updateCustomization({ secondaryColor: e.target.value })}
                              className="w-12 h-8 rounded border border-gray-300"
                            />
                            <Input
                              value={customization.secondaryColor}
                              onChange={(e) => updateCustomization({ secondaryColor: e.target.value })}
                              className="flex-1 h-8 text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">Text Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={customization.textColor}
                              onChange={(e) => updateCustomization({ textColor: e.target.value })}
                              className="w-12 h-8 rounded border border-gray-300"
                            />
                            <Input
                              value={customization.textColor}
                              onChange={(e) => updateCustomization({ textColor: e.target.value })}
                              className="flex-1 h-8 text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Effects</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">
                            Shadow Intensity: {Math.round(customization.shadowIntensity * 100)}%
                          </Label>
                          <Slider
                            value={[customization.shadowIntensity]}
                            onValueChange={([value]) => updateCustomization({ shadowIntensity: value })}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">
                            Border Radius: {customization.borderRadius}px
                          </Label>
                          <Slider
                            value={[customization.borderRadius]}
                            onValueChange={([value]) => updateCustomization({ borderRadius: value })}
                            max={50}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-0 flex-1 overflow-y-auto">
              <div className="p-6 bg-gray-50">
                <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Typography Settings</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">
                            Font Size: {customization.fontSize}px
                          </Label>
                          <Slider
                            value={[customization.fontSize]}
                            onValueChange={([value]) => updateCustomization({ fontSize: value })}
                            max={24}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">
                            Font Weight: {customization.fontWeight}
                          </Label>
                          <Slider
                            value={[customization.fontWeight]}
                            onValueChange={([value]) => updateCustomization({ fontWeight: value })}
                            max={900}
                            min={100}
                            step={100}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">
                            Padding: {customization.padding}px
                          </Label>
                          <Slider
                            value={[customization.padding]}
                            onValueChange={([value]) => updateCustomization({ padding: value })}
                            max={32}
                            min={8}
                            step={2}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="items" className="mt-0 flex-1 overflow-y-auto">
              <div className="p-6 bg-gray-50">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Links ({(props.items || []).length})</Label>
                      <Button size="sm" onClick={handleAddLink} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Link
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Max Items (optional)</Label>
                      <Input
                        type="number"
                        value={props.maxItems || ''}
                        onChange={(e) => updateProps({
                          maxItems: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        placeholder="No limit"
                        className="h-8 text-sm"
                        min="1"
                      />
                    </div>

                    <div className="space-y-3">
                      {(props.items || []).length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          <ExternalLink className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No links added yet</p>
                          <p className="text-xs text-gray-400">Click "Add Link" to get started</p>
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={(props.items || []).map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {(props.items || []).map((item, index) => (
                              <SortableLinkItem
                                key={item.id}
                                item={item}
                                index={index}
                                onUpdate={handleUpdateLink}
                                onDelete={handleDeleteLink}
                                isActive={item.isActive !== false}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}