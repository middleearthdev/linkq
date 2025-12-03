/**
 * Client-Side Image Compression Utility
 * Compresses images in the browser before upload to save bandwidth and storage
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 */

export interface CompressionOptions {
  maxWidth?: number      // Default: 800
  maxHeight?: number     // Default: 800
  quality?: number       // Default: 0.85 (85%)
  format?: 'webp' | 'jpeg' | 'png' // Default: 'webp'
}

export interface CompressionResult {
  blob: Blob
  width: number
  height: number
  originalSize: number
  compressedSize: number
  savings: string // "87.5%"
}

/**
 * Compress an image file in the browser
 *
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image blob
 *
 * @example
 * const compressed = await compressImage(file, {
 *   maxWidth: 400,
 *   quality: 0.85,
 *   format: 'webp'
 * })
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
    format = 'webp'
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    img.onload = () => {
      // Calculate dimensions while maintaining aspect ratio
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Set canvas size
      canvas.width = width
      canvas.height = height

      // Draw image with high quality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Compression failed - blob is null'))
          }
        },
        `image/${format}`,
        quality
      )

      // Cleanup
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }

    // Load image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Compress image with detailed results
 *
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise<CompressionResult> - Detailed compression results
 */
export async function compressImageWithDetails(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const originalSize = file.size

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    img.onload = () => {
      const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.85,
        format = 'webp'
      } = options

      // Calculate dimensions
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      // Draw image
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedSize = blob.size
            const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1)

            resolve({
              blob,
              width,
              height,
              originalSize,
              compressedSize,
              savings: `${savings}%`
            })
          } else {
            reject(new Error('Compression failed'))
          }
        },
        `image/${format}`,
        quality
      )

      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Get image dimensions without loading full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
