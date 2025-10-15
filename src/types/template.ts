/**
 * Template System Types
 * Core types for dynamic template system with premium gating
 */

export interface TemplateManifest {
  name: string
  version: string
  description?: string
  thumbnail?: string
  
  // Layout configuration
  layout: {
    header: string[]    // Block types allowed in header
    body: string[]      // Block types allowed in body  
    footer: string[]    // Block types allowed in footer
  }
  
  // Block restrictions
  allowedBlocks: string[]
  maxBlocks?: Record<string, number> // Max instances per block type
  
  // Default configuration
  defaults: {
    tokens: Record<string, string>      // CSS custom properties
    blockProps: Record<string, any>     // Default props per block type
    meta: {
      title?: string
      description?: string
      theme?: Record<string, string>
    }
  }
  
  // Premium features
  requiredFeatures?: string[]  // ["analytics", "custom-domain", "remove-branding"]
  requiredPlan?: 'FREE' | 'STARTER' | 'PRO'
  isPaid?: boolean
  priceCents?: number
}

export interface BlockSchema {
  type: string
  name: string
  description?: string
  category: 'basic' | 'premium' | 'pro'
  
  // JSON Schema for validation
  schema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
  
  // Default props
  defaultProps: Record<string, any>
  
  // Premium gating
  isPremium: boolean
  requiredPlan?: 'FREE' | 'STARTER' | 'PRO'
  
  // UI configuration
  icon?: string
  preview?: string  // Preview image URL
}

export interface UserSiteData {
  id: string
  handle: string
  templateVersionId: string
  
  // Block data
  blocks: Array<{
    id: string
    type: string
    props: any
    position?: {
      section: 'header' | 'body' | 'footer'
      order: number
    }
  }>
  
  // Site metadata
  meta: {
    title: string
    description: string
    theme: Record<string, string>
    font?: string
  }
  
  // Premium features
  customCss?: string
  customDomain?: string
  analyticsEnabled: boolean
  removeBranding: boolean
}

export interface UserEntitlements {
  plan: 'FREE' | 'STARTER' | 'PRO'
  planExpiry?: Date
  
  // Template purchases
  purchasedTemplates: string[]  // Template IDs
  
  // Feature entitlements
  features: string[]  // ["analytics", "custom-domain", "remove-branding"]
  
  // Usage limits
  limits: {
    sites: number
    linksPerSite: number
    customBlocks: number
    customDomains: number
  }
}

export interface TemplatePreview {
  id: string
  slug: string
  name: string
  description?: string
  thumbnail?: string
  category: 'free' | 'premium' | 'pro'
  
  // Pricing
  isPaid: boolean
  priceCents?: number
  requiredPlan?: 'FREE' | 'STARTER' | 'PRO'
  
  // Preview data
  previewData: UserSiteData
  features: string[]
  
  // Status for current user
  isOwned: boolean
  canAccess: boolean
  needsUpgrade: boolean
}

export interface TemplateMigration {
  fromTemplateId: string
  toTemplateId: string
  
  // Block mapping rules
  blockMappings: Array<{
    fromType: string
    toType: string
    propMappings?: Record<string, string>
  }>
  
  // Data transformations
  transformations: Array<{
    type: 'rename_prop' | 'merge_props' | 'split_prop' | 'custom'
    config: any
  }>
  
  // Fallback behavior
  fallbacks: Record<string, any>
}

// Template Registry Types
export interface TemplateRegistry {
  templates: Map<string, TemplateManifest>
  blocks: Map<string, BlockSchema>
  migrations: Map<string, TemplateMigration>
}

// API Response Types
export interface TemplateListResponse {
  templates: TemplatePreview[]
  categories: Array<{
    id: string
    name: string
    count: number
  }>
  featured: string[]  // Template IDs
}

export interface TemplateDetailResponse {
  template: TemplatePreview
  manifest: TemplateManifest
  similarTemplates: TemplatePreview[]
  reviews?: Array<{
    rating: number
    comment: string
    author: string
    createdAt: Date
  }>
}

// Template Editor Types
export interface TemplateEditorState {
  currentTemplate: TemplateManifest
  siteData: UserSiteData
  previewMode: 'mobile' | 'desktop' | 'tablet'
  isDirty: boolean
  errors: Record<string, string[]>
}

export interface BlockInstance {
  id: string
  type: string
  props: any
  isLocked: boolean
  hasErrors: boolean
  validation?: {
    isValid: boolean
    errors: string[]
  }
}