/**
 * Gallery Manager Dialog
 * Mobile-friendly dialog for managing gallery items and settings
 */

import { useState, useEffect } from "react"
import { Copy, ImageIcon, Trash2, Plus, LayoutGrid, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { MediaLibraryPicker } from "@/components/media/MediaLibraryPicker"

interface Block {
  id: string
  type: string
  props: any
}

interface GalleryManagerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
  canUploadImages?: boolean
}

const LAYOUT_TYPES = [
  { value: 'grid', label: 'Grid', description: 'Display in grid layout', icon: LayoutGrid },
  { value: 'carousel', label: 'Carousel', description: 'Scrollable slider', icon: Images }
]

const ASPECT_RATIOS = [
  { value: 'square', label: 'Square', ratio: '1:1' },
  { value: 'portrait', label: 'Portrait', ratio: '4:5' },
  { value: 'landscape', label: 'Landscape', ratio: '16:9' }
]

const IMAGE_FILTERS = [
  { value: 'none', label: 'None' },
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'noir', label: 'Noir' }
]

export default function GalleryManagerDialog({
  block,
  onUpdateBlock,
  onClose,
  canUploadImages = false
}: GalleryManagerDialogProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'settings'>('items')
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  const items = block.props.items || []
  const layout = block.props.layout || 'grid'
  const aspectRatio = block.props.aspectRatio || 'square'
  const imageFilter = block.props.imageFilter || 'none'
  const showCaptions = block.props.showCaptions ?? true
  const rounded = block.props.rounded ?? true

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  const addItem = () => {
    if (canUploadImages) {
      // Open Media Library for premium users
      setIsMediaLibraryOpen(true)
    } else {
      // Add default image for free users
      const newItem = {
        id: `gallery-item-${Date.now()}`,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
        caption: 'New image',
        alt: 'Gallery image'
      }
      updateField('items', [...items, newItem])
    }
  }

  // Handle Media Library selection
  const handleMediaLibrarySelect = (imageUrl: string) => {
    const newItem = {
      id: `gallery-item-${Date.now()}`,
      type: 'image',
      url: imageUrl,
      caption: '',
      alt: 'Gallery image'
    }
    updateField('items', [...items, newItem])
    setIsMediaLibraryOpen(false)
  }

  const deleteItem = (itemId: string) => {
    updateField('items', items.filter((item: any) => item.id !== itemId))
  }

  const updateItem = (itemId: string, field: string, value: any) => {
    updateField('items', items.map((item: any) =>
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full sm:max-w-2xl bg-background border-t sm:border sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="font-bold text-lg">Gallery Manager</h2>
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4 rotate-45" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'items'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              Items ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'items' && (
            <div className="p-4 space-y-3">
              {/* Add Item Button */}
              <Button
                onClick={addItem}
                variant="outline"
                className="w-full border-2 border-dashed hover:border-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No images yet</p>
                  <p className="text-xs text-muted-foreground">Click "Add Image" to start</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div key={item.id} className="p-3 rounded-lg border-2 border-border bg-card">
                      <div className="flex gap-3">
                        {/* Image Preview */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <Image
                            src={item.url}
                            alt={item.caption || 'Gallery item'}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <Input
                            value={item.caption || ''}
                            onChange={(e) => updateItem(item.id, 'caption', e.target.value)}
                            placeholder="Caption (optional)"
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors self-start"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              {/* Layout Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">Layout Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUT_TYPES.map((layoutOption) => {
                    const IconComponent = layoutOption.icon
                    return (
                      <button
                        key={layoutOption.value}
                        onClick={() => updateField('layout', layoutOption.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          layout === layoutOption.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium text-sm">{layoutOption.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{layoutOption.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>


              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-semibold mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => updateField('aspectRatio', ratio.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        aspectRatio === ratio.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{ratio.label}</div>
                      <div className="text-xs text-muted-foreground">{ratio.ratio}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2">Image Filter</label>
                <div className="grid grid-cols-4 gap-2">
                  {IMAGE_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => updateField('imageFilter', filter.value)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        imageFilter === filter.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{filter.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Show Captions */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
                  <div>
                    <p className="font-semibold text-sm">Show Captions</p>
                    <p className="text-xs text-muted-foreground">Display image captions</p>
                  </div>
                  <button
                    onClick={() => updateField('showCaptions', !showCaptions)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showCaptions ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        showCaptions ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Rounded Corners */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
                  <div>
                    <p className="font-semibold text-sm">Rounded Corners</p>
                    <p className="text-xs text-muted-foreground">Apply rounded edges</p>
                  </div>
                  <button
                    onClick={() => updateField('rounded', !rounded)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      rounded ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        rounded ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Media Library Picker - Outside GalleryManager backdrop */}
      {canUploadImages && (
        <MediaLibraryPicker
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          onSelect={handleMediaLibrarySelect}
          category="gallery"
          referenceId={`gallery:${block.id}`}
          currentImage=""
          title="Choose Gallery Image"
        />
      )}
    </>
  )
}
