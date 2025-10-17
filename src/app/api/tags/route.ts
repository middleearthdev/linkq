/**
 * Tags API Routes
 * GET /api/tags - List all available tags
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TagsResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const popular = searchParams.get('popular') === 'true'
    const search = searchParams.get('search')

    // Get tags from database
    const tags = await db.tag.findMany({
      where: {
        ...(category && { category }),
        ...(popular && { isPopular: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      orderBy: [
        { isPopular: 'desc' },
        { category: 'asc' },
        { sortOrder: 'asc' }
      ]
    })

    // Transform tags to response format
    const transformedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description || undefined,
      color: tag.color || undefined,
      icon: tag.icon || undefined,
      category: tag.category as 'industry' | 'style' | 'purpose' | 'audience' || undefined,
      isPopular: tag.isPopular,
      sortOrder: tag.sortOrder,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString()
    }))

    // Group tags by category
    const grouped = {
      industry: transformedTags.filter(tag => tag.category === 'industry'),
      style: transformedTags.filter(tag => tag.category === 'style'),
      purpose: transformedTags.filter(tag => tag.category === 'purpose'),
      audience: transformedTags.filter(tag => tag.category === 'audience')
    }

    // Get popular tags
    const popular_tags = transformedTags.filter(tag => tag.isPopular)

    const response: TagsResponse = {
      tags: transformedTags,
      grouped,
      popular: popular_tags
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Tags API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}