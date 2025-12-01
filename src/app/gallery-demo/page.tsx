'use client'

import React, { useState } from 'react'
import { GalleryBlock } from '@/components/blocks/GalleryBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GalleryBlockProps } from '@/types'
import { Smartphone, Tablet } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet'

export default function GalleryDemoPage() {
  // Sample gallery items with placeholder images
  const sampleImages = [
    {
      id: '1',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop',
      caption: 'Mountain Landscape',
    },
    {
      id: '2',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&auto=format&fit=crop',
      caption: 'Ocean Sunset',
    },
    {
      id: '3',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&auto=format&fit=crop',
      caption: 'City Skyline',
    },
    {
      id: '4',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=800&auto=format&fit=crop',
      caption: 'Forest Path',
    },
    {
      id: '5',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687220866-c856f566f1bd?w=800&auto=format&fit=crop',
      caption: 'Desert Dunes',
    },
    {
      id: '6',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=800&auto=format&fit=crop',
      caption: 'Waterfall',
    },
    {
      id: '7',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687218608-5e2522b04673?w=800&auto=format&fit=crop',
      caption: 'Northern Lights',
    },
    {
      id: '8',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=800&auto=format&fit=crop',
      caption: 'Snowy Mountains',
    },
    {
      id: '9',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1682687218880-7fdc3ca25c82?w=800&auto=format&fit=crop',
      caption: 'Tropical Beach',
    },
  ]

  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'carousel'>('grid')
  const [selectedColumns, setSelectedColumns] = useState<'small' | 'medium'>('small')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<any>('square')
  const [selectedImageFilter, setSelectedImageFilter] = useState<any>('none')
  const [selectedRounded, setSelectedRounded] = useState(true)
  const [showCaptions, setShowCaptions] = useState(true)
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile')

  const deviceFrameClass = {
    mobile: 'max-w-[375px] mx-auto',
    tablet: 'max-w-2xl mx-auto'
  }

  const layouts: Array<GalleryBlockProps['layout']> = ['grid', 'carousel']
  const aspectRatios: Array<GalleryBlockProps['aspectRatio']> = ['square', 'landscape', 'portrait', 'widescreen', 'original']
  const imageFilters: Array<GalleryBlockProps['imageFilter']> = ['none', 'grayscale', 'sepia', 'vintage', 'dramatic', 'warm', 'cool', 'noir']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            GalleryBlock Demo
          </h1>
          <p className="text-xl text-gray-600">
            2 Layouts • 5 Aspect Ratios • 8 Filters • Lightbox • Carousel • Mobile Optimized
          </p>
        </div>

        {/* Live Preview Section */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🎨 Live Interactive Preview</h2>

          {/* Controls */}
          <div className="space-y-6 mb-8">
            {/* Layout Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Layout</label>
              <div className="grid grid-cols-2 gap-2">
                {layouts.map((layout) => (
                  <Button
                    key={layout}
                    variant={selectedLayout === layout ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLayout(layout)}
                    className="capitalize text-xs"
                  >
                    {layout}
                  </Button>
                ))}
              </div>
            </div>

            {/* Columns Selector (only for non-carousel layouts) */}
            {selectedLayout !== 'carousel' && (
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Columns</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedColumns === 'small' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColumns('small')}
                  >
                    Small (3/2 cols)
                  </Button>
                  <Button
                    variant={selectedColumns === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColumns('medium')}
                  >
                    Medium (2/1 cols)
                  </Button>
                </div>
              </div>
            )}

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Aspect Ratio</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio}
                    variant={selectedAspectRatio === ratio ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedAspectRatio(ratio)}
                    className="capitalize text-xs"
                  >
                    {ratio}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image Filter Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Image Filter</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {imageFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedImageFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedImageFilter(filter)}
                    className="capitalize text-xs"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              {/* Rounded Corners Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rounded"
                  checked={selectedRounded}
                  onChange={(e) => setSelectedRounded(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <label htmlFor="rounded" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Rounded Corners
                </label>
              </div>

              {/* Show Captions Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="captions"
                  checked={showCaptions}
                  onChange={(e) => setShowCaptions(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <label htmlFor="captions" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Show Captions
                </label>
              </div>
            </div>

            {/* Device Preview Toggle */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
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
                deviceType === 'mobile' ? 'h-[667px]' : 'h-[600px]'
              }`}>
                <div className="p-4">
                  <GalleryBlock
                    props={{
                      items: sampleImages,
                      layout: selectedLayout,
                      columns: selectedColumns,
                      aspectRatio: selectedAspectRatio,
                      imageFilter: selectedImageFilter,
                      showCaptions: showCaptions,
                      rounded: selectedRounded,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* All Layouts Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">All 2 Layouts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {layouts.map((layout) => (
              <Card key={layout} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {layout}
                </h3>
                <GalleryBlock
                  props={{
                    items: sampleImages.slice(0, 6),
                    layout: layout,
                    columns: 'small',
                    aspectRatio: 'square',
                    imageFilter: 'none',
                    showCaptions: false,
                    rounded: true,
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Comparison */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Aspect Ratio Comparison</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aspectRatios.map((ratio) => (
              <Card key={ratio} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {ratio}
                </h3>
                <GalleryBlock
                  props={{
                    items: sampleImages.slice(0, 4),
                    layout: 'grid',
                    columns: 'medium',
                    aspectRatio: ratio,
                    imageFilter: 'none',
                    showCaptions: false,
                    rounded: true,
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Image Filters Gallery */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Image Filters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageFilters.map((filter) => (
              <Card key={filter} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {filter}
                </h3>
                <GalleryBlock
                  props={{
                    items: sampleImages.slice(0, 3),
                    layout: 'grid',
                    columns: 'medium',
                    aspectRatio: 'landscape',
                    imageFilter: filter,
                    showCaptions: false,
                    rounded: true,
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Rounded Corners Comparison */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Rounded Corners Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                Rounded (ON)
              </h3>
              <GalleryBlock
                props={{
                  items: sampleImages.slice(0, 4),
                  layout: 'grid',
                  columns: 'medium',
                  aspectRatio: 'square',
                  imageFilter: 'none',
                  showCaptions: false,
                  rounded: true,
                }}
              />
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                Rounded (OFF)
              </h3>
              <GalleryBlock
                props={{
                  items: sampleImages.slice(0, 4),
                  layout: 'grid',
                  columns: 'medium',
                  aspectRatio: 'square',
                  imageFilter: 'none',
                  showCaptions: false,
                  rounded: false,
                }}
              />
            </Card>
          </div>
        </div>

        {/* Lightbox Feature */}
        <Card className="p-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">✨ Lightbox Feature</h2>
          <p className="text-center text-lg mb-6">Click on any image to open the full-screen lightbox viewer with navigation!</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <GalleryBlock
              props={{
                items: sampleImages.slice(0, 6),
                layout: 'grid',
                columns: 'small',
                aspectRatio: 'square',
                imageFilter: 'none',
                showCaptions: true,
                rounded: true,
              }}
            />
          </div>
        </Card>

        {/* Carousel Showcase */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4 text-center">🎠 Carousel with Navigation</h2>
          <p className="text-center text-gray-600 mb-6">Use arrow buttons or dots to navigate</p>
          <GalleryBlock
            props={{
              items: sampleImages,
              layout: 'carousel',
              columns: 'small',
              aspectRatio: 'landscape',
              imageFilter: 'none',
              showCaptions: true,
              rounded: true,
            }}
          />
        </Card>

        {/* Stats */}
        <Card className="p-8 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
          <div className="grid md:grid-cols-6 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">2</div>
              <div className="text-sm opacity-90">Layouts</div>
            </div>
            <div>
              <div className="text-4xl font-bold">5</div>
              <div className="text-sm opacity-90">Aspect Ratios</div>
            </div>
            <div>
              <div className="text-4xl font-bold">8</div>
              <div className="text-sm opacity-90">Image Filters</div>
            </div>
            <div>
              <div className="text-4xl font-bold">✓</div>
              <div className="text-sm opacity-90">Lightbox</div>
            </div>
            <div>
              <div className="text-4xl font-bold">📱</div>
              <div className="text-sm opacity-90">Mobile Optimized</div>
            </div>
            <div>
              <div className="text-4xl font-bold">∞</div>
              <div className="text-sm opacity-90">Combinations</div>
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
                <div className="font-semibold">Lightbox Viewer</div>
                <div className="text-sm text-gray-600">Full-screen image viewing</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Carousel Navigation</div>
                <div className="text-sm text-gray-600">Arrows, dots, and keyboard support</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">2 Layouts</div>
                <div className="text-sm text-gray-600">Grid and carousel</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">5 Aspect Ratios</div>
                <div className="text-sm text-gray-600">Square, landscape, portrait, widescreen, original</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Mobile Optimized</div>
                <div className="text-sm text-gray-600">Touch-friendly with active states</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">8 Image Filters</div>
                <div className="text-sm text-gray-600">Grayscale, sepia, vintage, dramatic, and more</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Lazy Loading</div>
                <div className="text-sm text-gray-600">Optimized performance</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Responsive Design</div>
                <div className="text-sm text-gray-600">Works on all devices</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Customizable Spacing</div>
                <div className="text-sm text-gray-600">4 spacing options</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
