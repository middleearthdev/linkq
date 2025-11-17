'use client'

import React, { useState } from 'react'
import { GalleryBlock } from '@/components/blocks/GalleryBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GalleryBlockProps } from '@/types'

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

  const [selectedLayout, setSelectedLayout] = useState<any>('grid')
  const [selectedColumns, setSelectedColumns] = useState(3)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<any>('square')
  const [selectedImageFilter, setSelectedImageFilter] = useState<any>('none')
  const [selectedSpacing, setSelectedSpacing] = useState<any>('md')
  const [selectedRounded, setSelectedRounded] = useState<any>('md')
  const [showCaptions, setShowCaptions] = useState(true)

  const layouts: Array<GalleryBlockProps['layout']> = ['grid', 'carousel']
  const columns = [1, 2, 3, 4, 5, 6]
  const aspectRatios: Array<GalleryBlockProps['aspectRatio']> = ['square', 'landscape', 'portrait', 'widescreen', 'original']
  const imageFilters: Array<GalleryBlockProps['imageFilter']> = ['none', 'grayscale', 'sepia', 'vintage', 'dramatic', 'warm', 'cool', 'noir']
  const spacings: Array<GalleryBlockProps['spacing']> = ['none', 'sm', 'md', 'lg']
  const roundedOptions: Array<GalleryBlockProps['rounded']> = ['none', 'sm', 'md', 'lg', 'xl']

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
                <div className="grid grid-cols-6 gap-2">
                  {columns.map((col) => (
                    <Button
                      key={col}
                      variant={selectedColumns === col ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColumns(col)}
                    >
                      {col}
                    </Button>
                  ))}
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

            {/* Spacing & Rounded */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Spacing</label>
                <div className="grid grid-cols-4 gap-2">
                  {spacings.map((spacing) => (
                    <Button
                      key={spacing}
                      variant={selectedSpacing === spacing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSpacing(spacing)}
                      className="capitalize"
                    >
                      {spacing}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Rounded Corners</label>
                <div className="grid grid-cols-5 gap-2">
                  {roundedOptions.map((rounded) => (
                    <Button
                      key={rounded}
                      variant={selectedRounded === rounded ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedRounded(rounded)}
                      className="capitalize"
                    >
                      {rounded}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Show Captions Toggle */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Show Captions</label>
              <Button
                variant={showCaptions ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowCaptions(!showCaptions)}
              >
                {showCaptions ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-dashed border-gray-300">
            <GalleryBlock
              props={{
                items: sampleImages,
                layout: selectedLayout,
                columns: selectedColumns,
                aspectRatio: selectedAspectRatio,
                imageFilter: selectedImageFilter,
                showCaptions: showCaptions,
                spacing: selectedSpacing,
                rounded: selectedRounded,
              }}
            />
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
                    columns: 3,
                    aspectRatio: 'square',
                    imageFilter: 'none',
                    showCaptions: false,
                    spacing: 'md',
                    rounded: 'md',
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
                    columns: 2,
                    aspectRatio: ratio,
                    imageFilter: 'none',
                    showCaptions: false,
                    spacing: 'sm',
                    rounded: 'md',
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
                    columns: 1,
                    aspectRatio: 'landscape',
                    imageFilter: filter,
                    showCaptions: false,
                    spacing: 'sm',
                    rounded: 'md',
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Spacing Comparison */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Spacing Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spacings.map((spacing) => (
              <Card key={spacing} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {spacing}
                </h3>
                <GalleryBlock
                  props={{
                    items: sampleImages.slice(0, 4),
                    layout: 'grid',
                    columns: 2,
                    aspectRatio: 'square',
                    imageFilter: 'none',
                    showCaptions: false,
                    spacing: spacing,
                    rounded: 'md',
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Rounded Corners Comparison */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Rounded Corners</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {roundedOptions.map((rounded) => (
              <Card key={rounded} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 capitalize text-center text-gray-700">
                  {rounded}
                </h3>
                <GalleryBlock
                  props={{
                    items: sampleImages.slice(0, 3),
                    layout: 'grid',
                    columns: 1,
                    aspectRatio: 'square',
                    imageFilter: 'none',
                    showCaptions: false,
                    spacing: 'sm',
                    rounded: rounded,
                  }}
                />
              </Card>
            ))}
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
                columns: 3,
                aspectRatio: 'square',
                imageFilter: 'none',
                showCaptions: true,
                spacing: 'md',
                rounded: 'lg',
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
              columns: 3,
              aspectRatio: 'landscape',
              imageFilter: 'none',
              showCaptions: true,
              spacing: 'md',
              rounded: 'lg',
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
