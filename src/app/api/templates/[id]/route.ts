/**
 * Template Detail API Routes
 * GET /api/templates/[id] - Get template details by ID or slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    const template = await db.template.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
        status: 'PUBLISHED',
      },
      include: {
        versions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!template) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found',
        },
      }, { status: 404 })
    }

    const latestVersion = template.versions[0]

    const response = {
      id: template.id,
      slug: template.slug,
      name: template.name,
      description: template.description,
      category: template.category,
      creator: template.creator,
      revenueShare: template.revenueShare,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      thumbnail: `/templates/${template.slug}-preview.jpg`,
      currentVersion: latestVersion ? {
        id: latestVersion.id,
        version: latestVersion.version,
        manifest: latestVersion.manifestJson,
        cssVars: latestVersion.cssVarsJson,
        isPaid: latestVersion.isPaid,
        priceCents: latestVersion.priceCents,
        requiredPlan: latestVersion.requiredPlan,
        publishedAt: latestVersion.publishedAt,
      } : null,
      allVersions: template.versions.map(version => ({
        id: version.id,
        version: version.version,
        isPaid: version.isPaid,
        priceCents: version.priceCents,
        requiredPlan: version.requiredPlan,
        publishedAt: version.publishedAt,
      })),
    }

    return NextResponse.json({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Template detail API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch template details',
      },
    }, { status: 500 })
  }
}