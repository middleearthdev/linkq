/**
 * Background Registry System
 * Central registry for all background presets
 */

import { Background, BackgroundRegistry, BackgroundType } from './types'
import { GRADIENT_PRESETS } from './presets/gradients'
import { PATTERN_PRESETS } from './presets/patterns'
import { SOLID_PRESETS } from './presets/solids'
import { ANIMATED_PRESETS } from './presets/animated'
import { VIDEO_PRESETS } from './presets/videos'

// Combine all presets into one registry
export const BACKGROUND_REGISTRY: BackgroundRegistry = {
  ...SOLID_PRESETS,
  ...GRADIENT_PRESETS,
  ...PATTERN_PRESETS,
  ...ANIMATED_PRESETS,
  ...VIDEO_PRESETS,
}

// Helper functions
export function getBackground(key: string): Background | undefined {
  return BACKGROUND_REGISTRY[key]
}

export function getBackgroundsByType(type: BackgroundType): Background[] {
  return Object.values(BACKGROUND_REGISTRY).filter(bg => bg.type === type)
}

export function getBackgroundsByTag(tag: string): Background[] {
  return Object.values(BACKGROUND_REGISTRY).filter(
    bg => bg.tags?.includes(tag)
  )
}

export function getFreeBackgrounds(): Background[] {
  return Object.values(BACKGROUND_REGISTRY).filter(bg => !bg.isPremium)
}

export function getPremiumBackgrounds(): Background[] {
  return Object.values(BACKGROUND_REGISTRY).filter(bg => bg.isPremium)
}

export function searchBackgrounds(query: string): Background[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(BACKGROUND_REGISTRY).filter(bg =>
    bg.name.toLowerCase().includes(lowerQuery) ||
    bg.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// Get CSS value for background
export function getBackgroundCSS(key: string): string {
  const bg = getBackground(key)
  if (!bg) return '#ffffff'

  if (bg.type === 'solid') {
    return bg.value
  }

  if (bg.type === 'gradient') {
    return bg.value
  }

  if (bg.type === 'pattern') {
    return bg.value
  }

  if (bg.type === 'image') {
    return bg.value
  }

  if (bg.type === 'animated') {
    return bg.value || '#000000'
  }

  return '#ffffff'
}

// Get full CSS properties for background
export function getBackgroundStyles(key: string): Record<string, string> {
  const bg = getBackground(key)
  if (!bg) return { background: '#ffffff' }

  if (bg.type === 'solid') {
    return {
      background: bg.value,
      backgroundColor: bg.value,
    }
  }

  if (bg.type === 'gradient') {
    return {
      background: bg.value,
    }
  }

  if (bg.type === 'pattern') {
    return {
      background: bg.value,
      backgroundSize: bg.size,
      backgroundColor: bg.backgroundColor,
    }
  }

  if (bg.type === 'image') {
    const styles: Record<string, string> = {
      background: bg.value,
      backgroundPosition: bg.position || 'center',
      backgroundSize: bg.size || 'cover',
      backgroundAttachment: bg.attachment || 'scroll',
    }

    if (bg.overlay) {
      styles['--background-overlay'] = bg.overlay
    }

    return styles
  }

  if (bg.type === 'animated') {
    const styles: Record<string, string> = {
      background: bg.value || '#000000',
    }

    if (bg.animation) {
      styles.animation = bg.animation
    }

    return styles
  }

  if (bg.type === 'video') {
    const styles: Record<string, string> = {
      background: '#000000', // Fallback color
    }

    if (bg.overlay) {
      styles['--video-overlay'] = bg.overlay
    }

    return styles
  }

  return { background: '#ffffff' }
}

// Map old background values to new registry keys
export function migrateOldBackground(oldValue: string): string {
  // Try to match old gradient values to new keys
  const gradientMap: Record<string, string> = {
    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)': 'gradient-soft-clouds',
    'linear-gradient(135deg, #3A3A3A 0%, #2A2A2A 100%)': 'gradient-carbon-fiber',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)': 'gradient-ocean-breeze',
    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)': 'gradient-pearl-white',
    'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)': 'gradient-aurora-borealis',
    'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)': 'gradient-dark-ocean',
    'linear-gradient(135deg, #1a0028 0%, #4c0080 50%, #ff0080 100%)': 'gradient-cyberpunk-night',
    'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)': 'gradient-mint-fresh',
    'linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 50%, #0ea5e9 100%)': 'gradient-aqua-splash',
    'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)': 'gradient-peachy-keen',
    'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f23 100%)': 'gradient-space-void',
    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)': 'gradient-pearl-white',
    'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)': 'gradient-lavender-dream',
    'linear-gradient(135deg, #0a0a0a 0%, #7c2d12 50%, #facc15 100%)': 'gradient-electric-violet',
    'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #06b6d4 100%)': 'gradient-pastel-sky',
    'linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #dc2626 100%)': 'gradient-cherry-blossom',
    'linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 50%, #312e81 100%)': 'gradient-midnight-city',
    'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)': 'gradient-desert-sand',
    'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #e5e7eb 100%)': 'gradient-pearl-white',
    'linear-gradient(135deg, #ecfeff 0%, #67e8f9 50%, #22d3ee 100%)': 'gradient-aqua-splash',
    'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)': 'gradient-pastel-sky',
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)': 'gradient-desert-sand',
    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)': 'gradient-cherry-blossom',
    'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)': 'gradient-lavender-dream',
    'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)': 'gradient-space-void',
  }

  // Check if exact match exists
  if (gradientMap[oldValue]) {
    return gradientMap[oldValue]
  }

  // Check if it's an image background
  if (oldValue.includes('url(')) {
    return 'image-custom'
  }

  // Default to soft clouds
  return 'gradient-soft-clouds'
}

// Export all presets for direct access if needed
export {
  GRADIENT_PRESETS,
  PATTERN_PRESETS,
  SOLID_PRESETS,
  ANIMATED_PRESETS,
  VIDEO_PRESETS,
}
