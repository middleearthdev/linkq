/**
 * Centralized LinkList Style Configuration
 * This file contains all style definitions and configurations for LinkListBlock
 */

import { z } from 'zod'

export type LinkListStyle =
  | 'pill' | 'underline' | 'card' | 'modern' | 'modern-cream' | 'vintage'
  | 'ticket' | 'brush' | 'neon' | 'origami' | 'glass' | 'pixel'
  | 'hologram' | 'neomorphism' | 'bubble' | 'cyberpunk' | 'sketch'
  | 'metallic' | 'wood' | 'neon-outline' | 'minimal-line' | 'elastic'
  | 'terminal'
  // Game-inspired styles (Round 1)
  | 'rpg-fantasy' | 'battle-royale' | 'casual-game' | 'jrpg-anime' | 'dark-souls'
  // Game-inspired styles (Round 2)
  | 'arcade-retro' | 'racing-speed' | 'horror-glitch' | 'fighting-combo' | 'card-holo'
  // Game-inspired styles (Round 3)
  | 'puzzle-block' | 'strategy-rts' | 'moba-ability' | 'sandbox-craft' | 'rhythm-beat'
  // Culinary & F&B styles
  | 'coffee-shop' | 'bakery-sweet' | 'cocktail-bar' | 'fine-dining' | 'street-food'
  | 'sushi-bar' | 'pizza-oven' | 'ice-cream' | 'burger-joint' | 'ramen-shop'
  | 'wine-cellar' | 'tea-house' | 'chocolate-factory' | 'juice-bar' | 'bbq-grill'

export interface StyleTemplate {
  id: LinkListStyle
  name: string
  preview: string
  category: 'basic' | 'modern' | 'creative' | 'game' | 'culinary'
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
 * ============================================================
 * ZOD VALIDATION SCHEMAS
 * ============================================================
 */

// Hex color validation regex
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

/**
 * Schema for basic color scheme (5 required properties)
 */
export const ColorSchemeSchema = z.object({
  primary: z.string().regex(hexColorRegex, 'Primary must be a valid hex color'),
  secondary: z.string().regex(hexColorRegex, 'Secondary must be a valid hex color'),
  text: z.string().regex(hexColorRegex, 'Text must be a valid hex color'),
  accent: z.string().regex(hexColorRegex, 'Accent must be a valid hex color'),
  background: z.string().regex(hexColorRegex, 'Background must be a valid hex color'),
})

/**
 * Schema for extended custom colors (all optional except required basics)
 * All 13 properties must be defined for consistency
 */
export const CustomColorsSchema = z.object({
  // Basic colors (required)
  primary: z.string().regex(hexColorRegex),
  secondary: z.string().regex(hexColorRegex),
  text: z.string().regex(hexColorRegex),
  accent: z.string().regex(hexColorRegex),
  background: z.string().regex(hexColorRegex),

  // Extended colors for complex gradients (required for standardization)
  tertiary: z.string().regex(hexColorRegex),
  quaternary: z.string().regex(hexColorRegex),

  // Effect colors (required for standardization)
  glow: z.string().regex(hexColorRegex),
  highlight: z.string().regex(hexColorRegex),
  shadow: z.string(), // Can be rgba() or hex
  border: z.string().regex(hexColorRegex),

  // Gradient configuration (required for standardization)
  gradientType: z.enum(['linear', 'radial', 'conic']),
  gradientDirection: z.string(),

  // Optional for complex gradients
  gradientStops: z.array(z.string()).optional(),
})

/**
 * Schema for color preset validation
 */
export const ColorPresetSchema = z.object({
  name: z.string().min(1, 'Preset name is required'),
  colors: ColorSchemeSchema,
  advanced: CustomColorsSchema,
})

/**
 * Type inference from schema
 */
export type ValidatedColorPreset = z.infer<typeof ColorPresetSchema>

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
  },

  // Game-Inspired Styles
  {
    id: 'rpg-fantasy',
    name: 'RPG Fantasy',
    preview: 'bg-gradient-to-b from-amber-600 to-amber-800 border-4 border-yellow-600 text-yellow-100',
    category: 'game',
    description: 'Medieval fantasy RPG style with ornate golden borders'
  },
  {
    id: 'battle-royale',
    name: 'Battle Royale',
    preview: 'bg-gradient-to-r from-slate-800 to-slate-900 border-l-4 border-cyan-400 text-white',
    category: 'game',
    description: 'Modern tactical shooter style with accent stripe'
  },
  {
    id: 'casual-game',
    name: 'Casual Game',
    preview: 'bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white rounded-3xl shadow-xl',
    category: 'game',
    description: 'Colorful, playful mobile game style with vibrant gradients'
  },
  {
    id: 'jrpg-anime',
    name: 'JRPG Anime',
    preview: 'bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-yellow-300 text-white',
    category: 'game',
    description: 'Vibrant anime-style RPG with decorative borders'
  },
  {
    id: 'dark-souls',
    name: 'Dark Souls',
    preview: 'bg-gradient-to-b from-stone-800 to-stone-950 border border-amber-700 text-amber-100',
    category: 'game',
    description: 'Dark fantasy gothic style with worn, grungy appearance'
  },

  // Game-Inspired Styles (Round 2)
  {
    id: 'arcade-retro',
    name: 'Arcade Retro',
    preview: 'bg-black border-2 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)]',
    category: 'game',
    description: '80s neon arcade with CRT scanlines and retro glow'
  },
  {
    id: 'racing-speed',
    name: 'Racing Speed',
    preview: 'bg-gradient-to-r from-red-600 to-orange-500 border-l-4 border-yellow-400 text-white',
    category: 'game',
    description: 'Racing game HUD style with speed stripes and motion blur'
  },
  {
    id: 'horror-glitch',
    name: 'Horror Glitch',
    preview: 'bg-black border border-red-900 text-red-200',
    category: 'game',
    description: 'Horror game corrupted/glitched effect with distortion'
  },
  {
    id: 'fighting-combo',
    name: 'Fighting Combo',
    preview: 'bg-gradient-to-r from-yellow-500 to-red-600 border-2 border-white text-white',
    category: 'game',
    description: 'Fighting game combo meter with impact effect'
  },
  {
    id: 'card-holo',
    name: 'Card Holographic',
    preview: 'bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 border-2 border-yellow-300 text-purple-900',
    category: 'game',
    description: 'Trading card holographic foil with rainbow shimmer'
  },

  // Game-Inspired Styles (Round 3)
  {
    id: 'puzzle-block',
    name: 'Puzzle Block',
    preview: 'bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-blue-700 text-white',
    category: 'game',
    description: 'Tetris/puzzle game falling block style with grid pattern'
  },
  {
    id: 'strategy-rts',
    name: 'Strategy RTS',
    preview: 'bg-gradient-to-r from-green-900 to-emerald-800 border border-green-500 text-green-100',
    category: 'game',
    description: 'Real-time strategy command panel with tactical UI'
  },
  {
    id: 'moba-ability',
    name: 'MOBA Ability',
    preview: 'bg-gradient-to-br from-indigo-600 to-purple-700 border-2 border-cyan-400 text-white',
    category: 'game',
    description: 'MOBA ability button with cooldown and mana indicators'
  },
  {
    id: 'sandbox-craft',
    name: 'Sandbox Craft',
    preview: 'bg-gradient-to-b from-amber-600 to-stone-700 border-2 border-stone-900 text-amber-100',
    category: 'game',
    description: 'Minecraft/sandbox crafting grid style with pixelated edges'
  },
  {
    id: 'rhythm-beat',
    name: 'Rhythm Beat',
    preview: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white',
    category: 'game',
    description: 'Rhythm game note track with audio visualizer effect'
  },

  // Culinary & F&B Styles
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    preview: 'bg-gradient-to-br from-amber-800 to-amber-950 border-2 border-amber-600 text-amber-100',
    category: 'culinary',
    description: 'Warm coffee shop aesthetic with beans, steam, and latte art'
  },
  {
    id: 'bakery-sweet',
    name: 'Bakery Sweet',
    preview: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300 border-2 border-pink-400 text-pink-900',
    category: 'culinary',
    description: 'Sweet bakery style with frosting swirls and sprinkles'
  },
  {
    id: 'cocktail-bar',
    name: 'Cocktail Bar',
    preview: 'bg-gradient-to-br from-blue-900 to-purple-900 border border-cyan-400 text-cyan-100',
    category: 'culinary',
    description: 'Sophisticated bar style with ice cubes and neon lights'
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    preview: 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500 text-amber-100',
    category: 'culinary',
    description: 'Elegant restaurant menu style with silver cloche and candles'
  },
  {
    id: 'street-food',
    name: 'Street Food',
    preview: 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 border-2 border-yellow-600 text-white',
    category: 'culinary',
    description: 'Vibrant street food style with smoke and spice effects'
  },
  {
    id: 'sushi-bar',
    name: 'Sushi Bar',
    preview: 'bg-gradient-to-br from-slate-50 to-stone-100 border border-red-800 text-slate-900',
    category: 'culinary',
    description: 'Japanese sushi bar with bamboo mat and minimalist design'
  },
  {
    id: 'pizza-oven',
    name: 'Pizza Oven',
    preview: 'bg-gradient-to-br from-red-600 to-orange-700 border-4 border-green-600 text-yellow-50',
    category: 'culinary',
    description: 'Italian pizza style with wood fire and cheese stretch'
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    preview: 'bg-gradient-to-br from-pink-300 via-blue-200 to-purple-300 border-2 border-pink-400 text-purple-900',
    category: 'culinary',
    description: 'Sweet ice cream parlor with pastel colors and drips'
  },
  {
    id: 'burger-joint',
    name: 'Burger Joint',
    preview: 'bg-gradient-to-br from-yellow-600 to-amber-700 border-4 border-red-700 text-yellow-50',
    category: 'culinary',
    description: 'American diner burger style with grill marks and sesame seeds'
  },
  {
    id: 'ramen-shop',
    name: 'Ramen Shop',
    preview: 'bg-gradient-to-br from-orange-700 to-red-800 border-2 border-yellow-600 text-yellow-100',
    category: 'culinary',
    description: 'Japanese ramen style with steam, chopsticks, and noodles'
  },
  {
    id: 'wine-cellar',
    name: 'Wine Cellar',
    preview: 'bg-gradient-to-br from-purple-900 to-red-900 border-2 border-amber-700 text-amber-100',
    category: 'culinary',
    description: 'Elegant wine cellar with barrel wood and grape vines'
  },
  {
    id: 'tea-house',
    name: 'Tea House',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100 border border-green-700 text-green-900',
    category: 'culinary',
    description: 'Zen tea house with ceramic cups and tea leaves'
  },
  {
    id: 'chocolate-factory',
    name: 'Chocolate Factory',
    preview: 'bg-gradient-to-br from-amber-800 to-amber-950 border-2 border-yellow-600 text-yellow-100',
    category: 'culinary',
    description: 'Rich chocolate factory with cocoa swirls and gold wrapper'
  },
  {
    id: 'juice-bar',
    name: 'Juice Bar',
    preview: 'bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 border-2 border-green-500 text-white',
    category: 'culinary',
    description: 'Fresh juice bar with fruit splash and tropical vibes'
  },
  {
    id: 'bbq-grill',
    name: 'BBQ Grill',
    preview: 'bg-gradient-to-br from-stone-800 to-stone-950 border-2 border-orange-600 text-orange-100',
    category: 'culinary',
    description: 'BBQ grill style with smoke, char marks, and flame effects'
  }
]

