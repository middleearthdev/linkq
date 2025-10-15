import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * LinkQ Platform Utilities
 * Helper functions for the bio link platform
 */

import { UserEntitlements, SubscriptionTier, BlockSchema } from '@/types'

// ====================================
// VALIDATION UTILITIES
// ====================================

export function validateHandle(handle: string): { isValid: boolean; error?: string } {
  if (handle.length < 3) {
    return { isValid: false, error: 'Handle must be at least 3 characters long' }
  }
  
  if (handle.length > 30) {
    return { isValid: false, error: 'Handle must be less than 30 characters long' }
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
    return { isValid: false, error: 'Handle can only contain letters, numbers, hyphens, and underscores' }
  }
  
  // Reserved handles
  const reserved = ['admin', 'api', 'www', 'app', 'dashboard', 'editor', 'login', 'signup', 'settings']
  if (reserved.includes(handle.toLowerCase())) {
    return { isValid: false, error: 'This handle is reserved' }
  }
  
  return { isValid: true }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and on* attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/g, '')
    .replace(/\son\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
}

// ====================================
// ENTITLEMENT CHECKING
// ====================================

export function hasFeature(entitlements: UserEntitlements, feature: string): boolean {
  return entitlements.features.includes(feature)
}

export function hasTemplate(entitlements: UserEntitlements, templateId: string): boolean {
  return entitlements.templates.includes(templateId)
}

export function hasBlock(entitlements: UserEntitlements, blockType: string): boolean {
  return entitlements.blocks.includes(blockType)
}

export function canUseFeature(
  entitlements: UserEntitlements,
  feature: keyof UserEntitlements['limits']
): boolean {
  return entitlements.limits[feature] === true
}

export function getFeatureLimit(
  entitlements: UserEntitlements,
  feature: 'maxSites' | 'maxBlocks' | 'maxLinks'
): number {
  return entitlements.limits[feature] as number
}

// ====================================
// PLAN UTILITIES
// ====================================

export function getPlanFeatures(plan: keyof typeof SubscriptionTier): string[] {
  const features = {
    FREE: ['basic-templates', 'up-to-5-links', 'linkq-branding'],
    STARTER: ['premium-templates', 'up-to-20-links', 'basic-analytics', 'remove-branding'],
    PRO: ['all-templates', 'unlimited-links', 'advanced-analytics', 'custom-domain', 'custom-css', 'webhooks']
  }
  
  return features[plan] || []
}

export function getPlanLimits(plan: keyof typeof SubscriptionTier): UserEntitlements['limits'] {
  const limits = {
    FREE: {
      maxSites: 1,
      maxBlocks: 6,
      maxLinks: 5,
      customDomain: false,
      analytics: false,
      removeBranding: false,
      customCSS: false,
    },
    STARTER: {
      maxSites: 3,
      maxBlocks: 10,
      maxLinks: 20,
      customDomain: false,
      analytics: true,
      removeBranding: true,
      customCSS: false,
    },
    PRO: {
      maxSites: 10,
      maxBlocks: 20,
      maxLinks: -1, // unlimited
      customDomain: true,
      analytics: true,
      removeBranding: true,
      customCSS: true,
    }
  }
  
  return limits[plan] || limits.FREE
}

export function canUpgradeFrom(currentPlan: string, targetPlan: string): boolean {
  const planOrder = ['FREE', 'STARTER', 'PRO']
  const currentIndex = planOrder.indexOf(currentPlan)
  const targetIndex = planOrder.indexOf(targetPlan)
  
  return targetIndex > currentIndex
}

// ====================================
// TEMPLATE UTILITIES
// ====================================

export function generateCSSVariables(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(' ')
}

export function injectCSSVariables(element: HTMLElement, tokens: Record<string, string>) {
  Object.entries(tokens).forEach(([key, value]) => {
    element.style.setProperty(`--${key}`, value)
  })
}

export function validateBlockProps(props: any, schema: BlockSchema): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  try {
    // This is a simplified validation - in production you'd use a proper JSON schema validator
    const required = schema.schema.required || []
    const properties = schema.schema.properties
    
    // Check required properties
    for (const field of required) {
      if (!(field in props)) {
        errors.push(`Required field '${field}' is missing`)
      }
    }
    
    // Basic type checking for string fields
    Object.entries(properties).forEach(([field, fieldSchema]) => {
      if (field in props) {
        const value = props[field]
        if (fieldSchema.type === 'string' && typeof value !== 'string') {
          errors.push(`Field '${field}' must be a string`)
        }
        if (fieldSchema.type === 'number' && typeof value !== 'number') {
          errors.push(`Field '${field}' must be a number`)
        }
        if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Field '${field}' must be a boolean`)
        }
      }
    })
    
    return { isValid: errors.length === 0, errors }
  } catch (error) {
    return { isValid: false, errors: ['Invalid schema or props'] }
  }
}

// ====================================
// URL UTILITIES
// ====================================

export function getSiteUrl(handle: string, customDomain?: string): string {
  if (customDomain) {
    return `https://${customDomain}`
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linkq.app'
  return `${baseUrl}/${handle}`
}

export function getEditorUrl(siteId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linkq.app'
  return `${baseUrl}/editor/${siteId}`
}

export function getTemplatePreviewUrl(templateId: string, versionId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linkq.app'
  const version = versionId ? `?version=${versionId}` : ''
  return `${baseUrl}/templates/${templateId}/preview${version}`
}

// ====================================
// ANALYTICS UTILITIES
// ====================================

export function trackEvent(event: string, properties?: Record<string, any>) {
  // Simple analytics tracking - replace with your analytics provider
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties)
  }
}

export function formatAnalyticsData(data: any[]): { labels: string[]; values: number[] } {
  const labels = data.map(item => item.label || item.date || item.name)
  const values = data.map(item => item.value || item.count || 0)
  
  return { labels, values }
}

// ====================================
// FORMATTING UTILITIES
// ====================================

export function formatCurrency(cents: number, currency = 'IDR'): string {
  const amount = cents / 100
  
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

// ====================================
// SLUG UTILITIES
// ====================================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ====================================
// COLOR UTILITIES
// ====================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

// ====================================
// ERROR HANDLING
// ====================================

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

export function isApiError(error: any): error is { code: string; message: string } {
  return error && typeof error.code === 'string' && typeof error.message === 'string'
}

// ====================================
// TYPE GUARDS
// ====================================

export function isValidSubscriptionTier(value: string): value is keyof typeof SubscriptionTier {
  return Object.values(SubscriptionTier).includes(value as any)
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

// ====================================
// DEBOUNCE & THROTTLE
// ====================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

// ====================================
// ID GENERATION
// ====================================

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}