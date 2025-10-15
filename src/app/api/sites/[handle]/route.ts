/**
 * Site Data API Routes
 * GET: Fetch site data for editing
 * PATCH: Update site content
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
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
      where: { handle: resolvedParams.handle },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
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

    const body = await request.json()
    const { dataJson, title, description, status } = body

    // Find site by handle or ID and verify ownership
    const resolvedParams = await params
    const site = await prisma.userSite.findFirst({
      where: {
        OR: [
          { handle: resolvedParams.handle },
          { id: resolvedParams.handle } // Support both handle and ID
        ]
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Update site data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (dataJson) updateData.dataJson = dataJson
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (status) updateData.status = status

    const updatedSite = await prisma.userSite.update({
      where: { id: site.id },
      data: updateData,
      include: {
        templateVersion: {
          include: {
            template: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      site: updatedSite
    })

  } catch (error) {
    console.error('Site update error:', error)
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    )
  }
}