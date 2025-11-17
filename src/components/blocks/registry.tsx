/**
 * LinkQ Block Registry
 * Central registry for all block components and their schemas
 */

import React from 'react'
import { BlockSchema, BioBlockProps, LinkListBlockProps, SocialIconsBlockProps, CTABlockProps, GalleryBlockProps, DividerBlockProps, FooterBlockProps } from '@/types'
import { BioBlock } from './BioBlock'
import { LinkListBlock } from './LinkListBlock'
import { SocialIconsBlock } from './SocialIconsBlock'
import { CTABlock } from './CTABlock'
import { GalleryBlock } from './GalleryBlock'
import { AnalyticsBlock } from './AnalyticsBlock'
import { DividerBlock } from './DividerBlock'
import { FooterBlock } from './FooterBlock'

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
  'divider': DividerBlock,
  'footer': FooterBlock,
}

export type BlockType = keyof typeof BLOCK_COMPONENTS

// ====================================
// BLOCK SCHEMAS REGISTRY
// ====================================

export const BLOCK_SCHEMAS: Record<BlockType, BlockSchema> = {
  'bio': {
    type: 'bio',
    name: 'Bio',
    description: 'Display your profile picture, name, and bio with 12 avatar styles, 10 name typography options, and rich customization',
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
          description: 'A short description about yourself (max 160 characters)',
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
        avatarSize: {
          type: 'string',
          title: 'Avatar Size',
          description: 'Size of the profile picture',
          enum: ['sm', 'md', 'lg', 'xl', 'xxl'],
          default: 'lg',
        },
        avatarStyle: {
          type: 'string',
          title: 'Avatar Frame Style',
          description: 'Creative frame style for the profile picture',
          enum: ['circle', 'rounded-frame', 'square', 'blob', 'hexagon', 'star', 'diamond', 'wave', 'flower', 'badge', 'polaroid', 'vintage'],
          default: 'circle',
        },
        textAlign: {
          type: 'string',
          title: 'Text Alignment',
          description: 'Alignment of text content',
          enum: ['left', 'center', 'right'],
          default: 'center',
        },
        nameStyle: {
          type: 'string',
          title: 'Name Typography',
          description: 'Typography style for the name',
          enum: ['default', 'large-elegant', 'compact', 'modern-minimal', 'bold-impact', 'script-handwritten', 'tech-mono', 'gradient-text', 'neon-glow', 'vintage-serif'],
          default: 'default',
        },
        bioStyle: {
          type: 'string',
          title: 'Bio Text Style',
          description: 'Typography style for the bio text',
          enum: ['default', 'large', 'small', 'quote', 'modern'],
          default: 'default',
        },
        spacing: {
          type: 'string',
          title: 'Spacing',
          description: 'Spacing between elements',
          enum: ['tight', 'normal', 'wide'],
          default: 'normal',
        },
      },
      required: ['name'],
    },
    defaultProps: {
      name: 'Your Name',
      bio: 'Tell people about yourself',
      showAvatar: true,
      avatarSize: 'lg',
      avatarStyle: 'circle',
      textAlign: 'center',
      nameStyle: 'default',
      bioStyle: 'default',
      spacing: 'normal',
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
    description: 'Links to your social media profiles with 20+ platforms and customizable styles',
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
                enum: [
                  'twitter', 'x', 'instagram', 'facebook', 'threads', 'tiktok',
                  'snapchat', 'pinterest', 'reddit', 'linkedin', 'github',
                  'medium', 'behance', 'dribbble', 'whatsapp', 'telegram',
                  'discord', 'youtube', 'twitch', 'spotify', 'soundcloud'
                ],
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
          enum: ['round', 'square', 'minimal', 'neon', 'glassmorphism', 'neumorphic', 'floating', 'rotating', 'pulse', 'bounce'],
          default: 'round',
        },
        size: {
          type: 'string',
          title: 'Size',
          enum: ['sm', 'md', 'lg'],
          default: 'md',
        },
        colorMode: {
          type: 'string',
          title: 'Color Mode',
          enum: ['brand', 'monochrome', 'custom'],
          default: 'brand',
        },
        customColors: {
          type: 'object',
          title: 'Custom Colors',
          properties: {
            iconColor: { type: 'string', title: 'Icon Color' },
            backgroundColor: { type: 'string', title: 'Background Color' },
            borderColor: { type: 'string', title: 'Border Color' },
            hoverColor: { type: 'string', title: 'Hover Color' },
          },
        },
      },
      required: ['platforms'],
    },
    defaultProps: {
      platforms: [],
      style: 'round',
      size: 'md',
      colorMode: 'brand',
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
    description: 'Image and video gallery with lightbox, carousel, filters, and advanced layouts',
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
          enum: ['grid', 'masonry', 'carousel', 'pinterest', 'justified', 'mosaic'],
          default: 'grid',
        },
        columns: {
          type: 'number',
          title: 'Columns',
          minimum: 1,
          maximum: 6,
          default: 3,
        },
        aspectRatio: {
          type: 'string',
          title: 'Aspect Ratio',
          enum: ['square', 'landscape', 'portrait', 'widescreen', 'original'],
          default: 'square',
        },
        imageFilter: {
          type: 'string',
          title: 'Image Filter',
          enum: ['none', 'grayscale', 'sepia', 'vintage', 'dramatic', 'warm', 'cool', 'noir'],
          default: 'none',
        },
        showCaptions: {
          type: 'boolean',
          title: 'Show Captions',
          default: true,
        },
        spacing: {
          type: 'string',
          title: 'Spacing',
          enum: ['none', 'sm', 'md', 'lg'],
          default: 'md',
        },
        rounded: {
          type: 'string',
          title: 'Rounded Corners',
          enum: ['none', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
      },
      required: ['items'],
    },
    defaultProps: {
      items: [],
      layout: 'grid',
      columns: 3,
      aspectRatio: 'square',
      imageFilter: 'none',
      showCaptions: true,
      spacing: 'md',
      rounded: 'md',
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

  'divider': {
    type: 'divider',
    name: 'Divider',
    description: 'Visual separator with 8 styles, icons, gradients, and full customization',
    category: 'basic',
    schema: {
      type: 'object',
      properties: {
        style: {
          type: 'string',
          title: 'Divider Style',
          description: 'Visual style of the divider line',
          enum: ['solid', 'dashed', 'dotted', 'double', 'gradient', 'gradient-rainbow', 'gradient-sunset', 'gradient-ocean'],
          default: 'solid',
        },
        thickness: {
          type: 'number',
          title: 'Thickness',
          description: 'Line thickness in pixels (1-10)',
          minimum: 1,
          maximum: 10,
          default: 1,
        },
        color: {
          type: 'string',
          title: 'Color',
          description: 'Divider color (hex code)',
          default: '#e5e7eb',
        },
        spacing: {
          type: 'string',
          title: 'Spacing',
          description: 'Vertical spacing around divider',
          enum: ['none', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
        width: {
          type: 'string',
          title: 'Width',
          description: 'Divider width percentage',
          enum: ['25', '50', '75', '100'],
          default: '100',
        },
        alignment: {
          type: 'string',
          title: 'Alignment',
          description: 'Horizontal alignment',
          enum: ['left', 'center', 'right'],
          default: 'center',
        },
        icon: {
          type: 'string',
          title: 'Icon',
          description: 'Optional center icon',
          enum: ['none', 'sparkles', 'circle', 'square', 'star', 'heart', 'zap'],
          default: 'none',
        },
        animated: {
          type: 'boolean',
          title: 'Animated',
          description: 'Pulse animation effect',
          default: false,
        },
      },
    },
    defaultProps: {
      style: 'solid',
      thickness: 1,
      color: '#e5e7eb',
      spacing: 'md',
      width: '100',
      alignment: 'center',
      icon: 'none',
      animated: false,
    },
    isPremium: false,
  },

  'footer': {
    type: 'footer',
    name: 'Footer',
    description: 'Footer section with copyright, links, social icons, and multiple layout styles',
    category: 'basic',
    schema: {
      type: 'object',
      properties: {
        copyrightText: {
          type: 'string',
          title: 'Copyright Text',
          description: 'Copyright notice text',
          default: '© 2024 Your Name',
        },
        layout: {
          type: 'string',
          title: 'Layout Style',
          description: 'Footer layout arrangement',
          enum: ['centered', 'minimal', 'stacked', 'split'],
          default: 'centered',
        },
        showSocial: {
          type: 'boolean',
          title: 'Show Social Icons',
          description: 'Display social media icons',
          default: true,
        },
        showLinks: {
          type: 'boolean',
          title: 'Show Footer Links',
          description: 'Display footer navigation links',
          default: true,
        },
        links: {
          type: 'array',
          title: 'Footer Links',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', title: 'Label' },
              url: { type: 'string', title: 'URL' },
              external: { type: 'boolean', title: 'Open in new tab', default: false },
            },
            required: ['label', 'url'],
          },
          default: [],
        },
        socialLinks: {
          type: 'array',
          title: 'Social Links',
          items: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'email', 'website'],
              },
              url: { type: 'string', title: 'URL' },
            },
            required: ['platform', 'url'],
          },
          default: [],
        },
        backgroundColor: {
          type: 'string',
          title: 'Background Color',
          description: 'Footer background color (hex code)',
          default: '#ffffff',
        },
        textColor: {
          type: 'string',
          title: 'Text Color',
          description: 'Footer text color (hex code)',
          default: '#374151',
        },
        spacing: {
          type: 'string',
          title: 'Spacing',
          description: 'Vertical padding',
          enum: ['none', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
        borderTop: {
          type: 'boolean',
          title: 'Top Border',
          description: 'Show border at top of footer',
          default: false,
        },
      },
    },
    defaultProps: {
      copyrightText: '© 2024 Your Name',
      layout: 'centered',
      showSocial: true,
      showLinks: true,
      links: [],
      socialLinks: [],
      backgroundColor: '#ffffff',
      textColor: '#374151',
      spacing: 'md',
      borderTop: false,
    },
    isPremium: false,
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
export * from './DividerBlock'
export * from './FooterBlock'