import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

/**
 * Video Background Upload API
 * Handles video background uploads to DigitalOcean Spaces (or AWS S3)
 *
 * POST /api/upload/video
 * Body: FormData with 'file' field
 * Returns: { url: string, poster?: string }
 */

// Initialize S3 client (compatible with DigitalOcean Spaces)
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || 'linkq'
const CDN_URL = process.env.DO_SPACES_CDN_URL || `https://${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com`

// Allowed video types
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB (reasonable for background videos)

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'mp4'
    const filename = `videos/backgrounds/${nanoid()}.${ext}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3/Spaces
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
        // Cache control for better performance
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )

    // Generate CDN URL
    const url = `${CDN_URL}/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
      duration: null, // Could be extracted with ffmpeg if needed
    })
  } catch (error) {
    console.error('Video upload error:', error)

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    service: 'Video Background Upload API',
    status: 'active',
    allowedTypes: ALLOWED_TYPES,
    maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    endpoint: process.env.DO_SPACES_ENDPOINT || 'not configured',
    recommendations: {
      format: 'MP4 (H.264)',
      resolution: '1920x1080 or lower',
      duration: '10-30 seconds (looped)',
      bitrate: '2-5 Mbps',
    }
  })
}
