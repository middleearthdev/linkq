/**
 * BackgroundPicker Component
 * Visual background selector for site editor
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  BACKGROUND_REGISTRY,
  getBackgroundsByType,
  searchBackgrounds,
  getFreeBackgrounds,
  getPremiumBackgrounds,
} from '@/lib/backgrounds/registry'
import { BackgroundType } from '@/lib/backgrounds/types'
import { BACKGROUND_COLLECTIONS, getCollectionBackgrounds } from '@/lib/backgrounds/collections'
import { Search, Crown, Check, Upload, X, Loader2 } from 'lucide-react'

interface BackgroundPickerProps {
  value: string
  onChange: (backgroundKey: string) => void
  isPremiumUser?: boolean
  className?: string
}

export function BackgroundPicker({
  value,
  onChange,
  isPremiumUser = false,
  className,
}: BackgroundPickerProps) {
  const [category, setCategory] = useState<BackgroundType>('gradient')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null)
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null)

  // Overlay controls
  const [overlayOpacity, setOverlayOpacity] = useState(30)
  const [overlayColor, setOverlayColor] = useState('#000000')
  const [enableBlur, setEnableBlur] = useState(false)

  // Get backgrounds for current category
  const getBackgrounds = () => {
    if (searchQuery.trim()) {
      return searchBackgrounds(searchQuery)
    }

    // Filter by collection if selected
    if (selectedCollection) {
      const collectionKeys = getCollectionBackgrounds(selectedCollection)
      return Object.values(BACKGROUND_REGISTRY).filter(bg => {
        const key = Object.keys(BACKGROUND_REGISTRY).find(k => BACKGROUND_REGISTRY[k] === bg)
        return key && collectionKeys.includes(key)
      })
    }

    return getBackgroundsByType(category)
  }

  const backgrounds = getBackgrounds()

  const handleSelect = (key: string) => {
    const bg = BACKGROUND_REGISTRY[key]
    if (bg?.isPremium && !isPremiumUser) {
      // Show upgrade prompt
      alert('This background requires a premium plan. Upgrade to unlock!')
      return
    }
    onChange(key)
  }

  const handleImageUpload = async (file: File) => {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload JPG, PNG, GIF, or WebP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 10MB.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/background', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setCustomImageUrl(data.url)
      onChange('image-custom')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    // Validate file
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload MP4, WebM, or OGG.')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 50MB.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setCustomVideoUrl(data.url)
      onChange('video-custom')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn('background-picker space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search backgrounds..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (e.target.value.trim()) {
              setSelectedCollection(null) // Clear collection when searching
            }
          }}
          className="pl-10"
        />
      </div>

      {/* Collections Filter */}
      {!searchQuery.trim() && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Browse by Theme</Label>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={selectedCollection === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCollection(null)}
              className="h-7 text-xs"
            >
              All
            </Button>
            {BACKGROUND_COLLECTIONS.map(collection => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCollection(collection.id)}
                className="h-7 text-xs"
                title={collection.description}
              >
                <span className="mr-1">{collection.icon}</span>
                {collection.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as BackgroundType)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="solid">Solid</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="pattern">Pattern</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="animated">
            Animated
            <Crown className="w-3 h-3 ml-1 text-yellow-500" />
          </TabsTrigger>
        </TabsList>

        {/* Solid Colors */}
        <TabsContent value="solid" className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {backgrounds.map((bg) => {
              const key = Object.keys(BACKGROUND_REGISTRY).find(
                (k) => BACKGROUND_REGISTRY[k] === bg
              )!
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    'relative h-20 rounded-lg border-2 transition-all hover:scale-105',
                    value === key
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{ background: bg.preview }}
                  title={bg.name}
                >
                  {value === key && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                  {bg.isPremium && !isPremiumUser && (
                    <Crown className="absolute top-1 right-1 w-4 h-4 text-yellow-500 drop-shadow" />
                  )}
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* Gradients */}
        <TabsContent value="gradient" className="space-y-4">
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
            {backgrounds.map((bg) => {
              const key = Object.keys(BACKGROUND_REGISTRY).find(
                (k) => BACKGROUND_REGISTRY[k] === bg
              )!
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    'relative h-24 rounded-lg border-2 transition-all hover:scale-105',
                    value === key
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{ background: bg.preview }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {value === key && (
                      <Check className="w-6 h-6 text-white drop-shadow-lg mb-1" />
                    )}
                    <div className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      {bg.name}
                    </div>
                  </div>
                  {bg.isPremium && !isPremiumUser && (
                    <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-500 drop-shadow" />
                  )}
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* Patterns */}
        <TabsContent value="pattern" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {backgrounds.map((bg) => {
              const key = Object.keys(BACKGROUND_REGISTRY).find(
                (k) => BACKGROUND_REGISTRY[k] === bg
              )!
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    'relative h-24 rounded-lg border-2 transition-all hover:scale-105 overflow-hidden',
                    value === key
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={{
                    background: bg.preview,
                    // @ts-ignore - pattern specific properties
                    backgroundSize: bg.size,
                    // @ts-ignore
                    backgroundColor: bg.backgroundColor,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {value === key && (
                      <Check className="w-6 h-6 text-gray-800 drop-shadow-lg mb-1" />
                    )}
                    <div className="text-xs font-medium text-gray-800 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                      {bg.name}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* Image Upload */}
        <TabsContent value="image" className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload Background Image
            </p>
            <p className="text-xs text-gray-500 mb-4">
              JPG, PNG, GIF, or WebP (max 10MB)
            </p>
            <label className="cursor-pointer">
              <Button variant="default" size="sm" disabled={uploading} asChild>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </span>
              </Button>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(file)
                  }
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <p className="text-xs text-red-800">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {customImageUrl && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={customImageUrl}
                  alt="Custom background"
                  className="w-full h-32 object-cover"
                />
                {value === 'image-custom' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                )}
              </div>

              {/* Overlay Controls */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold text-gray-700">Image Controls</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Overlay Opacity</Label>
                    <span className="text-xs text-gray-500">{overlayOpacity}%</span>
                  </div>
                  <Slider
                    value={[overlayOpacity]}
                    onValueChange={([value]) => setOverlayOpacity(value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Overlay Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overlayColor}
                      onChange={(e) => setOverlayColor(e.target.value)}
                      className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={overlayColor}
                      onChange={(e) => setOverlayColor(e.target.value)}
                      className="flex-1 h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Blur Background</Label>
                  <Switch
                    checked={enableBlur}
                    onCheckedChange={setEnableBlur}
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect('image-custom')}
                  className="w-full text-xs"
                >
                  Apply Background
                </Button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Use high-resolution images (1920x1080 or higher) for best results. The image will automatically scale to fit the screen.
            </p>
          </div>
        </TabsContent>

        {/* Video Upload */}
        <TabsContent value="video" className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload Background Video
            </p>
            <p className="text-xs text-gray-500 mb-4">
              MP4, WebM, or OGG (max 50MB)
            </p>
            <label className="cursor-pointer">
              <Button variant="default" size="sm" disabled={uploading} asChild>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Video
                    </>
                  )}
                </span>
              </Button>
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleVideoUpload(file)
                  }
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <p className="text-xs text-red-800">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {customVideoUrl && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <video
                  src={customVideoUrl}
                  className="w-full h-32 object-cover"
                  controls
                  loop
                  muted
                />
                {value === 'video-custom' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                )}
              </div>

              {/* Overlay Controls */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-semibold text-gray-700">Video Controls</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Overlay Opacity</Label>
                    <span className="text-xs text-gray-500">{overlayOpacity}%</span>
                  </div>
                  <Slider
                    value={[overlayOpacity]}
                    onValueChange={([value]) => setOverlayOpacity(value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Overlay Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overlayColor}
                      onChange={(e) => setOverlayColor(e.target.value)}
                      className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={overlayColor}
                      onChange={(e) => setOverlayColor(e.target.value)}
                      className="flex-1 h-10 text-xs"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect('video-custom')}
                  className="w-full text-xs"
                >
                  Apply Background
                </Button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Tips:</strong> Use short videos (10-30 seconds) that loop well. MP4 format with H.264 codec works best. Keep file size under 50MB for faster loading.
            </p>
          </div>
        </TabsContent>

        {/* Animated (Premium) */}
        <TabsContent value="animated" className="space-y-4">
          {!isPremiumUser && (
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Premium Feature</h4>
              </div>
              <p className="text-sm text-yellow-800">
                Animated backgrounds are available for premium users. Upgrade to unlock!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {backgrounds.map((bg) => {
              const key = Object.keys(BACKGROUND_REGISTRY).find(
                (k) => BACKGROUND_REGISTRY[k] === bg
              )!
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={!isPremiumUser}
                  className={cn(
                    'relative h-32 rounded-lg border-2 transition-all',
                    value === key
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200',
                    isPremiumUser ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                  )}
                  style={{ background: bg.preview }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {value === key && (
                      <Check className="w-6 h-6 text-white drop-shadow-lg mb-1" />
                    )}
                    <div className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      {bg.name}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Current Selection Info */}
      {value && BACKGROUND_REGISTRY[value] && (
        <div className="bg-gray-50 rounded-lg p-3 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{BACKGROUND_REGISTRY[value].name}</p>
              <p className="text-xs text-gray-500">
                {BACKGROUND_REGISTRY[value].type.charAt(0).toUpperCase() +
                  BACKGROUND_REGISTRY[value].type.slice(1)}{' '}
                Background
              </p>
            </div>
            {BACKGROUND_REGISTRY[value].isPremium && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
