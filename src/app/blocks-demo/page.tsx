/**
 * Unified Blocks Demo Page
 * Single page showcasing ALL blocks with device preview & interactive controls
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Smartphone, Tablet } from 'lucide-react'

// Import all blocks
import { BioBlock } from '@/components/blocks/BioBlock'
import { LinkListBlock } from '@/components/blocks/LinkListBlock'
import { SocialIconsBlock } from '@/components/blocks/SocialIconsBlock'
import { DividerBlock } from '@/components/blocks/DividerBlock'
import { FooterBlock } from '@/components/blocks/FooterBlock'
import { GalleryBlock } from '@/components/blocks/GalleryBlock'
import { AnalyticsBlock } from '@/components/blocks/AnalyticsBlock'
import { ProductCatalogBlock } from '@/components/blocks/ProductCatalogBlock'
import { WhatsAppBusinessBlock } from '@/components/blocks/WhatsAppBusinessBlock'
import { DeliveryPlatformBlock } from '@/components/blocks/DeliveryPlatformBlock'
import { MarketplaceBlock } from '@/components/blocks/MarketplaceBlock'
import { LocationBlock } from '@/components/blocks/LocationBlock'
import { QRISPaymentBlock } from '@/components/blocks/QRISPaymentBlock'
import { COLOR_PRESETS, DEFAULT_COLORS } from '@/lib/link-list-styles'
import { RotateCcw, Copy, Check } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet'

const BLOCKS = [
  { id: 'bio', name: 'Bio Block', icon: '👤', category: 'basic', plan: 'FREE' },
  { id: 'linklist', name: 'Link List', icon: '🔗', category: 'basic', plan: 'FREE' },
  { id: 'social', name: 'Social Icons', icon: '📱', category: 'basic', plan: 'FREE' },
  { id: 'divider', name: 'Divider', icon: '➖', category: 'basic', plan: 'FREE' },
  { id: 'footer', name: 'Footer', icon: '🔚', category: 'basic', plan: 'FREE' },
  { id: 'gallery', name: 'Gallery', icon: '🖼️', category: 'premium', plan: 'PRO' },
  { id: 'analytics', name: 'Analytics', icon: '📊', category: 'premium', plan: 'PRO' },
  { id: 'product-catalog', name: 'Product Catalog', icon: '🛍️', category: 'premium', plan: 'FREE' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', category: 'indonesia', plan: 'FREE' },
  { id: 'delivery', name: 'Food Delivery', icon: '🍽️', category: 'indonesia', plan: 'FREE' },
  { id: 'marketplace', name: 'E-Commerce', icon: '🏪', category: 'indonesia', plan: 'FREE' },
  { id: 'location', name: 'Location & Map', icon: '📍', category: 'indonesia', plan: 'FREE' },
  { id: 'qris', name: 'QRIS Payment', icon: '💳', category: 'indonesia', plan: 'STARTER' },
]

export default function UnifiedBlocksDemoPage() {
  const [activeBlock, setActiveBlock] = useState('bio')
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile')
  const [copiedCode, setCopiedCode] = useState(false)

  // Block-specific customization states
  // Bio Block - Complete customization
  const [bioAvatarStyle, setBioAvatarStyle] = useState('circle')
  const [bioAvatarSize, setBioAvatarSize] = useState('lg')
  const [bioNameStyle, setBioNameStyle] = useState('default')
  const [bioStyle, setBioStyle] = useState('default')
  const [bioTextAlign, setBioTextAlign] = useState('center')
  const [bioSpacing, setBioSpacing] = useState('normal')

  // Other blocks
  const [linkListStyle, setLinkListStyle] = useState('pill')
  const [linkListCustomColors, setLinkListCustomColors] = useState(DEFAULT_COLORS)
  const [colorsCopied, setColorsCopied] = useState(false)
  const [socialIconStyle, setSocialIconStyle] = useState('round')

  // Divider customization
  const [dividerStyle, setDividerStyle] = useState('solid')
  const [dividerSpacing, setDividerSpacing] = useState('md')
  const [dividerIcon, setDividerIcon] = useState('none')
  const [dividerThickness, setDividerThickness] = useState(1)
  const [dividerColor, setDividerColor] = useState('#e5e7eb')
  const [dividerAnimated, setDividerAnimated] = useState(false)

  // Footer customization
  const [footerLayout, setFooterLayout] = useState('centered')
  const [footerShowSocial, setFooterShowSocial] = useState(true)
  const [footerShowLinks, setFooterShowLinks] = useState(true)
  const [footerSpacing, setFooterSpacing] = useState('md')
  const [footerBorderTop, setFooterBorderTop] = useState(false)
  const [footerBackgroundColor, setFooterBackgroundColor] = useState('#ffffff')
  const [footerTextColor, setFooterTextColor] = useState('#374151')

  const [galleryLayout, setGalleryLayout] = useState('grid')
  const [analyticsStyle, setAnalyticsStyle] = useState('detailed')
  const [productCatalogStyle, setProductCatalogStyle] = useState('instagram-card')

  // Device frame styles with minimum widths
  const deviceFrameClass = {
    mobile: 'w-full max-w-[375px] min-w-[320px]',  // Min: 320px (iPhone SE)
    tablet: 'w-full max-w-2xl min-w-[600px]',      // Min: 600px, Max: 672px
  }

  const deviceHeight = {
    mobile: 'h-[667px]',
    tablet: 'h-[800px]',
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const currentBlock = BLOCKS.find(b => b.id === activeBlock)

  // Render custom controls for each block
  const renderBlockControls = (blockId: string) => {
    switch (blockId) {
      case 'bio':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Bio Block</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Avatar Style */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Avatar Style (6 options)</label>
                <select
                  value={bioAvatarStyle}
                  onChange={(e) => setBioAvatarStyle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="circle">Circle</option>
                  <option value="rounded-frame">Rounded Frame</option>
                  <option value="square">Square</option>
                  <option value="wave">Wave</option>
                  <option value="polaroid">Polaroid</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>

              {/* Avatar Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Avatar Size (3 sizes)</label>
                <div className="flex gap-2">
                  {[
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' }
                  ].map((size) => (
                    <Button
                      key={size.value}
                      size="sm"
                      variant={bioAvatarSize === size.value ? 'default' : 'outline'}
                      onClick={() => setBioAvatarSize(size.value)}
                      className="flex-1 text-xs"
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Name Typography */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Name Typography (10 styles)</label>
                <select
                  value={bioNameStyle}
                  onChange={(e) => setBioNameStyle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="default">Default</option>
                  <option value="large-elegant">Large Elegant</option>
                  <option value="compact">Compact</option>
                  <option value="modern-minimal">Modern Minimal</option>
                  <option value="bold-impact">Bold Impact</option>
                  <option value="script-handwritten">Script Handwritten</option>
                  <option value="tech-mono">Tech Mono</option>
                  <option value="gradient-text">Gradient Text</option>
                  <option value="neon-glow">Neon Glow</option>
                  <option value="vintage-serif">Vintage Serif</option>
                </select>
              </div>

              {/* Bio Text Style */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Bio Text Style</label>
                <select
                  value={bioStyle}
                  onChange={(e) => setBioStyle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="default">Default</option>
                  <option value="large">Large</option>
                  <option value="small">Small</option>
                  <option value="quote">Quote</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Text Alignment</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <Button
                      key={align}
                      size="sm"
                      variant={bioTextAlign === align ? 'default' : 'outline'}
                      onClick={() => setBioTextAlign(align)}
                      className="capitalize flex-1"
                    >
                      {align}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Spacing</label>
                <div className="flex gap-2">
                  {['tight', 'normal', 'wide'].map((space) => (
                    <Button
                      key={space}
                      size="sm"
                      variant={bioSpacing === space ? 'default' : 'outline'}
                      onClick={() => setBioSpacing(space)}
                      className="capitalize flex-1"
                    >
                      {space}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )

      case 'linklist':
        return (
          <Card className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-700">🎨 Customize Link List</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLinkListCustomColors(DEFAULT_COLORS)
                    setColorsCopied(false)
                  }}
                  className="h-7 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(linkListCustomColors, null, 2))
                    setColorsCopied(true)
                    setTimeout(() => setColorsCopied(false), 2000)
                  }}
                  className="h-7 text-xs"
                >
                  {colorsCopied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Style Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Link Style (44 options)</label>
              <select
                value={linkListStyle}
                onChange={(e) => setLinkListStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <optgroup label="🎯 Basic Styles">
                  <option value="pill">Pill</option>
                </optgroup>

                <optgroup label="🎨 Creative Styles">
                  <option value="vintage">Vintage</option>
                  <option value="ticket">Ticket</option>
                  <option value="brush">Brush</option>
                  <option value="neon">Neon</option>
                  <option value="neon-outline">Neon Outline</option>
                  <option value="origami">Origami</option>
                  <option value="pixel">Pixel</option>
                  <option value="hologram">Hologram</option>
                  <option value="bubble">Bubble</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="sketch">Sketch</option>
                  <option value="metallic">Metallic</option>
                  <option value="terminal">Terminal</option>
                </optgroup>

                <optgroup label="🎮 Game-Inspired Styles">
                  <option value="rpg-fantasy">RPG Fantasy</option>
                  <option value="battle-royale">Battle Royale</option>
                  <option value="casual-game">Casual Game</option>
                  <option value="jrpg-anime">JRPG Anime</option>
                  <option value="dark-souls">Dark Souls</option>
                  <option value="arcade-retro">Arcade Retro</option>
                  <option value="racing-speed">Racing Speed</option>
                  <option value="horror-glitch">Horror Glitch</option>
                  <option value="fighting-combo">Fighting Combo</option>
                  <option value="card-holo">Card Holo</option>
                  <option value="puzzle-block">Puzzle Block</option>
                  <option value="strategy-rts">Strategy RTS</option>
                  <option value="moba-ability">MOBA Ability</option>
                  <option value="sandbox-craft">Sandbox Craft</option>
                  <option value="rhythm-beat">Rhythm Beat</option>
                </optgroup>

                <optgroup label="🍔 Culinary & F&B Styles">
                  <option value="coffee-shop">Coffee Shop</option>
                  <option value="bakery-sweet">Bakery Sweet</option>
                  <option value="cocktail-bar">Cocktail Bar</option>
                  <option value="fine-dining">Fine Dining</option>
                  <option value="street-food">Street Food</option>
                  <option value="sushi-bar">Sushi Bar</option>
                  <option value="pizza-oven">Pizza Oven</option>
                  <option value="ice-cream">Ice Cream</option>
                  <option value="burger-joint">Burger Joint</option>
                  <option value="ramen-shop">Ramen Shop</option>
                  <option value="wine-cellar">Wine Cellar</option>
                  <option value="tea-house">Tea House</option>
                  <option value="chocolate-factory">Chocolate Factory</option>
                  <option value="juice-bar">Juice Bar</option>
                  <option value="bbq-grill">BBQ Grill</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Try different styles to see how your links can look! 🎨
              </p>
            </div>

            {/* Color Presets Section */}
            <div className="border-t pt-4 mb-6">
              <h4 className="font-semibold text-xs text-gray-700 mb-3">🎨 Color Presets</h4>
              <p className="text-xs text-gray-500 mb-3">Quick start with popular color combinations</p>
              <div className="space-y-2">
                {COLOR_PRESETS.slice(0, 6).map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between h-auto px-3 py-2"
                    onClick={() => setLinkListCustomColors(preset.colors)}
                  >
                    <span className="text-xs">{preset.name}</span>
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Colors Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-xs text-gray-700 mb-3">🎨 Custom Colors (Fine-tune)</h4>
              <div className="space-y-3">
                {Object.entries(linkListCustomColors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value as string}
                        onChange={(e) => setLinkListCustomColors({...linkListCustomColors, [key]: e.target.value})}
                        className="w-10 h-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => setLinkListCustomColors({...linkListCustomColors, [key]: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 Fine-tune each color to match your brand perfectly!
              </p>
            </div>
          </Card>
        )

      case 'social':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Social Icons</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Icon Style (5 Mobile-Friendly)</label>
              <select
                value={socialIconStyle}
                onChange={(e) => setSocialIconStyle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="minimal">Minimal</option>
                <option value="floating">Floating (Animated)</option>
                <option value="pulse">Pulse (Animated)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ Hover-dependent styles removed for better mobile experience
              </p>
            </div>
          </Card>
        )

      case 'divider':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Divider</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Style */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Line Style (8 options)</label>
                <select
                  value={dividerStyle}
                  onChange={(e) => setDividerStyle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="gradient">Gradient</option>
                  <option value="gradient-rainbow">Gradient Rainbow</option>
                  <option value="gradient-sunset">Gradient Sunset</option>
                  <option value="gradient-ocean">Gradient Ocean</option>
                </select>
              </div>

              {/* Thickness */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Thickness: {dividerThickness}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dividerThickness}
                  onChange={(e) => setDividerThickness(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1px</span>
                  <span>10px</span>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={dividerColor}
                    onChange={(e) => setDividerColor(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={dividerColor}
                    onChange={(e) => setDividerColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Spacing</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' }
                  ].map((spacing) => (
                    <Button
                      key={spacing.value}
                      size="sm"
                      variant={dividerSpacing === spacing.value ? 'default' : 'outline'}
                      onClick={() => setDividerSpacing(spacing.value)}
                      className="text-xs"
                    >
                      {spacing.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Center Icon</label>
                <select
                  value={dividerIcon}
                  onChange={(e) => setDividerIcon(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="none">No Icon</option>
                  <option value="sparkles">✨ Sparkles</option>
                  <option value="circle">⭕ Circle</option>
                  <option value="square">⬜ Square</option>
                  <option value="star">⭐ Star</option>
                  <option value="heart">❤️ Heart</option>
                  <option value="zap">⚡ Zap</option>
                </select>
              </div>

              {/* Animated */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Animation</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dividerAnimated}
                    onChange={(e) => setDividerAnimated(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Pulse Animation</span>
                </div>
              </div>
            </div>
          </Card>
        )

      case 'gallery':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Gallery</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Layout Style (2 options)</label>
              <div className="flex gap-2">
                {[
                  { value: 'grid', label: 'Grid' },
                  { value: 'carousel', label: 'Carousel' }
                ].map((layout) => (
                  <Button
                    key={layout.value}
                    size="sm"
                    variant={galleryLayout === layout.value ? 'default' : 'outline'}
                    onClick={() => setGalleryLayout(layout.value)}
                    className="flex-1"
                  >
                    {layout.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )

      case 'analytics':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Analytics</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Display Style</label>
              <div className="flex gap-2">
                {['minimal', 'detailed', 'chart'].map((style) => (
                  <Button
                    key={style}
                    size="sm"
                    variant={analyticsStyle === style ? 'default' : 'outline'}
                    onClick={() => setAnalyticsStyle(style)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )

      case 'product-catalog':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Product Catalog</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Catalog Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'instagram-card', label: 'Instagram Card' },
                  { value: 'modern-minimal', label: 'Modern Minimal' },
                  { value: 'compact-grid', label: 'Compact Grid' },
                  { value: 'instagram-shop', label: 'Instagram Shop' },
                ].map((style) => (
                  <Button
                    key={style.value}
                    size="sm"
                    variant={productCatalogStyle === style.value ? 'default' : 'outline'}
                    onClick={() => setProductCatalogStyle(style.value)}
                    className="text-xs"
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )

      case 'footer':
        return (
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4 text-gray-700">🎨 Customize Footer</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Layout */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Layout Style (4 options)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'centered', label: 'Centered' },
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'stacked', label: 'Stacked' },
                    { value: 'split', label: 'Split' }
                  ].map((layout) => (
                    <Button
                      key={layout.value}
                      size="sm"
                      variant={footerLayout === layout.value ? 'default' : 'outline'}
                      onClick={() => setFooterLayout(layout.value)}
                      className="text-xs"
                    >
                      {layout.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Spacing</label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'sm', label: 'SM' },
                    { value: 'md', label: 'MD' },
                    { value: 'lg', label: 'LG' },
                    { value: 'xl', label: 'XL' }
                  ].map((spacing) => (
                    <Button
                      key={spacing.value}
                      size="sm"
                      variant={footerSpacing === spacing.value ? 'default' : 'outline'}
                      onClick={() => setFooterSpacing(spacing.value)}
                      className="text-xs"
                    >
                      {spacing.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={footerBackgroundColor}
                    onChange={(e) => setFooterBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footerBackgroundColor}
                    onChange={(e) => setFooterBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="#374151"
                  />
                </div>
              </div>

              {/* Show Social Icons */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Display Options</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={footerShowSocial}
                      onChange={(e) => setFooterShowSocial(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Show Social Icons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={footerShowLinks}
                      onChange={(e) => setFooterShowLinks(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Show Footer Links</span>
                  </div>
                </div>
              </div>

              {/* Border Top */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Border</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={footerBorderTop}
                    onChange={(e) => setFooterBorderTop(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Show Top Border</span>
                </div>
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎨 Unified Blocks Demo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                All 13 blocks • Device preview • Interactive controls • Live updates
              </p>
            </div>
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Home
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Block Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold mb-4 text-sm text-gray-500 uppercase tracking-wide">
                Select Block
              </h3>

              {/* Basic Blocks */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 mb-2">BASIC (FREE)</div>
                <div className="space-y-1">
                  {BLOCKS.filter(b => b.category === 'basic').map(block => (
                    <button
                      key={block.id}
                      onClick={() => setActiveBlock(block.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeBlock === block.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Blocks */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 mb-2">PREMIUM</div>
                <div className="space-y-1">
                  {BLOCKS.filter(b => b.category === 'premium').map(block => (
                    <button
                      key={block.id}
                      onClick={() => setActiveBlock(block.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeBlock === block.id
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                      <span className="ml-1 text-xs opacity-70">({block.plan})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Indonesia Blocks */}
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-2">🇮🇩 INDONESIA</div>
                <div className="space-y-1">
                  {BLOCKS.filter(b => b.category === 'indonesia').map(block => (
                    <button
                      key={block.id}
                      onClick={() => setActiveBlock(block.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeBlock === block.id
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="mr-2">{block.icon}</span>
                      {block.name}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Preview & Controls */}
          <div className="lg:col-span-3 space-y-6">
            {/* Device Type Selector */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentBlock?.icon} {currentBlock?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Category: <span className="font-semibold capitalize">{currentBlock?.category}</span> •
                    Plan: <span className="font-semibold">{currentBlock?.plan}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={deviceType === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setDeviceType('mobile')}
                    className="gap-1"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile</span>
                    <span className="text-xs opacity-70">(375px)</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={deviceType === 'tablet' ? 'default' : 'outline'}
                    onClick={() => setDeviceType('tablet')}
                    className="gap-1"
                  >
                    <Tablet className="w-4 h-4" />
                    <span>Tablet</span>
                    <span className="text-xs opacity-70">(672px)</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Custom Block Controls */}
            {renderBlockControls(activeBlock)}

            {/* Device Preview */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                  {deviceType === 'mobile' && (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile View (320px - 375px)</span>
                    </>
                  )}
                  {deviceType === 'tablet' && (
                    <>
                      <Tablet className="w-4 h-4" />
                      <span>Tablet View (600px - 672px)</span>
                    </>
                  )}
                </div>
              </div>

              <div className={`${deviceFrameClass[deviceType]} mx-auto`}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
                  {/* Device Notch */}
                  <div className="bg-gray-900 h-6 flex items-center justify-center">
                    <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                  </div>

                  {/* Content Area */}
                  <div className={`bg-gradient-to-br from-gray-50 to-gray-100 ${deviceHeight[deviceType]} overflow-y-auto`}>
                    <div className="p-6">
                      <BlockRenderer
                        blockId={activeBlock}
                        deviceType={deviceType}
                        bioAvatarStyle={bioAvatarStyle}
                        bioAvatarSize={bioAvatarSize}
                        bioNameStyle={bioNameStyle}
                        bioStyle={bioStyle}
                        bioTextAlign={bioTextAlign}
                        bioSpacing={bioSpacing}
                        linkListStyle={linkListStyle}
                        linkListCustomColors={linkListCustomColors}
                        socialIconStyle={socialIconStyle}
                        dividerStyle={dividerStyle}
                        dividerThickness={dividerThickness}
                        dividerColor={dividerColor}
                        dividerSpacing={dividerSpacing}
                        dividerIcon={dividerIcon}
                        dividerAnimated={dividerAnimated}
                        footerLayout={footerLayout}
                        footerShowSocial={footerShowSocial}
                        footerShowLinks={footerShowLinks}
                        footerSpacing={footerSpacing}
                        footerBorderTop={footerBorderTop}
                        footerBackgroundColor={footerBackgroundColor}
                        footerTextColor={footerTextColor}
                        galleryLayout={galleryLayout}
                        analyticsStyle={analyticsStyle}
                        productCatalogStyle={productCatalogStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Implementation Guide */}
            <Card className="p-6">
              <Tabs defaultValue="usage" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="props">Props</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                <TabsContent value="usage" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Implementation Code</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCode(getBlockCode(activeBlock))}
                      >
                        {copiedCode ? (
                          <><Check className="w-4 h-4 mr-1" /> Copied!</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{getBlockCode(activeBlock)}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="props" className="space-y-4">
                  <div className="text-sm text-gray-600">
                    {getBlockPropsDoc(activeBlock)}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="text-sm">
                    {getBlockFeatures(activeBlock)}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Block Renderer Component
function BlockRenderer({
  blockId,
  deviceType,
  bioAvatarStyle,
  bioAvatarSize,
  bioNameStyle,
  bioStyle,
  bioTextAlign,
  bioSpacing,
  linkListStyle,
  linkListCustomColors,
  socialIconStyle,
  dividerStyle,
  dividerThickness,
  dividerColor,
  dividerSpacing,
  dividerIcon,
  dividerAnimated,
  footerLayout,
  footerShowSocial,
  footerShowLinks,
  footerSpacing,
  footerBorderTop,
  footerBackgroundColor,
  footerTextColor,
  galleryLayout,
  analyticsStyle,
  productCatalogStyle,
}: {
  blockId: string
  deviceType: DeviceType
  bioAvatarStyle: string
  bioAvatarSize: string
  bioNameStyle: string
  bioStyle: string
  bioTextAlign: string
  bioSpacing: string
  linkListStyle: string
  linkListCustomColors: any
  socialIconStyle: string
  dividerStyle: string
  dividerThickness: number
  dividerColor: string
  dividerSpacing: string
  dividerIcon: string
  dividerAnimated: boolean
  footerLayout: string
  footerShowSocial: boolean
  footerShowLinks: boolean
  footerSpacing: string
  footerBorderTop: boolean
  footerBackgroundColor: string
  footerTextColor: string
  galleryLayout: string
  analyticsStyle: string
  productCatalogStyle: string
}) {
  switch (blockId) {
    case 'bio':
      return (
        <BioBlock
          props={{
            name: 'Alex Rivera',
            bio: 'Digital creator, photographer & storyteller. Capturing moments that matter.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            showAvatar: true,
            avatarSize: bioAvatarSize as any,
            avatarStyle: bioAvatarStyle as any,
            textAlign: bioTextAlign as any,
            nameStyle: bioNameStyle as any,
            bioStyle: bioStyle as any,
            spacing: bioSpacing as any,
          }}
        />
      )

    case 'linklist':
      return (
        <LinkListBlock
          props={{
            style: linkListStyle as any,
            items: [
              { id: '1', title: 'My Portfolio', url: 'https://example.com', isActive: true },
              { id: '2', title: 'YouTube Channel', url: 'https://youtube.com', isActive: true },
              { id: '3', title: 'Instagram', url: 'https://instagram.com', isActive: true },
            ],
            customColors: linkListCustomColors,
          }}
        />
      )

    case 'social':
      return (
        <SocialIconsBlock
          props={{
            platforms: [
              { platform: 'instagram', url: 'https://instagram.com/user' },
              { platform: 'tiktok', url: 'https://tiktok.com/@user' },
              { platform: 'youtube', url: 'https://youtube.com/c/user' },
              { platform: 'twitter', url: 'https://twitter.com/user' },
            ],
            style: socialIconStyle as any,
            size: 'md',
            colorMode: 'brand',
          }}
        />
      )

    case 'divider':
      return (
        <DividerBlock
          props={{
            style: dividerStyle as any,
            thickness: dividerThickness,
            color: dividerColor,
            spacing: dividerSpacing as any,
            icon: dividerIcon as any,
            animated: dividerAnimated,
          }}
        />
      )

    case 'footer':
      return (
        <FooterBlock
          props={{
            copyrightText: '© 2024 Your Name',
            layout: footerLayout as any,
            showSocial: footerShowSocial,
            showLinks: footerShowLinks,
            links: [
              { label: 'Privacy', url: '/privacy', external: false },
              { label: 'Terms', url: '/terms', external: false },
            ],
            socialLinks: [
              { platform: 'twitter', url: 'https://twitter.com' },
              { platform: 'instagram', url: 'https://instagram.com' },
            ],
            backgroundColor: footerBackgroundColor,
            textColor: footerTextColor,
            spacing: footerSpacing as any,
            borderTop: footerBorderTop,
          }}
        />
      )

    case 'gallery':
      return (
        <GalleryBlock
          props={{
            items: [
              { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop', caption: 'Beautiful sunset' },
              { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=600&h=600&fit=crop', caption: 'Mountain view' },
              { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=600&h=600&fit=crop', caption: 'Ocean waves' },
              { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1682687218336-bea22f0b0c8d?w=600&h=600&fit=crop', caption: 'City lights' },
              { id: '5', type: 'image', url: 'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=600&h=600&fit=crop', caption: 'Nature walk' },
              { id: '6', type: 'image', url: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=600&h=600&fit=crop', caption: 'Coffee time' },
            ],
            layout: galleryLayout as any,
            columns: deviceType === 'mobile' ? 'medium' : 'small',
            aspectRatio: 'square',
            imageFilter: 'none',
            showCaptions: false,
            rounded: true,
          }}
        />
      )

    case 'analytics':
      return (
        <AnalyticsBlock
          props={{
            showViews: true,
            showClicks: true,
            showVisitors: true,
            period: '30d',
            style: analyticsStyle as any,
          }}
          analyticsData={{
            views: 1234,
            clicks: 89,
            visitors: 567,
          }}
        />
      )

    case 'product-catalog':
      return (
        <ProductCatalogBlock
          props={{
            items: [
              {
                id: '1',
                name: 'Nasi Goreng Spesial',
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',
                price: 25000,
                description: 'Nasi goreng dengan telur dan ayam',
                category: 'Main Course',
                stock: 'available',
                rating: 4.8,
              },
              {
                id: '2',
                name: 'Mie Ayam Bakso',
                image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
                price: 20000,
                description: 'Mie ayam dengan bakso sapi',
                category: 'Main Course',
                stock: 'available',
                rating: 4.7,
              },
            ],
            style: productCatalogStyle as any,
            columns: deviceType === 'mobile' ? 'small' : 'medium',
            showSearch: true,
            showCategories: true,
            showStockIndicator: true,
            whatsappNumber: '081234567890',
            ctaText: 'Pesan via WhatsApp',
            forceViewport: deviceType === 'mobile' ? 'mobile' : 'tablet',
          }}
          isEditing={false}
        />
      )

    case 'whatsapp':
      return (
        <div className="relative h-64">
          <WhatsAppBusinessBlock
            props={{
              phoneNumber: '081234567890',
              message: 'Halo, saya tertarik dengan produk Anda',
              buttonText: 'Chat via WhatsApp',
              fabPosition: 'bottom-right',
              enablePulse: true,
            }}
          />
        </div>
      )

    case 'delivery':
      return (
        <DeliveryPlatformBlock
          props={{
            platforms: {
              gofood: {
                url: 'https://gofood.link/example',
                merchantName: 'Warung Kopi Budi',
              },
              grabfood: {
                url: 'https://food.grab.com/example',
                restaurantId: '1-ABCDEFGH',
                rating: 4.8,
              },
            },
            layout: 'buttons',
            showRatings: true,
            showPromos: false,
          }}
        />
      )

    case 'marketplace':
      return (
        <MarketplaceBlock
          props={{
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/store',
                storeName: 'Toko Elektronik',
                rating: 4.9,
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/store',
                shopId: 'shop-123',
              },
            },
            featuredProducts: [],
            layout: 'store-links',
            showBadges: true,
            showRatings: false,
          }}
        />
      )

    case 'location':
      return (
        <LocationBlock
          props={{
            googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521!2d106.819!3d-6.175',
            address: 'Jl. Sudirman No. 123, Jakarta',
            locationName: 'Warung Kopi Budi',
            phone: '021-12345678',
            showDirectionsButton: true,
            mapHeight: 300,
            showCurrentStatus: false,
          }}
        />
      )

    case 'qris':
      return (
        <QRISPaymentBlock
          props={{
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=QRIS-SAMPLE',
            merchantName: 'Toko Siti Beauty',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            showPaymentLogos: true,
            allowCustomAmount: false,
          }}
        />
      )

    default:
      return <div className="text-center text-gray-500 py-12">Select a block to preview</div>
  }
}

// Helper functions for documentation
function getBlockCode(blockId: string): string {
  const codes: Record<string, string> = {
    bio: `<BioBlock
  props={{
    name: 'Alex Rivera',
    bio: 'Digital creator & photographer',
    avatar: '/avatar.jpg',
    avatarStyle: 'circle',
    nameStyle: 'default',
    textAlign: 'center'
  }}
/>`,
    linklist: `<LinkListBlock
  props={{
    style: 'pill',
    items: [
      { title: 'Website', url: 'https://...' },
      { title: 'YouTube', url: 'https://...' }
    ]
  }}
/>`,
    social: `<SocialIconsBlock
  props={{
    platforms: [
      { platform: 'instagram', url: '...' },
      { platform: 'tiktok', url: '...' }
    ],
    style: 'round',
    colorMode: 'brand'
  }}
/>`,
    // Add more block codes...
  }
  return codes[blockId] || '// Code example not available'
}

function getBlockPropsDoc(blockId: string): React.ReactElement {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Available Props:</p>
      <p className="text-gray-600">Props documentation for {blockId} block</p>
    </div>
  )
}

function getBlockFeatures(blockId: string): React.ReactElement {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Features:</p>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>Fully responsive design</li>
        <li>Mobile-first approach</li>
        <li>Customizable styling</li>
        <li>Type-safe props</li>
      </ul>
    </div>
  )
}
