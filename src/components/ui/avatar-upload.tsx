/**
 * Avatar Upload Component
 * Mobile-first design for uploading profile pictures to DigitalOcean Spaces
 */

"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Camera, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

export function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  className,
  size = 'lg',
  disabled = false
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Size mapping for mobile-first design
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'avatars')

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      if (data.success && data.url) {
        onAvatarChange(data.url)
        setPreview(null) // Clear preview since we have the final URL
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreview(null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    onAvatarChange('')
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayImage = preview || currentAvatar

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      {/* Avatar Display */}
      <div className="relative">
        <Avatar className={cn(
          sizeClasses[size],
          'border-2 border-dashed border-gray-300 transition-all duration-200',
          !displayImage && 'bg-gray-50',
          isUploading && 'opacity-50'
        )}>
          <AvatarImage 
            src={displayImage} 
            alt="Avatar preview"
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <Camera className="w-6 h-6 text-gray-400" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Remove button */}
        {displayImage && !isUploading && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            disabled={disabled}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="relative"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {displayImage ? 'Change Photo' : 'Upload Photo'}
            </>
          )}
        </Button>

        {/* File size hint */}
        <p className="text-xs text-gray-500 text-center px-2">
          PNG, JPG up to 5MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 text-center px-2 bg-red-50 rounded-md py-1">
          {error}
        </p>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  )
}