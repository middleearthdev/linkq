/**
 * Admin Template Duplication API
 * POST /api/admin/templates/[templateId]/duplicate - Duplicate template with active version
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'

export async function POST(
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

    // Get original template with active version
    const originalTemplate = await db.template.findUnique({
      where: { id: templateId },
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
        },
      },
    })

    if (!originalTemplate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      }, { status: 404 })
    }

    // Generate unique slug for duplicate
    let newSlug = `${originalTemplate.slug}-copy`
    let counter = 1

    while (await db.template.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${originalTemplate.slug}-copy-${counter}`
      counter++
    }

    // Create new template
    const newTemplate = await db.template.create({
      data: {
        slug: newSlug,
        name: `${originalTemplate.name} (Copy)`,
        description: originalTemplate.description,
        category: originalTemplate.category,
        creator: originalTemplate.creator,
        status: 'DRAFT', // Always create duplicates as drafts
        thumbnail: originalTemplate.thumbnail,
      },
    })

    // Copy active version if exists
    if (originalTemplate.versions.length > 0) {
      const activeVersion = originalTemplate.versions[0]

      await db.templateVersion.create({
        data: {
          templateId: newTemplate.id,
          version: '1.0.0', // Start from v1.0.0
          manifestJson: activeVersion.manifestJson as any,
          cssVarsJson: activeVersion.cssVarsJson as any,
          isPaid: activeVersion.isPaid,
          priceCents: activeVersion.priceCents,
          requiredPlan: activeVersion.requiredPlan,
          isActive: true,
        },
      })
    }

    // Fetch complete template with versions
    const completeTemplate = await db.template.findUnique({
      where: { id: newTemplate.id },
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
        },
        _count: {
          select: {
            versions: true,
            purchases: true,
          },
        },
      },
    })

    const activeVersion = completeTemplate?.versions[0]

    const response = {
      id: completeTemplate!.id,
      slug: completeTemplate!.slug,
      name: completeTemplate!.name,
      description: completeTemplate!.description,
      category: completeTemplate!.category,
      creator: completeTemplate!.creator,
      status: completeTemplate!.status,
      thumbnail: completeTemplate!.thumbnail,
      createdAt: completeTemplate!.createdAt,
      updatedAt: completeTemplate!.updatedAt,
      _count: completeTemplate!._count,
      activeVersion: activeVersion ? {
        id: activeVersion.id,
        version: activeVersion.version,
        isPaid: activeVersion.isPaid,
        priceCents: activeVersion.priceCents,
        requiredPlan: activeVersion.requiredPlan,
      } : null,
    }

    return NextResponse.json({
      success: true,
      data: response,
      message: `Template duplicated successfully as "${newTemplate.name}"`,
    })

  } catch (error) {
    console.error('Duplicate template API error:', error)

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to duplicate template',
      },
    }, { status: 500 })
  }
}
