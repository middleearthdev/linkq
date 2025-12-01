/**
 * Admin Template Import API
 * POST /api/admin/templates/import - Import template from JSON file
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { z } from 'zod'

const ImportTemplateSchema = z.object({
  exportVersion: z.string(),
  exportedAt: z.string(),
  exportedBy: z.string().optional(),
  template: z.object({
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.string(),
    creator: z.string(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    thumbnail: z.string().optional().nullable(),
  }),
  versions: z.array(z.object({
    version: z.string(),
    manifestJson: z.any(),
    cssVarsJson: z.any(),
    isPaid: z.boolean(),
    priceCents: z.number(),
    requiredPlan: z.string(),
    isActive: z.boolean(),
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
  })),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Security: Check admin access
    const user = await getSessionUser()

    if (!user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const importData = ImportTemplateSchema.parse(body)

    // Check if slug is already taken
    const existingTemplate = await db.template.findUnique({
      where: { slug: importData.template.slug },
    })

    if (existingTemplate) {
      // Generate unique slug
      let newSlug = `${importData.template.slug}-imported`
      let counter = 1

      while (await db.template.findUnique({ where: { slug: newSlug } })) {
        newSlug = `${importData.template.slug}-imported-${counter}`
        counter++
      }

      importData.template.slug = newSlug
    }

    // Create template
    const newTemplate = await db.template.create({
      data: {
        slug: importData.template.slug,
        name: importData.template.name,
        description: importData.template.description,
        category: importData.template.category,
        creator: importData.template.creator,
        status: 'DRAFT', // Always import as draft for safety
        thumbnail: importData.template.thumbnail,
      },
    })

    // Create versions
    const versions = await Promise.all(
      importData.versions.map((version) =>
        db.templateVersion.create({
          data: {
            templateId: newTemplate.id,
            version: version.version,
            manifestJson: version.manifestJson as any,
            cssVarsJson: version.cssVarsJson as any,
            isPaid: version.isPaid,
            priceCents: version.priceCents,
            requiredPlan: version.requiredPlan as any,
            isActive: version.isActive,
            publishedAt: version.publishedAt ? new Date(version.publishedAt) : null,
          },
        })
      )
    )

    // Create tags if provided
    if (importData.tags && importData.tags.length > 0) {
      for (const tagName of importData.tags) {
        // Find or create tag
        let tag = await db.tag.findUnique({
          where: { name: tagName },
        })

        if (!tag) {
          tag = await db.tag.create({
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
            },
          })
        }

        // Connect tag to template
        await db.templateTag.create({
          data: {
            templateId: newTemplate.id,
            tagId: tag.id,
          },
        })
      }
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
      message: `Template imported successfully as "${newTemplate.name}"`,
      imported: {
        versionsCount: versions.length,
        tagsCount: importData.tags?.length || 0,
      },
    })

  } catch (error) {
    console.error('Import template API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid import data format',
          details: error.issues,
        },
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to import template',
      },
    }, { status: 500 })
  }
}
