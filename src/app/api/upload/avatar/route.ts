/**
 * Avatar Upload API Route
 * Handles file uploads to DigitalOcean Spaces
 */

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getCurrentUser } from '@/lib/auth-server'

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "linkq-assets"
const REGION = process.env.DO_SPACES_REGION || "sgp1"
const CDN_ENDPOINT = process.env.DO_SPACES_CDN || `https://${BUCKET_NAME}.${REGION}.cdn.digitaloceanspaces.com`

const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: `https://${REGION}.digitaloceanspaces.com`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || ""
  }
})

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
      console.error('Missing DigitalOcean Spaces credentials')
      return NextResponse.json({
        error: 'Server configuration error: Missing storage credentials'
      }, { status: 500 })
    }

    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'avatars'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${extension}`
    const key = `${folder}/${user.id}/${filename}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to DigitalOcean Spaces
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
      Metadata: {
        'uploaded-by': user.id,
        'original-name': file.name
      }
    })

    await s3Client.send(uploadCommand)

    return NextResponse.json({
      success: true,
      url: `${CDN_ENDPOINT}/${key}`,
      key,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30