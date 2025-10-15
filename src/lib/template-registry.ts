/**
 * Template Registry System (Database-Only)
 * All template manifests now stored in database
 */

import { TemplateManifest } from '@/types/template'
import { db } from '@/lib/db'

// Re-export block registry from components
export { BLOCK_REGISTRY, getBlockSchema } from '@/components/blocks/registry'

// Database-only template functions
export async function getTemplateManifest(templateId: string): Promise<TemplateManifest | null> {
  try {
    const templateVersion = await db.templateVersion.findFirst({
      where: { 
        template: { slug: templateId }, 
        isActive: true 
      },
      include: { 
        template: {
          select: {
            name: true,
            slug: true,
            description: true,
            category: true,
            status: true
          }
        }
      }
    })
    
    if (!templateVersion?.manifestJson) {
      return null
    }
    
    return templateVersion.manifestJson as unknown as TemplateManifest
  } catch (error) {
    console.error('Error fetching template manifest:', error)
    return null
  }
}

export async function getAllTemplateManifests(): Promise<Record<string, TemplateManifest>> {
  try {
    const templateVersions = await db.templateVersion.findMany({
      where: { 
        isActive: true,
        template: { status: 'PUBLISHED' }
      },
      include: { 
        template: {
          select: {
            slug: true,
            name: true,
            description: true,
            category: true,
            status: true
          }
        }
      }
    })
    
    const manifests: Record<string, TemplateManifest> = {}
    
    for (const version of templateVersions) {
      if (version.manifestJson && version.template.slug) {
        const key = `${version.template.slug}-v${version.version}`
        manifests[key] = version.manifestJson as unknown as TemplateManifest
      }
    }
    
    return manifests
  } catch (error) {
    console.error('Error fetching all template manifests:', error)
    return {}
  }
}

export async function getTemplatesByCategory(category?: string): Promise<any[]> {
  try {
    const where = {
      status: 'PUBLISHED' as const,
      ...(category && category !== 'all' ? { category } : {})
    }
    
    const templates = await db.template.findMany({
      where,
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    })
    
    return templates.filter(template => template.versions.length > 0)
  } catch (error) {
    console.error('Error fetching templates by category:', error)
    return []
  }
}

export async function getFeaturedTemplates(): Promise<string[]> {
  try {
    const featured = await db.template.findMany({
      where: { 
        status: 'PUBLISHED',
        category: { in: ['free', 'premium'] }
      },
      take: 3,
      orderBy: { createdAt: 'asc' },
      select: { slug: true }
    })
    
    return featured.map(t => t.slug)
  } catch (error) {
    console.error('Error fetching featured templates:', error)
    return []
  }
}

// Helper functions that can work with database data
export function validateBlockProps(blockType: string, props: any): { isValid: boolean; errors: string[] } {
  const { getBlockSchema } = require('@/components/blocks/registry')
  const schema = getBlockSchema(blockType)
  if (!schema) {
    return { isValid: false, errors: [`Unknown block type: ${blockType}`] }
  }
  
  const errors: string[] = []
  const required = schema.schema.required || []
  
  for (const field of required) {
    if (!(field in props) || props[field] === undefined || props[field] === '') {
      errors.push(`Field '${field}' is required`)
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

export function canUserAccessTemplate(manifest: TemplateManifest, userEntitlements: any): {
  canAccess: boolean
  needsUpgrade: boolean
  reason?: string
} {
  if (!manifest) {
    return { canAccess: false, needsUpgrade: false, reason: 'Template not found' }
  }
  
  // Check if template is paid
  if (manifest.isPaid) {
    const hasPurchased = userEntitlements.purchasedTemplates?.includes(manifest.name)
    if (!hasPurchased) {
      return { canAccess: false, needsUpgrade: true, reason: 'Template requires purchase' }
    }
  }
  
  // Check plan requirements
  if (manifest.requiredPlan && manifest.requiredPlan !== 'FREE') {
    const planLevels = { FREE: 0, STARTER: 1, PRO: 2 }
    const userLevel = planLevels[userEntitlements.plan as keyof typeof planLevels] || 0
    const requiredLevel = planLevels[manifest.requiredPlan as keyof typeof planLevels]
    
    if (userLevel < requiredLevel) {
      return { canAccess: false, needsUpgrade: true, reason: `Requires ${manifest.requiredPlan} plan` }
    }
  }
  
  return { canAccess: true, needsUpgrade: false }
}

// Template preview data generation (used by APIs)
export function generateTemplatePreviewData(manifest: TemplateManifest): any {
  if (!manifest) {
    return {
      id: 'preview',
      handle: 'preview',
      templateVersionId: 'preview',
      blocks: [],
      meta: { title: 'Preview', description: 'Template preview', theme: {} }
    }
  }

  const blocks: any[] = []
  const allowedBlocks = manifest.allowedBlocks || []
  const layoutBlocks = [
    ...(manifest.layout.header || []), 
    ...(manifest.layout.body || []), 
    ...(manifest.layout.footer || [])
  ]
  
  const blockProps = manifest.defaults?.blockProps || {}
  
  let blockId = 1
  for (const blockType of layoutBlocks) {
    if (allowedBlocks.includes(blockType)) {
      const props = blockProps[blockType] || {}
      
      if (blockType === 'bio') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'bio',
          props: {
            name: 'Your Name',
            bio: 'Your bio will appear here',
            showAvatar: props.showAvatar !== false,
            textAlign: props.textAlign || 'center',
            avatarSize: props.avatarSize || 'lg',
            avatarStyle: props.avatarStyle || 'circle',
            nameStyle: props.nameStyle || 'default',
            spacing: props.spacing || 'normal'
          }
        })
      } else if (blockType === 'link-list') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'link-list',
          props: {
            items: [
              { id: '1', title: 'Your Link', url: '#' },
              { id: '2', title: 'Another Link', url: '#' }
            ],
            style: props.style || 'pill',
            gap: props.gap || 'md'
          }
        })
      } else if (blockType === 'social-icons') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'social-icons',
          props: {
            platforms: [
              { platform: 'twitter', url: '#' },
              { platform: 'instagram', url: '#' }
            ],
            size: props.size || 'md',
            style: props.style || 'round'
          }
        })
      }
    }
  }

  return {
    id: 'preview',
    handle: 'preview', 
    templateVersionId: 'preview',
    blocks,
    meta: {
      title: manifest.defaults?.meta?.title || 'Preview',
      description: manifest.defaults?.meta?.description || 'Template preview',
      theme: manifest.defaults?.tokens || {}
    }
  }
}