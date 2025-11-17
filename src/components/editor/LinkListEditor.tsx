/**
 * Enhanced LinkList Editor Component
 * Advanced editor for link-list blocks with style customization and live preview
 */

"use client"

import { useState, useEffect } from "react"
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
import { LinkListBlock } from "@/components/blocks/LinkListBlock"
import {
  STYLE_TEMPLATES,
  getStylesByCategory,
  DEFAULT_COLORS,
  COLOR_PRESETS,
  LinkListStyle,
  isFullyCustomizable
} from "@/lib/link-list-styles"
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

// Sample data for style previews
const PREVIEW_DATA = {
  items: [
    { id: '1', title: 'Preview', url: '#', isActive: true }
  ]
}

// Function to get color requirements for each style
const getStyleColorRequirements = (styleId: string) => {
  const requirements: Record<string, {
    colors: Array<{
      key: string
      label: string
      description: string
      category: 'basic' | 'gradient' | 'effect'
    }>
    gradientDirection?: boolean
  }> = {
    // Basic styles - minimal colors
    'pill': {
      colors: [
        { key: 'primary', label: 'Button Color', description: 'Main button background', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Button text color', category: 'basic' }
      ]
    },
    'card': {
      colors: [
        { key: 'primary', label: 'Card Background', description: 'Card background color', category: 'basic' },
        { key: 'secondary', label: 'Border Color', description: 'Card border color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Card text color', category: 'basic' }
      ]
    },
    'underline': {
      colors: [
        { key: 'primary', label: 'Underline Color', description: 'Underline accent color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Link text color', category: 'basic' }
      ]
    },
    
    // Creative gradient styles
    'hologram': {
      colors: [
        { key: 'primary', label: 'Start Color', description: 'First gradient color', category: 'gradient' },
        { key: 'secondary', label: 'Second Color', description: 'Second gradient color', category: 'gradient' },
        { key: 'tertiary', label: 'Third Color', description: 'Third gradient color', category: 'gradient' },
        { key: 'quaternary', label: 'End Color', description: 'Fourth gradient color', category: 'gradient' },
        { key: 'text', label: 'Text Color', description: 'Button text color', category: 'basic' }
      ],
      gradientDirection: true
    },
    'bubble': {
      colors: [
        { key: 'primary', label: 'Bubble Start', description: 'Start of bubble gradient', category: 'gradient' },
        { key: 'secondary', label: 'Bubble Middle', description: 'Middle of bubble gradient', category: 'gradient' },
        { key: 'tertiary', label: 'Bubble End', description: 'End of bubble gradient', category: 'gradient' },
        { key: 'highlight', label: 'Bubble Shine', description: 'Highlight bubble effects', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Button text color', category: 'basic' }
      ],
      gradientDirection: true
    },
    'elastic': {
      colors: [
        { key: 'primary', label: 'Elastic Start', description: 'Start of elastic gradient', category: 'gradient' },
        { key: 'secondary', label: 'Elastic Middle', description: 'Middle of elastic gradient', category: 'gradient' },
        { key: 'tertiary', label: 'Elastic End', description: 'End of elastic gradient', category: 'gradient' },
        { key: 'text', label: 'Text Color', description: 'Button text color', category: 'basic' }
      ],
      gradientDirection: true
    },
    
    // Glow effect styles
    'neon': {
      colors: [
        { key: 'primary', label: 'Neon Color', description: 'Main neon glow color', category: 'basic' },
        { key: 'secondary', label: 'Secondary Glow', description: 'Secondary glow color', category: 'basic' },
        { key: 'glow', label: 'Glow Intensity', description: 'Glow effect color', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Neon text color', category: 'basic' }
      ]
    },
    'neon-outline': {
      colors: [
        { key: 'primary', label: 'Outline Color', description: 'Neon outline color', category: 'basic' },
        { key: 'glow', label: 'Glow Effect', description: 'Outline glow color', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Outline text color', category: 'basic' }
      ]
    },
    'cyberpunk': {
      colors: [
        { key: 'primary', label: 'Cyber Color', description: 'Main cyberpunk color', category: 'basic' },
        { key: 'background', label: 'Background', description: 'Dark background color', category: 'basic' },
        { key: 'glow', label: 'Scan Lines', description: 'Scan line glow color', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Cyber text color', category: 'basic' }
      ]
    },
    'terminal': {
      colors: [
        { key: 'primary', label: 'Terminal Green', description: 'Terminal text color', category: 'basic' },
        { key: 'background', label: 'Terminal Background', description: 'Dark terminal background', category: 'basic' },
        { key: 'glow', label: 'Terminal Glow', description: 'Terminal glow effect', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Terminal text color', category: 'basic' }
      ]
    },
    
    // Material styles
    'metallic': {
      colors: [
        { key: 'primary', label: 'Metal Base', description: 'Base metallic color', category: 'basic' },
        { key: 'secondary', label: 'Metal Mid', description: 'Mid metallic tone', category: 'gradient' },
        { key: 'tertiary', label: 'Metal Dark', description: 'Dark metallic tone', category: 'gradient' },
        { key: 'highlight', label: 'Metal Shine', description: 'Metallic highlight', category: 'effect' },
        { key: 'text', label: 'Text Color', description: 'Metal text color', category: 'basic' }
      ],
      gradientDirection: true
    },
    
    // Artistic styles
    'vintage': {
      colors: [
        { key: 'primary', label: 'Vintage Brown', description: 'Main vintage color', category: 'basic' },
        { key: 'secondary', label: 'Paper Background', description: 'Vintage paper color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Vintage text color', category: 'basic' }
      ]
    },
    'sketch': {
      colors: [
        { key: 'primary', label: 'Sketch Line', description: 'Sketch border color', category: 'basic' },
        { key: 'background', label: 'Paper Color', description: 'Sketch paper background', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Sketch text color', category: 'basic' }
      ]
    },
    'brush': {
      colors: [
        { key: 'primary', label: 'Brush Color', description: 'Main brush stroke color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Brush text color', category: 'basic' }
      ]
    },
    'origami': {
      colors: [
        { key: 'primary', label: 'Paper Color', description: 'Main paper color', category: 'basic' },
        { key: 'secondary', label: 'Paper Shade', description: 'Paper shadow color', category: 'gradient' },
        { key: 'text', label: 'Text Color', description: 'Paper text color', category: 'basic' }
      ],
      gradientDirection: true
    },
    'pixel': {
      colors: [
        { key: 'primary', label: 'Pixel Color', description: 'Main pixel color', category: 'basic' },
        { key: 'secondary', label: 'Pixel Shadow', description: 'Pixel shadow color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Pixel text color', category: 'basic' }
      ]
    },
    'ticket': {
      colors: [
        { key: 'primary', label: 'Ticket Color', description: 'Main ticket color', category: 'basic' },
        { key: 'background', label: 'Notch Color', description: 'Ticket notch color', category: 'basic' },
        { key: 'text', label: 'Text Color', description: 'Ticket text color', category: 'basic' }
      ]
    }
  }
  
  return requirements[styleId] || {
    colors: [
      { key: 'primary', label: 'Primary Color', description: 'Main color', category: 'basic' },
      { key: 'secondary', label: 'Secondary Color', description: 'Secondary color', category: 'basic' },
      { key: 'text', label: 'Text Color', description: 'Text color', category: 'basic' }
    ]
  }
}

// Function to get default colors based on style
const getStyleDefaultColors = (styleId: string) => {
  const styleDefaults: Record<string, any> = {
    'hologram': {
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899', 
      textColor: '#ffffff',
      tertiaryColor: '#06b6d4',
      quaternaryColor: '#3b82f6',
      glowColor: '#ec4899',
      highlightColor: '#ffffff',
      gradientDirection: 'to right'
    },
    'cyberpunk': {
      primaryColor: '#06b6d4',
      secondaryColor: '#0891b2',
      textColor: '#06b6d4',
      tertiaryColor: '#67e8f9',
      quaternaryColor: '#22d3ee',
      glowColor: '#06b6d4',
      highlightColor: '#a5f3fc',
      gradientDirection: 'to right'
    },
    'neon': {
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      textColor: '#f472b6',
      tertiaryColor: '#a855f7',
      quaternaryColor: '#3b82f6',
      glowColor: '#ec4899',
      highlightColor: '#ffffff',
      gradientDirection: 'to right'
    },
    'vintage': {
      primaryColor: '#92400e',
      secondaryColor: '#78350f',
      textColor: '#92400e',
      tertiaryColor: '#d97706',
      quaternaryColor: '#a16207',
      glowColor: '#92400e',
      highlightColor: '#fbbf24',
      gradientDirection: 'to right'
    },
    'ticket': {
      primaryColor: '#d97706',
      secondaryColor: '#ea580c',
      textColor: '#ffffff',
      tertiaryColor: '#f97316',
      quaternaryColor: '#dc2626',
      glowColor: '#f97316',
      highlightColor: '#ffffff',
      gradientDirection: 'to right'
    },
    'terminal': {
      primaryColor: '#22c55e',
      secondaryColor: '#16a34a',
      textColor: '#22c55e',
      tertiaryColor: '#4ade80',
      quaternaryColor: '#15803d',
      glowColor: '#22c55e',
      highlightColor: '#6ee7b7',
      gradientDirection: 'to right'
    },
    'bubble': {
      primaryColor: '#60a5fa',
      secondaryColor: '#a855f7',
      textColor: '#ffffff',
      tertiaryColor: '#ec4899',
      quaternaryColor: '#3b82f6',
      glowColor: '#60a5fa',
      highlightColor: '#ffffff',
      gradientDirection: '135deg'
    },
    'elastic': {
      primaryColor: '#f472b6',
      secondaryColor: '#a855f7',
      textColor: '#ffffff',
      tertiaryColor: '#ec4899',
      quaternaryColor: '#8b5cf6',
      glowColor: '#f472b6',
      highlightColor: '#ffffff',
      gradientDirection: 'to right'
    },
    'metallic': {
      primaryColor: '#9ca3af',
      secondaryColor: '#6b7280',
      textColor: '#1f2937',
      tertiaryColor: '#4b5563',
      quaternaryColor: '#374151',
      glowColor: '#9ca3af',
      highlightColor: '#e5e7eb',
      gradientDirection: 'to bottom'
    },
    'neon-outline': {
      primaryColor: '#06b6d4',
      secondaryColor: '#0891b2',
      textColor: '#06b6d4',
      tertiaryColor: '#67e8f9',
      quaternaryColor: '#22d3ee',
      glowColor: '#06b6d4',
      highlightColor: '#a5f3fc',
      gradientDirection: 'to right'
    },
    'origami': {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      textColor: '#1d4ed8',
      tertiaryColor: '#60a5fa',
      quaternaryColor: '#2563eb',
      glowColor: '#3b82f6',
      highlightColor: '#dbeafe',
      gradientDirection: 'to bottom right'
    },
    'pixel': {
      primaryColor: '#4ade80',
      secondaryColor: '#16a34a',
      textColor: '#15803d',
      tertiaryColor: '#22c55e',
      quaternaryColor: '#059669',
      glowColor: '#4ade80',
      highlightColor: '#bbf7d0',
      gradientDirection: 'to right'
    },
    'sketch': {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      textColor: '#1f2937',
      tertiaryColor: '#4b5563',
      quaternaryColor: '#6b7280',
      glowColor: '#1f2937',
      highlightColor: '#ffffff',
      gradientDirection: 'to right'
    },
    'brush': {
      primaryColor: '#064e3b',
      secondaryColor: '#065f46',
      textColor: '#064e3b',
      tertiaryColor: '#047857',
      quaternaryColor: '#059669',
      glowColor: '#064e3b',
      highlightColor: '#a7f3d0',
      gradientDirection: 'to right'
    }
  }
  
  return styleDefaults[styleId] || {
    primaryColor: DEFAULT_COLORS.primary,
    secondaryColor: DEFAULT_COLORS.secondary,
    textColor: DEFAULT_COLORS.text,
    tertiaryColor: '#6366f1',
    quaternaryColor: '#8b5cf6',
    glowColor: DEFAULT_COLORS.primary,
    highlightColor: '#ffffff',
    gradientDirection: 'to right'
  }
}

export function LinkListEditor({ props, onChange, onSave, onClose }: LinkListEditorProps) {
  const [currentTab, setCurrentTab] = useState("style")
  const [customization, setCustomization] = useState({
    primaryColor: props.customColors?.primary || DEFAULT_COLORS.primary,
    secondaryColor: props.customColors?.secondary || DEFAULT_COLORS.secondary,
    textColor: props.customColors?.text || DEFAULT_COLORS.text,
    tertiaryColor: props.customColors?.tertiary || '#6366f1',
    quaternaryColor: props.customColors?.quaternary || '#8b5cf6',
    glowColor: props.customColors?.glow || props.customColors?.primary || DEFAULT_COLORS.primary,
    highlightColor: props.customColors?.highlight || '#ffffff',
    shadowIntensity: 0.3,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    padding: 16,
    useGradient: false,
    gradientDirection: props.customColors?.gradientDirection || 'to right'
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update customization when style changes and no custom colors are set
  useEffect(() => {
    if (!props.customColors) {
      const styleDefaults = getStyleDefaultColors(props.style || 'pill')
      setCustomization(prev => ({
        ...prev,
        ...styleDefaults
      }))
    }
  }, [props.style, props.customColors])

  const updateProps = (updates: Partial<LinkListBlockProps>) => {
    onChange({ ...props, ...updates })
  }

  const updateCustomization = (updates: any) => {
    const newCustomization = { ...customization, ...updates }
    setCustomization(newCustomization)

    // Always set customColors when user is actively customizing
    // This allows each style to use the custom colors instead of their original defaults
    // All 13+ properties are properly mapped for standardization
    updateProps({
      customColors: {
        // Basic colors (5 properties)
        primary: newCustomization.primaryColor,
        secondary: newCustomization.secondaryColor,
        text: newCustomization.textColor,
        accent: newCustomization.accentColor || newCustomization.primaryColor,
        background: newCustomization.backgroundColor || newCustomization.secondaryColor,
        // Extended gradient colors (2 properties)
        tertiary: newCustomization.tertiaryColor,
        quaternary: newCustomization.quaternaryColor,
        // Effect colors (4 properties)
        glow: newCustomization.glowColor,
        highlight: newCustomization.highlightColor,
        shadow: newCustomization.shadowColor,
        border: newCustomization.borderColor,
        // Gradient configuration (2+ properties)
        gradientType: newCustomization.gradientType || 'linear',
        gradientDirection: newCustomization.gradientDirection || 'to right',
        gradientStops: newCustomization.gradientStops
      }
    })
  }

  const handleAddLink = () => {
    const newLink = {
      id: generateId(),
      title: 'New Link',
      url: 'https://example.com',
      isActive: true,
      icon: ''
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

  const filteredStyles = (category?: 'basic' | 'modern' | 'creative') => {
    if (!category) return STYLE_TEMPLATES
    return getStylesByCategory(category)
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
                          <div
                            key={template.id}
                            onClick={() => updateProps({ style: template.id as LinkListStyle })}
                            className={`p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${props.style === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="h-12 mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                              <div className="scale-75 w-full">
                                <LinkListBlock
                                  props={{
                                    ...PREVIEW_DATA,
                                    style: template.id,
                                    customColors: props.customColors ? {
                                      primary: customization.primaryColor,
                                      secondary: customization.secondaryColor,
                                      text: customization.textColor,
                                      accent: customization.primaryColor,
                                      background: customization.secondaryColor,
                                      tertiary: customization.tertiaryColor,
                                      quaternary: customization.quaternaryColor,
                                      glow: customization.glowColor,
                                      highlight: customization.highlightColor,
                                      gradientType: 'linear',
                                      gradientDirection: customization.gradientDirection
                                    } : undefined
                                  }}
                                  className="!p-1 pointer-events-none"
                                  isEditing={true}
                                />
                              </div>
                            </div>
                            <div className="text-xs font-medium text-gray-900">{template.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Modern Styles</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {filteredStyles('modern').map((template) => (
                          <div
                            key={template.id}
                            onClick={() => updateProps({ style: template.id as LinkListStyle })}
                            className={`p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${props.style === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="h-12 mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                              <div className="scale-75 w-full">
                                <LinkListBlock
                                  props={{
                                    ...PREVIEW_DATA,
                                    style: template.id,
                                    customColors: props.customColors ? {
                                      primary: customization.primaryColor,
                                      secondary: customization.secondaryColor,
                                      text: customization.textColor,
                                      accent: customization.primaryColor,
                                      background: customization.secondaryColor,
                                      tertiary: customization.tertiaryColor,
                                      quaternary: customization.quaternaryColor,
                                      glow: customization.glowColor,
                                      highlight: customization.highlightColor,
                                      gradientType: 'linear',
                                      gradientDirection: customization.gradientDirection
                                    } : undefined
                                  }}
                                  className="!p-1 pointer-events-none"
                                  isEditing={true}
                                />
                              </div>
                            </div>
                            <div className="text-xs font-medium text-gray-900">{template.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Creative Styles</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {filteredStyles('creative').map((template) => (
                          <div
                            key={template.id}
                            onClick={() => updateProps({ style: template.id as LinkListStyle })}
                            className={`p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${props.style === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="h-12 mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                              <div className="scale-75 w-full">
                                <LinkListBlock
                                  props={{
                                    ...PREVIEW_DATA,
                                    style: template.id,
                                    customColors: props.customColors ? {
                                      primary: customization.primaryColor,
                                      secondary: customization.secondaryColor,
                                      text: customization.textColor,
                                      accent: customization.primaryColor,
                                      background: customization.secondaryColor,
                                      tertiary: customization.tertiaryColor,
                                      quaternary: customization.quaternaryColor,
                                      glow: customization.glowColor,
                                      highlight: customization.highlightColor,
                                      gradientType: 'linear',
                                      gradientDirection: customization.gradientDirection
                                    } : undefined
                                  }}
                                  className="!p-1 pointer-events-none"
                                  isEditing={true}
                                />
                              </div>
                            </div>
                            <div className="text-xs font-medium text-gray-900">{template.name}</div>
                          </div>
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
                  {/* Color Compatibility Notice */}
                  {!isFullyCustomizable(props.style) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Palette className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Limited Color Support
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            The "{props.style}" style has a fixed theme. Try "pill", "card", or "modern" for full color customization.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Color Presets */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Quick Color Presets</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            const advanced = preset.advanced;
                            updateCustomization({
                              // Basic colors (5 properties)
                              primaryColor: preset.colors.primary,
                              secondaryColor: preset.colors.secondary,
                              textColor: preset.colors.text,
                              accentColor: preset.colors.accent,
                              backgroundColor: preset.colors.background,
                              // Extended gradient colors (2 properties)
                              tertiaryColor: advanced.tertiary,
                              quaternaryColor: advanced.quaternary,
                              // Effect colors (4 properties)
                              glowColor: advanced.glow,
                              highlightColor: advanced.highlight,
                              shadowColor: advanced.shadow,
                              borderColor: advanced.border,
                              // Gradient configuration (2+ properties)
                              gradientType: advanced.gradientType,
                              gradientDirection: advanced.gradientDirection,
                              gradientStops: advanced.gradientStops
                            })
                          }}
                          className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.colors.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.colors.text }}
                            />
                            {preset.advanced?.tertiary && (
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: preset.advanced.tertiary }}
                              />
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-900">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Color Controls */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Style Colors</Label>
                    {(() => {
                      const styleReqs = getStyleColorRequirements(props.style || 'pill')
                      const colorMap: Record<string, string> = {
                        primary: customization.primaryColor,
                        secondary: customization.secondaryColor,
                        text: customization.textColor,
                        tertiary: customization.tertiaryColor,
                        quaternary: customization.quaternaryColor,
                        glow: customization.glowColor,
                        highlight: customization.highlightColor,
                        background: customization.secondaryColor,
                      }
                      
                      return (
                        <div className="space-y-4">
                          {styleReqs.colors.map((colorConfig) => (
                            <div key={colorConfig.key}>
                              <Label className="text-xs text-gray-600 mb-2 block">{colorConfig.label}</Label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={colorMap[colorConfig.key] || '#3b82f6'}
                                  onChange={(e) => {
                                    const updateKey = colorConfig.key === 'primary' ? 'primaryColor' :
                                                    colorConfig.key === 'secondary' ? 'secondaryColor' :
                                                    colorConfig.key === 'text' ? 'textColor' :
                                                    colorConfig.key === 'tertiary' ? 'tertiaryColor' :
                                                    colorConfig.key === 'quaternary' ? 'quaternaryColor' :
                                                    colorConfig.key === 'glow' ? 'glowColor' :
                                                    colorConfig.key === 'highlight' ? 'highlightColor' :
                                                    colorConfig.key === 'background' ? 'secondaryColor' : 'primaryColor'
                                    updateCustomization({ [updateKey]: e.target.value })
                                  }}
                                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                />
                                <Input
                                  value={colorMap[colorConfig.key] || '#3b82f6'}
                                  onChange={(e) => {
                                    const updateKey = colorConfig.key === 'primary' ? 'primaryColor' :
                                                    colorConfig.key === 'secondary' ? 'secondaryColor' :
                                                    colorConfig.key === 'text' ? 'textColor' :
                                                    colorConfig.key === 'tertiary' ? 'tertiaryColor' :
                                                    colorConfig.key === 'quaternary' ? 'quaternaryColor' :
                                                    colorConfig.key === 'glow' ? 'glowColor' :
                                                    colorConfig.key === 'highlight' ? 'highlightColor' :
                                                    colorConfig.key === 'background' ? 'secondaryColor' : 'primaryColor'
                                    updateCustomization({ [updateKey]: e.target.value })
                                  }}
                                  className="flex-1 h-8 text-sm font-mono"
                                  placeholder="#3b82f6"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{colorConfig.description}</p>
                            </div>
                          ))}
                          
                          {styleReqs.gradientDirection && (
                            <div>
                              <Label className="text-xs text-gray-600 mb-2 block">Gradient Direction</Label>
                              <select
                                value={customization.gradientDirection}
                                onChange={(e) => updateCustomization({ gradientDirection: e.target.value })}
                                className="w-full h-8 text-sm bg-white border border-gray-300 rounded-md px-2"
                              >
                                <option value="to right">Left to Right</option>
                                <option value="to left">Right to Left</option>
                                <option value="to bottom">Top to Bottom</option>
                                <option value="to top">Bottom to Top</option>
                                <option value="to bottom right">Top-Left to Bottom-Right</option>
                                <option value="to bottom left">Top-Right to Bottom-Left</option>
                                <option value="45deg">45 Degrees</option>
                                <option value="90deg">90 Degrees</option>
                                <option value="135deg">135 Degrees</option>
                                <option value="180deg">180 Degrees</option>
                              </select>
                              <p className="text-xs text-gray-500 mt-1">Direction for gradient styles</p>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Quick Actions</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Get default colors for current style
                          const styleDefaults = getStyleDefaultColors(props.style || 'pill')
                          
                          // Reset customization state to style-specific defaults
                          setCustomization({
                            ...styleDefaults,
                            shadowIntensity: 0.3,
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            padding: 16,
                            useGradient: false
                          })
                          // Remove customColors entirely so each style uses its original colors
                          updateProps({ customColors: undefined })
                        }}
                      >
                        Reset to Original
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const temp = customization.primaryColor
                          updateCustomization({
                            primaryColor: customization.textColor,
                            textColor: temp
                          })
                        }}
                      >
                        Swap Primary/Text
                      </Button>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Live Preview</Label>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="max-w-xs mx-auto">
                        <LinkListBlock
                          props={{
                            ...PREVIEW_DATA,
                            style: props.style,
                            customColors: props.customColors ? {
                              primary: customization.primaryColor,
                              secondary: customization.secondaryColor,
                              text: customization.textColor,
                              accent: customization.primaryColor,
                              background: customization.secondaryColor,
                              tertiary: customization.tertiaryColor,
                              quaternary: customization.quaternaryColor,
                              glow: customization.glowColor,
                              highlight: customization.highlightColor,
                              gradientType: 'linear',
                              gradientDirection: customization.gradientDirection
                            } : undefined
                          }}
                          className="!p-2"
                          isEditing={true}
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