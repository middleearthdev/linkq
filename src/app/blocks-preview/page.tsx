/**
 * Blocks Preview Page
 * Preview all available blocks with sample data
 */

'use client'

import { useState } from 'react'
import {
  BLOCK_COMPONENTS,
  BLOCK_SCHEMAS,
  getBlocksByCategory,
  getAllBlockTypes
} from '@/components/blocks/registry'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Code } from 'lucide-react'
import Link from 'next/link'

// Mock data for each block type
const mockData = {
  'bio': {
    name: 'John Doe',
    bio: 'Digital creator, developer, and coffee enthusiast. Building awesome things one line of code at a time.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    showAvatar: true,
    avatarSize: 'lg',
    avatarStyle: 'circle',
    textAlign: 'center',
    nameStyle: 'default',
    spacing: 'normal'
  },
  'link-list': {
    style: 'pill',
    items: [
      { id: '1', title: 'My Portfolio', url: 'https://johndoe.dev', isActive: true }
    ],
    gap: 'md'
  },
  'social-icons': {
    platforms: [
      { platform: 'twitter', url: 'https://twitter.com/johndoe', username: '@johndoe' },
      { platform: 'instagram', url: 'https://instagram.com/johndoe', username: '@johndoe' },
      { platform: 'github', url: 'https://github.com/johndoe', username: 'johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', username: 'johndoe' }
    ],
    style: 'round',
    size: 'md'
  },
  'cta': {
    type: 'newsletter',
    title: 'Stay Updated',
    description: 'Get the latest updates about my projects and articles delivered straight to your inbox.',
    buttonText: 'Subscribe Now',
    action: {
      type: 'email',
      target: 'newsletter@johndoe.dev'
    }
  },
  'gallery': {
    items: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=150&fit=crop',
        caption: 'Coding workspace'
      },
      {
        id: '2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=150&fit=crop',
        caption: 'Latest project'
      },
      {
        id: '3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop',
        caption: 'Team collaboration'
      }
    ],
    layout: 'grid',
    columns: 3
  },
  'analytics': {
    showViews: true,
    showClicks: true,
    showVisitors: true,
    period: '30d',
    style: 'detailed'
  }
}

