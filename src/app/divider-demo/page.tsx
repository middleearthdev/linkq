'use client'

import React, { useState } from 'react'
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DividerBlockProps } from '@/types'
import { Smartphone, Tablet } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet'

export default function DividerBlockDemoPage() {
  // State for live customization
  const [selectedStyle, setSelectedStyle] = useState<any>('solid')
  const [selectedThickness, setSelectedThickness] = useState(1)
  const [selectedColor, setSelectedColor] = useState('#e5e7eb')
  const [selectedSpacing, setSelectedSpacing] = useState<any>('md')
  const [selectedIcon, setSelectedIcon] = useState<any>('none')
  const [isAnimated, setIsAnimated] = useState(false)
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile')

  const deviceFrameClass = {
    mobile: 'max-w-[375px] mx-auto',
    tablet: 'max-w-2xl mx-auto'
  }

  const dividerStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
  ] as const

  const iconOptions = [
    { value: 'none', label: 'None' },
    { value: 'sparkles', label: 'Sparkles' },
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'star', label: 'Star' },
    { value: 'heart', label: 'Heart' },
    { value: 'zap', label: 'Zap' },
  ] as const

  const colorPresets = [
    { color: '#e5e7eb', label: 'Light Gray' },
    { color: '#9ca3af', label: 'Gray' },
    { color: '#374151', label: 'Dark Gray' },
    { color: '#000000', label: 'Black' },
    { color: '#ef4444', label: 'Red' },
    { color: '#f59e0b', label: 'Orange' },
    { color: '#10b981', label: 'Green' },
    { color: '#3b82f6', label: 'Blue' },
    { color: '#8b5cf6', label: 'Purple' },
    { color: '#ec4899', label: 'Pink' },
  ]

  const spacings = ['none', 'sm', 'md', 'lg'] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-600 via-gray-700 to-zinc-800 bg-clip-text text-transparent">
            DividerBlock Demo
          </h1>
          <p className="text-xl text-gray-600">
            4 Divider Styles • 7 Icon Options • Full Customization
          </p>
          <div className="flex gap-4 justify-center text-sm text-gray-500">
            <span>✅ Multiple Styles</span>
            <span>✅ Icon Support</span>
            <span>✅ Mobile-First</span>
          </div>
        </div>

        {/* Live Interactive Preview */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🎨 Live Interactive Preview</h2>

          {/* Controls */}
          <div className="space-y-6 mb-8">
            {/* Style Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Divider Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dividerStyles.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedStyle === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStyle(value)}
                    className="text-xs h-9"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Icon (Optional)</label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {iconOptions.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedIcon === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedIcon(value)}
                    className="text-xs h-9"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Thickness Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Thickness</label>
                <span className="text-xs text-gray-500">{selectedThickness}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedThickness}
                onChange={(e) => setSelectedThickness(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Color</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-12 h-9 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="#e5e7eb"
                />
              </div>
              {/* Color presets */}
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {colorPresets.map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full h-8 rounded border-2 transition-all ${
                      selectedColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Spacing</label>
              <div className="grid grid-cols-4 gap-2">
                {spacings.map((space) => (
                  <Button
                    key={space}
                    variant={selectedSpacing === space ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSpacing(space)}
                    className="capitalize text-xs h-9"
                  >
                    {space}
                  </Button>
                ))}
              </div>
            </div>

            {/* Animated Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="animated"
                checked={isAnimated}
                onChange={(e) => setIsAnimated(e.target.checked)}
                className="rounded cursor-pointer"
              />
              <label htmlFor="animated" className="text-sm font-medium cursor-pointer">
                Animated (pulse effect)
              </label>
            </div>
          </div>

          {/* Device Preview Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border-2 border-slate-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Device Preview
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setDeviceType('mobile')}
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
                <span className="text-xs opacity-70">(375px)</span>
              </Button>
              <Button
                onClick={() => setDeviceType('tablet')}
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
                <span className="text-xs opacity-70">(672px)</span>
              </Button>
            </div>
          </div>

          {/* Device Frame Preview */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
              {deviceType === 'mobile' ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Preview</span>
                </>
              ) : (
                <>
                  <Tablet className="w-4 h-4" />
                  <span>Tablet Preview</span>
                </>
              )}
            </div>
          </div>

          <div className={deviceFrameClass[deviceType]}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <div className="bg-gray-900 h-6 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
              </div>
              <div className={`bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-y-auto ${
                deviceType === 'mobile' ? 'h-[500px]' : 'h-[400px]'
              }`}>
                <div className="bg-white p-6 m-4 rounded-lg">
                  <p className="text-gray-600 mb-4 text-sm">Content above divider</p>
                  <DividerBlock
                    props={{
                      style: selectedStyle,
                      thickness: selectedThickness,
                      color: selectedColor,
                      spacing: selectedSpacing,
                      icon: selectedIcon,
                      animated: isAnimated,
                    }}
                  />
                  <p className="text-gray-600 mt-4 text-sm">Content below divider</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* All Divider Styles Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">All 4 Divider Styles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dividerStyles.map(({ value, label }) => (
              <Card key={value} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                  {label}
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Section Title</p>
                  <DividerBlock
                    props={{
                      style: value,
                      thickness: 2,
                      color: '#3b82f6',
                      spacing: 'md',
                      icon: 'none',
                      animated: false,
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-2">Section content continues here...</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Icon Options Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">All 7 Icon Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iconOptions.filter(opt => opt.value !== 'none').map(({ value, label }) => (
              <Card key={value} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-sm font-semibold mb-4 text-center text-gray-500 uppercase tracking-wide">
                  {label}
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <DividerBlock
                    props={{
                      style: 'solid',
                      thickness: 1,
                      color: '#8b5cf6',
                      spacing: 'md',
                      icon: value,
                      animated: false,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Real-World Use Cases */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Real-World Use Cases</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Section Separator */}
            <Card className="p-8 bg-white">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Section Separator</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">About Me</h4>
                  <p className="text-gray-600 text-sm">
                    Hi! I'm a digital creator passionate about design and technology.
                  </p>
                </div>

                <DividerBlock
                  props={{
                    style: 'solid',
                    thickness: 1,
                    color: '#e5e7eb',
                    spacing: 'md',
                    icon: 'none',
                    animated: false,
                  }}
                />

                <div>
                  <h4 className="text-lg font-semibold mb-2">My Work</h4>
                  <p className="text-gray-600 text-sm">
                    Check out my latest projects and creative endeavors.
                  </p>
                </div>
              </div>
            </Card>

            {/* Decorative Divider */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Decorative Accent</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-2">Premium Collection</h4>
                  <p className="text-gray-600 text-sm">
                    Exclusive designs curated just for you
                  </p>
                </div>

                <DividerBlock
                  props={{
                    style: 'double',
                    thickness: 2,
                    color: '#8b5cf6',
                    spacing: 'lg',
                    icon: 'sparkles',
                    animated: true,
                  }}
                />

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Limited time offer • Premium tier only
                  </p>
                </div>
              </div>
            </Card>

            {/* Content Break */}
            <Card className="p-8 bg-white">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Content Break</h3>
              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <DividerBlock
                  props={{
                    style: 'dashed',
                    thickness: 2,
                    color: '#9ca3af',
                    spacing: 'sm',
                    icon: 'none',
                    animated: false,
                  }}
                />

                <p className="text-gray-700 text-sm leading-relaxed">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </Card>

            {/* Dotted with Icon */}
            <Card className="p-8 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
              <h3 className="text-xl font-bold mb-6 text-center">Icon Divider</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-2">Creative Portfolio</h4>
                  <p className="text-gray-200 text-sm">
                    Clean designs that stand out
                  </p>
                </div>

                <DividerBlock
                  props={{
                    style: 'dotted',
                    thickness: 2,
                    color: '#ffffff',
                    spacing: 'lg',
                    icon: 'star',
                    animated: true,
                  }}
                />

                <div className="text-center">
                  <p className="text-sm text-gray-300">
                    Bold • Clean • Unique
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-8 bg-gradient-to-r from-slate-600 to-gray-700 text-white">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">4</div>
              <div className="text-sm opacity-90">Divider Styles</div>
            </div>
            <div>
              <div className="text-4xl font-bold">7</div>
              <div className="text-sm opacity-90">Icon Options</div>
            </div>
            <div>
              <div className="text-4xl font-bold">4</div>
              <div className="text-sm opacity-90">Spacing Options</div>
            </div>
            <div>
              <div className="text-4xl font-bold">∞</div>
              <div className="text-sm opacity-90">Color Options</div>
            </div>
            <div>
              <div className="text-4xl font-bold">📱</div>
              <div className="text-sm opacity-90">Mobile First</div>
            </div>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🚀 All Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">4 Divider Styles</div>
                <div className="text-sm text-gray-600">Solid, dashed, dotted, double</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">7 Icon Options</div>
                <div className="text-sm text-gray-600">Sparkles, circle, square, star, heart, zap</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Custom Thickness</div>
                <div className="text-sm text-gray-600">1-10px adjustable range</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Color Picker</div>
                <div className="text-sm text-gray-600">Unlimited colors + 8 presets</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Spacing Control</div>
                <div className="text-sm text-gray-600">None, sm, md, lg</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Animation</div>
                <div className="text-sm text-gray-600">Optional pulse effect</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Mobile-First Design</div>
                <div className="text-sm text-gray-600">Responsive, touch-optimized</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Type-Safe</div>
                <div className="text-sm text-gray-600">Full TypeScript & Zod validation</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Easy Integration</div>
                <div className="text-sm text-gray-600">Drop-in component, no setup needed</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">💡 Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Content Organization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Separating bio sections (About, Work, Contact)</li>
                <li>• Breaking up long-form content into digestible parts</li>
                <li>• Creating visual hierarchy in landing pages</li>
                <li>• Dividing FAQ or documentation sections</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Visual Enhancement</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Adding decorative accents to premium sections</li>
                <li>• Creating themed dividers with gradient effects</li>
                <li>• Highlighting special content with icon dividers</li>
                <li>• Building cohesive brand experiences</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
