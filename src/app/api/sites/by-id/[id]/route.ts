/**
 * Site Data API Routes (By ID)
 * GET: Fetch site data by ID for editing (more secure than handle)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const site = await prisma.userSite.findUnique({
      where: { id: resolvedParams.id },
      include: {
        templateVersion: {
          include: {
            template: true
          }
        }
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Check if user owns this site
    if (site.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      site
    })

  } catch (error) {
    console.error('Site fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    )
  }
}
