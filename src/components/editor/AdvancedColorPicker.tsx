'use client'

/**
 * Advanced Color Picker Component
 * Allows customization of all 15 color properties with live preview
 */

import { useState } from 'react'
import { HexColorPicker, RgbaColorPicker } from 'react-colorful'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Palette, Sparkles, Sliders, Zap } from 'lucide-react'
import type { CustomColors } from '@/lib/link-list-styles'

interface AdvancedColorPickerProps {
  colors?: CustomColors
  onChange: (colors: CustomColors) => void
}

export function AdvancedColorPicker({ colors, onChange }: AdvancedColorPickerProps) {
  const [localColors, setLocalColors] = useState<CustomColors>(colors || {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    text: '#ffffff',
    accent: '#60a5fa',
    background: '#f3f4f6',
    tertiary: '#60a5fa',
    quaternary: '#1e40af',
    glow: '#3b82f6',
    highlight: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.1)',
    border: '#3b82f6',
    gradientType: 'linear',
    gradientDirection: 'to right'
  })

  const [showPicker, setShowPicker] = useState<string | null>(null)

  const updateColor = (key: keyof CustomColors, value: any) => {
    const newColors = { ...localColors, [key]: value }
    setLocalColors(newColors)
    onChange(newColors)
  }

  const ColorControl = ({
    label,
    colorKey,
    description
  }: {
    label: string
    colorKey: keyof CustomColors
    description?: string
  }) => {
    const value = localColors[colorKey] as string || '#000000'
    const isRgba = colorKey === 'shadow' && typeof value === 'string' && value.startsWith('rgba')

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">{label}</Label>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: value }}
              onClick={() => setShowPicker(showPicker === colorKey ? null : colorKey)}
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => updateColor(colorKey, e.target.value)}
              className="w-32 font-mono text-xs"
              placeholder="#000000"
            />
          </div>
        </div>

        {showPicker === colorKey && (
          <div className="p-4 border rounded-lg bg-white shadow-lg">
            {isRgba ? (
              <RgbaColorPicker
                color={(() => {
                  // Parse rgba string to RgbaColor object
                  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/)
                  if (match) {
                    return {
                      r: parseInt(match[1]),
                      g: parseInt(match[2]),
                      b: parseInt(match[3]),
                      a: match[4] ? parseFloat(match[4]) : 1
                    }
                  }
                  return { r: 0, g: 0, b: 0, a: 0.1 }
                })()}
                onChange={(color) => {
                  const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
                  updateColor(colorKey, rgba)
                }}
              />
            ) : (
              <HexColorPicker
                color={value}
                onChange={(color) => updateColor(colorKey, color)}
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPicker(null)}
              className="w-full mt-2"
            >
              Done
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-2">
        {/* Basic Colors */}
        <AccordionItem value="basic" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Basic Colors</span>
              <span className="text-xs text-gray-500">(5 properties)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <ColorControl
              label="Primary Color"
              colorKey="primary"
              description="Main brand color"
            />
            <ColorControl
              label="Secondary Color"
              colorKey="secondary"
              description="Supporting color"
            />
            <ColorControl
              label="Text Color"
              colorKey="text"
              description="Text on colored backgrounds"
            />
            <ColorControl
              label="Accent Color"
              colorKey="accent"
              description="Highlights and emphasis"
            />
            <ColorControl
              label="Background Color"
              colorKey="background"
              description="Card/button background"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Extended Gradient Colors */}
        <AccordionItem value="gradient" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Gradient Colors</span>
              <span className="text-xs text-gray-500">(2 properties)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <ColorControl
              label="Tertiary Color"
              colorKey="tertiary"
              description="3rd color for complex gradients"
            />
            <ColorControl
              label="Quaternary Color"
              colorKey="quaternary"
              description="4th color for rainbow gradients"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Effect Colors */}
        <AccordionItem value="effects" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold">Effect Colors</span>
              <span className="text-xs text-gray-500">(4 properties)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <ColorControl
              label="Glow Color"
              colorKey="glow"
              description="Neon glow and box-shadow"
            />
            <ColorControl
              label="Highlight Color"
              colorKey="highlight"
              description="Shine and reflection effects"
            />
            <ColorControl
              label="Shadow Color"
              colorKey="shadow"
              description="Drop shadow (supports rgba)"
            />
            <ColorControl
              label="Border Color"
              colorKey="border"
              description="Outline and borders"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Gradient Configuration */}
        <AccordionItem value="config" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Gradient Settings</span>
              <span className="text-xs text-gray-500">(2 properties)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gradient Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateColor('gradientType', type)}
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      localColors.gradientType === type
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Gradient Direction</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'To Right →', value: 'to right' },
                  { label: 'To Left ←', value: 'to left' },
                  { label: 'To Bottom ↓', value: 'to bottom' },
                  { label: 'To Top ↑', value: 'to top' },
                  { label: 'Diagonal ↘', value: '45deg' },
                  { label: 'Diagonal ↗', value: '135deg' },
                ].map((dir) => (
                  <button
                    key={dir.value}
                    onClick={() => updateColor('gradientDirection', dir.value)}
                    className={`px-3 py-2 text-xs rounded border transition-colors ${
                      localColors.gradientDirection === dir.value
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>

              <Input
                type="text"
                value={localColors.gradientDirection || 'to right'}
                onChange={(e) => updateColor('gradientDirection', e.target.value)}
                placeholder="Custom (e.g., 90deg, to top right)"
                className="text-sm mt-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Preview Card */}
      <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <Label className="text-sm font-medium mb-3 block">Live Preview</Label>
        <div
          className="h-20 rounded-lg transition-all duration-300"
          style={{
            background: localColors.gradientType === 'linear'
              ? `linear-gradient(${localColors.gradientDirection}, ${localColors.primary}, ${localColors.secondary}, ${localColors.tertiary})`
              : localColors.gradientType === 'radial'
              ? `radial-gradient(circle, ${localColors.primary}, ${localColors.secondary}, ${localColors.tertiary})`
              : `conic-gradient(${localColors.primary}, ${localColors.secondary}, ${localColors.tertiary}, ${localColors.primary})`,
            boxShadow: `0 4px 20px ${localColors.glow}40, inset 0 1px 0 ${localColors.highlight}30`,
            border: `2px solid ${localColors.border}`,
          }}
        />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-600">Gradient + Glow + Border</span>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: localColors.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: localColors.secondary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: localColors.tertiary }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="text-xs text-gray-500 text-center">
        ✅ All 13 color properties configured
      </div>
    </div>
  )
}
