/**
 * Pattern Background Presets
 * 12+ pattern backgrounds using CSS gradients and SVG
 */

import { PatternBackground } from '../types'

export const PATTERN_PRESETS: Record<string, PatternBackground> = {
  // DOTS (3 patterns)
  'pattern-dots-light': {
    type: 'pattern',
    name: 'Polka Dots Light',
    preview: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
    value: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
    size: '20px 20px',
    backgroundColor: '#ffffff',
    tags: ['dots', 'light', 'minimal']
  },
  'pattern-dots-dark': {
    type: 'pattern',
    name: 'Polka Dots Dark',
    preview: 'radial-gradient(circle, #374151 1px, transparent 1px)',
    value: 'radial-gradient(circle, #374151 1px, transparent 1px)',
    size: '20px 20px',
    backgroundColor: '#1f2937',
    tags: ['dots', 'dark']
  },
  'pattern-dots-colorful': {
    type: 'pattern',
    name: 'Colorful Dots',
    preview: 'radial-gradient(circle, #667eea 2px, transparent 2px)',
    value: 'radial-gradient(circle, #667eea 2px, transparent 2px)',
    size: '30px 30px',
    backgroundColor: '#f5f7fa',
    tags: ['dots', 'colorful']
  },

  // GRID (3 patterns)
  'pattern-grid-light': {
    type: 'pattern',
    name: 'Grid Lines Light',
    preview: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
    value: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
    size: '20px 20px',
    backgroundColor: '#ffffff',
    tags: ['grid', 'light', 'tech']
  },
  'pattern-grid-dark': {
    type: 'pattern',
    name: 'Grid Lines Dark',
    preview: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)',
    value: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)',
    size: '20px 20px',
    backgroundColor: '#1f2937',
    tags: ['grid', 'dark', 'tech']
  },
  'pattern-blueprint': {
    type: 'pattern',
    name: 'Blueprint Grid',
    preview: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
    value: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
    size: '30px 30px',
    backgroundColor: '#1e3a8a',
    tags: ['grid', 'blue', 'blueprint']
  },

  // DIAGONAL (2 patterns)
  'pattern-stripes-light': {
    type: 'pattern',
    name: 'Diagonal Stripes',
    preview: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #ffffff 10px, #ffffff 20px)',
    value: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #ffffff 10px, #ffffff 20px)',
    size: 'auto',
    backgroundColor: '#ffffff',
    tags: ['stripes', 'diagonal', 'light']
  },
  'pattern-stripes-dark': {
    type: 'pattern',
    name: 'Diagonal Stripes Dark',
    preview: 'repeating-linear-gradient(45deg, #374151, #374151 10px, #1f2937 10px, #1f2937 20px)',
    value: 'repeating-linear-gradient(45deg, #374151, #374151 10px, #1f2937 10px, #1f2937 20px)',
    size: 'auto',
    backgroundColor: '#1f2937',
    tags: ['stripes', 'diagonal', 'dark']
  },

  // GEOMETRIC (4 patterns)
  'pattern-hexagons': {
    type: 'pattern',
    name: 'Hexagon Pattern',
    preview: 'url("data:image/svg+xml,%3Csvg width=\'28\' height=\'49\' viewBox=\'0 0 28 49\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z\'/%3E%3C/g%3E%3C/svg%3E")',
    value: 'url("data:image/svg+xml,%3Csvg width=\'28\' height=\'49\' viewBox=\'0 0 28 49\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z\'/%3E%3C/g%3E%3C/svg%3E")',
    size: '28px 49px',
    backgroundColor: '#ffffff',
    tags: ['geometric', 'hexagon', 'modern']
  },
  'pattern-zigzag': {
    type: 'pattern',
    name: 'Zigzag Pattern',
    preview: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'12\' viewBox=\'0 0 40 12\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z\' fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    value: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'12\' viewBox=\'0 0 40 12\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z\' fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    size: '40px 12px',
    backgroundColor: '#ffffff',
    tags: ['geometric', 'zigzag', 'modern']
  },
  'pattern-triangles': {
    type: 'pattern',
    name: 'Triangle Pattern',
    preview: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0l10 10L0 20V0zm20 0v20L10 10 20 0z\'/%3E%3C/g%3E%3C/svg%3E")',
    value: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0l10 10L0 20V0zm20 0v20L10 10 20 0z\'/%3E%3C/g%3E%3C/svg%3E")',
    size: '20px 20px',
    backgroundColor: '#ffffff',
    tags: ['geometric', 'triangle', 'modern']
  },
  'pattern-waves': {
    type: 'pattern',
    name: 'Wave Pattern',
    preview: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\' fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    value: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\' fill=\'%23e5e7eb\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    size: '100px 20px',
    backgroundColor: '#ffffff',
    tags: ['geometric', 'wave', 'organic']
  },
}
