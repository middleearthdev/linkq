/**
 * Dashboard Sites API Routes
 * GET /api/dashboard/sites - List user's sites
 * POST /api/dashboard/sites - Create new site
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const CreateSiteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  handle: z.string().min(3, 'Handle must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, underscores, and hyphens'),
  description: z.string().optional(),
  templateId: z.string().min(1, 'Template is required'),
})

export async function GET(request: NextRequest) {
  try {
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

    // Get user's sites
    const sites = await db.userSite.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        templateVersion: {
          include: {
            template: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            analytics: true,
          },
        },
      },
    })

    const formattedSites = sites.map(site => ({
      id: site.id,
      title: site.title,
      handle: site.handle,
      description: site.description,
      status: site.status,
      customDomain: site.customDomain,
      template: {
        name: site.templateVersion.template.name,
        slug: site.templateVersion.template.slug,
      },
      views: site._count.analytics,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      publishedAt: site.publishedAt,
    }))

    return NextResponse.json({
      success: true,
      data: { sites: formattedSites },
    })

  } catch (error) {
    console.error('Dashboard sites API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch sites',
      },
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const validatedData = CreateSiteSchema.parse(body)

    // Check if handle is already taken
    const existingHandle = await db.userSite.findUnique({
      where: { handle: validatedData.handle },
    })

    if (existingHandle) {
      return NextResponse.json({
        success: false,
        error: { code: 'HANDLE_TAKEN', message: 'Handle is already taken' },
      }, { status: 400 })
    }

    // Get template version
    const template = await db.template.findUnique({
      where: { id: validatedData.templateId },
      include: {
        versions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!template || !template.versions[0]) {
      return NextResponse.json({
        success: false,
        error: { code: 'TEMPLATE_NOT_FOUND', message: 'Template not found' },
      }, { status: 404 })
    }

    const templateVersion = template.versions[0]

    // Create initial site data
    const initialData = {
      title: validatedData.title,
      description: validatedData.description,
      blocks: [
        {
          id: 'bio-1',
          type: 'bio',
          props: {
            name: session.user.name || 'Your Name',
            bio: 'Welcome to my bio link page!',
            avatar: '',
          },
          visible: true,
        },
      ],
    }

    // Create site
    const site = await db.userSite.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        handle: validatedData.handle,
        description: validatedData.description,
        templateVersionId: templateVersion.id,
        dataJson: initialData,
        status: 'DRAFT',
      },
      include: {
        templateVersion: {
          include: {
            template: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    const response = {
      id: site.id,
      title: site.title,
      handle: site.handle,
      description: site.description,
      status: site.status,
      template: {
        name: site.templateVersion.template.name,
        slug: site.templateVersion.template.slug,
      },
      createdAt: site.createdAt,
    }

    return NextResponse.json({
      success: true,
      data: response,
    }, { status: 201 })

  } catch (error) {
    console.error('Create site API error:', error)
    
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
        message: 'Failed to create site',
      },
    }, { status: 500 })
  }
}