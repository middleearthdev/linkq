/**
 * Block Schema API Routes
 * GET /api/blocks/schema/[type] - Get block schema by type
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params

    const blockDefinition = await db.blockDefinition.findUnique({
      where: { type },
    })

    if (!blockDefinition) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Block type not found',
        },
      }, { status: 404 })
    }

    const response = {
      type: blockDefinition.type,
      name: blockDefinition.name,
      description: blockDefinition.description,
      category: blockDefinition.category,
      schema: blockDefinition.schemaJson,
      defaultProps: blockDefinition.defaultProps,
      isPremium: blockDefinition.isPremium,
      requiredPlan: blockDefinition.requiredPlan,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })

  } catch (error) {
    console.error('Block schema API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch block schema',
      },
    }, { status: 500 })
  }
}