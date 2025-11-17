'use client'

/**
 * Standalone LinkList Editor - Test & Demo Page
 * Quick access for testing all link styles and color presets
 *
 * Access: http://localhost:3000/test/linklist-editor
 */

import { useState } from 'react'
import { LinkListBlock } from '@/components/blocks/LinkListBlock'
import { AdvancedColorPicker } from '@/components/editor/AdvancedColorPicker'
import {
  COLOR_PRESETS,
  STYLE_TEMPLATES,
  getStylesByCategory,
  type LinkListStyle,
  type CustomColors
} from '@/lib/link-list-styles'
import type { LinkListBlockProps } from '@/types'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Copy, RotateCcw, Palette, Paintbrush } from 'lucide-react'

export default function LinkListEditorTestPage() {
  // Initial sample links
  const [props, setProps] = useState<LinkListBlockProps>({
    style: 'pill',
    items: [
      {
        id: '1',
        title: 'My Website',
        url: 'https://example.com',
        icon: '🌐',
        isActive: true
      },
      {
        id: '2',
        title: 'GitHub Profile',
        url: 'https://github.com',
        icon: '💻',
        isActive: true
      },
      {
        id: '3',
        title: 'Twitter/X',
        url: 'https://twitter.com',
        icon: '🐦',
        isActive: true
      },
      {
        id: '4',
        title: 'Instagram',
        url: 'https://instagram.com',
        icon: '📸',
        isActive: true
      },
      {
        id: '5',
        title: 'YouTube Channel',
        url: 'https://youtube.com',
        icon: '🎥',
        isActive: true
      }
    ],
    customColors: undefined
  })

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // Add new link
  const handleAddLink = () => {
    const newLink = {
      id: `${Date.now()}`,
      title: 'New Link',
      url: 'https://example.com',
      icon: '🔗',
      isActive: true
    }
    setProps({
      ...props,
      items: [...props.items, newLink]
    })
  }

  // Remove link
  const handleRemoveLink = (id: string) => {
    setProps({
      ...props,
      items: props.items.filter(item => item.id !== id)
    })
  }

  // Update link
  const handleUpdateLink = (id: string, updates: any) => {
    setProps({
      ...props,
      items: props.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    })
  }

  // Upload thumbnail
  const handleUploadThumbnail = async (itemId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/thumbnail', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          alert(`Upload failed: ${error.error}`)
          return
        }

        const { url } = await response.json()

        // Update link with thumbnail URL
        handleUpdateLink(itemId, { thumbnail: url })
      } catch (error) {
        console.error('Thumbnail upload failed:', error)
        alert('Upload failed. Please try again.')
      }
    }

    input.click()
  }

  // Apply preset
  const handleApplyPreset = (presetName: string) => {
    const preset = COLOR_PRESETS.find(p => p.name === presetName)
    if (!preset) return

    const advanced = preset.advanced
    setProps({
      ...props,
      customColors: {
        primary: preset.colors.primary,
        secondary: preset.colors.secondary,
        text: preset.colors.text,
        accent: preset.colors.accent,
        background: preset.colors.background,
        tertiary: advanced.tertiary,
        quaternary: advanced.quaternary,
        glow: advanced.glow,
        highlight: advanced.highlight,
        shadow: advanced.shadow,
        border: advanced.border,
        gradientType: advanced.gradientType,
        gradientDirection: advanced.gradientDirection,
        gradientStops: advanced.gradientStops
      }
    })
    setSelectedPreset(presetName)
  }

  // Reset colors
  const handleResetColors = () => {
    setProps({
      ...props,
      customColors: undefined
    })
    setSelectedPreset(null)
  }

  // Change style
  const handleChangeStyle = (style: LinkListStyle) => {
    setProps({
      ...props,
      style
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                LinkList Editor - Test Page
              </h1>
              <p className="text-gray-600 mt-2">
                Test all 53 link styles and 8 color presets • All properties standardized ✅
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleResetColors}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Editor Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Presets
              </h2>

              <div className="space-y-3">
                <Label className="text-sm text-gray-600">
                  Quick Presets (All 15 properties applied)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset.name)}
                      className={`p-3 border rounded-lg transition-all text-left hover:border-blue-500 ${
                        selectedPreset === preset.name
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: preset.colors.text }}
                        />
                        {preset.advanced.tertiary && (
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: preset.advanced.tertiary }}
                          />
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-900">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPreset && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-medium text-green-800">
                    ✅ Applied: {selectedPreset}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    All 15 properties active
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Paintbrush className="w-5 h-5" />
                Advanced Color Picker
              </h2>

              <AdvancedColorPicker
                colors={props.customColors}
                onChange={(colors: CustomColors) => {
                  setProps({ ...props, customColors: colors })
                  setSelectedPreset(null) // Clear preset selection when manual editing
                }}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Link Styles</h2>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="game">Game</TabsTrigger>
                  <TabsTrigger value="food">Food</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-2">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Basic & Creative Styles
                  </Label>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {[
                      ...getStylesByCategory('basic'),
                      ...getStylesByCategory('modern'),
                      ...getStylesByCategory('creative')
                    ].map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleChangeStyle(template.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          props.style === template.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="game" className="space-y-2">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Game-Inspired Styles (15 styles)
                  </Label>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {getStylesByCategory('game').map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleChangeStyle(template.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          props.style === template.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                        }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="food" className="space-y-2">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Culinary Styles (15 styles)
                  </Label>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {getStylesByCategory('culinary').map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleChangeStyle(template.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          props.style === template.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                        }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Links</h2>
                <Button size="sm" onClick={handleAddLink} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {props.items.map((item, index) => (
                  <div key={item.id} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <Label className="text-xs text-gray-500">Link #{index + 1}</Label>
                      <button
                        onClick={() => handleRemoveLink(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Icon (emoji)"
                        value={item.icon || ''}
                        onChange={(e) => handleUpdateLink(item.id, { icon: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => handleUpdateLink(item.id, { title: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="URL"
                        value={item.url}
                        onChange={(e) => handleUpdateLink(item.id, { url: e.target.value })}
                        className="text-sm"
                      />

                      {/* Thumbnail Upload */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Thumbnail (Optional)</Label>
                        {item.thumbnail ? (
                          <div className="relative">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateLink(item.id, { thumbnail: undefined })}
                              className="absolute top-2 right-2"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUploadThumbnail(item.id)}
                            className="w-full gap-2"
                          >
                            <Plus className="w-3 h-3" />
                            Upload Thumbnail
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:col-span-2">
            <Card className="p-8 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Live Preview</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Style: <span className="font-medium text-blue-600">{props.style}</span>
                    {selectedPreset && (
                      <span className="ml-2">
                        • Preset: <span className="font-medium text-green-600">{selectedPreset}</span>
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {props.items.length} links
                </div>
              </div>

              {/* Preview Canvas */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[600px] border-2 border-gray-200">
                <div className="max-w-md mx-auto">
                  <LinkListBlock
                    props={props}
                    isEditing={false}
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  🎨 Custom Colors Active
                </h3>
                {props.customColors ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-blue-700">Primary:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: props.customColors.primary }} />
                        <code className="text-[10px]">{props.customColors.primary}</code>
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Secondary:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: props.customColors.secondary }} />
                        <code className="text-[10px]">{props.customColors.secondary}</code>
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Glow:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: props.customColors.glow }} />
                        <code className="text-[10px]">{props.customColors.glow}</code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-blue-700">
                    No custom colors applied. Using default style colors.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">53</div>
            <div className="text-sm text-gray-600 mt-1">Total Styles</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600 mt-1">Color Presets</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">15</div>
            <div className="text-sm text-gray-600 mt-1">Color Properties</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-gray-600 mt-1">Standardized</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
