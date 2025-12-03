/**
 * Media Library Upload API
 * Handles image uploads with compression, deduplication, and usage tracking
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 * POST /api/media-library/upload
 */

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'
import { generateImageHash } from '@/lib/media/hash'

// S3 Configuration
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
  forcePathStyle: false, // DigitalOcean Spaces uses virtual-hosted style
})

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || 'linkq'
const CDN_URL = process.env.DO_SPACES_CDN_URL || `https://${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com`

// Constants
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Size presets by category
const SIZE_PRESETS = {
  avatar: { width: 400, height: 400 },
  thumbnail: { width: 400, height: 400 },
  gallery: { width: 1200, height: 1200 },
  product: { width: 800, height: 800 },
  general: { width: 800, height: 800 }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const category = (formData.get('category') as string) || 'general'
    const referenceId = formData.get('referenceId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 3. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
      }, { status: 400 })
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 })
    }

    // 5. Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const originalSize = buffer.length

    // 6. Generate hash for deduplication
    const hash = generateImageHash(buffer)

    // 7. Check if user already has this image
    const existing = await prisma.mediaLibrary.findUnique({
      where: {
        userId_hash: {
          userId: user.id,
          hash
        }
      }
    })

    if (existing) {
      // Image already exists - increment usage and return
      const updated = await prisma.mediaLibrary.update({
        where: { id: existing.id },
        data: {
          usageCount: { increment: 1 },
          usedIn: referenceId
            ? { push: referenceId }
            : existing.usedIn,
          lastUsedAt: new Date(),
          // Cancel deletion if it was marked
          markedForDeletion: false,
          deleteAfter: null
        }
      })

      return NextResponse.json({
        success: true,
        item: updated,
        cached: true,
        message: 'Image already exists in your library - reusing existing file',
        savings: '100%' // No upload needed!
      })
    }

    // 8. Process image with Sharp
    const sizePreset = SIZE_PRESETS[category as keyof typeof SIZE_PRESETS] || SIZE_PRESETS.general

    const processed = await sharp(buffer)
      .resize(sizePreset.width, sizePreset.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toBuffer()

    const metadata = await sharp(processed).metadata()

    // 9. Upload to S3
    const filename = `media-library/${user.id}/${hash}.webp`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: processed,
        ContentType: 'image/webp',
        ACL: 'public-read',
        CacheControl: 'public, max-age=31536000, immutable',
        Metadata: {
          'uploaded-by': user.id,
          'original-name': file.name,
          'original-size': originalSize.toString(),
          'optimized-size': processed.length.toString(),
          'hash': hash
        }
      })
    )

    const url = `${CDN_URL}/${filename}`

    // 10. Save to database
    const item = await prisma.mediaLibrary.create({
      data: {
        userId: user.id,
        hash,
        url,
        filename: file.name,
        size: processed.length,
        width: metadata.width,
        height: metadata.height,
        type: 'image/webp',
        category,
        usageCount: referenceId ? 1 : 0,
        usedIn: referenceId ? [referenceId] : [],
        lastUsedAt: referenceId ? new Date() : null
      }
    })

    // 11. Calculate savings
    const savings = ((1 - processed.length / originalSize) * 100).toFixed(1)

    console.log(`✅ Image uploaded: ${file.name}`)
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`)
    console.log(`   Optimized: ${(processed.length / 1024).toFixed(1)} KB`)
    console.log(`   Savings: ${savings}%`)

    return NextResponse.json({
      success: true,
      item,
      cached: false,
      originalSize,
      optimizedSize: processed.length,
      savings: `${savings}%`
    })

  } catch (error) {
    console.error('Media library upload error:', error)

    return NextResponse.json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint for status check
export async function GET() {
  return NextResponse.json({
    service: 'Media Library Upload API',
    status: 'active',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    categories: Object.keys(SIZE_PRESETS)
  })
}
