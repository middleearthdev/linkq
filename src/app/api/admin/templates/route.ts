/**
 * Admin Templates API Routes
 * GET /api/admin/templates - List all templates for admin
 * POST /api/admin/templates - Create new template
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { z } from 'zod'

const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['free', 'premium', 'pro']),
  creator: z.string().optional(),
  manifestJson: z.any(),
  cssVarsJson: z.any().optional(),
  isPaid: z.boolean().default(false),
  priceCents: z.number().min(0).optional(),
  requiredPlan: z.enum(['FREE', 'STARTER', 'PRO']).optional(),
})

// Add better error logging
function logValidationError(error: z.ZodError, body: any) {
  console.error('Validation failed for template creation:')
  console.error('Received data:', JSON.stringify(body, null, 2))
  console.error('Validation errors:', error.issues)
}

export async function GET(request: NextRequest) {
  try {
    // Get user with fresh DB check
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (category && category !== 'all') {
      where.category = category
    }

    // Get templates with counts
    const [templates, total] = await Promise.all([
      db.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          versions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              versions: true,
              purchases: true,
              tags: true,
            },
          },
        },
      }),
      db.template.count({ where }),
    ])

    const formattedTemplates = templates.map((template: any) => {
      const activeVersion = template.versions[0]
      
      return {
        id: template.id,
        slug: template.slug,
        name: template.name,
        description: template.description,
        category: template.category,
        creator: template.creator,
        status: template.status,
        isPaid: activeVersion?.isPaid || false,
        priceCents: activeVersion?.priceCents || 0,
        requiredPlan: activeVersion?.requiredPlan,
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
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        templates: formattedTemplates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + limit < total,
        },
      },
    })

  } catch (error) {
    console.error('Admin templates API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch templates',
      },
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user with fresh DB check
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      }, { status: 401 })
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      }, { status: 403 })
    }

    const body = await request.json()
    
    let validatedData
    try {
      validatedData = CreateTemplateSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        logValidationError(error, body)
      }
      throw error
    }

    // Check if slug is already taken
    const existingTemplate = await db.template.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingTemplate) {
      return NextResponse.json({
        success: false,
        error: { code: 'SLUG_TAKEN', message: 'Template slug is already taken' },
      }, { status: 400 })
    }

    // Create template and first version
    const template = await db.template.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        category: validatedData.category,
        creator: validatedData.creator || user.name || 'Admin',
        status: 'DRAFT',
        versions: {
          create: {
            version: '1.0.0',
            manifestJson: validatedData.manifestJson,
            cssVarsJson: validatedData.cssVarsJson || {},
            isPaid: validatedData.isPaid,
            priceCents: validatedData.priceCents || 0,
            requiredPlan: validatedData.requiredPlan || 'FREE',
            isActive: true,
          },
        },
      },
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
        },
      },
    })

    const response = {
      id: template.id,
      slug: template.slug,
      name: template.name,
      description: template.description,
      category: template.category,
      creator: template.creator,
      status: template.status,
      createdAt: template.createdAt,
      version: template.versions[0],
    }

    return NextResponse.json({
      success: true,
      data: response,
    }, { status: 201 })

  } catch (error) {
    console.error('Create template API error:', error)
    
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
        message: 'Failed to create template',
      },
    }, { status: 500 })
  }
}