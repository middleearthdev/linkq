/**
 * LinkQ Platform - TypeScript Types & Interfaces
 * Complete type definitions for the dynamic template system
 */

import { z } from 'zod'

// ====================================
// CORE ENUMS (matching Prisma)
// ====================================

export const SubscriptionTier = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO',
} as const

export const TemplateStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export const UserSiteStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SUSPENDED: 'SUSPENDED',
} as const

export const PurchaseStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

export type SubscriptionTierType = keyof typeof SubscriptionTier
export type TemplateStatusType = keyof typeof TemplateStatus
export type UserSiteStatusType = keyof typeof UserSiteStatus
export type PurchaseStatusType = keyof typeof PurchaseStatus

// ====================================
// TEMPLATE MANIFEST SYSTEM
// ====================================

export const TemplateManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  layout: z.object({
    header: z.array(z.string()),
    body: z.array(z.string()),
    footer: z.array(z.string()),
  }),
  allowedBlocks: z.array(z.string()),
  defaults: z.object({
    tokens: z.record(z.string(), z.string()), // CSS variables
    blockProps: z.record(z.string(), z.any()), // Default props per block
  }),
  requiredFeatures: z.array(z.string()).optional(),
})

export type TemplateManifest = z.infer<typeof TemplateManifestSchema>

// ====================================
// BLOCK SYSTEM
// ====================================

export const BlockSchemaSchema = z.object({
  type: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(['basic', 'premium', 'pro']).optional(),
  schema: z.object({
    type: z.literal('object'),
    properties: z.record(z.string(), z.any()),
    required: z.array(z.string()).optional(),
  }),
  defaultProps: z.record(z.string(), z.any()).optional(),
  isPremium: z.boolean().default(false),
  requiredPlan: z.nativeEnum(SubscriptionTier).optional(),
})

export type BlockSchema = z.infer<typeof BlockSchemaSchema>

// Individual block prop types
export const BioBlockPropsSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  showAvatar: z.boolean().default(true),
  avatarSize: z.enum(['sm', 'md', 'lg', 'xl', 'xxl']).default('lg'),
  avatarStyle: z.enum(['circle', 'rounded', 'rounded-frame', 'blob', 'hexagon', 'star', 'diamond', 'wave', 'flower', 'badge', 'polaroid', 'vintage']).default('circle'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  nameStyle: z.enum(['default', 'large-elegant']).default('default'),
  spacing: z.enum(['normal', 'wide']).default('normal'),
})

export const LinkItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const LinkListBlockPropsSchema = z.object({
  style: z.enum(['pill', 'underline', 'card', 'modern', 'modern-cream', 'vintage', 'ticket', 'brush', 'neon', 'origami', 'glass', 'pixel', 'hologram', 'neomorphism', 'bubble', 'cyberpunk', 'sketch', 'metallic', 'wood', 'neon-outline', 'minimal-line', 'elastic', 'terminal']).default('pill'),
  items: z.array(LinkItemSchema),
  maxItems: z.number().optional(),
  customColors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    text: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    // Extended colors for creative styles
    tertiary: z.string().optional(),
    quaternary: z.string().optional(),
    shadow: z.string().optional(),
    border: z.string().optional(),
    highlight: z.string().optional(),
    glow: z.string().optional(),
    // Gradient definitions
    gradientType: z.enum(['linear', 'radial', 'conic']).optional(),
    gradientDirection: z.string().optional(),
    gradientStops: z.array(z.string()).optional(),
  }).optional(),
})

export const SocialIconsBlockPropsSchema = z.object({
  platforms: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    username: z.string().optional(),
  })),
  style: z.enum(['round', 'square', 'minimal']).default('round'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
})

export const CTABlockPropsSchema = z.object({
  type: z.enum(['newsletter', 'contact', 'custom']),
  title: z.string(),
  description: z.string().optional(),
  buttonText: z.string(),
  action: z.object({
    type: z.enum(['email', 'form', 'link']),
    target: z.string(),
  }),
})

