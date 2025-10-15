/**
 * Complete Database Seed Script
 * Includes full template manifests in database
 */

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create block definitions
  const blockDefinitions = [
    {
      type: 'bio',
      name: 'Bio Section',
      description: 'Profile information with avatar, name, and bio text',
      category: 'basic',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          bio: { type: 'string', title: 'Bio' },
          avatar: { type: 'string', title: 'Avatar URL' },
          showAvatar: { type: 'boolean', title: 'Show Avatar', default: true },
          textAlign: { type: 'string', enum: ['left', 'center', 'right'], default: 'center' },
          avatarSize: { type: 'string', enum: ['sm', 'md', 'lg', 'xl', 'xxl'], default: 'lg' },
          avatarStyle: { type: 'string', enum: ['circle', 'rounded', 'rounded-frame'], default: 'circle' },
          nameStyle: { type: 'string', enum: ['default', 'large-elegant'], default: 'default' },
          spacing: { type: 'string', enum: ['normal', 'wide'], default: 'normal' }
        },
        required: ['name']
      },
      defaultProps: {
        name: 'Your Name',
        bio: 'Add your bio here',
        showAvatar: true,
        textAlign: 'center',
        avatarSize: 'lg'
      }
    },
    {
      type: 'link-list',
      name: 'Link List',
      description: 'List of clickable links',
      category: 'basic',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string', title: 'Title' },
                url: { type: 'string', title: 'URL' },
                style: { type: 'string', enum: ['pill', 'card', 'minimal'], default: 'pill' },
                icon: { type: 'string', title: 'Icon' }
              },
              required: ['title', 'url']
            }
          },
          style: { type: 'string', enum: ['pill', 'card', 'minimal', 'glass'], default: 'pill' },
          gap: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' }
        }
      },
      defaultProps: {
        items: [],
        style: 'pill',
        gap: 'md'
      }
    },
    {
      type: 'social-icons',
      name: 'Social Icons',
      description: 'Social media links with icons',
      category: 'basic',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', enum: ['instagram', 'twitter', 'linkedin', 'github', 'youtube', 'tiktok'] },
                url: { type: 'string', title: 'URL' }
              },
              required: ['platform', 'url']
            }
          },
          size: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' },
          style: { type: 'string', enum: ['rounded', 'square', 'minimal'], default: 'rounded' }
        }
      },
      defaultProps: {
        items: [],
        size: 'md',
        style: 'rounded'
      }
    },
    {
      type: 'gallery',
      name: 'Image Gallery',
      description: 'Showcase images or videos',
      category: 'premium',
      isPremium: true,
      requiredPlan: 'STARTER' as any,
      schemaJson: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['image', 'video'] },
                url: { type: 'string', title: 'URL' },
                caption: { type: 'string', title: 'Caption' }
              },
              required: ['type', 'url']
            }
          },
          layout: { type: 'string', enum: ['grid', 'carousel'], default: 'grid' },
          columns: { type: 'number', minimum: 2, maximum: 4, default: 3 }
        }
      },
      defaultProps: {
        items: [],
        layout: 'grid',
        columns: 3
      }
    },
    {
      type: 'analytics',
      name: 'Analytics Dashboard',
      description: 'View click and visitor analytics',
      category: 'pro',
      isPremium: true,
      requiredPlan: 'PRO' as any,
      schemaJson: {
        type: 'object',
        properties: {
          showViews: { type: 'boolean', title: 'Show Page Views', default: true },
          showClicks: { type: 'boolean', title: 'Show Link Clicks', default: true },
          timeframe: {
            type: 'string',
            title: 'Default Timeframe',
            enum: ['7d', '30d', '90d', '1y'],
            default: '30d'
          }
        }
      },
      defaultProps: {
        showViews: true,
        showClicks: true,
        timeframe: '30d'
      }
    }
  ]

  // Create block definitions
  for (const blockDef of blockDefinitions) {
    await prisma.blockDefinition.upsert({
      where: { type: blockDef.type },
      update: blockDef,
      create: blockDef
    })
  }

  console.log('✅ Block definitions created')

  // Create templates with full manifest data
  const templates = [
    {
      slug: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design perfect for professionals',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Minimal',
        version: '1.0.0',
        description: 'Clean and simple design perfect for professionals',
        thumbnail: '/templates/minimal-thumb.jpg',
        layout: {
          header: [],
          body: ['bio', 'link-list', 'social-icons'],
          footer: []
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: {
          'bio': 1,
          'link-list': 1,
          'social-icons': 1
        },
        defaults: {
          tokens: {
            '--primary-color': '#66A38A',
            '--secondary-color': '#2A3441',
            '--background': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            '--text-color': '#2D3748',
            '--card-background': '#FFFFFF',
            '--border-radius': '12px',
            '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          },
          blockProps: {
            'link-list': {
              style: 'card',
              gap: 'md'
            },
            'social-icons': {
              size: 'md',
              style: 'rounded'
            }
          },
          meta: {
            title: 'My Links',
            description: 'All my important links in one place'
          }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'modern',
      name: 'Modern',
      description: 'Sleek dark design with rounded avatar and elegant typography',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Modern',
        version: '1.0.0',
        description: 'Sleek dark design with rounded avatar and elegant typography',
        thumbnail: '/templates/modern-thumb.jpg',
        layout: {
          header: [],
          body: ['bio', 'link-list', 'social-icons'],
          footer: []
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: {
          'bio': 1,
          'link-list': 1,
          'social-icons': 1
        },
        defaults: {
          tokens: {
            '--primary-color': '#FFFFFF',
            '--secondary-color': '#A8A8A8',
            '--background': 'linear-gradient(135deg, #3A3A3A 0%, #2A2A2A 100%)',
            '--text-color': '#FFFFFF',
            '--text-secondary': '#D4D4D4',
            '--card-background': '#F5F4F0',
            '--card-text': '#5D4E37',
            '--border-radius': '24px',
            '--avatar-border': '3px solid rgba(255, 255, 255, 0.95)',
            '--shadow': '0 8px 32px rgba(0, 0, 0, 0.4)',
            '--button-hover': '#F0EFE8'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'xxl',
              avatarStyle: 'rounded-frame',
              textAlign: 'center',
              nameStyle: 'large-elegant',
              spacing: 'wide'
            },
            'link-list': {
              style: 'modern-cream',
              gap: 'md',
              buttonStyle: 'rounded'
            },
            'social-icons': {
              size: 'lg',
              style: 'filled',
              gap: 'lg'
            }
          },
          meta: {
            title: 'My Modern Profile',
            description: 'Connect with me through my curated links'
          }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'aurora',
      name: 'Aurora',
      description: 'Beautiful glassmorphism design with gradients',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Aurora',
        version: '1.0.0',
        description: 'Beautiful glassmorphism design with gradients',
        thumbnail: '/templates/aurora-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list', 'gallery'],
          footer: ['social-icons']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'gallery'],
        maxBlocks: {
          'bio': 1,
          'link-list': 1,
          'social-icons': 1,
          'gallery': 2
        },
        defaults: {
          tokens: {
            '--primary-color': '#8B5CF6',
            '--secondary-color': '#06B6D4',
            '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '--text-color': '#FFFFFF',
            '--card-background': 'rgba(255, 255, 255, 0.15)',
            '--border-radius': '20px',
            '--backdrop-blur': '10px',
            '--shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          },
          blockProps: {
            'link-list': {
              style: 'glass',
              gap: 'lg'
            },
            'social-icons': {
              size: 'lg',
              style: 'rounded'
            },
            'gallery': {
              layout: 'masonry',
              columns: 2
            }
          },
          meta: {
            title: 'My Beautiful Links',
            description: 'Discover my world through these curated links'
          }
        },
        isPaid: true,
        priceCents: 900,
        requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'professional',
      name: 'Professional',
      description: 'Corporate design with advanced features',
      category: 'pro',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Professional',
        version: '1.0.0',
        description: 'Corporate design with advanced features',
        thumbnail: '/templates/professional-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list', 'analytics'],
          footer: ['social-icons']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'analytics', 'gallery'],
        defaults: {
          tokens: {
            '--primary-color': '#1E40AF',
            '--secondary-color': '#64748B',
            '--background': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            '--text-color': '#1E293B',
            '--card-background': '#FFFFFF',
            '--border-radius': '8px',
            '--shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          },
          blockProps: {
            'link-list': {
              style: 'minimal',
              gap: 'sm'
            },
            'social-icons': {
              size: 'sm',
              style: 'minimal'
            },
            'analytics': {
              showViews: true,
              showClicks: true,
              timeframe: '30d'
            }
          },
          meta: {
            title: 'Professional Profile',
            description: 'Connect with me professionally'
          }
        },
        requiredPlan: 'PRO',
        requiredFeatures: ['analytics', 'custom-domain', 'remove-branding']
      }
    }
  ]

  for (const templateData of templates) {
    const template = await prisma.template.upsert({
      where: { slug: templateData.slug },
      update: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        status: templateData.status
      },
      create: {
        slug: templateData.slug,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        status: templateData.status
      }
    })

    await prisma.templateVersion.upsert({
      where: {
        templateId_version: {
          templateId: template.id,
          version: templateData.manifest.version
        }
      },
      update: {
        manifestJson: templateData.manifest as any,
        cssVarsJson: templateData.manifest.defaults.tokens as any,
        isPaid: templateData.category === 'premium' || templateData.manifest.isPaid || false,
        priceCents: templateData.manifest.priceCents || (templateData.category === 'premium' ? 900 : undefined),
        requiredPlan: templateData.category === 'pro' ? 'PRO' : (templateData.manifest.requiredPlan as any) || null,
        isActive: true,
        publishedAt: new Date()
      },
      create: {
        templateId: template.id,
        version: templateData.manifest.version,
        manifestJson: templateData.manifest as any,
        cssVarsJson: templateData.manifest.defaults.tokens as any,
        isPaid: templateData.category === 'premium' || templateData.manifest.isPaid || false,
        priceCents: templateData.manifest.priceCents || (templateData.category === 'premium' ? 900 : undefined),
        requiredPlan: templateData.category === 'pro' ? 'PRO' : (templateData.manifest.requiredPlan as any) || null,
        isActive: true,
        publishedAt: new Date()
      }
    })

    console.log(`✅ Template "${templateData.name}" created`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })