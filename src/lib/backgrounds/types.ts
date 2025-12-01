/**
 * Background System Types
 * Comprehensive type definitions for background system
 */

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image' | 'animated' | 'video'

export interface BaseBackground {
  type: BackgroundType
  name: string
  preview: string // Visual preview (CSS or image URL)
  isPremium?: boolean
  tags?: string[] // For filtering/search
}

export interface SolidBackground extends BaseBackground {
  type: 'solid'
  value: string // Hex color
}

export interface GradientBackground extends BaseBackground {
  type: 'gradient'
  value: string // CSS gradient value
  colors: string[] // Array of colors used
  angle?: number // Gradient angle (default 135deg)
}

export interface PatternBackground extends BaseBackground {
  type: 'pattern'
  value: string // CSS pattern (gradient or url)
  size: string // Background size (e.g., '20px 20px')
  backgroundColor: string // Base color behind pattern
}

export interface ImageBackground extends BaseBackground {
  type: 'image'
  value: string // URL or data URI
  position?: string // Background position (default: 'center')
  size?: string // Background size (default: 'cover')
  attachment?: 'scroll' | 'fixed' // Background attachment
  overlay?: string // Optional overlay color (e.g., 'rgba(0, 0, 0, 0.3)')
}

export interface AnimatedBackground extends BaseBackground {
  type: 'animated'
  component?: string // React component name for animation
  value?: string // CSS value if applicable
  animation?: string // CSS animation property
  isPremium: true // Always premium
}

export interface VideoBackground extends BaseBackground {
  type: 'video'
  value: string // URL to video file
  poster?: string // Poster image URL (shown before video loads)
  overlay?: string // Optional overlay color (e.g., 'rgba(0, 0, 0, 0.3)')
  loop?: boolean // Loop video (default: true)
  muted?: boolean // Mute video (default: true)
  playbackRate?: number // Playback speed (default: 1.0)
}

export type Background =
  | SolidBackground
  | GradientBackground
  | PatternBackground
  | ImageBackground
  | AnimatedBackground
  | VideoBackground

export type BackgroundRegistry = Record<string, Background>

// Custom background configuration
export interface CustomBackgroundConfig {
  type: BackgroundType
  colors?: string[] // For gradients
  angle?: number // For gradients
  pattern?: string // For patterns
  imageUrl?: string // For images
  videoUrl?: string // For videos
  overlay?: string // For images and videos
  poster?: string // For videos
}

// Site background configuration (stored in DB)
export interface SiteBackgroundConfig {
  backgroundType: string // Key from registry or 'custom'
  backgroundCustom?: CustomBackgroundConfig // For custom backgrounds
  backgroundImage?: string // For uploaded images
}
