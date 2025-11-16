/**
 * Centralized LinkList Style Configuration
 * This file contains all style definitions and configurations for LinkListBlock
 */

export type LinkListStyle = 
  | 'pill' | 'underline' | 'card' | 'modern' | 'modern-cream' | 'vintage' 
  | 'ticket' | 'brush' | 'neon' | 'origami' | 'glass' | 'pixel' 
  | 'hologram' | 'neomorphism' | 'bubble' | 'cyberpunk' | 'sketch' 
  | 'metallic' | 'wood' | 'neon-outline' | 'minimal-line' | 'elastic' 
  | 'terminal'

export interface StyleTemplate {
  id: LinkListStyle
  name: string
  preview: string
  category: 'basic' | 'modern' | 'creative'
  description?: string
}

export interface ColorScheme {
  primary: string
  secondary: string
  text: string
  accent: string
  background: string
}

export interface CustomColors {
  primary?: string
  secondary?: string
  text?: string
  accent?: string
  background?: string
  // Extended colors for creative styles
  tertiary?: string        // Third color for complex gradients
  quaternary?: string      // Fourth color for complex gradients
  shadow?: string          // Custom shadow color
  border?: string          // Custom border color
  highlight?: string       // Highlight/shine color
  glow?: string           // Glow effect color
  // Gradient definitions
  gradientType?: 'linear' | 'radial' | 'conic'
  gradientDirection?: string // e.g., 'to right', '45deg', etc.
  gradientStops?: string[]   // Array of color stops for complex gradients
}

/**
 * Complete style templates with preview classes and categories
 */
export const STYLE_TEMPLATES: StyleTemplate[] = [
  // Basic Styles
  {
    id: 'pill',
    name: 'Pill',
    preview: 'rounded-full bg-blue-500 text-white',
    category: 'basic',
    description: 'Classic rounded pill button style'
  },
  {
    id: 'card',
    name: 'Card',
    preview: 'rounded-lg border bg-white shadow-sm',
    category: 'basic',
    description: 'Clean card-style buttons with subtle shadows'
  },
  {
    id: 'underline',
    name: 'Underline',
    preview: 'border-b-2 border-transparent hover:border-blue-500',
    category: 'basic',
    description: 'Minimal text links with animated underlines'
  },

  // Modern Styles
  {
    id: 'modern',
    name: 'Modern',
    preview: 'rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    category: 'modern',
    description: 'Sleek gradient buttons with rounded corners'
  },
  {
    id: 'modern-cream',
    name: 'Modern Cream',
    preview: 'rounded-2xl bg-amber-50 border border-amber-200 text-amber-800',
    category: 'modern',
    description: 'Sophisticated cream-colored modern design'
  },
  {
    id: 'glass',
    name: 'Glass',
    preview: 'rounded-2xl bg-white/10 backdrop-blur-md border border-white/20',
    category: 'modern',
    description: 'Glassmorphism effect with backdrop blur'
  },
  {
    id: 'neomorphism',
    name: 'Neomorphism',
    preview: 'rounded-2xl bg-gray-100 shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
    category: 'modern',
    description: 'Soft UI design with subtle shadows'
  },

  // Creative Styles
  {
    id: 'vintage',
    name: 'Vintage',
    preview: 'border-2 border-amber-800 bg-amber-50 text-amber-800',
    category: 'creative',
    description: 'Classic vintage design with double borders'
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: 'rounded-lg bg-black border-2 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    category: 'creative',
    description: 'Glowing neon effect perfect for dark themes'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    preview: 'bg-black border border-cyan-400 text-cyan-400 font-mono',
    category: 'creative',
    description: 'Futuristic cyberpunk aesthetic with scan lines'
  },
  {
    id: 'ticket',
    name: 'Ticket',
    preview: 'bg-amber-800 text-white relative overflow-hidden',
    category: 'creative',
    description: 'Fun ticket-style with perforated edges'
  },
  {
    id: 'brush',
    name: 'Brush',
    preview: 'bg-emerald-200 text-emerald-900',
    category: 'creative',
    description: 'Artistic brush stroke effect'
  },
  {
    id: 'origami',
    name: 'Origami',
    preview: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
    category: 'creative',
    description: 'Paper-folded origami design'
  },
  {
    id: 'pixel',
    name: 'Pixel',
    preview: 'bg-green-400 text-green-900 border-2 border-green-600 rounded-none shadow-[4px_4px_0px_0px_rgba(34,197,94,0.8)]',
    category: 'creative',
    description: '8-bit retro pixel art style'
  },
  {
    id: 'hologram',
    name: 'Hologram',
    preview: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white',
    category: 'creative',
    description: 'Holographic rainbow gradient effect'
  },
  {
    id: 'bubble',
    name: 'Bubble',
    preview: 'bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full',
    category: 'creative',
    description: 'Playful bubble design with highlights'
  },
  {
    id: 'sketch',
    name: 'Sketch',
    preview: 'bg-white border-2 border-gray-800 text-gray-800',
    category: 'creative',
    description: 'Hand-drawn sketch aesthetic'
  },
  {
    id: 'metallic',
    name: 'Metallic',
    preview: 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 text-gray-800',
    category: 'creative',
    description: 'Shiny metallic surface effect'
  },
  {
    id: 'wood',
    name: 'Wood',
    preview: 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-100',
    category: 'creative',
    description: 'Natural wood grain texture'
  },
  {
    id: 'neon-outline',
    name: 'Neon Outline',
    preview: 'bg-transparent border-2 border-cyan-400 text-cyan-400',
    category: 'creative',
    description: 'Outlined neon glow effect'
  },
  {
    id: 'minimal-line',
    name: 'Minimal Line',
    preview: 'bg-transparent border-b-2 border-gray-300 text-gray-600',
    category: 'basic',
    description: 'Ultra-minimal line design'
  },
  {
    id: 'elastic',
    name: 'Elastic',
    preview: 'bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full',
    category: 'creative',
    description: 'Bouncy elastic animation effect'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    preview: 'bg-black border border-green-400 text-green-400 font-mono',
    category: 'creative',
    description: 'Command-line terminal interface'
  }
]

