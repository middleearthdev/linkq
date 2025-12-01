/**
 * Admin Template Export API
 * GET /api/admin/templates/[templateId]/export - Export template as JSON
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params

    // Security: Check admin access
    const user = await getSessionUser()

    if (!user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    // Get template with all versions
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      }, { status: 404 })
    }

    // Create export data structure
    const exportData = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: user.email,
      template: {
        slug: template.slug,
        name: template.name,
        description: template.description,
        category: template.category,
        creator: template.creator,
        status: template.status,
        thumbnail: template.thumbnail,
      },
      versions: template.versions.map((version) => ({
        version: version.version,
        manifestJson: version.manifestJson,
        cssVarsJson: version.cssVarsJson,
        isPaid: version.isPaid,
        priceCents: version.priceCents,
        requiredPlan: version.requiredPlan,
        isActive: version.isActive,
        publishedAt: version.publishedAt,
        createdAt: version.createdAt,
      })),
      tags: template.tags.map((tagRelation) => tagRelation.tag.name),
    }

    // Return as downloadable JSON file
    const filename = `template-${template.slug}-${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Export template API error:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to export template',
      },
    }, { status: 500 })
  }
}
