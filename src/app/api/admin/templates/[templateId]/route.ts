/**
 * Admin Template Detail API Routes
 * GET /api/admin/templates/[templateId] - Get template details
 * PUT /api/admin/templates/[templateId] - Update template
 * DELETE /api/admin/templates/[templateId] - Delete template
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const UpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(['free', 'premium', 'pro']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  creator: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.email !== 'admin@linkq.app') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    // Get template with all versions
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            versions: true,
            purchases: true,
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

    const activeVersion = template.versions.find((v: any) => v.isActive)

    const response = {
      id: template.id,
      slug: template.slug,
      name: template.name,
      description: template.description,
      category: template.category,
      creator: template.creator,
      status: template.status,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      _count: template._count,
      activeVersion: activeVersion ? {
        id: activeVersion.id,
        version: activeVersion.version,
        manifestJson: activeVersion.manifestJson,
        cssVarsJson: activeVersion.cssVarsJson,
        isPaid: activeVersion.isPaid,
        priceCents: activeVersion.priceCents,
        requiredPlan: activeVersion.requiredPlan,
        publishedAt: activeVersion.publishedAt,
      } : null,
      versions: template.versions.map((version: any) => ({
        id: version.id,
        version: version.version,
        isPaid: version.isPaid,
        priceCents: version.priceCents,
        requiredPlan: version.requiredPlan,
        isActive: version.isActive,
        createdAt: version.createdAt,
        publishedAt: version.publishedAt,
      })),
    }

    return NextResponse.json({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Get template API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch template',
      },
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.email !== 'admin@linkq.app') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = UpdateTemplateSchema.parse(body)

    // Check if template exists
    const existingTemplate = await db.template.findUnique({
      where: { id: templateId },
    })

    if (!existingTemplate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      }, { status: 404 })
    }

    // If slug is being updated, check if it's available
    if (validatedData.slug && validatedData.slug !== existingTemplate.slug) {
      const slugTaken = await db.template.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugTaken) {
        return NextResponse.json({
          success: false,
          error: { code: 'SLUG_TAKEN', message: 'Template slug is already taken' },
        }, { status: 400 })
      }
    }

    // Update template
    const updatedTemplate = await db.template.update({
      where: { id: templateId },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.slug && { slug: validatedData.slug }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.creator && { creator: validatedData.creator }),
      },
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
        },
      },
    })

    const response = {
      id: updatedTemplate.id,
      slug: updatedTemplate.slug,
      name: updatedTemplate.name,
      description: updatedTemplate.description,
      category: updatedTemplate.category,
      creator: updatedTemplate.creator,
      status: updatedTemplate.status,
      updatedAt: updatedTemplate.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Update template API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues,
        },
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update template',
      },
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.email !== 'admin@linkq.app') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        _count: {
          select: {
            purchases: true,
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

    // Check if template is in use
    if (template._count.purchases > 0) {
      return NextResponse.json({
        success: false,
        error: { 
          code: 'TEMPLATE_IN_USE', 
          message: `Cannot delete template. It has ${template._count.purchases} purchases.` 
        },
      }, { status: 400 })
    }

    // Delete template versions first
    await db.templateVersion.deleteMany({
      where: { templateId: templateId },
    })

    // Delete template
    await db.template.delete({
      where: { id: templateId },
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    })

  } catch (error) {
    console.error('Delete template API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete template',
      },
    }, { status: 500 })
  }
}