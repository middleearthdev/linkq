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
      } else if (blockType === 'gallery') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'gallery',
          props: {
            items: props.items || props.images || [
              { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400', caption: 'Gallery 1' },
              { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1506102383123-c8ef1e872756?w=400', caption: 'Gallery 2' },
              { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', caption: 'Gallery 3' },
              { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', caption: 'Gallery 4' }
            ],
            layout: props.layout || 'grid',
            columns: props.columns || 2,
            aspectRatio: props.aspectRatio || 'square',
            imageFilter: props.imageFilter || 'none',
            spacing: props.spacing || 'md',
            rounded: props.rounded || 'md',
            showCaptions: props.showCaptions !== false
          }
        })
      } else if (blockType === 'divider') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'divider',
          props: {
            style: props.style || 'solid',
            thickness: props.thickness || 1,
            color: props.color || '#e5e7eb',
            spacing: props.spacing || 'md',
            width: props.width || '100',
            alignment: props.alignment || 'center',
            icon: props.icon || 'none',
            animated: props.animated || false
          }
        })
      } else if (blockType === 'footer') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'footer',
          props: {
            copyrightText: props.copyrightText || '© 2024 Your Name',
            layout: props.layout || 'centered',
            showSocial: props.showSocial !== false,
            showLinks: props.showLinks !== false,
            links: props.links || [],
            socialLinks: props.socialLinks || [],
            backgroundColor: props.backgroundColor || 'transparent',
            textColor: props.textColor || '#374151',
            spacing: props.spacing || 'md',
            borderTop: props.borderTop || false
          }
        })
      } else if (blockType === 'analytics') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'analytics',
          props: {
            provider: props.provider || 'none',
            trackingId: props.trackingId || ''
          }
        })
      } else if (blockType === 'whatsapp-business') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'whatsapp-business',
          props: {
            phoneNumber: props.phoneNumber || '081234567890',
            message: props.message || 'Halo, saya tertarik dengan produk Anda',
            buttonText: props.buttonText || 'Chat via WhatsApp',
            buttonStyle: props.buttonStyle || 'fab',
            showIcon: props.showIcon !== false,
            businessName: props.businessName || 'Business',
            fabPosition: props.fabPosition || 'bottom-right',
            fabSize: props.fabSize || 'default',
            showLabel: props.showLabel !== false,
            enablePulse: props.enablePulse !== false,
            expandOnHover: props.expandOnHover !== false
          }
        })
      } else if (blockType === 'qris-payment') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'qris-payment',
          props: {
            qrisImage: props.qrisImage || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_PREVIEW',
            merchantName: props.merchantName || 'Merchant Name',
            paymentMethods: props.paymentMethods || ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            presetAmounts: props.presetAmounts || [50000, 100000, 200000],
            allowCustomAmount: props.allowCustomAmount !== false,
            instructions: props.instructions || 'Scan QR code dengan aplikasi e-wallet Anda',
            showPaymentLogos: props.showPaymentLogos !== false
          }
        })
      } else if (blockType === 'marketplace') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'marketplace',
          props: {
            stores: props.stores || {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/your-store',
                storeName: 'Your Store'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/your-store',
                shopId: 'yourstore'
              }
            },
            layout: props.layout || 'buttons',
            showBadges: props.showBadges !== false,
            showRatings: props.showRatings !== false,
            featuredProducts: props.featuredProducts || []
          }
        })
      } else if (blockType === 'delivery-platform') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'delivery-platform',
          props: {
            platforms: props.platforms || {
              gofood: {
                url: 'https://gofood.link/a/preview',
                merchantName: 'Your Restaurant'
              },
              grabfood: {
                url: 'https://food.grab.com/id/en/restaurant/preview',
                restaurantId: '1-PREVIEW'
              }
            },
            layout: props.layout || 'buttons',
            showRatings: props.showRatings !== false,
            showPromos: props.showPromos !== false,
            primaryPlatform: props.primaryPlatform || 'gofood'
          }
        })
      } else if (blockType === 'location') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'location',
          props: {
            googleMapsUrl: props.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1753924',
            address: props.address || 'Your Address',
            phone: props.phone || '021-12345678',
            openingHours: props.openingHours || [
              { day: 'Monday - Friday', hours: '09:00 - 18:00' },
              { day: 'Saturday - Sunday', hours: 'Closed' }
            ],
            locationName: props.locationName || 'Your Location',
            showDirectionsButton: props.showDirectionsButton !== false,
            mapHeight: props.mapHeight || 300,
            showCurrentStatus: props.showCurrentStatus !== false
          }
        })
      } else if (blockType === 'product-catalog') {
        blocks.push({
          id: (blockId++).toString(),
          type: 'product-catalog',
          props: {
            items: props.items || [
              {
                id: '1',
                name: 'Nasi Goreng Spesial',
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
                price: 25000,
                originalPrice: 30000,
                description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
                category: 'Main Course',
                stock: 'available',
                stockCount: 20,
                badges: ['Hot', 'Promo'],
                rating: 4.5,
                reviewCount: 128
              },
              {
                id: '2',
                name: 'Mie Ayam Bakso',
                image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
                price: 20000,
                description: 'Mie ayam dengan bakso sapi dan pangsit goreng',
                category: 'Main Course',
                stock: 'available',
                stockCount: 15,
                badges: ['Popular'],
                rating: 4.7,
                reviewCount: 96
              },
              {
                id: '3',
                name: 'Es Teh Manis',
                image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
                price: 5000,
                description: 'Teh manis dingin segar',
                category: 'Beverages',
                stock: 'available',
                stockCount: 50,
                rating: 4.2,
                reviewCount: 45
              },
              {
                id: '4',
                name: 'Paket Nasi Ayam',
                image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
                price: 35000,
                originalPrice: 40000,
                description: 'Paket lengkap dengan nasi, ayam goreng, sayur, dan sambal',
                category: 'Packages',
                stock: 'low',
                stockCount: 3,
                badges: ['Limited'],
                rating: 4.8,
                reviewCount: 203
              }
            ],
            style: props.style || 'grid-card',
            columns: props.columns || 2,
            showSearch: props.showSearch !== false,
            showCategories: props.showCategories !== false,
            showStockIndicator: props.showStockIndicator !== false,
            showRating: props.showRating !== false,
            whatsappNumber: props.whatsappNumber || '081234567890',
            ctaText: props.ctaText || 'Order via WhatsApp'
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
      theme: manifest.defaults?.tokens || {},
      backgroundKey: manifest.defaults?.backgroundKey
    }
  }
}