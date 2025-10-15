/**
 * LinkQ Block Registry
 * Central registry for all block components and their schemas
 */

import React from 'react'
import { BlockSchema, BioBlockProps, LinkListBlockProps, SocialIconsBlockProps, CTABlockProps, GalleryBlockProps } from '@/types'
import { BioBlock } from './BioBlock'
import { LinkListBlock } from './LinkListBlock'
import { SocialIconsBlock } from './SocialIconsBlock'
import { CTABlock } from './CTABlock'
import { GalleryBlock } from './GalleryBlock'
import { AnalyticsBlock } from './AnalyticsBlock'

// ====================================
// BLOCK COMPONENT REGISTRY
// ====================================

export const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'bio': BioBlock,
  'link-list': LinkListBlock,
  'social-icons': SocialIconsBlock,
  'cta': CTABlock,
  'gallery': GalleryBlock,
  'analytics': AnalyticsBlock,
}

export type BlockType = keyof typeof BLOCK_COMPONENTS

// ====================================
// BLOCK SCHEMAS REGISTRY
// ====================================

export const BLOCK_SCHEMAS: Record<BlockType, BlockSchema> = {
  'bio': {
    type: 'bio',
    name: 'Bio',
    description: 'Display your profile picture, name, and bio',
    category: 'basic',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
          description: 'Your display name',
        },
        bio: {
          type: 'string',
          title: 'Bio',
          description: 'A short description about yourself',
        },
        avatar: {
          type: 'string',
          title: 'Avatar URL',
          description: 'URL to your profile picture',
        },
        showAvatar: {
          type: 'boolean',
          title: 'Show Avatar',
          description: 'Whether to display the profile picture',
          default: true,
        },
      },
      required: ['name'],
    },
    defaultProps: {
      name: 'Your Name',
      bio: 'Tell people about yourself',
      showAvatar: true,
    },
    isPremium: false,
  },

  'link-list': {
    type: 'link-list',
    name: 'Link List',
    description: 'A list of clickable links',
    category: 'basic',
    schema: {
      type: 'object',
      properties: {
        style: {
          type: 'string',
          title: 'Style',
          enum: ['pill', 'underline', 'card'],
          default: 'pill',
        },
        items: {
          type: 'array',
          title: 'Links',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string', title: 'Title' },
              url: { type: 'string', title: 'URL' },
              icon: { type: 'string', title: 'Icon' },
              isActive: { type: 'boolean', title: 'Active', default: true },
            },
            required: ['title', 'url'],
          },
        },
        maxItems: {
          type: 'number',
          title: 'Max Items',
          description: 'Maximum number of links to display',
        },
      },
      required: ['items'],
    },
    defaultProps: {
      style: 'pill',
      items: [
        {
          id: '1',
          title: 'My Website',
          url: 'https://yoursite.com',
          isActive: true,
        },
      ],
    },
    isPremium: false,
  },

  'social-icons': {
    type: 'social-icons',
    name: 'Social Icons',
    description: 'Links to your social media profiles',
    category: 'basic',
    schema: {
      type: 'object',
      properties: {
        platforms: {
          type: 'array',
          title: 'Social Platforms',
          items: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                title: 'Platform',
                enum: ['twitter', 'instagram', 'facebook', 'linkedin', 'github', 'youtube', 'tiktok'],
              },
              url: { type: 'string', title: 'URL' },
              username: { type: 'string', title: 'Username' },
            },
            required: ['platform', 'url'],
          },
        },
        style: {
          type: 'string',
          title: 'Style',
          enum: ['round', 'square', 'minimal'],
          default: 'round',
        },
        size: {
          type: 'string',
          title: 'Size',
          enum: ['sm', 'md', 'lg'],
          default: 'md',
        },
      },
      required: ['platforms'],
    },
    defaultProps: {
      platforms: [],
      style: 'round',
      size: 'md',
    },
    isPremium: false,
  },

  'cta': {
    type: 'cta',
    name: 'Call to Action',
    description: 'A prominent call-to-action button',
    category: 'premium',
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: 'Type',
          enum: ['newsletter', 'contact', 'custom'],
        },
        title: {
          type: 'string',
          title: 'Title',
        },
        description: {
          type: 'string',
          title: 'Description',
        },
        buttonText: {
          type: 'string',
          title: 'Button Text',
        },
        action: {
          type: 'object',
          title: 'Action',
          properties: {
            type: {
              type: 'string',
              enum: ['email', 'form', 'link'],
            },
            target: {
              type: 'string',
              title: 'Target',
            },
          },
          required: ['type', 'target'],
        },
      },
      required: ['type', 'title', 'buttonText', 'action'],
    },
    defaultProps: {
      type: 'newsletter',
      title: 'Stay Updated',
      description: 'Subscribe to get the latest updates',
      buttonText: 'Subscribe',
      action: {
        type: 'email',
        target: 'your@email.com',
      },
    },
    isPremium: true,
    requiredPlan: 'STARTER',
  },

  'gallery': {
    type: 'gallery',
    name: 'Gallery',
    description: 'Image and video gallery',
    category: 'premium',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          title: 'Gallery Items',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: {
                type: 'string',
                enum: ['image', 'video'],
              },
              url: { type: 'string', title: 'URL' },
              thumbnail: { type: 'string', title: 'Thumbnail' },
              caption: { type: 'string', title: 'Caption' },
            },
            required: ['id', 'type', 'url'],
          },
        },
        layout: {
          type: 'string',
          title: 'Layout',
          enum: ['grid', 'masonry', 'carousel'],
          default: 'grid',
        },
        columns: {
          type: 'number',
          title: 'Columns',
          minimum: 1,
          maximum: 6,
          default: 3,
        },
      },
      required: ['items'],
    },
    defaultProps: {
      items: [],
      layout: 'grid',
      columns: 3,
    },
    isPremium: true,
    requiredPlan: 'PRO',
  },

  'analytics': {
    type: 'analytics',
    name: 'Analytics',
    description: 'Display site analytics and metrics',
    category: 'pro',
    schema: {
      type: 'object',
      properties: {
        showViews: {
          type: 'boolean',
          title: 'Show Views',
          default: true,
        },
        showClicks: {
          type: 'boolean',
          title: 'Show Clicks',
          default: true,
        },
        showVisitors: {
          type: 'boolean',
          title: 'Show Unique Visitors',
          default: false,
        },
        period: {
          type: 'string',
          title: 'Time Period',
          enum: ['7d', '30d', '90d', 'all'],
          default: '30d',
        },
        style: {
          type: 'string',
          title: 'Style',
          enum: ['minimal', 'detailed', 'chart'],
          default: 'minimal',
        },
      },
    },
    defaultProps: {
      showViews: true,
      showClicks: true,
      showVisitors: false,
      period: '30d',
      style: 'minimal',
    },
    isPremium: true,
    requiredPlan: 'PRO',
  },
}