/**
 * All available link list styles
 */
export const ALL_STYLES: LinkListStyle[] = STYLE_TEMPLATES.map(template => template.id)

/**
 * Get styles by category
 */
export const getStylesByCategory = (category: 'basic' | 'modern' | 'creative'): StyleTemplate[] => {
  return STYLE_TEMPLATES.filter(template => template.category === category)
}

/**
 * Get style template by ID
 */
export const getStyleTemplate = (styleId: LinkListStyle): StyleTemplate | undefined => {
  return STYLE_TEMPLATES.find(template => template.id === styleId)
}

/**
 * Popular color presets for customization
 */
export const COLOR_PRESETS: Array<{ name: string; colors: ColorScheme; advanced?: CustomColors }> = [
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      text: '#ffffff',
      accent: '#38bdf8',
      background: '#f0f9ff'
    },
    advanced: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      tertiary: '#38bdf8',
      quaternary: '#0369a1',
      text: '#ffffff',
      accent: '#38bdf8',
      background: '#f0f9ff',
      glow: '#0ea5e9',
      highlight: '#67e8f9',
      gradientType: 'linear',
      gradientDirection: 'to right'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      text: '#ffffff',
      accent: '#34d399',
      background: '#f0fdf4'
    },
    advanced: {
      primary: '#10b981',
      secondary: '#059669',
      tertiary: '#34d399',
      quaternary: '#047857',
      text: '#ffffff',
      accent: '#34d399',
      background: '#f0fdf4',
      glow: '#10b981',
      highlight: '#6ee7b7'
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      text: '#ffffff',
      accent: '#fb923c',
      background: '#fff7ed'
    },
    advanced: {
      primary: '#f97316',
      secondary: '#ea580c',
      tertiary: '#fb923c',
      quaternary: '#dc2626',
      text: '#ffffff',
      accent: '#fb923c',
      background: '#fff7ed',
      glow: '#f97316',
      highlight: '#fbbf24',
      gradientType: 'linear',
      gradientDirection: '45deg'
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      text: '#ffffff',
      accent: '#a78bfa',
      background: '#faf5ff'
    },
    advanced: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      tertiary: '#a78bfa',
      quaternary: '#6d28d9',
      text: '#ffffff',
      accent: '#a78bfa',
      background: '#faf5ff',
      glow: '#8b5cf6',
      highlight: '#c4b5fd'
    }
  },
  {
    name: 'Holographic',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      text: '#ffffff',
      accent: '#06b6d4',
      background: '#000000'
    },
    advanced: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      tertiary: '#06b6d4',
      quaternary: '#3b82f6',
      text: '#ffffff',
      accent: '#06b6d4',
      background: '#000000',
      glow: '#ec4899',
      highlight: '#ffffff',
      gradientType: 'linear',
      gradientDirection: 'to right',
      gradientStops: ['#ec4899', '#8b5cf6', '#06b6d4', '#3b82f6']
    }
  },
  {
    name: 'Cyberpunk Neon',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      text: '#06b6d4',
      accent: '#67e8f9',
      background: '#000000'
    },
    advanced: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      tertiary: '#67e8f9',
      quaternary: '#22d3ee',
      text: '#06b6d4',
      accent: '#67e8f9',
      background: '#000000',
      glow: '#06b6d4',
      highlight: '#a5f3fc',
      border: '#06b6d4'
    }
  },
  {
    name: 'Vintage Paper',
    colors: {
      primary: '#92400e',
      secondary: '#78350f',
      text: '#92400e',
      accent: '#d97706',
      background: '#fef7ed'
    },
    advanced: {
      primary: '#92400e',
      secondary: '#78350f',
      tertiary: '#d97706',
      quaternary: '#a16207',
      text: '#92400e',
      accent: '#d97706',
      background: '#fef7ed',
      border: '#92400e',
      highlight: '#fbbf24'
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#374151',
      secondary: '#1f2937',
      text: '#ffffff',
      accent: '#6b7280',
      background: '#111827'
    },
    advanced: {
      primary: '#374151',
      secondary: '#1f2937',
      tertiary: '#6b7280',
      quaternary: '#4b5563',
      text: '#ffffff',
      accent: '#6b7280',
      background: '#111827',
      highlight: '#9ca3af'
    }
  }
]

