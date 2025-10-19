/**
 * Template Versions API Routes
 * POST /api/admin/templates/[templateId]/versions - Create new template version
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-utils'
import { z } from 'zod'

const CreateVersionSchema = z.object({
  manifestJson: z.any(),
  cssVarsJson: z.any().optional(),
  isPaid: z.boolean().default(false),
  priceCents: z.number().min(0).optional(),
  requiredPlan: z.enum(['FREE', 'STARTER', 'PRO']).optional(),
})

function incrementVersion(currentVersion: string): string {
  const parts = currentVersion.split('.')
  const patch = parseInt(parts[2] || '0') + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}

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

    const body = await request.json()
    const validatedData = CreateVersionSchema.parse(body)

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!template) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      }, { status: 404 })
    }

    // Get next version number
    const latestVersion = template.versions[0]
    const nextVersion = latestVersion ? incrementVersion(latestVersion.version) : '1.0.0'

    // Create new version in a transaction
    const newVersion = await db.$transaction(async (tx) => {
      // Deactivate current active version
      if (latestVersion?.isActive) {
        await tx.templateVersion.update({
          where: { id: latestVersion.id },
          data: { isActive: false },
        })
      }

      // Create new version
      return tx.templateVersion.create({
        data: {
          templateId,
          version: nextVersion,
          manifestJson: validatedData.manifestJson,
          cssVarsJson: validatedData.cssVarsJson || {},
          isPaid: validatedData.isPaid,
          priceCents: validatedData.priceCents || 0,
          requiredPlan: validatedData.requiredPlan || 'FREE',
          isActive: true,
        },
      })
    })

    const response = {
      id: newVersion.id,
      version: newVersion.version,
      manifestJson: newVersion.manifestJson,
      cssVarsJson: newVersion.cssVarsJson,
      isPaid: newVersion.isPaid,
      priceCents: newVersion.priceCents,
      requiredPlan: newVersion.requiredPlan,
      isActive: newVersion.isActive,
      createdAt: newVersion.createdAt,
    }

    return NextResponse.json({
      success: true,
      data: response,
    }, { status: 201 })

  } catch (error) {
    console.error('Create template version API error:', error)
    
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
        message: 'Failed to create template version',
      },
    }, { status: 500 })
  }
}