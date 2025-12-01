/**
 * Complete Database Seed Script
 * Includes full template manifests in database
 */

import { PrismaClient } from '../src/generated/prisma'
import { getTemplateCategoryData } from './template-category-mapping'
import { indonesiaTemplates } from './indonesia-templates'
import { newTemplates2024 } from './new-templates-2024'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create tags first
  const tags = [
    // Industry Tags
    { name: 'Business', slug: 'business', description: 'Professional business templates', color: '#1f2937', icon: '💼', category: 'industry', isPopular: true, sortOrder: 1 },
    { name: 'Tech', slug: 'tech', description: 'Technology and development focused', color: '#3b82f6', icon: '💻', category: 'industry', isPopular: true, sortOrder: 2 },
    { name: 'Creative', slug: 'creative', description: 'For artists, designers, and creators', color: '#8b5cf6', icon: '🎨', category: 'industry', isPopular: true, sortOrder: 3 },
    { name: 'Healthcare', slug: 'healthcare', description: 'Medical and wellness professionals', color: '#10b981', icon: '🏥', category: 'industry', isPopular: false, sortOrder: 10 },
    { name: 'Education', slug: 'education', description: 'Teachers, schools, and educational content', color: '#f59e0b', icon: '📚', category: 'industry', isPopular: false, sortOrder: 11 },
    { name: 'Food & Beverage', slug: 'food-beverage', description: 'Restaurants, chefs, and food businesses', color: '#ef4444', icon: '🍕', category: 'industry', isPopular: false, sortOrder: 12 },
    { name: 'Fitness', slug: 'fitness', description: 'Gyms, trainers, and fitness professionals', color: '#f97316', icon: '💪', category: 'industry', isPopular: false, sortOrder: 13 },
    { name: 'Fashion', slug: 'fashion', description: 'Fashion brands and style influencers', color: '#ec4899', icon: '👗', category: 'industry', isPopular: false, sortOrder: 14 },
    { name: 'Music', slug: 'music', description: 'Musicians, bands, and music industry', color: '#8b5cf6', icon: '🎵', category: 'industry', isPopular: true, sortOrder: 4 },
    { name: 'Sports', slug: 'sports', description: 'Athletes, teams, and sports organizations', color: '#059669', icon: '⚽', category: 'industry', isPopular: true, sortOrder: 5 },
    { name: 'Gaming', slug: 'gaming', description: 'Gamers, streamers, and gaming content', color: '#7c3aed', icon: '🎮', category: 'industry', isPopular: true, sortOrder: 6 },

    // Style Tags  
    { name: 'Minimal', slug: 'minimal', description: 'Clean, simple, and uncluttered design', color: '#6b7280', icon: '⚪', category: 'style', isPopular: true, sortOrder: 20 },
    { name: 'Dark Mode', slug: 'dark-mode', description: 'Dark themed templates', color: '#111827', icon: '🌙', category: 'style', isPopular: true, sortOrder: 21 },
    { name: 'Colorful', slug: 'colorful', description: 'Bright and vibrant designs', color: '#f59e0b', icon: '🌈', category: 'style', isPopular: true, sortOrder: 22 },
    { name: 'Gradient', slug: 'gradient', description: 'Beautiful gradient backgrounds', color: '#8b5cf6', icon: '🌅', category: 'style', isPopular: true, sortOrder: 23 },
    { name: 'Neon', slug: 'neon', description: 'Glowing neon effects and cyberpunk style', color: '#00ffff', icon: '⚡', category: 'style', isPopular: false, sortOrder: 30 },
    { name: 'Glassmorphism', slug: 'glassmorphism', description: 'Modern glass-like transparency effects', color: '#3b82f6', icon: '🔮', category: 'style', isPopular: false, sortOrder: 31 },
    { name: 'Retro', slug: 'retro', description: 'Vintage and retro-inspired designs', color: '#f59e0b', icon: '📼', category: 'style', isPopular: false, sortOrder: 32 },
    { name: 'Elegant', slug: 'elegant', description: 'Sophisticated and refined aesthetics', color: '#1f2937', icon: '✨', category: 'style', isPopular: false, sortOrder: 33 },

    // Purpose Tags
    { name: 'Personal', slug: 'personal', description: 'For individual personal use', color: '#6b7280', icon: '👤', category: 'purpose', isPopular: true, sortOrder: 40 },
    { name: 'Portfolio', slug: 'portfolio', description: 'Showcase work and projects', color: '#3b82f6', icon: '📁', category: 'purpose', isPopular: true, sortOrder: 41 },
    { name: 'Social Media', slug: 'social-media', description: 'Connect social media profiles', color: '#ec4899', icon: '📱', category: 'purpose', isPopular: true, sortOrder: 42 },
    { name: 'Resume', slug: 'resume', description: 'Professional CV and resume links', color: '#1f2937', icon: '📄', category: 'purpose', isPopular: false, sortOrder: 50 },
    { name: 'Event', slug: 'event', description: 'Promote events and gatherings', color: '#f59e0b', icon: '🎉', category: 'purpose', isPopular: false, sortOrder: 51 },
    { name: 'Shop', slug: 'shop', description: 'E-commerce and online stores', color: '#059669', icon: '🛒', category: 'purpose', isPopular: false, sortOrder: 52 },
    { name: 'Blog', slug: 'blog', description: 'Link to blog and articles', color: '#6b7280', icon: '📝', category: 'purpose', isPopular: false, sortOrder: 53 },

    // Audience Tags
    { name: 'Professional', slug: 'professional', description: 'For working professionals', color: '#1f2937', icon: '👔', category: 'audience', isPopular: true, sortOrder: 60 },
    { name: 'Student', slug: 'student', description: 'For students and academics', color: '#3b82f6', icon: '🎓', category: 'audience', isPopular: false, sortOrder: 70 },
    { name: 'Entrepreneur', slug: 'entrepreneur', description: 'For startup founders and entrepreneurs', color: '#f59e0b', icon: '🚀', category: 'audience', isPopular: false, sortOrder: 71 },
    { name: 'Influencer', slug: 'influencer', description: 'For social media influencers', color: '#ec4899', icon: '📸', category: 'audience', isPopular: true, sortOrder: 61 },
    { name: 'Freelancer', slug: 'freelancer', description: 'For independent contractors', color: '#8b5cf6', icon: '💼', category: 'audience', isPopular: false, sortOrder: 72 },
  ]

  for (const tagData of tags) {
    await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: tagData,
      create: tagData
    })
  }

  console.log('✅ Tags created')

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
          avatarStyle: { type: 'string', enum: ['circle', 'rounded-frame', 'square', 'blob', 'hexagon', 'star', 'diamond', 'wave', 'flower', 'badge', 'polaroid', 'vintage'], default: 'circle' },
          nameStyle: { type: 'string', enum: ['default', 'large-elegant', 'compact', 'modern-minimal', 'bold-impact', 'script-handwritten', 'tech-mono', 'gradient-text', 'neon-glow', 'vintage-serif'], default: 'default' },
          bioStyle: { type: 'string', enum: ['default', 'large', 'small', 'quote', 'modern'], default: 'default' },
          spacing: { type: 'string', enum: ['tight', 'normal', 'wide'], default: 'normal' }
        },
        required: ['name']
      },
      defaultProps: {
        name: 'Your Name',
        bio: 'Add your bio here',
        showAvatar: true,
        textAlign: 'center',
        avatarSize: 'lg',
        avatarStyle: 'circle',
        nameStyle: 'default',
        bioStyle: 'default',
        spacing: 'normal'
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
          platforms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', enum: ['twitter', 'x', 'instagram', 'facebook', 'threads', 'tiktok', 'snapchat', 'pinterest', 'reddit', 'linkedin', 'github', 'medium', 'behance', 'dribbble', 'whatsapp', 'telegram', 'discord', 'youtube', 'twitch', 'spotify', 'soundcloud'] },
                url: { type: 'string', title: 'URL' },
                username: { type: 'string', title: 'Username' }
              },
              required: ['platform', 'url']
            }
          },
          size: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' },
          style: { type: 'string', enum: ['round', 'square', 'minimal', 'neon', 'glassmorphism', 'neumorphic', 'floating', 'rotating', 'pulse', 'bounce'], default: 'round' },
          colorMode: { type: 'string', enum: ['brand', 'monochrome', 'custom'], default: 'brand' }
        }
      },
      defaultProps: {
        platforms: [],
        size: 'md',
        style: 'round',
        colorMode: 'brand'
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
    },
    {
      type: 'divider',
      name: 'Divider',
      description: 'Visual separator with multiple styles',
      category: 'basic',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          style: { type: 'string', enum: ['solid', 'dashed', 'dotted', 'double', 'gradient', 'gradient-rainbow', 'gradient-sunset', 'gradient-ocean'], default: 'solid' },
          thickness: { type: 'number', minimum: 1, maximum: 10, default: 1 },
          color: { type: 'string', default: '#e5e7eb' },
          spacing: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl'], default: 'md' },
          width: { type: 'string', enum: ['25', '50', '75', '100'], default: '100' },
          alignment: { type: 'string', enum: ['left', 'center', 'right'], default: 'center' },
          icon: { type: 'string', enum: ['none', 'sparkles', 'circle', 'square', 'star', 'heart', 'zap'], default: 'none' },
          animated: { type: 'boolean', default: false }
        }
      },
      defaultProps: {
        style: 'solid',
        thickness: 1,
        color: '#e5e7eb',
        spacing: 'md',
        width: '100',
        alignment: 'center',
        icon: 'none',
        animated: false
      }
    },
    {
      type: 'footer',
      name: 'Footer',
      description: 'Footer section with copyright and links',
      category: 'basic',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          copyrightText: { type: 'string', default: '© 2024 Your Name' },
          layout: { type: 'string', enum: ['centered', 'minimal', 'stacked', 'split'], default: 'centered' },
          showSocial: { type: 'boolean', default: true },
          showLinks: { type: 'boolean', default: true },
          links: { type: 'array', default: [] },
          socialLinks: { type: 'array', default: [] },
          backgroundColor: { type: 'string', default: '#ffffff' },
          textColor: { type: 'string', default: '#374151' },
          spacing: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl'], default: 'md' },
          borderTop: { type: 'boolean', default: false }
        }
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
        borderTop: false
      }
    },
    // Indonesia-Specific Blocks
    {
      type: 'whatsapp-business',
      name: 'WhatsApp Business',
      description: 'WhatsApp Business contact with Indonesian phone formatting',
      category: 'indonesia',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string', title: 'Phone Number' },
          message: { type: 'string', title: 'Pre-filled Message' },
          buttonText: { type: 'string', default: 'Chat via WhatsApp' },
          buttonStyle: { type: 'string', enum: ['fab', 'filled', 'outlined', 'minimal'], default: 'fab' },
          showIcon: { type: 'boolean', default: true },
          businessName: { type: 'string', title: 'Business Name' },
          fabPosition: { type: 'string', enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center'], default: 'bottom-right' },
          fabSize: { type: 'string', enum: ['small', 'default', 'large'], default: 'default' },
          showLabel: { type: 'boolean', default: true },
          enablePulse: { type: 'boolean', default: true },
          expandOnHover: { type: 'boolean', default: true }
        },
        required: ['phoneNumber']
      },
      defaultProps: {
        phoneNumber: '081234567890',
        buttonText: 'Chat via WhatsApp',
        buttonStyle: 'fab',
        showIcon: true,
        fabPosition: 'bottom-right',
        fabSize: 'default',
        showLabel: true,
        enablePulse: true,
        expandOnHover: true
      }
    },
    {
      type: 'delivery-platform',
      name: 'Delivery Platform',
      description: 'Food delivery platform links (GoFood, GrabFood, ShopeeFood)',
      category: 'indonesia',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          platforms: { type: 'object' },
          layout: { type: 'string', enum: ['buttons', 'grid', 'carousel'], default: 'buttons' },
          showRatings: { type: 'boolean', default: true },
          showPromos: { type: 'boolean', default: true },
          primaryPlatform: { type: 'string', enum: ['gofood', 'grabfood', 'shopeefood'], default: 'gofood' }
        }
      },
      defaultProps: {
        platforms: {},
        layout: 'buttons',
        showRatings: true,
        showPromos: true
      }
    },
    {
      type: 'marketplace',
      name: 'Marketplace',
      description: 'E-commerce marketplace store links (Tokopedia, Shopee, TikTok Shop)',
      category: 'indonesia',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          stores: { type: 'object' },
          layout: { type: 'string', enum: ['buttons', 'grid', 'mixed'], default: 'buttons' },
          showBadges: { type: 'boolean', default: true },
          showRatings: { type: 'boolean', default: true },
          featuredProducts: { type: 'array', default: [] }
        }
      },
      defaultProps: {
        stores: {},
        layout: 'buttons',
        showBadges: true,
        showRatings: true
      }
    },
    {
      type: 'location',
      name: 'Location',
      description: 'Google Maps location with opening hours',
      category: 'indonesia',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          googleMapsUrl: { type: 'string', title: 'Google Maps Embed URL' },
          address: { type: 'string', title: 'Address' },
          phone: { type: 'string', title: 'Phone' },
          openingHours: { type: 'array', default: [] },
          locationName: { type: 'string', title: 'Location Name' },
          showDirectionsButton: { type: 'boolean', default: true },
          mapHeight: { type: 'number', default: 300 },
          showCurrentStatus: { type: 'boolean', default: true }
        }
      },
      defaultProps: {
        showDirectionsButton: true,
        mapHeight: 300,
        showCurrentStatus: true
      }
    },
    {
      type: 'qris-payment',
      name: 'QRIS Payment',
      description: 'QRIS QR code payment for Indonesian e-wallets',
      category: 'indonesia',
      isPremium: false,
      schemaJson: {
        type: 'object',
        properties: {
          qrisImage: { type: 'string', title: 'QRIS QR Code Image URL' },
          merchantName: { type: 'string', title: 'Merchant Name' },
          paymentMethods: { type: 'array', default: ['Gopay', 'OVO', 'Dana', 'ShopeePay'] },
          presetAmounts: { type: 'array', default: [] },
          allowCustomAmount: { type: 'boolean', default: true },
          instructions: { type: 'string', title: 'Payment Instructions' },
          showPaymentLogos: { type: 'boolean', default: true }
        }
      },
      defaultProps: {
        paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
        allowCustomAmount: true,
        showPaymentLogos: true
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
          backgroundKey: 'gradient-soft-clouds',
          tokens: {
            '--primary-color': '#66A38A',
            '--secondary-color': '#2A3441',
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
          backgroundKey: 'gradient-carbon-fiber',
          tokens: {
            '--primary-color': '#FFFFFF',
            '--secondary-color': '#A8A8A8',
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
          backgroundKey: 'gradient-ocean-breeze',
          tokens: {
            '--primary-color': '#8B5CF6',
            '--secondary-color': '#06B6D4',
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
              layout: 'grid',
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
          backgroundKey: 'gradient-pearl-white',
          tokens: {
            '--primary-color': '#1E40AF',
            '--secondary-color': '#64748B',
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
    },
    {
      slug: 'cosmic-gradient',
      name: 'Cosmic Gradient',
      description: 'Futuristic gradient design with holographic button effects',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Cosmic Gradient',
        version: '1.0.0',
        description: 'Futuristic gradient design with holographic button effects',
        thumbnail: '/templates/cosmic-gradient-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list'],
          footer: ['social-icons']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: {
          'bio': 1,
          'link-list': 1,
          'social-icons': 1
        },
        defaults: {
          backgroundKey: 'gradient-aurora-borealis',
          tokens: {
            '--primary-color': '#8B5CF6',
            '--secondary-color': '#EC4899',
            '--text-color': '#FFFFFF',
            '--card-background': 'rgba(255, 255, 255, 0.1)',
            '--border-radius': '20px',
            '--shadow': '0 8px 32px rgba(31, 38, 135, 0.37)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'xl',
              avatarStyle: 'circle',
              textAlign: 'center',
              nameStyle: 'large-elegant',
              spacing: 'wide'
            },
            'link-list': {
              style: 'hologram',
              gap: 'lg',
              customColors: {
                primary: '#8B5CF6',
                secondary: '#EC4899',
                text: '#FFFFFF',
                accent: '#F59E0B',
                background: 'rgba(255, 255, 255, 0.1)'
              }
            },
            'social-icons': {
              size: 'lg',
              style: 'rounded'
            }
          },
          meta: {
            title: 'Cosmic Links',
            description: 'Step into the future with my digital universe'
          }
        },
        isPaid: true,
        priceCents: 1200,
        requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'neon-cyberpunk',
      name: 'Neon Cyberpunk',
      description: 'Dark cyberpunk theme with neon glowing effects and terminal-style buttons',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Neon Cyberpunk',
        version: '1.0.0',
        description: 'Dark cyberpunk theme with neon glowing effects and terminal-style buttons',
        thumbnail: '/templates/neon-cyberpunk-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list'],
          footer: ['social-icons']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: {
          'bio': 1,
          'link-list': 1,
          'social-icons': 1
        },
        defaults: {
          backgroundKey: 'gradient-dark-ocean',
          tokens: {
            '--primary-color': '#00FFFF',
            '--secondary-color': '#FF0080',
            '--text-color': '#00FFFF',
            '--card-background': '#000000',
            '--border-radius': '8px',
            '--shadow': '0 0 20px rgba(0, 255, 255, 0.3)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'lg',
              avatarStyle: 'circle',
              textAlign: 'center',
              nameStyle: 'default',
              spacing: 'normal'
            },
            'link-list': {
              style: 'terminal',
              gap: 'md',
              customColors: {
                primary: '#00FFFF',
                secondary: '#FF0080',
                text: '#00FFFF',
                accent: '#FFFF00',
                background: '#000000'
              }
            },
            'social-icons': {
              size: 'md',
              style: 'rounded'
            }
          },
          meta: {
            title: 'CYBER_LINKS.EXE',
            description: 'Access granted > Enter the matrix of connections'
          }
        },
        isPaid: true,
        priceCents: 1200,
        requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'retro-synthwave',
      name: 'Retro Synthwave',
      description: 'Nostalgic 80s synthwave aesthetic with neon purple and pink gradients',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Retro Synthwave',
        version: '1.0.0',
        description: 'Nostalgic 80s synthwave aesthetic with neon purple and pink gradients',
        thumbnail: '/templates/retro-synthwave-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list'],
          footer: ['social-icons']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-cyberpunk-night',
          tokens: {
            '--primary-color': '#FF0080',
            '--secondary-color': '#8B5CF6',
            '--text-color': '#FFE0FF',
            '--card-background': 'rgba(255, 0, 128, 0.1)',
            '--border-radius': '12px',
            '--shadow': '0 0 30px rgba(255, 0, 128, 0.4)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'neon', gap: 'lg', customColors: { primary: '#FF0080', secondary: '#8B5CF6', text: '#FFE0FF', accent: '#00FFFF', background: 'rgba(255, 0, 128, 0.05)' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: 'RETROWAVE.LINK', description: 'Dive into the neon-soaked digital nostalgia' }
        },
        isPaid: true, priceCents: 1200, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'forest-nature',
      name: 'Forest Nature',
      description: 'Calming forest green theme perfect for eco-friendly and wellness brands',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Forest Nature',
        version: '1.0.0',
        description: 'Calming forest green theme perfect for eco-friendly and wellness brands',
        thumbnail: '/templates/forest-nature-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-mint-fresh',
          tokens: {
            '--primary-color': '#059669',
            '--secondary-color': '#065f46',
            '--text-color': '#064e3b',
            '--card-background': 'rgba(255, 255, 255, 0.8)',
            '--border-radius': '16px',
            '--shadow': '0 4px 16px rgba(5, 150, 105, 0.2)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'lg', avatarStyle: 'rounded', textAlign: 'center', nameStyle: 'default', spacing: 'normal' },
            'link-list': { style: 'wood', gap: 'md', customColors: { primary: '#059669', secondary: '#065f46', text: '#ffffff', accent: '#34d399', background: '#f0fdf4' } },
            'social-icons': { size: 'md', style: 'rounded' }
          },
          meta: { title: 'My Green Space', description: 'Naturally connected, sustainably minded' }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'ocean-waves',
      name: 'Ocean Waves',
      description: 'Serene ocean blue gradients with flowing wave-like button animations',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Ocean Waves',
        version: '1.0.0',
        description: 'Serene ocean blue gradients with flowing wave-like button animations',
        thumbnail: '/templates/ocean-waves-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-aqua-splash',
          tokens: {
            '--primary-color': '#0ea5e9',
            '--secondary-color': '#0284c7',
            '--text-color': '#0c4a6e',
            '--card-background': 'rgba(255, 255, 255, 0.9)',
            '--border-radius': '20px',
            '--shadow': '0 8px 24px rgba(14, 165, 233, 0.3)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'bubble', gap: 'lg', customColors: { primary: '#0ea5e9', secondary: '#0284c7', text: '#ffffff', accent: '#38bdf8', background: 'rgba(14, 165, 233, 0.1)' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: 'Ocean Links', description: 'Dive deep into my digital ocean' }
        },
        isPaid: true, priceCents: 1000, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'sunset-desert',
      name: 'Sunset Desert',
      description: 'Warm sunset colors with sandy textures for travel and lifestyle content',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Sunset Desert',
        version: '1.0.0',
        description: 'Warm sunset colors with sandy textures for travel and lifestyle content',
        thumbnail: '/templates/sunset-desert-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-peachy-keen',
          tokens: {
            '--primary-color': '#f97316',
            '--secondary-color': '#ea580c',
            '--text-color': '#9a3412',
            '--card-background': 'rgba(255, 255, 255, 0.85)',
            '--border-radius': '14px',
            '--shadow': '0 6px 20px rgba(249, 115, 22, 0.25)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'pixel', gap: 'lg', customColors: { primary: '#f97316', secondary: '#ea580c', text: '#9a3412', accent: '#fdba74', background: '#fff7ed' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: 'Desert Wanderer', description: 'Following the sunset, chasing adventures' }
        },
        isPaid: true, priceCents: 1000, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'midnight-gamer',
      name: 'Midnight Gamer',
      description: 'Dark gaming theme with RGB accents and pixel-style elements',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Midnight Gamer',
        version: '1.0.0',
        description: 'Dark gaming theme with RGB accents and pixel-style elements',
        thumbnail: '/templates/midnight-gamer-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-space-void',
          tokens: {
            '--primary-color': '#22c55e',
            '--secondary-color': '#16a34a',
            '--text-color': '#22c55e',
            '--card-background': '#111111',
            '--border-radius': '8px',
            '--shadow': '0 0 25px rgba(34, 197, 94, 0.4)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'lg', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'default', spacing: 'normal' },
            'link-list': { style: 'pixel', gap: 'md', customColors: { primary: '#22c55e', secondary: '#16a34a', text: '#000000', accent: '#84cc16', background: '#0a0a0a' } },
            'social-icons': { size: 'md', style: 'rounded' }
          },
          meta: { title: 'GAMER.HUB', description: 'Level up your connections' }
        },
        isPaid: true, priceCents: 1200, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'marble-luxury',
      name: 'Marble Luxury',
      description: 'Elegant marble textures with gold accents for premium brands',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Marble Luxury',
        version: '1.0.0',
        description: 'Elegant marble textures with gold accents for premium brands',
        thumbnail: '/templates/marble-luxury-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-pearl-white',
          tokens: {
            '--primary-color': '#d4af37',
            '--secondary-color': '#b8860b',
            '--text-color': '#1e293b',
            '--card-background': '#ffffff',
            '--border-radius': '12px',
            '--shadow': '0 8px 32px rgba(212, 175, 55, 0.2)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'rounded-frame', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'metallic', gap: 'lg', customColors: { primary: '#d4af37', secondary: '#b8860b', text: '#1e293b', accent: '#fbbf24', background: '#ffffff' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: 'Luxury Collection', description: 'Crafted with excellence, designed for distinction' }
        },
        isPaid: true, priceCents: 1500, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'sakura-zen',
      name: 'Sakura Zen',
      description: 'Peaceful Japanese-inspired design with soft pink cherry blossom theme',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Sakura Zen',
        version: '1.0.0',
        description: 'Peaceful Japanese-inspired design with soft pink cherry blossom theme',
        thumbnail: '/templates/sakura-zen-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-lavender-dream',
          tokens: {
            '--primary-color': '#f43f5e',
            '--secondary-color': '#e11d48',
            '--text-color': '#881337',
            '--card-background': 'rgba(255, 255, 255, 0.9)',
            '--border-radius': '18px',
            '--shadow': '0 4px 20px rgba(244, 63, 94, 0.15)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'minimal-line', gap: 'lg', customColors: { primary: '#f43f5e', secondary: '#e11d48', text: '#881337', accent: '#fbcfe8', background: '#fdf2f8' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: '桜 Sakura Links', description: 'Beauty in simplicity, harmony in design' }
        },
        isPaid: true, priceCents: 1100, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'electric-music',
      name: 'Electric Music',
      description: 'Vibrant electric theme perfect for DJs, musicians, and music producers',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Electric Music',
        version: '1.0.0',
        description: 'Vibrant electric theme perfect for DJs, musicians, and music producers',
        thumbnail: '/templates/electric-music-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-electric-violet',
          tokens: {
            '--primary-color': '#facc15',
            '--secondary-color': '#eab308',
            '--text-color': '#facc15',
            '--card-background': 'rgba(250, 204, 21, 0.1)',
            '--border-radius': '10px',
            '--shadow': '0 0 30px rgba(250, 204, 21, 0.5)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'modern', gap: 'lg', customColors: { primary: '#facc15', secondary: '#eab308', text: '#000000', accent: '#fbbf24', background: 'rgba(250, 204, 21, 0.05)' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: '⚡ ELECTRIC BEATS', description: 'Feel the rhythm, share the energy' }
        },
        isPaid: true, priceCents: 1200, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'arctic-ice',
      name: 'Arctic Ice',
      description: 'Cool ice-blue theme with crystalline glass effects and winter vibes',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Arctic Ice',
        version: '1.0.0',
        description: 'Cool ice-blue theme with crystalline glass effects and winter vibes',
        thumbnail: '/templates/arctic-ice-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-pastel-sky',
          tokens: {
            '--primary-color': '#06b6d4',
            '--secondary-color': '#0891b2',
            '--text-color': '#0c4a6e',
            '--card-background': 'rgba(255, 255, 255, 0.8)',
            '--border-radius': '16px',
            '--shadow': '0 8px 32px rgba(6, 182, 212, 0.3)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'glass', gap: 'lg', customColors: { primary: '#06b6d4', secondary: '#0891b2', text: '#0c4a6e', accent: '#67e8f9', background: 'rgba(255, 255, 255, 0.6)' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: 'Arctic Links', description: 'Pure as ice, clear as crystal' }
        },
        isPaid: true, priceCents: 1100, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'fitness-energy',
      name: 'Fitness Energy',
      description: 'High-energy orange and red theme perfect for fitness trainers and gyms',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Fitness Energy',
        version: '1.0.0',
        description: 'High-energy orange and red theme perfect for fitness trainers and gyms',
        thumbnail: '/templates/fitness-energy-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-cherry-blossom',
          tokens: {
            '--primary-color': '#dc2626',
            '--secondary-color': '#b91c1c',
            '--text-color': '#7f1d1d',
            '--card-background': 'rgba(255, 255, 255, 0.9)',
            '--border-radius': '12px',
            '--shadow': '0 4px 20px rgba(220, 38, 38, 0.25)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'lg', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'default', spacing: 'normal' },
            'link-list': { style: 'modern', gap: 'md', customColors: { primary: '#dc2626', secondary: '#b91c1c', text: '#ffffff', accent: '#fecaca', background: '#fef2f2' } },
            'social-icons': { size: 'md', style: 'rounded' }
          },
          meta: { title: 'Fitness Hub', description: 'Stronger every day, unstoppable every way' }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'space-explorer',
      name: 'Space Explorer',
      description: 'Deep space theme with stars and cosmic elements for astronomy enthusiasts',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Space Explorer',
        version: '1.0.0',
        description: 'Deep space theme with stars and cosmic elements for astronomy enthusiasts',
        thumbnail: '/templates/space-explorer-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-midnight-city',
          tokens: {
            '--primary-color': '#a855f7',
            '--secondary-color': '#9333ea',
            '--text-color': '#e0e7ff',
            '--card-background': 'rgba(168, 85, 247, 0.1)',
            '--border-radius': '14px',
            '--shadow': '0 0 30px rgba(168, 85, 247, 0.4)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'neomorphism', gap: 'lg', customColors: { primary: '#a855f7', secondary: '#9333ea', text: '#e0e7ff', accent: '#c4b5fd', background: '#1e1b4b' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: '🚀 SPACE LINKS', description: 'Exploring the infinite cosmos of connections' }
        },
        isPaid: true, priceCents: 1300, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'coffee-artist',
      name: 'Coffee Artist',
      description: 'Warm coffee brown theme perfect for cafes, baristas, and coffee lovers',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Coffee Artist',
        version: '1.0.0',
        description: 'Warm coffee brown theme perfect for cafes, baristas, and coffee lovers',
        thumbnail: '/templates/coffee-artist-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-desert-sand',
          tokens: {
            '--primary-color': '#92400e',
            '--secondary-color': '#78350f',
            '--text-color': '#451a03',
            '--card-background': 'rgba(255, 255, 255, 0.9)',
            '--border-radius': '12px',
            '--shadow': '0 4px 16px rgba(146, 64, 14, 0.2)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'lg', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'default', spacing: 'normal' },
            'link-list': { style: 'sketch', gap: 'md', customColors: { primary: '#92400e', secondary: '#78350f', text: '#451a03', accent: '#fed7aa', background: '#fef7ed' } },
            'social-icons': { size: 'md', style: 'rounded' }
          },
          meta: { title: '☕ Coffee Links', description: 'Brewing connections, one cup at a time' }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'monochrome-artist',
      name: 'Monochrome Artist',
      description: 'Sophisticated black and white design for photographers and visual artists',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Monochrome Artist',
        version: '1.0.0',
        description: 'Sophisticated black and white design for photographers and visual artists',
        thumbnail: '/templates/monochrome-artist-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-pearl-white',
          tokens: {
            '--primary-color': '#374151',
            '--secondary-color': '#1f2937',
            '--text-color': '#111827',
            '--card-background': '#ffffff',
            '--border-radius': '8px',
            '--shadow': '0 4px 16px rgba(0, 0, 0, 0.1)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'lg', avatarStyle: 'rounded', textAlign: 'center', nameStyle: 'default', spacing: 'normal' },
            'link-list': { style: 'underline', gap: 'md', customColors: { primary: '#374151', secondary: '#1f2937', text: '#111827', accent: '#6b7280', background: '#ffffff' } },
            'social-icons': { size: 'md', style: 'minimal' }
          },
          meta: { title: 'Monochrome Portfolio', description: 'Capturing life in shades of meaning' }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'tropical-paradise',
      name: 'Tropical Paradise',
      description: 'Vibrant tropical theme with turquoise and coral colors for travel brands',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Tropical Paradise',
        version: '1.0.0',
        description: 'Vibrant tropical theme with turquoise and coral colors for travel brands',
        thumbnail: '/templates/tropical-paradise-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          backgroundKey: 'gradient-aqua-splash',
          tokens: {
            '--primary-color': '#06b6d4',
            '--secondary-color': '#0891b2',
            '--text-color': '#0e7490',
            '--card-background': 'rgba(255, 255, 255, 0.85)',
            '--border-radius': '20px',
            '--shadow': '0 8px 24px rgba(6, 182, 212, 0.3)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'brush', gap: 'lg', customColors: { primary: '#06b6d4', secondary: '#0891b2', text: '#ffffff', accent: '#67e8f9', background: '#ecfeff' } },
            'social-icons': { size: 'lg', style: 'rounded' }
          },
          meta: { title: '🏝️ Paradise Links', description: 'Escape to your digital tropical getaway' }
        },
        isPaid: true, priceCents: 1100, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'mountain-landscape',
      name: 'Mountain Landscape',
      description: 'Stunning mountain landscape background with nature-inspired design',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Mountain Landscape',
        version: '1.0.0',
        description: 'Stunning mountain landscape background with nature-inspired design',
        thumbnail: '/templates/mountain-landscape-thumb.jpg',
        layout: { header: ['bio'], body: ['link-list'], footer: ['social-icons'] },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'gallery'],
        maxBlocks: { 'bio': 1, 'link-list': 1, 'social-icons': 1 },
        defaults: {
          tokens: {
            '--primary-color': '#059669',
            '--secondary-color': '#047857',
            '--background': 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80") center/cover fixed',
            '--background-overlay': 'rgba(0, 0, 0, 0.3)',
            '--text-color': '#FFFFFF',
            '--card-background': 'rgba(255, 255, 255, 0.15)',
            '--card-backdrop-filter': 'blur(10px)',
            '--border-radius': '16px',
            '--border': '1px solid rgba(255, 255, 255, 0.2)',
            '--shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          },
          blockProps: {
            'bio': { showAvatar: true, avatarSize: 'xl', avatarStyle: 'circle', textAlign: 'center', nameStyle: 'large-elegant', spacing: 'wide' },
            'link-list': { style: 'glass', gap: 'lg', customColors: { primary: '#059669', secondary: '#047857', text: '#ffffff', accent: '#10b981', background: 'rgba(255, 255, 255, 0.15)' } },
            'social-icons': { size: 'lg', style: 'round' }
          },
          meta: { title: '🏔️ Mountain Explorer', description: 'Adventure awaits in the mountains' }
        },
        isPaid: true, priceCents: 1500, requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'student-portfolio',
      name: 'Student Portfolio',
      description: 'Clean academic portfolio for students and graduates',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Student Portfolio',
        version: '1.0.0',
        description: 'Clean academic portfolio for students and graduates',
        thumbnail: '/templates/student-portfolio-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list', 'divider', 'gallery'],
          footer: ['footer']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'divider', 'footer', 'gallery'],
        defaults: {
          backgroundKey: 'gradient-pastel-sky',
          tokens: {
            '--primary-color': '#3b82f6',
            '--secondary-color': '#2563eb',
            '--text-color': '#1e3a8a',
            '--card-background': '#ffffff',
            '--border-radius': '12px',
            '--shadow': '0 4px 12px rgba(59, 130, 246, 0.15)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'lg',
              avatarStyle: 'rounded-frame',
              nameStyle: 'default',
              textAlign: 'center',
              spacing: 'normal'
            },
            'link-list': {
              style: 'card',
              gap: 'md'
            },
            'divider': {
              style: 'solid',
              thickness: 1,
              color: '#3b82f6'
            },
            'footer': {
              layout: 'minimal',
              copyrightText: '© 2024 Student',
              showSocial: true,
              showLinks: false
            }
          },
          meta: {
            title: 'My Student Portfolio',
            description: 'Academic achievements and projects'
          }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'entrepreneur-startup',
      name: 'Entrepreneur Startup',
      description: 'Professional startup founder profile with bold design',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Entrepreneur Startup',
        version: '1.0.0',
        description: 'Professional startup founder profile with bold design',
        thumbnail: '/templates/entrepreneur-startup-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['divider', 'link-list'],
          footer: ['social-icons', 'footer']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'divider', 'footer'],
        defaults: {
          backgroundKey: 'gradient-desert-sand',
          tokens: {
            '--primary-color': '#f59e0b',
            '--secondary-color': '#d97706',
            '--text-color': '#78350f',
            '--card-background': '#ffffff',
            '--border-radius': '10px',
            '--shadow': '0 6px 16px rgba(245, 158, 11, 0.2)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'xl',
              avatarStyle: 'hexagon',
              nameStyle: 'bold-impact',
              textAlign: 'center',
              spacing: 'wide'
            },
            'link-list': {
              style: 'modern',
              gap: 'lg'
            },
            'divider': {
              style: 'solid',
              thickness: 2,
              color: '#f59e0b'
            },
            'footer': {
              layout: 'centered',
              showSocial: true,
              showLinks: true
            }
          },
          meta: {
            title: 'Startup Founder',
            description: 'Building the future, one idea at a time'
          }
        },
        requiredPlan: 'FREE'
      }
    },
    {
      slug: 'restaurant-menu',
      name: 'Restaurant Menu',
      description: 'Elegant restaurant and cafe menu link page',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Restaurant Menu',
        version: '1.0.0',
        description: 'Elegant restaurant and cafe menu link page',
        thumbnail: '/templates/restaurant-menu-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['gallery', 'divider', 'link-list'],
          footer: ['footer']
        },
        allowedBlocks: ['bio', 'link-list', 'gallery', 'divider', 'footer'],
        defaults: {
          backgroundKey: 'gradient-cherry-blossom',
          tokens: {
            '--primary-color': '#dc2626',
            '--secondary-color': '#b91c1c',
            '--text-color': '#7f1d1d',
            '--card-background': '#ffffff',
            '--border-radius': '16px',
            '--shadow': '0 6px 20px rgba(220, 38, 38, 0.2)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'xxl',
              avatarStyle: 'rounded-frame',
              nameStyle: 'large-elegant',
              textAlign: 'center',
              spacing: 'wide'
            },
            'link-list': {
              style: 'card',
              gap: 'md'
            },
            'gallery': {
              layout: 'grid',
              columns: 2,
              aspectRatio: 'square'
            },
            'divider': {
              style: 'gradient',
              thickness: 2,
              color: '#dc2626'
            },
            'footer': {
              layout: 'stacked',
              showSocial: true,
              showLinks: true,
              links: [
                { label: 'Order Now', url: '#', external: false },
                { label: 'Location', url: '#', external: false }
              ]
            }
          },
          meta: {
            title: 'Our Restaurant',
            description: 'Delicious food, memorable experiences'
          }
        },
        isPaid: true,
        priceCents: 1000,
        requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'wedding-event',
      name: 'Wedding Event',
      description: 'Romantic wedding invitation and event details page',
      category: 'premium',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Wedding Event',
        version: '1.0.0',
        description: 'Romantic wedding invitation and event details page',
        thumbnail: '/templates/wedding-event-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['divider', 'link-list', 'divider', 'gallery'],
          footer: ['footer']
        },
        allowedBlocks: ['bio', 'link-list', 'gallery', 'divider', 'footer'],
        defaults: {
          backgroundKey: 'gradient-lavender-dream',
          tokens: {
            '--primary-color': '#f472b6',
            '--secondary-color': '#ec4899',
            '--text-color': '#831843',
            '--card-background': 'rgba(255, 255, 255, 0.9)',
            '--border-radius': '20px',
            '--shadow': '0 8px 24px rgba(244, 114, 182, 0.25)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'xxl',
              avatarStyle: 'flower',
              nameStyle: 'script-handwritten',
              bioStyle: 'quote',
              textAlign: 'center',
              spacing: 'wide'
            },
            'link-list': {
              style: 'glass',
              gap: 'lg'
            },
            'divider': {
              style: 'gradient',
              thickness: 2,
              icon: 'heart',
              color: '#f472b6'
            },
            'gallery': {
              layout: 'carousel',
              columns: 1,
              aspectRatio: 'landscape'
            },
            'footer': {
              layout: 'centered',
              copyrightText: '© 2024 Our Special Day',
              showSocial: false,
              showLinks: true
            }
          },
          meta: {
            title: 'Our Wedding',
            description: 'Join us in celebrating our love'
          }
        },
        isPaid: true,
        priceCents: 1500,
        requiredFeatures: ['premium-templates']
      }
    },
    {
      slug: 'developer-tech',
      name: 'Developer Tech',
      description: 'Modern developer portfolio with terminal aesthetics',
      category: 'free',
      status: 'PUBLISHED' as const,
      manifest: {
        name: 'Developer Tech',
        version: '1.0.0',
        description: 'Modern developer portfolio with terminal aesthetics',
        thumbnail: '/templates/developer-tech-thumb.jpg',
        layout: {
          header: ['bio'],
          body: ['link-list', 'divider'],
          footer: ['footer']
        },
        allowedBlocks: ['bio', 'link-list', 'social-icons', 'divider', 'footer'],
        defaults: {
          backgroundKey: 'gradient-space-void',
          tokens: {
            '--primary-color': '#22c55e',
            '--secondary-color': '#16a34a',
            '--text-color': '#22c55e',
            '--card-background': '#111111',
            '--border-radius': '8px',
            '--shadow': '0 0 20px rgba(34, 197, 94, 0.3)'
          },
          blockProps: {
            'bio': {
              showAvatar: true,
              avatarSize: 'lg',
              avatarStyle: 'hexagon',
              nameStyle: 'tech-mono',
              textAlign: 'center',
              spacing: 'normal'
            },
            'link-list': {
              style: 'terminal',
              gap: 'md'
            },
            'divider': {
              style: 'dashed',
              thickness: 1,
              color: '#22c55e'
            },
            'footer': {
              layout: 'minimal',
              copyrightText: '© 2024 Developer',
              backgroundColor: '#000000',
              textColor: '#22c55e',
              showSocial: true
            }
          },
          meta: {
            title: 'DEV_PORTFOLIO',
            description: 'Code. Build. Deploy.'
          }
        },
        requiredPlan: 'FREE'
      }
    }
  ]

  // Merge all templates: base + Indonesia-specific + new 2024 templates
  const allTemplates = [...templates, ...indonesiaTemplates, ...newTemplates2024]

  console.log(`📦 Total templates to seed: ${allTemplates.length}`)

  for (const templateData of allTemplates) {
    // Get category data for this template
    const categoryData = getTemplateCategoryData(templateData.slug)

    const template = await prisma.template.upsert({
      where: { slug: templateData.slug },
      update: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        status: templateData.status,
        // Update category fields
        ...(categoryData && {
          primaryCategory: categoryData.primaryCategory,
          subCategory: categoryData.subCategory,
          industryTags: categoryData.industryTags,
          targetAudience: categoryData.targetAudience,
          recommendedFor: categoryData.recommendedFor,
          includesFeatures: categoryData.includesFeatures,
          localizedName: categoryData.localizedName,
          localizedDesc: categoryData.localizedDesc
        })
      },
      create: {
        slug: templateData.slug,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        status: templateData.status,
        // Add category fields
        ...(categoryData && {
          primaryCategory: categoryData.primaryCategory,
          subCategory: categoryData.subCategory,
          industryTags: categoryData.industryTags,
          targetAudience: categoryData.targetAudience,
          recommendedFor: categoryData.recommendedFor,
          includesFeatures: categoryData.includesFeatures,
          localizedName: categoryData.localizedName,
          localizedDesc: categoryData.localizedDesc
        })
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

  // Create template-tag relationships
  const templateTagMappings = [
    {
      templateSlug: 'minimal',
      tagSlugs: ['minimal', 'business', 'professional', 'personal', 'portfolio']
    },
    {
      templateSlug: 'modern', 
      tagSlugs: ['dark-mode', 'elegant', 'business', 'professional', 'creative', 'portfolio']
    },
    {
      templateSlug: 'aurora',
      tagSlugs: ['gradient', 'glassmorphism', 'colorful', 'creative', 'influencer', 'personal']
    },
    {
      templateSlug: 'professional',
      tagSlugs: ['minimal', 'business', 'professional', 'resume', 'entrepreneur'] 
    },
    {
      templateSlug: 'cosmic-gradient',
      tagSlugs: ['gradient', 'neon', 'tech', 'gaming', 'creative', 'influencer']
    },
    {
      templateSlug: 'neon-cyberpunk', 
      tagSlugs: ['neon', 'dark-mode', 'tech', 'gaming', 'creative', 'freelancer']
    },
    {
      templateSlug: 'retro-synthwave',
      tagSlugs: ['retro', 'neon', 'music', 'creative', 'influencer', 'colorful']
    },
    {
      templateSlug: 'forest-nature',
      tagSlugs: ['minimal', 'healthcare', 'personal', 'business', 'portfolio']
    },
    {
      templateSlug: 'ocean-waves',
      tagSlugs: ['gradient', 'colorful', 'personal', 'influencer', 'creative']
    },
    {
      templateSlug: 'sunset-desert',
      tagSlugs: ['gradient', 'colorful', 'personal', 'influencer', 'portfolio']
    },
    {
      templateSlug: 'midnight-gamer',
      tagSlugs: ['dark-mode', 'gaming', 'tech', 'creative', 'influencer']
    },
    {
      templateSlug: 'marble-luxury',
      tagSlugs: ['elegant', 'business', 'professional', 'entrepreneur', 'portfolio']
    },
    {
      templateSlug: 'sakura-zen',
      tagSlugs: ['elegant', 'minimal', 'personal', 'creative', 'portfolio']
    },
    {
      templateSlug: 'electric-music',
      tagSlugs: ['music', 'neon', 'creative', 'influencer', 'colorful']
    },
    {
      templateSlug: 'arctic-ice',
      tagSlugs: ['glassmorphism', 'minimal', 'personal', 'creative', 'portfolio']
    },
    {
      templateSlug: 'fitness-energy',
      tagSlugs: ['fitness', 'business', 'professional', 'personal', 'colorful']
    },
    {
      templateSlug: 'space-explorer',
      tagSlugs: ['tech', 'creative', 'dark-mode', 'personal', 'portfolio']
    },
    {
      templateSlug: 'coffee-artist',
      tagSlugs: ['food-beverage', 'business', 'personal', 'creative', 'portfolio']
    },
    {
      templateSlug: 'monochrome-artist',
      tagSlugs: ['minimal', 'creative', 'professional', 'portfolio', 'personal']
    },
    {
      templateSlug: 'tropical-paradise',
      tagSlugs: ['colorful', 'gradient', 'personal', 'influencer', 'creative']
    },
    {
      templateSlug: 'mountain-landscape',
      tagSlugs: ['minimal', 'outdoor', 'personal', 'creative', 'portfolio']
    },
    {
      templateSlug: 'student-portfolio',
      tagSlugs: ['minimal', 'education', 'student', 'portfolio', 'personal']
    },
    {
      templateSlug: 'entrepreneur-startup',
      tagSlugs: ['business', 'entrepreneur', 'professional', 'colorful', 'portfolio']
    },
    {
      templateSlug: 'restaurant-menu',
      tagSlugs: ['food-beverage', 'business', 'colorful', 'shop', 'professional']
    },
    {
      templateSlug: 'wedding-event',
      tagSlugs: ['event', 'elegant', 'personal', 'colorful', 'creative']
    },
    {
      templateSlug: 'developer-tech',
      tagSlugs: ['tech', 'dark-mode', 'professional', 'portfolio', 'personal']
    },
    // Indonesia-specific templates
    {
      templateSlug: 'toko-online-modern',
      tagSlugs: ['business', 'shop', 'personal', 'minimal', 'entrepreneur']
    },
    {
      templateSlug: 'umkm-fashion-boutique',
      tagSlugs: ['fashion', 'business', 'shop', 'elegant', 'colorful']
    },
    {
      templateSlug: 'warung-kopi-cafe',
      tagSlugs: ['food-beverage', 'business', 'personal', 'minimal']
    },
    {
      templateSlug: 'restoran-delivery',
      tagSlugs: ['food-beverage', 'business', 'colorful', 'shop']
    },
    {
      templateSlug: 'beauty-creator-hub',
      tagSlugs: ['creative', 'influencer', 'personal', 'colorful', 'elegant']
    },
    {
      templateSlug: 'food-blogger-paradise',
      tagSlugs: ['food-beverage', 'creative', 'influencer', 'personal', 'colorful']
    },
    {
      templateSlug: 'brand-skincare-premium',
      tagSlugs: ['business', 'shop', 'elegant', 'professional', 'colorful']
    },
    {
      templateSlug: 'reseller-beauty',
      tagSlugs: ['business', 'shop', 'personal', 'minimal']
    },
    {
      templateSlug: 'fotografer-wedding',
      tagSlugs: ['creative', 'professional', 'portfolio', 'event', 'elegant']
    },
    {
      templateSlug: 'wedding-organizer-elegant',
      tagSlugs: ['event', 'business', 'professional', 'elegant', 'colorful']
    },
    // New 2024 templates - Creator
    {
      templateSlug: 'gaming-streamer-hub',
      tagSlugs: ['gaming', 'tech', 'creative', 'influencer', 'dark-mode']
    },
    {
      templateSlug: 'tech-reviewer-pro',
      tagSlugs: ['tech', 'creative', 'professional', 'dark-mode', 'portfolio']
    },
    {
      templateSlug: 'travel-blogger-wanderlust',
      tagSlugs: ['creative', 'influencer', 'personal', 'colorful', 'gradient']
    },
    {
      templateSlug: 'lifestyle-influencer-modern',
      tagSlugs: ['creative', 'influencer', 'personal', 'elegant', 'colorful']
    },
    // New 2024 templates - UMKM
    {
      templateSlug: 'food-seller-homemade',
      tagSlugs: ['food-beverage', 'business', 'personal', 'colorful', 'shop']
    },
    {
      templateSlug: 'handicraft-artisan',
      tagSlugs: ['creative', 'business', 'shop', 'personal', 'minimal']
    },
    {
      templateSlug: 'service-business-pro',
      tagSlugs: ['business', 'professional', 'personal', 'minimal', 'entrepreneur']
    },
    {
      templateSlug: 'dropship-reseller-hub',
      tagSlugs: ['business', 'shop', 'personal', 'minimal', 'entrepreneur']
    },
    {
      templateSlug: 'thrift-store-vintage',
      tagSlugs: ['fashion', 'business', 'shop', 'retro', 'personal']
    },
    // New 2024 templates - F&B
    {
      templateSlug: 'bakery-cake-shop',
      tagSlugs: ['food-beverage', 'business', 'elegant', 'colorful', 'shop']
    },
    {
      templateSlug: 'catering-service-pro',
      tagSlugs: ['food-beverage', 'business', 'professional', 'event', 'shop']
    },
    {
      templateSlug: 'cloud-kitchen-delivery',
      tagSlugs: ['food-beverage', 'business', 'dark-mode', 'tech', 'shop']
    }
  ]

  for (const mapping of templateTagMappings) {
    // Find the template
    const template = await prisma.template.findUnique({
      where: { slug: mapping.templateSlug }
    })
    
    if (!template) {
      console.warn(`⚠️ Template with slug "${mapping.templateSlug}" not found`)
      continue
    }

    // Find the tags
    const tags = await prisma.tag.findMany({
      where: { slug: { in: mapping.tagSlugs } }
    })

    // Create template-tag relationships
    for (const tag of tags) {
      await prisma.templateTag.upsert({
        where: {
          templateId_tagId: {
            templateId: template.id,
            tagId: tag.id
          }
        },
        update: {},
        create: {
          templateId: template.id,
          tagId: tag.id
        }
      })
    }

    console.log(`✅ Tags assigned to template "${mapping.templateSlug}": ${mapping.tagSlugs.join(', ')}`)
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