export const GalleryBlockPropsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    type: z.enum(['image', 'video']),
    url: z.string(),
    thumbnail: z.string().optional(),
    caption: z.string().optional(),
  })),
  layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
  columns: z.number().min(1).max(6).default(3),
})

export type BioBlockProps = z.infer<typeof BioBlockPropsSchema>
export type LinkListBlockProps = z.infer<typeof LinkListBlockPropsSchema>
export type SocialIconsBlockProps = z.infer<typeof SocialIconsBlockPropsSchema>
export type CTABlockProps = z.infer<typeof CTABlockPropsSchema>
export type GalleryBlockProps = z.infer<typeof GalleryBlockPropsSchema>

// ====================================
// USER SITE DATA
// ====================================

export const BlockDataSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.any()),
  order: z.number(),
  isVisible: z.boolean().default(true),
})

export const UserSiteDataSchema = z.object({
  blocks: z.array(BlockDataSchema),
  theme: z.object({
    colors: z.record(z.string(), z.string()),
    fonts: z.record(z.string(), z.string()),
    spacing: z.record(z.string(), z.string()),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional(),
  }).optional(),
})

export type BlockData = z.infer<typeof BlockDataSchema>
export type UserSiteData = z.infer<typeof UserSiteDataSchema>

// Block type alias
export type Block = BlockData

// Complete site data for editor
export interface SiteData {
  id: string
  handle: string
  title?: string
  description?: string
  favicon?: string
  status: UserSiteStatusType
  customDomain?: string
  customCss?: string
  removeBranding: boolean
  template: {
    name: string
    slug: string
    manifest: TemplateManifest
    cssVars: Record<string, string>
  }
  data: UserSiteData
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// ====================================
// USER ENTITLEMENTS
// ====================================

export const UserEntitlementsSchema = z.object({
  plan: z.nativeEnum(SubscriptionTier),
  features: z.array(z.string()),
  templates: z.array(z.string()), // Template IDs user has access to
  blocks: z.array(z.string()), // Block types user has access to
  limits: z.object({
    maxSites: z.number(),
    maxBlocks: z.number(),
    maxLinks: z.number(),
    customDomain: z.boolean(),
    analytics: z.boolean(),
    removeBranding: z.boolean(),
    customCSS: z.boolean(),
  }),
})

export type UserEntitlements = z.infer<typeof UserEntitlementsSchema>

// ====================================
// API RESPONSE TYPES
// ====================================

// ====================================
// TAG SYSTEM TYPES
// ====================================

export const TagCategoryEnum = {
  INDUSTRY: 'industry',
  STYLE: 'style', 
  PURPOSE: 'purpose',
  AUDIENCE: 'audience'
} as const

export type TagCategory = keyof typeof TagCategoryEnum

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  category: z.enum(['industry', 'style', 'purpose', 'audience']).optional(),
  isPopular: z.boolean().default(false),
  sortOrder: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Tag = z.infer<typeof TagSchema>

export interface TemplateListResponse {
  templates: Array<{
    id: string
    slug: string
    name: string
    description?: string
    thumbnail?: string
    category?: string
    isPaid: boolean
    priceCents?: number
    requiredPlan?: SubscriptionTierType
    isOwned: boolean
    tags: Tag[]
    latestVersion: {
      id: string
      version: string
      manifest: TemplateManifest
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  filters: {
    availableTags: Tag[]
    selectedTags: string[]
    categories: string[]
  }
}

export interface PublicSiteResponse {
  handle: string
  title?: string
  description?: string
  favicon?: string
  template: {
    manifest: TemplateManifest
    cssVars: Record<string, string>
  }
  data: UserSiteData
  branding: {
    showBranding: boolean
    customBranding?: {
      logo?: string
      text?: string
      url?: string
    }
  }
}

export interface SiteAnalyticsResponse {
  summary: {
    totalViews: number
    totalClicks: number
    uniqueVisitors: number
    topReferrers: Array<{ referrer: string; count: number }>
    topCountries: Array<{ country: string; count: number }>
  }
  events: Array<{
    id: string
    event: string
    target?: string
    referrer?: string
    country?: string
    timestamp: string
  }>
  dateRange: {
    from: string
    to: string
  }
}

// ====================================
// EDITOR TYPES
// ====================================

export interface EditorState {
  site: UserSiteData
  selectedBlock?: string
  previewMode: boolean
  isDirty: boolean
}

export interface DragDropContext {
  activeId: string | null
  overId: string | null
}

export interface TemplatePreview {
  id: string
  name: string
  thumbnail: string
  manifest: TemplateManifest
  cssVars: Record<string, string>
}

// ====================================
// FORM SCHEMAS
// ====================================

export const CreateSiteSchema = z.object({
  handle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .max(30, 'Handle must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, hyphens, and underscores'),
  templateVersionId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
})

export const UpdateSiteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  favicon: z.string().optional(),
  data: UserSiteDataSchema,
  customCss: z.string().optional(),
})

export const PurchaseTemplateSchema = z.object({
  templateId: z.string(),
  returnUrl: z.string().url().optional(),
})

export type CreateSiteData = z.infer<typeof CreateSiteSchema>
export type UpdateSiteData = z.infer<typeof UpdateSiteSchema>
export type PurchaseTemplateData = z.infer<typeof PurchaseTemplateSchema>

// ====================================
// UTILITY TYPES
// ====================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  tags?: string[] // Array of tag slugs for filtering
  sort?: 'name' | 'created' | 'updated' | 'price' | 'popularity'
  order?: 'asc' | 'desc'
}

