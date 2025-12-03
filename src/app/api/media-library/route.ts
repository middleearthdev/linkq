/**
 * Media Library List API
 * Get user's uploaded media with filtering and pagination
 *
 * Based on: MEDIA_LIBRARY_CONTEXT.md
 * GET /api/media-library
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse query params
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const unused = searchParams.get('unused') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 3. Build where clause
    const where: any = {
      userId: user.id
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (unused) {
      where.usageCount = 0
    }

    // 4. Get items with pagination
    const [items, total] = await Promise.all([
      prisma.mediaLibrary.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.mediaLibrary.count({ where })
    ])

    // 5. Calculate total size
    const totalSize = items.reduce((sum, item) => sum + item.size, 0)

    return NextResponse.json({
      success: true,
      items,
      total,
      totalSize,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Media library fetch error:', error)

    return NextResponse.json({
      error: 'Failed to fetch media library',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
