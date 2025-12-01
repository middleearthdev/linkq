/**
 * Gradient Background Presets
 * 30+ curated gradient backgrounds organized by theme
 */

import { GradientBackground } from '../types'

export const GRADIENT_PRESETS: Record<string, GradientBackground> = {
  // LIGHT & SOFT (5 gradients)
  'gradient-soft-clouds': {
    type: 'gradient',
    name: 'Soft Clouds',
    preview: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    colors: ['#f5f7fa', '#c3cfe2'],
    angle: 135,
    tags: ['light', 'soft', 'clean', 'minimal']
  },
  'gradient-pearl-white': {
    type: 'gradient',
    name: 'Pearl White',
    preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    value: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    colors: ['#f8fafc', '#e2e8f0'],
    angle: 135,
    tags: ['light', 'minimal', 'clean']
  },
  'gradient-pastel-sky': {
    type: 'gradient',
    name: 'Pastel Sky',
    preview: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
    value: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #06b6d4 100%)',
    colors: ['#f0f9ff', '#bae6fd', '#06b6d4'],
    angle: 135,
    tags: ['light', 'blue', 'calm']
  },
  'gradient-mint-fresh': {
    type: 'gradient',
    name: 'Mint Fresh',
    preview: 'linear-gradient(135deg, #ecfdf5, #a7f3d0)',
    value: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)',
    colors: ['#ecfdf5', '#a7f3d0', '#34d399'],
    angle: 135,
    tags: ['light', 'green', 'fresh']
  },
  'gradient-lavender-dream': {
    type: 'gradient',
    name: 'Lavender Dream',
    preview: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
    value: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
    colors: ['#fdf2f8', '#fce7f3', '#fbcfe8'],
    angle: 135,
    tags: ['light', 'pink', 'feminine']
  },

  // VIBRANT & COLORFUL (8 gradients)
  'gradient-ocean-breeze': {
    type: 'gradient',
    name: 'Ocean Breeze',
    preview: 'linear-gradient(135deg, #667eea, #764ba2)',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: ['#667eea', '#764ba2'],
    angle: 135,
    tags: ['vibrant', 'blue', 'purple']
  },
  'gradient-sunset-dream': {
    type: 'gradient',
    name: 'Sunset Dream',
    preview: 'linear-gradient(135deg, #ff6b6b, #feca57)',
    value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    colors: ['#ff6b6b', '#feca57'],
    angle: 135,
    tags: ['vibrant', 'warm', 'sunset']
  },
  'gradient-tropical-paradise': {
    type: 'gradient',
    name: 'Tropical Paradise',
    preview: 'linear-gradient(135deg, #f093fb, #f5576c)',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    colors: ['#f093fb', '#f5576c'],
    angle: 135,
    tags: ['vibrant', 'pink', 'tropical']
  },
  'gradient-aurora-borealis': {
    type: 'gradient',
    name: 'Aurora Borealis',
    preview: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    colors: ['#667eea', '#764ba2', '#f093fb'],
    angle: 135,
    tags: ['vibrant', 'purple', 'colorful']
  },
  'gradient-peachy-keen': {
    type: 'gradient',
    name: 'Peachy Keen',
    preview: 'linear-gradient(135deg, #fed7aa, #fdba74)',
    value: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%)',
    colors: ['#fed7aa', '#fdba74', '#f97316'],
    angle: 135,
    tags: ['warm', 'orange', 'vibrant']
  },
  'gradient-neon-life': {
    type: 'gradient',
    name: 'Neon Life',
    preview: 'linear-gradient(135deg, #fa709a, #fee140)',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    colors: ['#fa709a', '#fee140'],
    angle: 135,
    tags: ['vibrant', 'neon', 'energetic']
  },
  'gradient-aqua-splash': {
    type: 'gradient',
    name: 'Aqua Splash',
    preview: 'linear-gradient(135deg, #f0f9ff, #7dd3fc)',
    value: 'linear-gradient(135deg, #f0f9ff 0%, #7dd3fc 50%, #0ea5e9 100%)',
    colors: ['#f0f9ff', '#7dd3fc', '#0ea5e9'],
    angle: 135,
    tags: ['blue', 'aqua', 'fresh']
  },
  'gradient-cherry-blossom': {
    type: 'gradient',
    name: 'Cherry Blossom',
    preview: 'linear-gradient(135deg, #fef2f2, #fecaca)',
    value: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #dc2626 100%)',
    colors: ['#fef2f2', '#fecaca', '#dc2626'],
    angle: 135,
    tags: ['pink', 'red', 'romantic']
  },

  // DARK & BOLD (8 gradients)
  'gradient-midnight-city': {
    type: 'gradient',
    name: 'Midnight City',
    preview: 'linear-gradient(135deg, #0c0a1e, #1e1b4b)',
    value: 'linear-gradient(135deg, #0c0a1e 0%, #1e1b4b 50%, #312e81 100%)',
    colors: ['#0c0a1e', '#1e1b4b', '#312e81'],
    angle: 135,
    tags: ['dark', 'blue', 'night']
  },
  'gradient-dark-ocean': {
    type: 'gradient',
    name: 'Dark Ocean',
    preview: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
    value: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    colors: ['#0a0a0a', '#1a1a2e', '#16213e'],
    angle: 135,
    tags: ['dark', 'blue', 'deep']
  },
  'gradient-cyberpunk-night': {
    type: 'gradient',
    name: 'Cyberpunk Night',
    preview: 'linear-gradient(135deg, #1a0028, #4c0080)',
    value: 'linear-gradient(135deg, #1a0028 0%, #4c0080 50%, #ff0080 100%)',
    colors: ['#1a0028', '#4c0080', '#ff0080'],
    angle: 135,
    tags: ['dark', 'neon', 'cyberpunk']
  },
  'gradient-electric-violet': {
    type: 'gradient',
    name: 'Electric Violet',
    preview: 'linear-gradient(135deg, #0a0a0a, #7c2d12)',
    value: 'linear-gradient(135deg, #0a0a0a 0%, #7c2d12 50%, #facc15 100%)',
    colors: ['#0a0a0a', '#7c2d12', '#facc15'],
    angle: 135,
    tags: ['dark', 'electric', 'bold']
  },
  'gradient-carbon-fiber': {
    type: 'gradient',
    name: 'Carbon Fiber',
    preview: 'linear-gradient(135deg, #3A3A3A, #2A2A2A)',
    value: 'linear-gradient(135deg, #3A3A3A 0%, #2A2A2A 100%)',
    colors: ['#3A3A3A', '#2A2A2A'],
    angle: 135,
    tags: ['dark', 'minimal', 'tech']
  },
  'gradient-space-void': {
    type: 'gradient',
    name: 'Space Void',
    preview: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    value: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f23 100%)',
    colors: ['#0a0a0a', '#1a1a1a', '#0f0f23'],
    angle: 135,
    tags: ['dark', 'space', 'deep']
  },
  'gradient-noir': {
    type: 'gradient',
    name: 'Film Noir',
    preview: 'linear-gradient(135deg, #1c1c1c, #4a4a4a)',
    value: 'linear-gradient(135deg, #1c1c1c 0%, #4a4a4a 100%)',
    colors: ['#1c1c1c', '#4a4a4a'],
    angle: 135,
    tags: ['dark', 'elegant', 'minimal']
  },
  'gradient-deep-purple': {
    type: 'gradient',
    name: 'Deep Purple',
    preview: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
    value: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    colors: ['#1e1b4b', '#4c1d95', '#7c3aed'],
    angle: 135,
    tags: ['dark', 'purple', 'royal']
  },

  // NATURE & EARTH (5 gradients)
  'gradient-forest-mist': {
    type: 'gradient',
    name: 'Forest Mist',
    preview: 'linear-gradient(135deg, #134e4a, #047857)',
    value: 'linear-gradient(135deg, #134e4a 0%, #047857 50%, #10b981 100%)',
    colors: ['#134e4a', '#047857', '#10b981'],
    angle: 135,
    tags: ['nature', 'green', 'forest']
  },
  'gradient-autumn-leaves': {
    type: 'gradient',
    name: 'Autumn Leaves',
    preview: 'linear-gradient(135deg, #7c2d12, #ea580c)',
    value: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
    colors: ['#7c2d12', '#ea580c', '#fb923c'],
    angle: 135,
    tags: ['nature', 'autumn', 'warm']
  },
  'gradient-desert-sand': {
    type: 'gradient',
    name: 'Desert Sand',
    preview: 'linear-gradient(135deg, #fef7ed, #fed7aa)',
    value: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)',
    colors: ['#fef7ed', '#fed7aa', '#fdba74'],
    angle: 135,
    tags: ['nature', 'earth', 'warm']
  },
  'gradient-ocean-depth': {
    type: 'gradient',
    name: 'Ocean Depth',
    preview: 'linear-gradient(135deg, #164e63, #0e7490)',
    value: 'linear-gradient(135deg, #164e63 0%, #0e7490 50%, #06b6d4 100%)',
    colors: ['#164e63', '#0e7490', '#06b6d4'],
    angle: 135,
    tags: ['nature', 'ocean', 'blue']
  },
  'gradient-mountain-peak': {
    type: 'gradient',
    name: 'Mountain Peak',
    preview: 'linear-gradient(135deg, #e7e5e4, #a8a29e)',
    value: 'linear-gradient(135deg, #e7e5e4 0%, #a8a29e 50%, #78716c 100%)',
    colors: ['#e7e5e4', '#a8a29e', '#78716c'],
    angle: 135,
    tags: ['nature', 'earth', 'neutral']
  },

  // PREMIUM & SPECIAL (4 gradients)
  'gradient-holographic': {
    type: 'gradient',
    name: 'Holographic',
    preview: 'linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0)',
    value: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 35%, #40e0d0 70%, #ff0080 100%)',
    colors: ['#ff0080', '#ff8c00', '#40e0d0'],
    angle: 135,
    tags: ['premium', 'colorful', 'vibrant'],
    isPremium: true
  },
  'gradient-rainbow-wave': {
    type: 'gradient',
    name: 'Rainbow Wave',
    preview: 'linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0, #4169e1)',
    value: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #4169e1 75%, #ff0080 100%)',
    colors: ['#ff0080', '#ff8c00', '#40e0d0', '#4169e1'],
    angle: 135,
    tags: ['premium', 'rainbow', 'vibrant'],
    isPremium: true
  },
  'gradient-gold-luxury': {
    type: 'gradient',
    name: 'Gold Luxury',
    preview: 'linear-gradient(135deg, #a17d3f, #d4af37)',
    value: 'linear-gradient(135deg, #a17d3f 0%, #d4af37 50%, #f9e79f 100%)',
    colors: ['#a17d3f', '#d4af37', '#f9e79f'],
    angle: 135,
    tags: ['premium', 'gold', 'luxury'],
    isPremium: true
  },
  'gradient-silver-chrome': {
    type: 'gradient',
    name: 'Silver Chrome',
    preview: 'linear-gradient(135deg, #71797E, #C0C0C0)',
    value: 'linear-gradient(135deg, #71797E 0%, #C0C0C0 50%, #E8E8E8 100%)',
    colors: ['#71797E', '#C0C0C0', '#E8E8E8'],
    angle: 135,
    tags: ['premium', 'silver', 'metallic'],
    isPremium: true
  },
}
