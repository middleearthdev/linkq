/**
 * Template Switching API
 * POST /api/sites/[handle]/template - Switch site template
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import {
  getTemplateManifest,
  canUserAccessTemplate
} from '@/lib/template-registry'
import { UserEntitlements } from '@/types/template'

interface TemplateSwitchRequest {
  templateVersionId: string
  preserveData?: boolean
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { handle } = await params
    const body: TemplateSwitchRequest = await request.json()
    const { templateVersionId, preserveData = true } = body

    // Get current site by handle
    const site = await db.userSite.findFirst({
      where: {
        handle: handle,
        userId: user.id
      },
      include: {
        templateVersion: {
          include: {
            template: true
          }
        }
      }
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    console.log(templateVersionId)
    // Get target template version
    const targetTemplateVersion = await db.templateVersion.findFirst({
      where: {
        id: templateVersionId,
        isActive: true
      },
      include: {
        template: true
      }
    })

    if (!targetTemplateVersion) {
      return NextResponse.json({ error: 'Template version not found' }, { status: 404 })
    }

    // Check user entitlements
    const userEntitlements: UserEntitlements = {
      plan: user.plan as any,
      planExpiry: user.planExpiry || undefined,
      purchasedTemplates: await getUserPurchasedTemplates(user.id),
      features: getUserFeatures(user.plan),
      limits: getUserLimits(user.plan)
    }

    // Get template manifests for migration and access check
    const currentManifest = await getTemplateManifest(site.templateVersion.template.slug)
    const targetManifest = await getTemplateManifest(targetTemplateVersion.template.slug)

    if (!targetManifest) {
      return NextResponse.json({ error: 'Target template manifest not found' }, { status: 404 })
    }

    const accessCheck = canUserAccessTemplate(targetManifest, userEntitlements)
    if (!accessCheck.canAccess) {
      return NextResponse.json({
        error: 'Access denied',
        reason: accessCheck.reason,
        needsUpgrade: accessCheck.needsUpgrade
      }, { status: 403 })
    }

    // Perform data migration if needed
    let migratedData = site.dataJson as any

    if (preserveData && currentManifest) {
      migratedData = await migrateTemplateData(
        site.dataJson as any,
        currentManifest,
        targetManifest,
        `${site.templateVersion.template.slug}-v1`,
        `${targetTemplateVersion.template.slug}-v1`
      )
    } else {
      // Use default data from target template
      migratedData = generateDefaultSiteData(targetManifest)
    }

    // Update site with new template
    const updatedSite = await db.userSite.update({
      where: { id: site.id },
      data: {
        templateVersionId: targetTemplateVersion.id,
        dataJson: migratedData,
        updatedAt: new Date()
      },
      include: {
        templateVersion: {
          include: {
            template: true
          }
        }
      }
    })

    // Log template switch for analytics
    await logTemplateSwitchEvent(user.id, site.id, site.templateVersionId, templateVersionId)

    return NextResponse.json({
      success: true,
      site: {
        id: updatedSite.id,
        handle: updatedSite.handle,
        templateVersionId: updatedSite.templateVersionId,
        dataJson: updatedSite.dataJson,
        templateName: updatedSite.templateVersion.template.name
      },
      migration: {
        preservedData: preserveData,
        migratedBlocks: migratedData.blocks?.length || 0
      }
    })

  } catch (error) {
    console.error('Template switch error:', error)
    return NextResponse.json(
      { error: 'Failed to switch template' },
      { status: 500 }
    )
  }
}

// Helper Functions
async function getUserPurchasedTemplates(userId: string): Promise<string[]> {
  const purchases = await db.userTemplatePurchase.findMany({
    where: {
      userId,
      status: 'COMPLETED'
    },
    select: {
      templateId: true
    }
  })

  return purchases.map(p => p.templateId)
}

function getUserFeatures(plan: string): string[] {
  const features: Record<string, string[]> = {
    FREE: ['basic-templates'],
    STARTER: ['basic-templates', 'premium-templates', 'analytics'],
    PRO: ['basic-templates', 'premium-templates', 'analytics', 'custom-domain', 'remove-branding', 'custom-css']
  }
  return features[plan] || features.FREE
}

function getUserLimits(plan: string) {
  const limits: Record<string, any> = {
    FREE: { sites: 1, linksPerSite: 5, customBlocks: 0, customDomains: 0 },
    STARTER: { sites: 3, linksPerSite: 20, customBlocks: 2, customDomains: 0 },
    PRO: { sites: 10, linksPerSite: 100, customBlocks: 10, customDomains: 3 }
  }
  return limits[plan] || limits.FREE
}

async function migrateTemplateData(
  currentData: any,
  currentManifest: any,
  targetManifest: any,
  fromTemplateId: string,
  toTemplateId: string
): Promise<any> {
  // Simple data migration without complex rules
  const migratedData = {
    blocks: [] as any[],
    meta: {
      ...currentData.meta,
      theme: { ...targetManifest.defaults.tokens } // Apply new theme
    }
  }

  // Migrate blocks - keep compatible blocks, apply new default props for supported blocks
  if (currentData.blocks && Array.isArray(currentData.blocks)) {
    for (const block of currentData.blocks) {
      const migratedBlock = migrateBlockSimple(block, targetManifest)
      if (migratedBlock) {
        migratedData.blocks.push(migratedBlock)
      }
    }
  }

  // Add default blocks if they don't exist
  for (const blockType of targetManifest.allowedBlocks) {
    const hasBlock = migratedData.blocks.some((b: any) => b.type === blockType)
    if (!hasBlock && targetManifest.defaults.blockProps[blockType]) {
      migratedData.blocks.push({
        id: generateBlockId(),
        type: blockType,
        props: { ...targetManifest.defaults.blockProps[blockType] }
      })
    }
  }

  return migratedData
}

function migrateBlockSimple(block: any, targetManifest: any): any | null {
  // Check if block type is allowed in target template
  if (!targetManifest.allowedBlocks.includes(block.type)) {
    return null // Block not supported, skip it
  }

  // Apply default props from target template - template props take priority
  const defaultProps = targetManifest.defaults.blockProps[block.type] || {}

  // Preserve important user data that shouldn't be overwritten by template defaults
  const preservedUserData: Record<string, string[]> = {
    bio: ['avatar', 'name', 'bio'], // Keep user's personal info
    links: ['items'], // Keep user's links
    // Add other block types as needed
  }

  const userDataToPreserve = preservedUserData[block.type] || []
  const preservedProps: any = {}
  
  // Extract user data that should be preserved
  userDataToPreserve.forEach(key => {
    if (block.props[key] !== undefined && block.props[key] !== null && block.props[key] !== '') {
      preservedProps[key] = block.props[key]
    }
  })

  return {
    ...block,
    props: {
      ...block.props,      // User's current props as base
      ...defaultProps,     // Template props override user props
      ...preservedProps    // But preserve important user data
    }
  }
}

function generateDefaultSiteData(manifest: any): any {
  const blocks: any[] = []

  // Create default blocks based on manifest
  for (const blockType of manifest.allowedBlocks) {
    if (manifest.defaults.blockProps[blockType]) {
      blocks.push({
        id: generateBlockId(),
        type: blockType,
        props: { ...manifest.defaults.blockProps[blockType] }
      })
    }
  }

  return {
    blocks,
    meta: {
      title: manifest.defaults.meta?.title || 'My Links',
      description: manifest.defaults.meta?.description || 'All my links in one place',
      theme: { ...manifest.defaults.tokens }
    }
  }
}

function generateBlockId(): string {
  return Math.random().toString(36).substring(2, 11)
}

async function logTemplateSwitchEvent(
  userId: string,
  siteId: string,
  fromTemplateId: string,
  toTemplateId: string
) {
  try {
    // Log the template switch event for analytics
    // This could be stored in a separate analytics table
    console.log('Template switch:', {
      userId,
      siteId,
      fromTemplateId,
      toTemplateId,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Failed to log template switch event:', error)
  }
}