export default function BlocksPreviewPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const categories = [
    { id: 'all', name: 'All Blocks', count: getAllBlockTypes().length },
    { id: 'basic', name: 'Basic (Free)', count: getBlocksByCategory('basic').length },
    { id: 'premium', name: 'Premium (Starter+)', count: getBlocksByCategory('premium').length },
    { id: 'pro', name: 'Pro Only', count: getBlocksByCategory('pro').length }
  ]

  const getFilteredBlocks = () => {
    if (selectedCategory === 'all') {
      return Object.values(BLOCK_SCHEMAS)
    }
    return getBlocksByCategory(selectedCategory as any)
  }

  // Style variations for blocks that support multiple styles
  const getStyleVariations = (blockType: string) => {
    const baseProps = mockData[blockType as keyof typeof mockData]
    if (!baseProps) return []

    switch (blockType) {
      case 'link-list':
        return [
          { name: 'Pill', props: { ...baseProps, style: 'pill' } },
          { name: 'Underline', props: { ...baseProps, style: 'underline' } },
          { name: 'Card', props: { ...baseProps, style: 'card' } },
          { name: 'Modern', props: { ...baseProps, style: 'modern' } },
          { name: 'Modern Cream', props: { ...baseProps, style: 'modern-cream' } },
          { name: 'Neon', props: { ...baseProps, style: 'neon' } },
          { name: 'Glass', props: { ...baseProps, style: 'glass' } },
          { name: 'Pixel', props: { ...baseProps, style: 'pixel' } },
          { name: 'Hologram', props: { ...baseProps, style: 'hologram' } },
          { name: 'Neomorphism', props: { ...baseProps, style: 'neomorphism' } },
          { name: 'Bubble', props: { ...baseProps, style: 'bubble' } },
          { name: 'Cyberpunk', props: { ...baseProps, style: 'cyberpunk' } },
          { name: 'Metallic', props: { ...baseProps, style: 'metallic' } },
          { name: 'Wood', props: { ...baseProps, style: 'wood' } },
          { name: 'Minimal Line', props: { ...baseProps, style: 'minimal-line' } },
          { name: 'Elastic', props: { ...baseProps, style: 'elastic' } },
          { name: 'Terminal', props: { ...baseProps, style: 'terminal' } }
        ]
      case 'social-icons':
        return [
          { name: 'Round', props: { ...baseProps, style: 'round' } },
          { name: 'Square', props: { ...baseProps, style: 'square' } },
          { name: 'Minimal', props: { ...baseProps, style: 'minimal' } }
        ]
      case 'bio':
        return [
          { name: 'Circle', props: { ...baseProps, avatarStyle: 'circle' } },
          { name: 'Rounded Frame', props: { ...baseProps, avatarStyle: 'rounded-frame' } },
          { name: 'Square', props: { ...baseProps, avatarStyle: 'square' } },
          { name: 'Blob (Organic)', props: { ...baseProps, avatarStyle: 'blob' } },
          { name: 'Hexagon', props: { ...baseProps, avatarStyle: 'hexagon' } },
          { name: 'Star', props: { ...baseProps, avatarStyle: 'star' } },
          { name: 'Diamond', props: { ...baseProps, avatarStyle: 'diamond' } },
          { name: 'Wave', props: { ...baseProps, avatarStyle: 'wave' } },
          { name: 'Flower', props: { ...baseProps, avatarStyle: 'flower' } },
          { name: 'Badge', props: { ...baseProps, avatarStyle: 'badge' } },
          { name: 'Polaroid', props: { ...baseProps, avatarStyle: 'polaroid' } },
          { name: 'Vintage', props: { ...baseProps, avatarStyle: 'vintage' } }
        ]
      case 'gallery':
        return [
          { name: 'Grid', props: { ...baseProps, layout: 'grid' } },
          { name: 'Masonry', props: { ...baseProps, layout: 'masonry' } },
          { name: 'Carousel', props: { ...baseProps, layout: 'carousel' } }
        ]
      default:
        return [{ name: 'Default', props: baseProps }]
    }
  }

  const renderBlockPreview = (blockType: string) => {
    const Component = BLOCK_COMPONENTS[blockType]
    const variations = getStyleVariations(blockType)

    if (!Component || variations.length === 0) {
      return <div className="text-muted-foreground">No preview available</div>
    }

    // If only one variation, show it directly
    if (variations.length === 1) {
      return (
        <div className="min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Component props={variations[0].props} />
          </div>
        </div>
      )
    }

    // Show all variations in a grid
    return (
      <div className="space-y-4">
        {variations.map((variation, index) => (
          <div key={index}>
            <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
              {variation.name}
            </div>
            <div className="min-h-[150px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Component props={variation.props} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderBlockCode = (blockType: string) => {
    const props = mockData[blockType as keyof typeof mockData]

    return (
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm">
          <code>{`import { ${blockType.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('')}Block } from '@/components/blocks'

<${blockType.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('')}Block 
  props={${JSON.stringify(props, null, 2).replace(/"/g, "'")}}
/>`}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Blocks Preview</h1>
                <p className="text-muted-foreground">Preview all available blocks with sample data</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={viewMode === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('code')}
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {getFilteredBlocks().map((schema) => (
            <Card key={schema.type} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {schema.name}
                      {schema.isPremium && (
                        <Badge variant="secondary">
                          {schema.requiredPlan || 'Premium'}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{schema.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {schema.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {viewMode === 'preview' ? (
                  renderBlockPreview(schema.type)
                ) : (
                  <div className="p-4">
                    {renderBlockCode(schema.type)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {getFilteredBlocks().length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blocks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}