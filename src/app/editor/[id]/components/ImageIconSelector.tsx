/**
 * Image/Icon Selector Component
 * Modal to choose between icon or image for links
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Image as ImageIcon, Sparkles, Lock } from "lucide-react"
import { IconPicker, getIconByName } from "./IconPicker"

interface ImageIconSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectIcon: (iconName: string) => void
  onSelectImage: (imageUrl: string) => void
  currentIcon?: string
  currentImage?: string
  isPremium?: boolean
}

export function ImageIconSelector({
  isOpen,
  onClose,
  onSelectIcon,
  onSelectImage,
  currentIcon,
  currentImage,
  isPremium = false
}: ImageIconSelectorProps) {
  const [mode, setMode] = useState<'choose' | 'icon' | 'image'>('choose')

  if (!isOpen) return null

  const handleReset = () => {
    setMode('choose')
  }

  const handleIconSelect = (iconName: string) => {
    onSelectIcon(iconName)
    onClose()
    handleReset()
  }

  const handleImageSelect = (imageUrl: string) => {
    onSelectImage(imageUrl)
    onClose()
    handleReset()
  }

  // If in icon mode, show icon picker
  if (mode === 'icon') {
    return (
      <IconPicker
        isOpen={true}
        onClose={() => {
          handleReset()
          onClose()
        }}
        onSelect={handleIconSelect}
        currentIcon={currentIcon}
      />
    )
  }

  // If in image mode (premium only) - Use Media Library
  if (mode === 'image') {
    // Import MediaLibraryPicker dynamically to avoid circular deps
    const MediaLibraryPicker = require('@/components/media/MediaLibraryPicker').MediaLibraryPicker

    return (
      <MediaLibraryPicker
        isOpen={true}
        onClose={() => {
          handleReset()
          onClose()
        }}
        onSelect={handleImageSelect}
        category="thumbnail"
        currentImage={currentImage}
        title="Select Image"
      />
    )
  }

  // Choose mode - show options
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
      <div className="relative w-full md:max-w-md h-auto bg-card dark:bg-[#2A3441] rounded-t-2xl md:rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card dark:bg-[#2A3441] border-b border-border p-3 md:p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-foreground dark:text-white">
              Pilih Tipe
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="p-4 md:p-6 space-y-3">
          {/* Icon Option */}
          <button
            onClick={() => setMode('icon')}
            className="w-full p-4 rounded-lg border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground dark:text-white mb-1">
                  Icon
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pilih dari 70+ icon yang tersedia
                </p>
              </div>
            </div>
          </button>

          {/* Image Option - Locked for Free */}
          <button
            onClick={() => {
              if (isPremium) {
                setMode('image')
              }
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left group relative ${
              isPremium
                ? 'border-border bg-background hover:border-primary hover:bg-primary/5 cursor-pointer'
                : 'border-border/50 bg-secondary/30 cursor-not-allowed opacity-60'
            }`}
          >
            {!isPremium && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <Lock className="h-3 w-3 text-yellow-600" />
                  <span className="text-[10px] font-medium text-yellow-600">Premium</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isPremium
                  ? 'bg-blue-500/10 group-hover:bg-blue-500/20'
                  : 'bg-secondary'
              }`}>
                <ImageIcon className={`h-6 w-6 ${
                  isPremium ? 'text-blue-500' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  isPremium ? 'text-foreground dark:text-white' : 'text-muted-foreground'
                }`}>
                  Image
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isPremium
                    ? 'Upload custom image untuk link'
                    : 'Fitur premium - upgrade untuk unlock'
                  }
                </p>
              </div>
            </div>
          </button>

          {/* Remove Option */}
          {(currentIcon || currentImage) && (
            <button
              onClick={() => {
                handleIconSelect('')
                handleReset()
              }}
              className="w-full p-4 rounded-lg border-2 border-border bg-background hover:border-red-500 hover:bg-red-500/5 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <X className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground dark:text-white mb-1">
                    Hapus
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hapus icon/image
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
