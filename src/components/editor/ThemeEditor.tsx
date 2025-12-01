/**
 * Theme Editor Component
 * Visual editor for template CSS variables and styling
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Type,
  Layout,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Image
} from "lucide-react"
import { BackgroundPicker } from "@/components/editor/BackgroundPicker"

interface ThemeEditorProps {
  cssVars: Record<string, string>
  onChange: (cssVars: Record<string, string>) => void
  backgroundKey?: string
  onBackgroundChange?: (backgroundKey: string) => void
  isPremiumUser?: boolean
  className?: string
}

const THEME_PRESETS = {
  "default": {
    '--primary-color': '#66A38A',
    '--secondary-color': '#E8F4F0',
    '--background-color': '#ffffff',
    '--text-color': '#1f2937',
    '--card-background': '#ffffff',
    '--card-text': '#1f2937',
    '--border-radius': '12px',
    '--spacing': '16px'
  },
  "dark": {
    '--primary-color': '#60A5FA',
    '--secondary-color': '#1E293B',
    '--background-color': '#0F172A',
    '--text-color': '#F8FAFC',
    '--card-background': '#1E293B',
    '--card-text': '#F8FAFC',
    '--border-radius': '8px',
    '--spacing': '16px'
  },
  "minimal": {
    '--primary-color': '#000000',
    '--secondary-color': '#F5F5F5',
    '--background-color': '#ffffff',
    '--text-color': '#000000',
    '--card-background': '#ffffff',
    '--card-text': '#000000',
    '--border-radius': '4px',
    '--spacing': '12px'
  },
  "vibrant": {
    '--primary-color': '#EC4899',
    '--secondary-color': '#FCE7F3',
    '--background-color': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--text-color': '#ffffff',
    '--card-background': 'rgba(255, 255, 255, 0.1)',
    '--card-text': '#ffffff',
    '--border-radius': '16px',
    '--spacing': '20px'
  },
  "nature": {
    '--primary-color': '#10B981',
    '--secondary-color': '#D1FAE5',
    '--background-color': 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    '--text-color': '#064E3B',
    '--card-background': 'rgba(255, 255, 255, 0.9)',
    '--card-text': '#064E3B',
    '--border-radius': '12px',
    '--spacing': '18px'
  }
}

const FONT_OPTIONS = [
  { name: 'System Default', value: 'system' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' }
]

export function ThemeEditor({
  cssVars,
  onChange,
  backgroundKey = 'gradient-soft-clouds',
  onBackgroundChange,
  isPremiumUser = false,
  className
}: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState("presets")

  const updateCssVar = (key: string, value: string) => {
    onChange({
      ...cssVars,
      [key]: value
    })
  }

  const applyPreset = (presetName: string) => {
    const preset = THEME_PRESETS[presetName as keyof typeof THEME_PRESETS]
    if (preset) {
      onChange({ ...cssVars, ...preset })
    }
  }

  const resetToDefault = () => {
    onChange(THEME_PRESETS.default)
  }

  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(cssVars, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const theme = JSON.parse(e.target?.result as string)
          onChange({ ...cssVars, ...theme })
        } catch (error) {
          alert('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  const ColorPicker = ({ label, varName, value }: { label: string, varName: string, value: string }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="color"
            value={value?.startsWith('#') ? value : '#66A38A'}
            onChange={(e) => updateCssVar(varName, e.target.value)}
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => updateCssVar(varName, e.target.value)}
          placeholder="#000000"
          className="flex-1 h-8 text-xs"
        />
      </div>
    </div>
  )

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
              <Palette className="h-4 w-4" />
              Theme Editor
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize colors and styling
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={resetToDefault} className="h-7 px-2">
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={exportTheme} className="h-7 px-2">
              <Download className="h-3 w-3" />
            </Button>
            <div className="relative">
              <Button size="sm" variant="ghost" asChild className="h-7 px-2">
                <label className="cursor-pointer">
                  <Upload className="h-3 w-3" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-3 pt-2">
            <TabsList className="grid w-full grid-cols-5 h-8">
              <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
              <TabsTrigger value="background" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                BG
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <TabsContent value="presets" className="mt-3 space-y-0">
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(THEME_PRESETS).map(([name, preset]) => (
                  <Button
                    key={name}
                    variant="outline"
                    onClick={() => applyPreset(name)}
                    className="h-auto p-2 flex items-center justify-start space-x-2 text-left"
                  >
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset['--primary-color'] }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset['--secondary-color'] }}
                      />
                    </div>
                    <span className="text-xs font-medium capitalize">{name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="background" className="mt-3 space-y-0">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-blue-800">
                    Choose a background for your site. Premium backgrounds unlock advanced animations.
                  </p>
                </div>
                {onBackgroundChange ? (
                  <BackgroundPicker
                    value={backgroundKey}
                    onChange={onBackgroundChange}
                    isPremiumUser={isPremiumUser}
                  />
                ) : (
                  <p className="text-xs text-gray-500">Background picker not available</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="mt-3 space-y-0">
              <div className="space-y-3">
                <ColorPicker
                  label="Primary Color"
                  varName="--primary-color"
                  value={cssVars['--primary-color'] || '#66A38A'}
                />
                <ColorPicker
                  label="Secondary Color"
                  varName="--secondary-color"
                  value={cssVars['--secondary-color'] || '#E8F4F0'}
                />
                <ColorPicker
                  label="Background Color"
                  varName="--background-color"
                  value={cssVars['--background-color'] || '#ffffff'}
                />
                <ColorPicker
                  label="Text Color"
                  varName="--text-color"
                  value={cssVars['--text-color'] || '#1f2937'}
                />
                <ColorPicker
                  label="Card Background"
                  varName="--card-background"
                  value={cssVars['--card-background'] || '#ffffff'}
                />
                <ColorPicker
                  label="Card Text"
                  varName="--card-text"
                  value={cssVars['--card-text'] || '#1f2937'}
                />
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-3 space-y-0">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Font Family</Label>
                  <select
                    value={cssVars['--font-family'] || 'system'}
                    onChange={(e) => updateCssVar('--font-family', e.target.value)}
                    className="w-full h-8 px-2 rounded-md border border-gray-300 bg-white text-xs"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Font Size: {cssVars['--font-size'] || '16px'}
                  </Label>
                  <Slider
                    value={[parseInt(cssVars['--font-size']?.replace('px', '') || '16')]}
                    onValueChange={([value]) => updateCssVar('--font-size', `${value}px`)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Line Height: {cssVars['--line-height'] || '1.5'}
                  </Label>
                  <Slider
                    value={[parseFloat(cssVars['--line-height'] || '1.5') * 10]}
                    onValueChange={([value]) => updateCssVar('--line-height', (value / 10).toString())}
                    min={10}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="mt-3 space-y-0">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Border Radius: {cssVars['--border-radius'] || '12px'}
                  </Label>
                  <Slider
                    value={[parseInt(cssVars['--border-radius']?.replace('px', '') || '12')]}
                    onValueChange={([value]) => updateCssVar('--border-radius', `${value}px`)}
                    min={0}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Spacing: {cssVars['--spacing'] || '16px'}
                  </Label>
                  <Slider
                    value={[parseInt(cssVars['--spacing']?.replace('px', '') || '16')]}
                    onValueChange={([value]) => updateCssVar('--spacing', `${value}px`)}
                    min={8}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Background Style</Label>
                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      size="sm"
                      variant={cssVars['--background']?.includes('gradient') ? 'default' : 'outline'}
                      onClick={() => updateCssVar('--background', 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)')}
                      className="h-7 text-xs"
                    >
                      Gradient
                    </Button>
                    <Button
                      size="sm"
                      variant={!cssVars['--background']?.includes('gradient') ? 'default' : 'outline'}
                      onClick={() => updateCssVar('--background', cssVars['--background-color'] || '#ffffff')}
                      className="h-7 text-xs"
                    >
                      Solid
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Compact Theme Preview */}
        <div className="mt-3 p-3 border-t border-gray-200">
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="h-3 w-3" />
            <span className="text-xs font-medium">Preview</span>
          </div>
          <div 
            className="p-2 rounded text-xs"
            style={{
              background: cssVars['--background'] || cssVars['--background-color'] || '#ffffff',
              color: cssVars['--text-color'] || '#1f2937',
              borderRadius: cssVars['--border-radius'] || '12px',
              fontSize: '10px',
              transform: 'scale(0.8)',
              transformOrigin: 'left top'
            }}
          >
            <div 
              className="p-1.5 rounded mb-1.5"
              style={{
                background: cssVars['--card-background'] || '#ffffff',
                color: cssVars['--card-text'] || '#1f2937',
                borderRadius: cssVars['--border-radius'] || '12px'
              }}
            >
              <div style={{ color: cssVars['--primary-color'] || '#66A38A', fontWeight: 'bold' }}>
                Sample Header
              </div>
              <div className="mt-0.5">
                Template preview text
              </div>
            </div>
            <div 
              className="inline-block px-2 py-1 rounded"
              style={{
                background: cssVars['--primary-color'] || '#66A38A',
                color: cssVars['--card-background'] || '#ffffff',
                borderRadius: cssVars['--border-radius'] || '12px'
              }}
            >
              Button
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}