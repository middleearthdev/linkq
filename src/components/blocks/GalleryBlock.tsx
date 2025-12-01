/**
 * GalleryBlock Component - Enhanced Version
 * Image and video gallery with lightbox, filters, and advanced layouts
 */

'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GalleryBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { Plus, Trash2, Play, Lock, ChevronLeft, ChevronRight, X, Maximize2, Download, Share2 } from 'lucide-react'
import Image from 'next/image'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface GalleryBlockComponentProps {
  props: GalleryBlockProps
  className?: string
  isEditing?: boolean
  isLocked?: boolean
}

export function GalleryBlock({ props, className, isEditing = false, isLocked = false }: GalleryBlockComponentProps) {
  const {
    items = [],
    layout = 'grid',
    columns = 'small',
    aspectRatio = 'square',
    imageFilter = 'none',
    showCaptions = true,
    rounded = true,
  } = props

  const [currentSlide, setCurrentSlide] = useState(0)

  const handleItemClick = (item: any, index: number) => {
    if (isEditing || isLocked) return

    trackEvent('gallery_item_click', {
      itemId: item.id,
      itemType: item.type,
      layout,
    })

    setCurrentSlide(index)
  }

  if (isLocked) {
    return (
      <Card className={cn(
        'relative p-6 bg-gray-50 border-dashed',
        'gallery-block',
        className
      )}>
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Premium Feature</p>
            <p className="text-xs text-gray-500">Upgrade to PRO to unlock Gallery blocks</p>
          </div>
        </div>

        <div className="opacity-30">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (items.length === 0 && !isEditing) {
    return null
  }

  // Rounded class based on boolean
  const roundedClass = rounded ? 'rounded-lg' : 'rounded-none'

  // Grid columns - same as ProductCatalog
  const gridColsClass = columns === 'small'
    ? 'grid-cols-2 sm:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2'

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[9/16]',
    widescreen: 'aspect-[21/9]',
    original: 'aspect-auto',
  }

  // Image filters
  const filterStyles = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(80%)',
    vintage: 'sepia(50%) contrast(110%) brightness(95%)',
    dramatic: 'contrast(150%) brightness(90%) saturate(120%)',
    warm: 'sepia(20%) saturate(130%) brightness(105%)',
    cool: 'hue-rotate(180deg) saturate(120%) brightness(95%)',
    noir: 'grayscale(100%) contrast(150%) brightness(90%)',
  }

  return (
    <div className={cn(
      'w-full p-6',
      'gallery-block',
      className
    )}>
      <PhotoProvider
        maskOpacity={0.8}
        speed={() => 300}
        easing={() => 'cubic-bezier(0.4, 0, 0.2, 1)'}
      >
        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className={cn(
            'grid gap-3',
            gridColsClass,
            'gallery-grid'
          )}>
            {items.map((item, index) => (
              <PhotoView key={item.id || index} src={item.url}>
                <GalleryItem
                  item={item}
                  onClick={() => handleItemClick(item, index)}
                  isEditing={isEditing}
                  aspectRatioClass={aspectRatioClasses[aspectRatio]}
                  filterStyle={filterStyles[imageFilter]}
                  roundedClass={roundedClass}
                  showCaption={showCaptions}
                />
              </PhotoView>
            ))}
          </div>
        )}

        {/* Carousel Layout with Navigation */}
        {layout === 'carousel' && (
          <div className="relative">
            {/* Navigation Arrows */}
            {items.length > 1 && !isEditing && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg transition-all active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg transition-all active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Carousel Items */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {items.map((item, index) => (
                  <div key={item.id || index} className="w-full flex-shrink-0">
                    <PhotoView src={item.url}>
                      <GalleryItem
                        item={item}
                        onClick={() => handleItemClick(item, index)}
                        isEditing={isEditing}
                        aspectRatioClass={aspectRatioClasses[aspectRatio]}
                        filterStyle={filterStyles[imageFilter]}
                        roundedClass={roundedClass}
                        showCaption={showCaptions}
                      />
                    </PhotoView>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot Indicators */}
            {items.length > 1 && !isEditing && (
              <div className="flex gap-2 justify-center mt-6">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      currentSlide === index
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 active:bg-gray-500'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </PhotoProvider>

      {isEditing && items.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="font-medium">No gallery items added yet</p>
          <p className="text-sm">Add images or videos to get started</p>
        </div>
      )}
    </div>
  )
}

interface GalleryItemProps {
  item: any
  onClick: () => void
  isEditing: boolean
  aspectRatioClass: string
  filterStyle: string
  roundedClass: string
  showCaption: boolean
}

function GalleryItem({
  item,
  onClick,
  isEditing,
  showCaption,
  aspectRatioClass,
  filterStyle,
  roundedClass,
}: GalleryItemProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden transition-all duration-200',
        'gallery-item',
        // Active state for mobile touch feedback
        'active:opacity-90 active:scale-[0.98]',
        isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
        roundedClass
      )}
      onClick={onClick}
    >
      <div className={cn('relative', aspectRatioClass)}>
        {item.type === 'image' ? (
          <Image
            src={item.thumbnail || item.url}
            alt={item.caption || 'Gallery image'}
            fill
            className="object-cover"
            style={{ filter: filterStyle }}
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full bg-black">
            <Image
              src={item.thumbnail || '/video-placeholder.jpg'}
              alt={item.caption || 'Video thumbnail'}
              fill
              className="object-cover"
              style={{ filter: filterStyle }}
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* Caption */}
        {item.caption && showCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
            <p className="text-sm font-medium line-clamp-2">{item.caption}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

// Editor component for customizing GalleryBlock props
export function GalleryBlockEditor({
  props,
  onChange,
  className
}: {
  props: GalleryBlockProps
  onChange: (props: GalleryBlockProps) => void
  className?: string
}) {
  const handleLayoutChange = (layout: any) => {
    onChange({ ...props, layout })
  }

  const handleColumnsChange = (columns: 'small' | 'medium') => {
    onChange({ ...props, columns })
  }

  const handleAspectRatioChange = (aspectRatio: any) => {
    onChange({ ...props, aspectRatio })
  }

  const handleFilterChange = (imageFilter: any) => {
    onChange({ ...props, imageFilter })
  }

  const handleRoundedChange = (rounded: boolean) => {
    onChange({ ...props, rounded })
  }

  const handleAddItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      type: 'image' as const,
      url: '',
      thumbnail: '',
      caption: '',
    }
    onChange({ ...props, items: [...(props.items || []), newItem] })
  }

  const handleUpdateItem = (index: number, updates: any) => {
    const items = [...(props.items || [])]
    items[index] = { ...items[index], ...updates }
    onChange({ ...props, items })
  }

  const handleRemoveItem = (index: number) => {
    const items = [...(props.items || [])]
    items.splice(index, 1)
    onChange({ ...props, items })
  }

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Layout selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {(['grid', 'carousel'] as const).map((layout) => (
            <Button
              key={layout}
              variant={props.layout === layout ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLayoutChange(layout)}
              className="capitalize"
            >
              {layout}
            </Button>
          ))}
        </div>
      </div>

      {/* Columns selector (only for grid layout) */}
      {props.layout === 'grid' && (
        <div>
          <label className="block text-sm font-medium mb-2">Columns</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={props.columns === 'small' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleColumnsChange('small')}
            >
              Small (3/2 cols)
            </Button>
            <Button
              variant={props.columns === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleColumnsChange('medium')}
            >
              Medium (2/1 cols)
            </Button>
          </div>
        </div>
      )}

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
        <div className="grid grid-cols-3 gap-2">
          {(['square', 'landscape', 'portrait', 'widescreen', 'original'] as const).map((ratio) => (
            <Button
              key={ratio}
              variant={props.aspectRatio === ratio ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAspectRatioChange(ratio)}
              className="capitalize"
            >
              {ratio}
            </Button>
          ))}
        </div>
      </div>

      {/* Image Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Image Filter</label>
        <div className="grid grid-cols-4 gap-2">
          {(['none', 'grayscale', 'sepia', 'vintage', 'dramatic', 'warm', 'cool', 'noir'] as const).map((filter) => (
            <Button
              key={filter}
              variant={props.imageFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(filter)}
              className="capitalize text-xs"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Rounded Corners Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rounded"
          checked={props.rounded ?? true}
          onChange={(e) => handleRoundedChange(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="rounded" className="text-sm font-medium">
          Rounded Corners
        </label>
      </div>

      {/* Show Captions Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showCaptions"
          checked={props.showCaptions ?? true}
          onChange={(e) => onChange({ ...props, showCaptions: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="showCaptions" className="text-sm font-medium">
          Show Captions
        </label>
      </div>

      {/* Gallery items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Gallery Items</label>
          <Button size="sm" onClick={handleAddItem} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(props.items || []).map((item, index) => (
            <Card key={item.id || index} className="p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={item.type}
                    onChange={(e) => handleUpdateItem(index, { type: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 active:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => handleUpdateItem(index, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`${item.type === 'image' ? 'Image' : 'Video'} URL`}
                />

                {item.type === 'video' && (
                  <input
                    type="url"
                    value={item.thumbnail || ''}
                    onChange={(e) => handleUpdateItem(index, { thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Video thumbnail URL"
                  />
                )}

                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleUpdateItem(index, { caption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Caption (optional)"
                />
              </div>
            </Card>
          ))}

          {(!props.items || props.items.length === 0) && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No gallery items added yet</p>
              <p className="text-sm">Click "Add Item" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
