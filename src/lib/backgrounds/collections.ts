/**
 * Background Collections
 * Curated collections of backgrounds grouped by theme and use case
 */

export interface BackgroundCollection {
  id: string
  name: string
  description: string
  icon?: string
  backgrounds: string[] // Array of background keys
}

export const BACKGROUND_COLLECTIONS: BackgroundCollection[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple backgrounds for professional looks',
    icon: '🎨',
    backgrounds: [
      'solid-white',
      'solid-gray-50',
      'solid-gray-900',
      'gradient-soft-clouds',
      'gradient-pearl-white',
      'gradient-pastel-sky',
    ]
  },
  {
    id: 'vibrant',
    name: 'Vibrant & Colorful',
    description: 'Bold and energetic backgrounds',
    icon: '🌈',
    backgrounds: [
      'gradient-sunset-dream',
      'gradient-tropical-paradise',
      'gradient-aurora-borealis',
      'gradient-peachy-keen',
      'gradient-neon-life',
      'gradient-aqua-splash',
      'gradient-cherry-blossom',
    ]
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Dark backgrounds for night-time viewing',
    icon: '🌙',
    backgrounds: [
      'solid-black',
      'solid-gray-900',
      'gradient-midnight-city',
      'gradient-dark-ocean',
      'gradient-cyberpunk-night',
      'gradient-space-void',
      'gradient-noir',
      'gradient-deep-purple',
      'gradient-carbon-fiber',
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Earth',
    description: 'Natural and organic backgrounds',
    icon: '🌿',
    backgrounds: [
      'gradient-forest-mist',
      'gradient-autumn-leaves',
      'gradient-desert-sand',
      'gradient-ocean-depth',
      'gradient-mountain-peak',
      'gradient-mint-fresh',
    ]
  },
  {
    id: 'elegant',
    name: 'Elegant & Luxury',
    description: 'Sophisticated backgrounds for premium feel',
    icon: '💎',
    backgrounds: [
      'gradient-pearl-white',
      'gradient-lavender-dream',
      'gradient-soft-clouds',
      'gradient-holographic',
      'gradient-gold-luxury',
      'gradient-silver-chrome',
    ]
  },
  {
    id: 'tech',
    name: 'Tech & Modern',
    description: 'Futuristic and tech-inspired backgrounds',
    icon: '⚡',
    backgrounds: [
      'gradient-cyberpunk-night',
      'gradient-electric-violet',
      'gradient-carbon-fiber',
      'pattern-grid-dark',
      'pattern-circuit',
      'pattern-hexagons',
      'animated-matrix',
    ]
  },
  {
    id: 'patterns',
    name: 'Patterns',
    description: 'Repeating pattern backgrounds',
    icon: '📐',
    backgrounds: [
      'pattern-dots-light',
      'pattern-dots-dark',
      'pattern-dots-colorful',
      'pattern-grid-light',
      'pattern-grid-dark',
      'pattern-blueprint',
      'pattern-stripes-light',
      'pattern-stripes-dark',
      'pattern-hexagons',
      'pattern-zigzag',
      'pattern-triangles',
      'pattern-waves',
    ]
  },
  {
    id: 'animated',
    name: 'Animated (Premium)',
    description: 'Dynamic animated backgrounds',
    icon: '✨',
    backgrounds: [
      'animated-gradient-flow',
      'animated-aurora',
      'animated-particles',
      'animated-waves',
      'animated-stars',
      'animated-matrix',
    ]
  },
]

/**
 * Get backgrounds for a specific collection
 */
export function getCollectionBackgrounds(collectionId: string): string[] {
  const collection = BACKGROUND_COLLECTIONS.find(c => c.id === collectionId)
  return collection?.backgrounds || []
}

/**
 * Get all collection IDs
 */
export function getCollectionIds(): string[] {
  return BACKGROUND_COLLECTIONS.map(c => c.id)
}

/**
 * Find which collection a background belongs to
 */
export function findBackgroundCollection(backgroundKey: string): BackgroundCollection | null {
  return BACKGROUND_COLLECTIONS.find(c => c.backgrounds.includes(backgroundKey)) || null
}