// ====================================
// TAG MANAGEMENT TYPES
// ====================================

export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  slug: z.string().min(1, 'Tag slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  icon: z.string().optional(),
  category: z.enum(['industry', 'style', 'purpose', 'audience']).optional(),
  isPopular: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

export const UpdateTagSchema = CreateTagSchema.partial()

export const TagFilterParams = z.object({
  category: z.enum(['industry', 'style', 'purpose', 'audience']).optional(),
  isPopular: z.boolean().optional(),
  search: z.string().optional(),
})

export type CreateTagData = z.infer<typeof CreateTagSchema>
export type UpdateTagData = z.infer<typeof UpdateTagSchema>
export type TagFilterData = z.infer<typeof TagFilterParams>

export interface TagsResponse {
  tags: Tag[]
  grouped: {
    industry: Tag[]
    style: Tag[]
    purpose: Tag[]
    audience: Tag[]
  }
  popular: Tag[]
}

export interface ErrorDetails {
  field?: string
  code: string
  message: string
}

// ====================================
// TEMPLATE CREATION TYPES
// ====================================

export interface CreateTemplateData {
  name: string
  slug: string
  description?: string
  category?: string
  manifest: TemplateManifest
  cssVars: Record<string, string>
  isPaid?: boolean
  priceCents?: number
  requiredPlan?: SubscriptionTierType
}

export interface TemplateVersionData {
  version: string
  manifest: TemplateManifest
  cssVars: Record<string, string>
  changelog?: string
}

// ====================================
// PREMIUM FEATURES
// ====================================

export interface CustomDomainConfig {
  domain: string
  verified: boolean
  sslEnabled: boolean
  dnsRecords: Array<{
    type: string
    name: string
    value: string
    required: boolean
  }>
}

export interface WebhookConfig {
  url: string
  events: string[]
  secret: string
  isActive: boolean
}

export interface AnalyticsConfig {
  enabled: boolean
  retention: number // days
  excludeOwnVisits: boolean
  trackingCode?: string
}

// ====================================
// PAYMENT TYPES (Xendit)
// ====================================

export interface XenditInvoiceData {
  external_id: string
  amount: number
  currency: string
  payer_email?: string
  description: string
  invoice_duration?: number
  success_redirect_url?: string
  failure_redirect_url?: string
}

export interface XenditWebhookData {
  id: string
  external_id: string
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'
  amount: number
  currency: string
  paid_amount?: number
  paid_at?: string
  payment_method?: string
}