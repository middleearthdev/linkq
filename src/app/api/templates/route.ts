/**
 * Template API Routes
 * GET /api/templates - List available templates
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { canUserAccessTemplate, generateTemplatePreviewData } from '@/lib/template-registry'
import { TemplateListResponse, TemplatePreview } from '@/types/template'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    // Get templates from database
    const templates = await db.template.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category && { category })
      },
      include: {
        versions: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Get user's purchased templates if user is logged in
    const purchasedTemplates = user ? await db.userTemplatePurchase.findMany({
      where: { userId: user.id, status: 'COMPLETED' },
      select: { templateId: true }
    }) : []

    // Get user entitlements
    const userEntitlements = user ? {
      plan: user.plan || 'FREE',
      planExpiry: user.planExpiry,
      purchasedTemplates: purchasedTemplates.map(p => p.templateId),
      features: getUserFeatures(user.plan || 'FREE'),
      limits: getUserLimits(user.plan || 'FREE')
    } : null

    // Transform to preview format
    const templatePreviews: TemplatePreview[] = templates.map(template => {
      const version = template.versions[0]
      if (!version) return null

      const manifest = version.manifestJson as any
      const accessCheck = userEntitlements
        ? canUserAccessTemplate(manifest, userEntitlements)
        : { canAccess: !version.isPaid && (!version.requiredPlan || version.requiredPlan === 'FREE'), needsUpgrade: false }

      return {
        id: template.id,
        slug: template.slug,
        name: template.name,
        description: template.description || '',
        thumbnail: template.thumbnail || '',
        category: (template.category as 'free' | 'premium' | 'pro') || 'free',

        isPaid: version.isPaid,
        priceCents: version.priceCents || undefined,
        requiredPlan: version.requiredPlan || undefined,

        previewData: generateTemplatePreviewData(manifest),
        features: getTemplateFeatures(manifest),

        isOwned: userEntitlements?.purchasedTemplates.includes(template.id) || false,
        canAccess: accessCheck.canAccess,
        needsUpgrade: accessCheck.needsUpgrade || false
      }
    }).filter(Boolean) as TemplatePreview[]

    // Get categories
    const categories = await db.template.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true }
    })

    // Get featured templates from database (mark them as featured in the database)
    const featuredTemplates = await db.template.findMany({
      where: {
        status: 'PUBLISHED',
        category: { in: ['free', 'premium'] } // Show free and premium as featured
      },
      take: 3,
      orderBy: { createdAt: 'asc' } // Show oldest (most stable) templates first
    })

    const response: TemplateListResponse = {
      templates: featured
        ? templatePreviews.filter(t => featuredTemplates.some(ft => ft.slug === t.slug))
        : templatePreviews,
      categories: categories.map(cat => ({
        id: cat.category || 'uncategorized',
        name: formatCategoryName(cat.category || 'uncategorized'),
        count: cat._count.category
      })),
      featured: featuredTemplates.map(t => t.slug)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Template list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// Helper functions
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


function getTemplateFeatures(manifest: any): string[] {
  if (!manifest) return []

  const features = ['Responsive Design', 'Mobile Optimized']

  if (manifest.allowedBlocks?.includes('gallery')) {
    features.push('Image Gallery')
  }

  if (manifest.allowedBlocks?.includes('analytics')) {
    features.push('Analytics Dashboard')
  }

  if (manifest.defaults?.tokens?.['--backdrop-blur']) {
    features.push('Glassmorphism Effects')
  }

  if (manifest.requiredFeatures?.includes('custom-domain')) {
    features.push('Custom Domain')
  }

  return features
}

function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    free: 'Free Templates',
    premium: 'Premium Templates',
    pro: 'Pro Templates',
    uncategorized: 'Other'
  }
  return names[category] || category
}