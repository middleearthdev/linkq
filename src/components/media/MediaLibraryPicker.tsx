/**
 * Media Library Picker Component
 * Unified image picker for all features
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 */

"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Upload,
  Search,
  Trash2,
  Image as ImageIcon,
  Grid3x3,
  List,
  X,
  Loader2,
  Check
} from 'lucide-react'
import { compressImageWithDetails } from '@/lib/media/compress-image'
import { formatFileSize } from '@/lib/media/compress-image'

interface MediaItem {
  id: string
  url: string
  filename: string
  size: number
  width?: number
  height?: number
  category?: string
  usageCount: number
  markedForDeletion: boolean
  deleteAfter?: string
  createdAt: string
}

interface MediaLibraryPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void

  // Context
  category?: 'avatar' | 'thumbnail' | 'gallery' | 'product' | 'general'
  referenceId?: string // Auto-track usage on select

  // UI
  currentImage?: string
  title?: string
}

export function MediaLibraryPicker({
  isOpen,
  onClose,
  onSelect,
  category = 'general',
  referenceId,
  currentImage,
  title = 'Media Library'
}: MediaLibraryPickerProps) {
  const [tab, setTab] = useState<'library' | 'upload'>('library')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Load media library
  const loadMediaLibrary = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category,
        limit: '50'
      })

      const response = await fetch(`/api/media-library?${params}`)
      const data = await response.json()

      if (data.success) {
        setMediaItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load media library:', error)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    if (isOpen) {
      loadMediaLibrary()
    }
  }, [isOpen, loadMediaLibrary])

  // Handle file upload
  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      // 1. Client-side compression
      const { blob, savings, compressedSize } = await compressImageWithDetails(file, {
        maxWidth: category === 'avatar' ? 400 : 800,
        maxHeight: category === 'avatar' ? 400 : 800,
        quality: 0.85,
        format: 'webp'
      })

      console.log(`✅ Compressed: ${file.name}`)
      console.log(`   Savings: ${savings}`)

      // 2. Upload to server
      const formData = new FormData()
      formData.append('file', blob, `${file.name}.webp`)
      formData.append('category', category)
      if (referenceId) {
        formData.append('referenceId', referenceId)
      }

      const response = await fetch('/api/media-library/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Add to library list
        setMediaItems(prev => [data.item, ...prev])

        // Auto-select and close
        onSelect(data.item.url)
        onClose()
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  // Handle delete
  const handleDelete = async (itemId: string) => {
    if (!confirm('Delete this image? It will be removed from all places using it.')) {
      return
    }

    try {
      const response = await fetch(`/api/media-library/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMediaItems(prev => prev.filter(item => item.id !== itemId))
      } else {
        const data = await response.json()
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Delete failed. Please try again.')
    }
  }

  // Filter items
  const filteredItems = mediaItems.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] bg-card dark:bg-[#1A2332] rounded-xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-xl font-semibold text-foreground dark:text-white">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-border flex-shrink-0">
          <Button
            variant={tab === 'library' ? 'default' : 'outline'}
            onClick={() => setTab('library')}
            className="flex-1 sm:flex-initial"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">My Uploads ({mediaItems.length})</span>
            <span className="sm:hidden">Library ({mediaItems.length})</span>
          </Button>
          <Button
            variant={tab === 'upload' ? 'default' : 'outline'}
            onClick={() => setTab('upload')}
            className="flex-1 sm:flex-initial"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Upload New</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {tab === 'library' ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="hidden sm:flex"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Grid View */}
              {!loading && viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        currentImage === item.url
                          ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                          : 'border-border hover:border-primary/50 hover:scale-[1.02]'
                      }`}
                      onClick={() => {
                        onSelect(item.url)
                        onClose()
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Selected indicator */}
                      {currentImage === item.url && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <p className="text-white text-xs font-medium text-center truncate w-full px-2">
                          {item.filename}
                        </p>
                        {item.usageCount === 0 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="h-7 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>

                      {/* Usage badge */}
                      {item.usageCount > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary text-white text-xs font-medium">
                          {item.usageCount}×
                        </div>
                      )}

                      {/* Deletion warning */}
                      {item.markedForDeletion && (
                        <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-[10px] py-1 px-2 text-center">
                          Unused - Will delete soon
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {!loading && viewMode === 'list' && (
                <div className="space-y-2">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 hover:bg-secondary/50 cursor-pointer transition-all ${
                        currentImage === item.url
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                      onClick={() => {
                        onSelect(item.url)
                        onClose()
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground dark:text-white truncate">
                          {item.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.size)} • Used {item.usageCount}×
                          {item.width && item.height && ` • ${item.width}×${item.height}`}
                        </p>
                      </div>
                      {currentImage === item.url && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                      {item.usageCount === 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">
                    {searchQuery ? 'No images found' : 'No images uploaded yet'}
                  </p>
                  {!searchQuery && (
                    <Button
                      className="mt-4"
                      onClick={() => setTab('upload')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First Image
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Upload Tab */
            <div className="max-w-md mx-auto">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                {uploading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Compressing and uploading...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">
                      Upload Image
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Click to browse or drag and drop
                      <br />
                      PNG, JPG, GIF, or WebP (max 10MB)
                    </p>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Button asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="mt-6 text-xs text-muted-foreground space-y-1">
                <p>✅ Images are automatically compressed</p>
                <p>✅ Duplicates are detected and reused</p>
                <p>✅ Unused images are cleaned up after 30 days</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
