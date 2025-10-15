/**
 * GalleryBlock Component
 * Image and video gallery with multiple layout options
 */

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GalleryBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { Plus, Trash2, Play, Lock } from 'lucide-react'
import Image from 'next/image'

interface GalleryBlockComponentProps {
  props: GalleryBlockProps
  className?: string
  isEditing?: boolean
  isLocked?: boolean
}

export function GalleryBlock({ props, className, isEditing = false, isLocked = false }: GalleryBlockComponentProps) {
  const { items = [], layout = 'grid', columns = 3 } = props

  const handleItemClick = (item: any) => {
    if (isEditing || isLocked) return

    trackEvent('gallery_item_click', {
      itemId: item.id,
      itemType: item.type,
      layout,
    })

    // Open in lightbox or modal
    console.log('Open gallery item:', item)
  }

  if (isLocked) {
    return (
      <Card className={cn(
        'relative p-6 bg-gray-50 border-dashed',
        'gallery-block', // CSS class for template styling
        className
      )}>
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Premium Feature</p>
            <p className="text-xs text-gray-500">Upgrade to unlock Gallery blocks</p>
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

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  return (
    <div className={cn(
      'w-full p-6',
      'gallery-block', // CSS class for template styling
      className
    )}>
      {layout === 'grid' && (
        <div className={cn(
          'grid gap-4',
          gridCols[columns as keyof typeof gridCols] || 'grid-cols-3',
          'gallery-grid' // CSS class for template styling
        )}>
          {items.map((item, index) => (
            <GalleryItem
              key={item.id || index}
              item={item}
              onClick={() => handleItemClick(item)}
              isEditing={isEditing}
            />
          ))}
        </div>
      )}

      {layout === 'masonry' && (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item, index) => (
            <div key={item.id || index} className="break-inside-avoid">
              <GalleryItem
                item={item}
                onClick={() => handleItemClick(item)}
                isEditing={isEditing}
              />
            </div>
          ))}
        </div>
      )}

      {layout === 'carousel' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex-shrink-0 w-64">
              <GalleryItem
                item={item}
                onClick={() => handleItemClick(item)}
                isEditing={isEditing}
              />
            </div>
          ))}
        </div>
      )}

      {isEditing && items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No gallery items added yet</p>
          <p className="text-sm">Add images or videos to get started</p>
        </div>
      )}
    </div>
  )
}

function GalleryItem({ 
  item, 
  onClick, 
  isEditing 
}: { 
  item: any
  onClick: () => void
  isEditing: boolean 
}) {
  return (
    <Card 
      className={cn(
        'cursor-pointer overflow-hidden hover:shadow-lg transition-shadow group',
        'gallery-item', // CSS class for template styling
        isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {item.type === 'image' ? (
          <Image
            src={item.thumbnail || item.url}
            alt={item.caption || 'Gallery image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="relative w-full h-full bg-black">
            <Image
              src={item.thumbnail || '/video-placeholder.jpg'}
              alt={item.caption || 'Video thumbnail'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-gray-800 ml-1" />
              </div>
            </div>
          </div>
        )}

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
            {item.caption}
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
  const handleLayoutChange = (layout: 'grid' | 'masonry' | 'carousel') => {
    onChange({ ...props, layout })
  }

  const handleColumnsChange = (columns: number) => {
    onChange({ ...props, columns })
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
        <div className="flex gap-2">
          {(['grid', 'masonry', 'carousel'] as const).map((layout) => (
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
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((cols) => (
              <Button
                key={cols}
                variant={props.columns === cols ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleColumnsChange(cols)}
              >
                {cols}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Gallery Items</label>
          <Button size="sm" onClick={handleAddItem} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-3">
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
                    className="text-red-600 hover:text-red-700"
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