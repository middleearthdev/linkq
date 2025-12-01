/**
 * Animated Background Presets (Premium Feature)
 * Animated backgrounds using CSS animations or React components
 */

import { AnimatedBackground } from '../types'

export const ANIMATED_PRESETS: Record<string, AnimatedBackground> = {
  'animated-gradient-flow': {
    type: 'animated',
    name: 'Gradient Flow',
    preview: 'linear-gradient(270deg, #667eea, #764ba2, #f093fb)',
    value: 'linear-gradient(270deg, #667eea, #764ba2, #f093fb, #667eea)',
    animation: 'gradient-flow 15s ease infinite',
    isPremium: true,
    tags: ['animated', 'gradient', 'smooth']
  },
  'animated-aurora': {
    type: 'animated',
    name: 'Aurora Lights',
    preview: 'radial-gradient(ellipse at top, #667eea, transparent)',
    value: 'radial-gradient(ellipse at top, #667eea, transparent), radial-gradient(ellipse at bottom, #764ba2, transparent)',
    animation: 'aurora-pulse 8s ease-in-out infinite',
    isPremium: true,
    tags: ['animated', 'aurora', 'mystical']
  },
  'animated-particles': {
    type: 'animated',
    name: 'Floating Particles',
    preview: '#0a0a0a',
    component: 'ParticlesBackground',
    isPremium: true,
    tags: ['animated', 'particles', 'tech']
  },
  'animated-waves': {
    type: 'animated',
    name: 'Ocean Waves',
    preview: 'linear-gradient(135deg, #667eea, #764ba2)',
    component: 'WavesBackground',
    isPremium: true,
    tags: ['animated', 'waves', 'organic']
  },
  'animated-stars': {
    type: 'animated',
    name: 'Starfield',
    preview: '#000000',
    component: 'StarsBackground',
    isPremium: true,
    tags: ['animated', 'stars', 'space']
  },
  'animated-matrix': {
    type: 'animated',
    name: 'Matrix Rain',
    preview: '#000000',
    component: 'MatrixBackground',
    isPremium: true,
    tags: ['animated', 'matrix', 'tech']
  },
}
