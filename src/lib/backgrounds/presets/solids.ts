/**
 * Solid Color Background Presets
 * Curated solid color backgrounds
 */

import { SolidBackground } from '../types'

export const SOLID_PRESETS: Record<string, SolidBackground> = {
  'solid-white': {
    type: 'solid',
    name: 'Pure White',
    preview: '#ffffff',
    value: '#ffffff',
    tags: ['light', 'clean', 'minimal']
  },
  'solid-black': {
    type: 'solid',
    name: 'Pure Black',
    preview: '#000000',
    value: '#000000',
    tags: ['dark', 'bold', 'minimal']
  },
  'solid-gray-50': {
    type: 'solid',
    name: 'Light Gray',
    preview: '#f9fafb',
    value: '#f9fafb',
    tags: ['light', 'neutral', 'subtle']
  },
  'solid-gray-900': {
    type: 'solid',
    name: 'Dark Gray',
    preview: '#111827',
    value: '#111827',
    tags: ['dark', 'neutral', 'modern']
  },
  'solid-blue': {
    type: 'solid',
    name: 'Sky Blue',
    preview: '#0ea5e9',
    value: '#0ea5e9',
    tags: ['blue', 'vibrant', 'fresh']
  },
  'solid-purple': {
    type: 'solid',
    name: 'Royal Purple',
    preview: '#7c3aed',
    value: '#7c3aed',
    tags: ['purple', 'vibrant', 'royal']
  },
  'solid-pink': {
    type: 'solid',
    name: 'Hot Pink',
    preview: '#ec4899',
    value: '#ec4899',
    tags: ['pink', 'vibrant', 'bold']
  },
  'solid-green': {
    type: 'solid',
    name: 'Fresh Green',
    preview: '#10b981',
    value: '#10b981',
    tags: ['green', 'vibrant', 'fresh']
  },
}
