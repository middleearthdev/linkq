'use client'

import React, { useState } from 'react'
import { SocialIconsBlock } from '@/components/blocks/SocialIconsBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SocialIconsBlockProps } from '@/types'

export default function SocialIconsDemoPage() {
  // Sample platforms data
  const allPlatforms = [
    { platform: 'instagram', url: 'https://instagram.com/linkq', username: 'linkq' },
    { platform: 'twitter', url: 'https://twitter.com/linkq', username: 'linkq' },
    { platform: 'x', url: 'https://x.com/linkq', username: 'linkq' },
    { platform: 'facebook', url: 'https://facebook.com/linkq', username: 'linkq' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/linkq', username: 'linkq' },
    { platform: 'github', url: 'https://github.com/linkq', username: 'linkq' },
    { platform: 'youtube', url: 'https://youtube.com/@linkq', username: 'linkq' },
    { platform: 'tiktok', url: 'https://tiktok.com/@linkq', username: 'linkq' },
    { platform: 'threads', url: 'https://threads.net/@linkq', username: 'linkq' },
    { platform: 'whatsapp', url: 'https://wa.me/1234567890', username: '' },
    { platform: 'telegram', url: 'https://t.me/linkq', username: 'linkq' },
    { platform: 'discord', url: 'https://discord.com/users/linkq', username: 'linkq' },
    { platform: 'reddit', url: 'https://reddit.com/u/linkq', username: 'linkq' },
    { platform: 'pinterest', url: 'https://pinterest.com/linkq', username: 'linkq' },
    { platform: 'snapchat', url: 'https://snapchat.com/add/linkq', username: 'linkq' },
    { platform: 'twitch', url: 'https://twitch.tv/linkq', username: 'linkq' },
    { platform: 'spotify', url: 'https://open.spotify.com/user/linkq', username: 'linkq' },
    { platform: 'soundcloud', url: 'https://soundcloud.com/linkq', username: 'linkq' },
    { platform: 'medium', url: 'https://medium.com/@linkq', username: 'linkq' },
    { platform: 'behance', url: 'https://behance.net/linkq', username: 'linkq' },
    { platform: 'dribbble', url: 'https://dribbble.com/linkq', username: 'linkq' },
  ]

  const popularPlatforms = allPlatforms.slice(0, 6)

  const [selectedStyle, setSelectedStyle] = useState<any>('round')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [selectedColorMode, setSelectedColorMode] = useState<'brand' | 'monochrome' | 'custom'>('brand')
  const [customColors, setCustomColors] = useState({
    iconColor: '#6366f1',
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
    hoverColor: '#c7d2fe',
  })

  const styles = [
    'round',
    'square',
    'minimal',
    'neon',
    'glassmorphism',
    'neumorphic',
    'floating',
    'rotating',
    'pulse',
    'bounce',
  ]

  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
  const colorModes: Array<'brand' | 'monochrome' | 'custom'> = ['brand', 'monochrome', 'custom']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            SocialIconsBlock Demo
          </h1>
          <p className="text-xl text-gray-600">
            21 Platforms • 10 Styles • 3 Color Modes • Fully Customizable
          </p>
        </div>

        {/* Live Preview Section */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🎨 Live Interactive Preview</h2>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Style Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStyle(style)}
                    className="capitalize text-xs"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Size</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="flex-1 capitalize"
                  >
                    {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Mode Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Color Mode</label>
              <div className="flex gap-2">
                {colorModes.map((mode) => (
                  <Button
                    key={mode}
                    variant={selectedColorMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColorMode(mode)}
                    className="flex-1 capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Color Pickers */}
          {selectedColorMode === 'custom' && (
            <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-purple-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium mb-2">Icon Color</label>
                <input
                  type="color"
                  value={customColors.iconColor}
                  onChange={(e) => setCustomColors({ ...customColors, iconColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Background</label>
                <input
                  type="color"
                  value={customColors.backgroundColor}
                  onChange={(e) => setCustomColors({ ...customColors, backgroundColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Border</label>
                <input
                  type="color"
                  value={customColors.borderColor}
                  onChange={(e) => setCustomColors({ ...customColors, borderColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Hover</label>
                <input
                  type="color"
                  value={customColors.hoverColor}
                  onChange={(e) => setCustomColors({ ...customColors, hoverColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Live Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 border-2 border-dashed border-gray-300">
            <SocialIconsBlock
              props={{
                platforms: popularPlatforms,
                style: selectedStyle,
                size: selectedSize,
                colorMode: selectedColorMode,
                customColors: selectedColorMode === 'custom' ? customColors : undefined,
              }}
            />
          </div>
        </Card>

        {/* All Styles Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">All 10 Styles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <Card key={style} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {style}
                </h3>
                <SocialIconsBlock
                  props={{
                    platforms: popularPlatforms.slice(0, 5),
                    style: style as any,
                    size: 'md',
                    colorMode: 'brand',
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* All 21 Platforms */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center">All 21 Platforms</h2>
          <SocialIconsBlock
            props={{
              platforms: allPlatforms,
              style: 'round',
              size: 'md',
              colorMode: 'brand',
            }}
          />
        </Card>

        {/* Size Comparison */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Size Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sizes.map((size) => (
              <Card key={size} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                </h3>
                <SocialIconsBlock
                  props={{
                    platforms: popularPlatforms.slice(0, 4),
                    style: 'round',
                    size: size,
                    colorMode: 'brand',
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Color Modes */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Color Modes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Brand */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                Brand Colors
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: popularPlatforms.slice(0, 5),
                  style: 'round',
                  size: 'md',
                  colorMode: 'brand',
                }}
              />
              <p className="text-xs text-center mt-4 text-gray-500">
                Official platform colors
              </p>
            </Card>

            {/* Monochrome */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                Monochrome
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: popularPlatforms.slice(0, 5),
                  style: 'round',
                  size: 'md',
                  colorMode: 'monochrome',
                  customColors: {
                    iconColor: '#1f2937',
                    backgroundColor: '#f3f4f6',
                  },
                }}
              />
              <p className="text-xs text-center mt-4 text-gray-500">
                Single color theme
              </p>
            </Card>

            {/* Custom */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                Custom Colors
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: popularPlatforms.slice(0, 5),
                  style: 'round',
                  size: 'md',
                  colorMode: 'custom',
                  customColors: {
                    iconColor: '#8b5cf6',
                    backgroundColor: '#ede9fe',
                    borderColor: '#8b5cf6',
                    hoverColor: '#ddd6fe',
                  },
                }}
              />
              <p className="text-xs text-center mt-4 text-gray-500">
                Fully customizable
              </p>
            </Card>
          </div>
        </div>

        {/* Platform Categories */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Platform Categories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Social */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-pink-600">
                📱 Social Media (9)
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: allPlatforms.filter(p =>
                    ['instagram', 'twitter', 'x', 'facebook', 'threads', 'tiktok', 'snapchat', 'pinterest', 'reddit'].includes(p.platform)
                  ),
                  style: 'round',
                  size: 'md',
                  colorMode: 'brand',
                }}
              />
            </Card>

            {/* Professional */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
                💼 Professional (5)
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: allPlatforms.filter(p =>
                    ['linkedin', 'github', 'medium', 'behance', 'dribbble'].includes(p.platform)
                  ),
                  style: 'round',
                  size: 'md',
                  colorMode: 'brand',
                }}
              />
            </Card>

            {/* Messaging */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-green-600">
                💬 Messaging (3)
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: allPlatforms.filter(p =>
                    ['whatsapp', 'telegram', 'discord'].includes(p.platform)
                  ),
                  style: 'round',
                  size: 'md',
                  colorMode: 'brand',
                }}
              />
            </Card>

            {/* Entertainment */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-purple-600">
                🎮 Entertainment (4)
              </h3>
              <SocialIconsBlock
                props={{
                  platforms: allPlatforms.filter(p =>
                    ['youtube', 'twitch', 'spotify', 'soundcloud'].includes(p.platform)
                  ),
                  style: 'round',
                  size: 'md',
                  colorMode: 'brand',
                }}
              />
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">21</div>
              <div className="text-sm opacity-90">Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10</div>
              <div className="text-sm opacity-90">Styles</div>
            </div>
            <div>
              <div className="text-4xl font-bold">3</div>
              <div className="text-sm opacity-90">Color Modes</div>
            </div>
            <div>
              <div className="text-4xl font-bold">∞</div>
              <div className="text-sm opacity-90">Possibilities</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
