/**
 * Site Creation API Route
 * Handles creating new bio link sites with template and handle validation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getPlanLimits } from '@/lib/utils'

export async function POST(request: NextRequest) {
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
    const { handle, templateSlug = 'minimal' } = body

    // Validate handle format
    if (!handle || !/^[a-zA-Z0-9_-]+$/.test(handle) || handle.length < 3 || handle.length > 30) {
      return NextResponse.json(
        { error: 'Handle must be 3-30 characters and contain only letters, numbers, hyphens, and underscores' },
        { status: 400 }
      )
    }

    // Check if handle is already taken
    const existingSite = await prisma.userSite.findUnique({
      where: { handle }
    })

    if (existingSite) {
      return NextResponse.json(
        { error: 'This handle is already taken' },
        { status: 409 }
      )
    }

    // Check user's plan limits
    const userPlan = (session.user as any)?.plan || 'FREE'
    const limits = getPlanLimits(userPlan as 'FREE' | 'STARTER' | 'PRO')
    
    // Count user's current sites
    const currentSiteCount = await prisma.userSite.count({
      where: { userId: session.user.id }
    })
    
    // Check if user can create more sites
    if (currentSiteCount >= limits.maxSites) {
      return NextResponse.json(
        { 
          error: 'Site limit reached', 
          message: `You've reached your ${userPlan} plan limit of ${limits.maxSites} sites. Upgrade to create more sites.`,
          currentCount: currentSiteCount,
          maxAllowed: limits.maxSites,
          plan: userPlan
        },
        { status: 403 }
      )
    }

    // Get template version
    const template = await prisma.template.findUnique({
      where: { slug: templateSlug },
      include: {
        versions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!template || template.versions.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const templateVersion = template.versions[0]

    // Check if user has access to this template
    if (templateVersion.isPaid && !templateVersion.requiredPlan) {
      // TODO: Check if user has purchased this template
    }

    if (templateVersion.requiredPlan) {
      // TODO: Check if user plan meets requirement
    }

    // Create default site data based on template
    const defaultSiteData = {
      blocks: [
        {
          id: 'bio-1',
          type: 'bio',
          props: {
            name: session.user.name || 'Your Name',
            bio: 'Add your bio here',
            avatar: session.user.image || null,
            showAvatar: true
          }
        },
        {
          id: 'links-1',
          type: 'link-list',
          props: {
            items: [
              {
                id: 'link-1',
                title: 'My Website',
                url: 'https://yoursite.com',
                style: 'pill'
              }
            ]
          }
        },
        {
          id: 'social-1',
          type: 'social-icons',
          props: {
            items: []
          }
        }
      ],
      meta: {
        title: `${session.user.name || 'Your Name'} | Bio Link`,
        description: 'My bio link page',
        theme: templateVersion.cssVarsJson
      }
    }

    // Create the site
    const site = await prisma.userSite.create({
      data: {
        userId: session.user.id,
        handle,
        templateVersionId: templateVersion.id,
        dataJson: defaultSiteData,
        title: `${session.user.name || 'Your Name'} | Bio Link`,
        description: 'My bio link page',
        status: 'DRAFT'
      }
    })

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        handle: site.handle,
        status: site.status,
        editUrl: `/editor/${site.handle}`,
        previewUrl: `/${site.handle}`
      }
    })

  } catch (error) {
    console.error('Site creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}