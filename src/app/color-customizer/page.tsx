/**
 * Color Customizer Page
 * Real-time color customization for LinkListBlock styles
 */

'use client'

import { useState } from 'react'
import { LinkListBlock } from '@/components/blocks/LinkListBlock'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Palette, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  COLOR_PRESETS,
  ALL_STYLES,
  DEFAULT_COLORS,
  LinkListStyle
} from '@/lib/link-list-styles'



// Mock data for preview
const mockData = {
  style: 'pill' as const,
  items: [
    { id: '1', title: 'My Portfolio', url: 'https://johndoe.dev', isActive: true },
    { id: '2', title: 'GitHub', url: 'https://github.com/johndoe', isActive: true },
    { id: '3', title: 'Contact Me', url: 'mailto:john@johndoe.dev', isActive: true }
  ]
}

export default function ColorCustomizerPage() {
  const [selectedStyle, setSelectedStyle] = useState<LinkListStyle>('pill')
  const [customColors, setCustomColors] = useState(DEFAULT_COLORS)

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setCustomColors(preset.colors)
  }

  const resetColors = () => {
    setCustomColors(DEFAULT_COLORS)
  }

  const copyColors = () => {
    const colorJson = JSON.stringify(customColors, null, 2)
    navigator.clipboard.writeText(colorJson)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/blocks-preview">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blocks
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Palette className="h-6 w-6" />
                  Color Customizer
                </h1>
                <p className="text-muted-foreground">Customize LinkListBlock colors in real-time</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={resetColors}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={copyColors}>
                Copy Colors
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Color Controls */}
          <div className="lg:col-span-1 space-y-6">

            {/* Color Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Color Presets</CardTitle>
                <CardDescription>Quick start with popular color combinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {COLOR_PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="w-full justify-between h-auto p-3"
                    onClick={() => applyPreset(preset)}
                  >
                    <span>{preset.name}</span>
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Custom Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Colors</CardTitle>
                <CardDescription>Fine-tune your color palette</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Style Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Style</CardTitle>
                <CardDescription>Choose a style to preview (all 23 styles support colors!)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {ALL_STYLES.map((style) => (
                    <Button
                      key={style}
                      variant={selectedStyle === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStyle(style)}
                      className="capitalize justify-start"
                    >
                      {style.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See your colors applied in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <LinkListBlock
                      props={{
                        ...mockData,
                        style: selectedStyle,
                        customColors
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Styles Preview */}
            <Card>
              <CardHeader>
                <CardTitle>All 23 Styles Showcase</CardTitle>
                <CardDescription>Your custom colors applied to every available style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ALL_STYLES.map((style) => (
                    <div key={style} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground capitalize flex items-center justify-between">
                        <span>{style.replace('-', ' ')}</span>
                        {selectedStyle === style && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "min-h-[100px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-3 flex items-center justify-center cursor-pointer border-2 transition-colors",
                          selectedStyle === style ? "border-blue-500" : "border-transparent hover:border-gray-300"
                        )}
                        onClick={() => setSelectedStyle(style)}
                      >
                        <div className="w-full max-w-xs">
                          <LinkListBlock
                            props={{
                              style: style,
                              items: [
                                { id: '1', title: 'Sample', url: '#', isActive: true }
                              ],
                              customColors
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Color Code Output */}
            <Card>
              <CardHeader>
                <CardTitle>Export Colors</CardTitle>
                <CardDescription>Copy these values to use in your components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`// Custom Colors Configuration
customColors: ${JSON.stringify(customColors, null, 2)}

// Usage in LinkListBlock
<LinkListBlock 
  props={{
    style: "${selectedStyle}",
    items: [...],
    customColors: ${JSON.stringify(customColors, null, 2)}
  }}
/>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}