/**
 * Color Picker Component
 * Comprehensive color selection with presets and custom input
 */

"use client"

import { Input } from "@/components/ui/input"

// Helper function to calculate contrast and suggest text color
function getContrastColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance < 0.5 ? '#FFFFFF' : '#000000'
}

interface ColorPickerProps {
  value?: string
  defaultColor?: string
  onChange: (color: string | undefined) => void
  label?: string
  allowDefault?: boolean
  isTextColor?: boolean
}

const PRESET_COLORS = [
  { name: 'Sage', color: '#66A38A' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Green', color: '#22C55E' },
  { name: 'Gray', color: '#6B7280' },
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#FFFFFF' }
]

const TEXT_PRESET_COLORS = [
  { name: 'White (Dark BG)', color: '#FFFFFF', description: 'For dark backgrounds' },
  { name: 'Black (Light BG)', color: '#000000', description: 'For light backgrounds' }
]

export default function ColorPicker({ 
  value, 
  defaultColor = '#66A38A', 
  onChange, 
  label = 'Color',
  allowDefault = true,
  isTextColor = false 
}: ColorPickerProps) {
  const currentColor = value || defaultColor
  
  const presetColors = isTextColor ? TEXT_PRESET_COLORS : PRESET_COLORS
  const colorOptions = allowDefault 
    ? [{ name: 'Default', color: defaultColor, isDefault: true }, ...presetColors]
    : presetColors

  return (
    <div>
      <label className="text-xs text-gray-400 block mb-2">{label}</label>
      
      {/* Preset Colors */}
      <div className={`grid gap-2 mb-3 ${isTextColor ? 'grid-cols-1' : 'grid-cols-5'}`}>
        {colorOptions.map((colorOption) => (
          <button
            key={colorOption.name}
            onClick={() => {
              if ('isDefault' in colorOption && colorOption.isDefault) {
                onChange(undefined)
              } else {
                onChange(colorOption.color)
              }
            }}
            className={`${isTextColor ? 'h-10 px-3' : 'h-6 w-6'} rounded border-2 transition-all hover:scale-105 flex items-center justify-center ${
              (value === colorOption.color) || 
              (!value && 'isDefault' in colorOption && colorOption.isDefault)
                ? 'border-white scale-105 ring-1' 
                : 'border-gray-600 hover:border-gray-400'
            }`}
            style={{ 
              backgroundColor: isTextColor ? '#1F2937' : colorOption.color,
              color: isTextColor ? colorOption.color : getContrastColor(colorOption.color),
              borderColor: (value === colorOption.color) || 
                         (!value && 'isDefault' in colorOption && colorOption.isDefault) ? '#66A38A' : '',
              outlineColor: '#66A38A'
            }}
            title={'description' in colorOption ? (colorOption as any).description : colorOption.name}
          >
            {isTextColor ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Aa</span>
                <span className="text-xs opacity-80">{colorOption.name}</span>
              </div>
            ) : null}
          </button>
        ))}
      </div>
      
      {/* Custom Color Input */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500 block">Custom Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
          />
          <Input
            value={value || ''}
            onChange={(e) => {
              const color = e.target.value
              if (color.match(/^#[0-9A-F]{6}$/i) || color === '') {
                onChange(color || undefined)
              }
            }}
            className="bg-gray-700 border-gray-600 text-white h-8 text-sm flex-1"
            placeholder={defaultColor}
          />
        </div>
      </div>
    </div>
  )
}