/**
 * Default color scheme
 */
export const DEFAULT_COLORS: ColorScheme = {
  primary: '#3b82f6',
  secondary: '#1d4ed8',
  text: '#ffffff',
  accent: '#60a5fa',
  background: '#f3f4f6'
}

/**
 * Generate CSS custom properties for a color scheme
 */
export const generateCustomStyle = (customColors?: CustomColors): React.CSSProperties => {
  if (!customColors) return {}
  
  return {
    '--custom-primary': customColors.primary || 'var(--primary-color)',
    '--custom-secondary': customColors.secondary || 'var(--secondary-color)', 
    '--custom-text': customColors.text || 'var(--text-color)',
    '--custom-accent': customColors.accent || customColors.primary || 'var(--primary-color)',
    '--custom-background': customColors.background || customColors.secondary || 'var(--card-background)'
  } as React.CSSProperties
}

/**
 * Check if a style supports full color customization
 */
export const isFullyCustomizable = (styleId: LinkListStyle): boolean => {
  const fullyCustomizable: LinkListStyle[] = [
    'pill', 'card', 'underline', 'modern', 'modern-cream', 
    'glass', 'neon', 'bubble', 'neomorphism', 'minimal-line',
    'vintage', 'cyberpunk', 'ticket', 'brush', 'origami', 
    'pixel', 'hologram', 'sketch', 'metallic', 'neon-outline', 
    'elastic', 'terminal'
  ]
  return fullyCustomizable.includes(styleId)
}

/**
 * Validate if a style ID is valid
 */
export const isValidStyle = (style: string): style is LinkListStyle => {
  return ALL_STYLES.includes(style as LinkListStyle)
}