// ====================================
// REGISTRY UTILITIES
// ====================================

export function getBlockComponent(type: string) {
  return BLOCK_COMPONENTS[type as BlockType]
}

export function getBlockSchema(type: string): BlockSchema | undefined {
  return BLOCK_SCHEMAS[type as BlockType]
}

export function getAllBlockTypes(): BlockType[] {
  return Object.keys(BLOCK_COMPONENTS) as BlockType[]
}

export function getBlocksByCategory(category: 'basic' | 'premium' | 'pro'): BlockSchema[] {
  return Object.values(BLOCK_SCHEMAS).filter(schema => schema.category === category)
}

export function getFreeBlocks(): BlockSchema[] {
  return Object.values(BLOCK_SCHEMAS).filter(schema => !schema.isPremium)
}

export function getPremiumBlocks(): BlockSchema[] {
  return Object.values(BLOCK_SCHEMAS).filter(schema => schema.isPremium)
}

export function getBlocksForPlan(plan: 'FREE' | 'STARTER' | 'PRO'): BlockSchema[] {
  if (plan === 'FREE') {
    return getFreeBlocks()
  }
  
  if (plan === 'STARTER') {
    return Object.values(BLOCK_SCHEMAS).filter(
      schema => !schema.isPremium || schema.requiredPlan === 'STARTER'
    )
  }
  
  // PRO gets all blocks
  return Object.values(BLOCK_SCHEMAS)
}

export function isBlockAvailable(blockType: string, userPlan: 'FREE' | 'STARTER' | 'PRO'): boolean {
  const schema = getBlockSchema(blockType)
  if (!schema) return false
  
  if (!schema.isPremium) return true
  
  if (userPlan === 'FREE') return false
  
  if (schema.requiredPlan === 'PRO' && userPlan !== 'PRO') return false
  
  return true
}

// ====================================
// BLOCK VALIDATION
// ====================================

export function validateBlockData(type: string, props: any): { isValid: boolean; errors: string[] } {
  const schema = getBlockSchema(type)
  if (!schema) {
    return { isValid: false, errors: [`Unknown block type: ${type}`] }
  }
  
  const errors: string[] = []
  const required = schema.schema.required || []
  const properties = schema.schema.properties
  
  // Check required fields
  for (const field of required) {
    if (!(field in props)) {
      errors.push(`Required field '${field}' is missing`)
    }
  }
  
  // Validate field types
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
      
      if (fieldSchema.type === 'array' && !Array.isArray(value)) {
        errors.push(`Field '${field}' must be an array`)
      }
      
      // Validate enum values
      if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
        errors.push(`Field '${field}' must be one of: ${fieldSchema.enum.join(', ')}`)
      }
    }
  })
  
  return { isValid: errors.length === 0, errors }
}

// ====================================
// BLOCK PROPS GENERATION
// ====================================

export function generateDefaultProps(type: string): any {
  const schema = getBlockSchema(type)
  return schema?.defaultProps || {}
}

export function mergeWithDefaults(type: string, props: any): any {
  const defaults = generateDefaultProps(type)
  return { ...defaults, ...props }
}

// ====================================
// BLOCK SEARCH & FILTERING
// ====================================

export function searchBlocks(query: string): BlockSchema[] {
  const lowercaseQuery = query.toLowerCase()
  
  return Object.values(BLOCK_SCHEMAS).filter(schema => 
    schema.name.toLowerCase().includes(lowercaseQuery) ||
    schema.description?.toLowerCase().includes(lowercaseQuery) ||
    schema.type.toLowerCase().includes(lowercaseQuery)
  )
}

export function filterBlocks(filters: {
  category?: string
  isPremium?: boolean
  plan?: 'FREE' | 'STARTER' | 'PRO'
}): BlockSchema[] {
  let blocks = Object.values(BLOCK_SCHEMAS)
  
  if (filters.category) {
    blocks = blocks.filter(schema => schema.category === filters.category)
  }
  
  if (filters.isPremium !== undefined) {
    blocks = blocks.filter(schema => schema.isPremium === filters.isPremium)
  }
  
  if (filters.plan) {
    blocks = getBlocksForPlan(filters.plan)
  }
  
  return blocks
}

// ====================================
// EXPORT ALL
// ====================================

// Export the main registry
export const BLOCK_REGISTRY = BLOCK_SCHEMAS

export * from './BioBlock'
export * from './LinkListBlock'
export * from './SocialIconsBlock'
export * from './CTABlock'
export * from './GalleryBlock'
export * from './AnalyticsBlock'