/**
 * All available link list styles
 */
export const ALL_STYLES: LinkListStyle[] = STYLE_TEMPLATES.map(template => template.id)

/**
 * Get styles by category
 */
export const getStylesByCategory = (category: 'basic' | 'modern' | 'creative' | 'game' | 'culinary'): StyleTemplate[] => {
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
 * All presets follow standardized format with complete advanced properties
 */
export const COLOR_PRESETS: Array<{ name: string; colors: ColorScheme; advanced: CustomColors }> = [
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
      // Basic colors
      primary: '#0ea5e9',
      secondary: '#0284c7',
      text: '#ffffff',
      accent: '#38bdf8',
      background: '#f0f9ff',
      // Extended gradient colors
      tertiary: '#38bdf8',
      quaternary: '#0369a1',
      // Effect colors
      glow: '#0ea5e9',
      highlight: '#67e8f9',
      shadow: 'rgba(14, 165, 233, 0.2)',
      border: '#0ea5e9',
      // Gradient configuration
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
      // Basic colors
      primary: '#10b981',
      secondary: '#059669',
      text: '#ffffff',
      accent: '#34d399',
      background: '#f0fdf4',
      // Extended gradient colors
      tertiary: '#34d399',
      quaternary: '#047857',
      // Effect colors
      glow: '#10b981',
      highlight: '#6ee7b7',
      shadow: 'rgba(16, 185, 129, 0.2)',
      border: '#10b981',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to right'
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
      // Basic colors
      primary: '#f97316',
      secondary: '#ea580c',
      text: '#ffffff',
      accent: '#fb923c',
      background: '#fff7ed',
      // Extended gradient colors
      tertiary: '#fb923c',
      quaternary: '#dc2626',
      // Effect colors
      glow: '#f97316',
      highlight: '#fbbf24',
      shadow: 'rgba(249, 115, 22, 0.25)',
      border: '#f97316',
      // Gradient configuration
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
      // Basic colors
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      text: '#ffffff',
      accent: '#a78bfa',
      background: '#faf5ff',
      // Extended gradient colors
      tertiary: '#a78bfa',
      quaternary: '#6d28d9',
      // Effect colors
      glow: '#8b5cf6',
      highlight: '#c4b5fd',
      shadow: 'rgba(139, 92, 246, 0.2)',
      border: '#8b5cf6',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to right'
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
      // Basic colors
      primary: '#ec4899',
      secondary: '#8b5cf6',
      text: '#ffffff',
      accent: '#06b6d4',
      background: '#000000',
      // Extended gradient colors
      tertiary: '#06b6d4',
      quaternary: '#3b82f6',
      // Effect colors
      glow: '#ec4899',
      highlight: '#ffffff',
      shadow: 'rgba(236, 72, 153, 0.3)',
      border: '#ec4899',
      // Gradient configuration
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
      text: '#ffffff',
      accent: '#67e8f9',
      background: '#000000'
    },
    advanced: {
      // Basic colors
      primary: '#06b6d4',
      secondary: '#0891b2',
      text: '#ffffff',
      accent: '#67e8f9',
      background: '#000000',
      // Extended gradient colors
      tertiary: '#67e8f9',
      quaternary: '#22d3ee',
      // Effect colors
      glow: '#06b6d4',
      highlight: '#a5f3fc',
      shadow: 'rgba(6, 182, 212, 0.4)',
      border: '#06b6d4',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to right'
    }
  },
  {
    name: 'Vintage Paper',
    colors: {
      primary: '#92400e',
      secondary: '#78350f',
      text: '#fef3c7',
      accent: '#d97706',
      background: '#fef7ed'
    },
    advanced: {
      // Basic colors
      primary: '#92400e',
      secondary: '#78350f',
      text: '#fef3c7',
      accent: '#d97706',
      background: '#fef7ed',
      // Extended gradient colors
      tertiary: '#d97706',
      quaternary: '#a16207',
      // Effect colors
      glow: '#92400e',
      highlight: '#fbbf24',
      shadow: 'rgba(146, 64, 14, 0.15)',
      border: '#92400e',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to bottom'
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
      // Basic colors
      primary: '#374151',
      secondary: '#1f2937',
      text: '#ffffff',
      accent: '#6b7280',
      background: '#111827',
      // Extended gradient colors
      tertiary: '#6b7280',
      quaternary: '#4b5563',
      // Effect colors
      glow: '#374151',
      highlight: '#9ca3af',
      shadow: 'rgba(0, 0, 0, 0.5)',
      border: '#374151',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to right'
    }
  },
  {
    name: 'Cherry Blossom',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      text: '#ffffff',
      accent: '#f472b6',
      background: '#fdf2f8'
    },
    advanced: {
      // Basic colors
      primary: '#ec4899',
      secondary: '#db2777',
      text: '#ffffff',
      accent: '#f472b6',
      background: '#fdf2f8',
      // Extended gradient colors
      tertiary: '#f472b6',
      quaternary: '#be185d',
      // Effect colors
      glow: '#ec4899',
      highlight: '#fbcfe8',
      shadow: 'rgba(236, 72, 153, 0.25)',
      border: '#ec4899',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: '135deg'
    }
  },
  {
    name: 'Mint Fresh',
    colors: {
      primary: '#14b8a6',
      secondary: '#0d9488',
      text: '#ffffff',
      accent: '#2dd4bf',
      background: '#f0fdfa'
    },
    advanced: {
      // Basic colors
      primary: '#14b8a6',
      secondary: '#0d9488',
      text: '#ffffff',
      accent: '#2dd4bf',
      background: '#f0fdfa',
      // Extended gradient colors
      tertiary: '#2dd4bf',
      quaternary: '#0f766e',
      // Effect colors
      glow: '#14b8a6',
      highlight: '#5eead4',
      shadow: 'rgba(20, 184, 166, 0.2)',
      border: '#14b8a6',
      // Gradient configuration
      gradientType: 'linear',
      gradientDirection: 'to right'
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
 * Handles all basic and extended color properties for consistent styling
 */
export const generateCustomStyle = (customColors?: CustomColors): React.CSSProperties => {
  if (!customColors) return {}

  return {
    // Dedicated text color variable - STANDARDIZED for all 53 styles
    '--custom-text-color': customColors.text || '#ffffff',

    // Basic colors (5 properties)
    '--custom-primary': customColors.primary || 'var(--primary-color)',
    '--custom-secondary': customColors.secondary || 'var(--secondary-color)',
    '--custom-text': customColors.text || 'var(--text-color)',
    '--custom-accent': customColors.accent || customColors.primary || 'var(--primary-color)',
    '--custom-background': customColors.background || customColors.secondary || 'var(--card-background)',

    // Extended colors for complex gradients (4 properties)
    '--custom-tertiary': customColors.tertiary || customColors.accent || customColors.primary || 'var(--primary-color)',
    '--custom-quaternary': customColors.quaternary || customColors.secondary || 'var(--secondary-color)',

    // Effect colors (4 properties)
    '--custom-glow': customColors.glow || customColors.primary || 'var(--primary-color)',
    '--custom-highlight': customColors.highlight || '#ffffff',
    '--custom-shadow': customColors.shadow || 'rgba(0, 0, 0, 0.1)',
    '--custom-border': customColors.border || customColors.primary || 'var(--border)',

    // Gradient configuration (2 properties)
    '--custom-gradient-type': customColors.gradientType || 'linear',
    '--custom-gradient-direction': customColors.gradientDirection || 'to right',
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
    'elastic', 'terminal',
    // Game-inspired styles (Round 1)
    'rpg-fantasy', 'battle-royale', 'casual-game', 'jrpg-anime', 'dark-souls',
    // Game-inspired styles (Round 2)
    'arcade-retro', 'racing-speed', 'horror-glitch', 'fighting-combo', 'card-holo',
    // Game-inspired styles (Round 3)
    'puzzle-block', 'strategy-rts', 'moba-ability', 'sandbox-craft', 'rhythm-beat',
    // Culinary & F&B styles
    'coffee-shop', 'bakery-sweet', 'cocktail-bar', 'fine-dining', 'street-food',
    'sushi-bar', 'pizza-oven', 'ice-cream', 'burger-joint', 'ramen-shop',
    'wine-cellar', 'tea-house', 'chocolate-factory', 'juice-bar', 'bbq-grill'
  ]
  return fullyCustomizable.includes(styleId)
}

/**
 * Validate if a style ID is valid
 */
export const isValidStyle = (style: string): style is LinkListStyle => {
  return ALL_STYLES.includes(style as LinkListStyle)
}