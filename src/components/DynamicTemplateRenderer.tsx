/**
 * Dynamic Template Renderer Component
 * Renders templates using Block Registry - Zero Code Changes for New Templates!
 * Now supports Background Registry System for consistent background management
 */

"use client"

import { useEffect } from "react"
import { getBlockComponent } from "@/components/blocks/registry"
import { getBackground, getBackgroundStyles, migrateOldBackground } from "@/lib/backgrounds/registry"
import { BackgroundRenderer } from "@/components/backgrounds/BackgroundRenderer"

// Export helper untuk generate wallpaper style
export function generateWallpaperStyle(wallpaper: {
  type: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
  color: string
  pattern?: 'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'
  blur?: 'light' | 'medium' | 'heavy' | 'glass'
}): string {
  const { type, color, pattern, blur } = wallpaper

  switch (type) {
    case 'fill':
      return color

    case 'gradient':
      // Create gradient from color (darker to lighter)
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 }
      }
      const rgb = hexToRgb(color)
      const lighterRgb = {
        r: Math.min(255, rgb.r + 60),
        g: Math.min(255, rgb.g + 60),
        b: Math.min(255, rgb.b + 60)
      }
      return `linear-gradient(135deg, ${color} 0%, rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}) 100%)`

    case 'blur':
      // Blur effects with different intensities
      const blurType = blur || 'medium'
      const blurEffects: Record<string, string> = {
        light: `${color} url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3Ccircle cx='25' cy='25' r='20' fill='rgba(255,255,255,0.3)' filter='url(%23blur)'/%3E%3Ccircle cx='75' cy='75' r='25' fill='rgba(255,255,255,0.2)' filter='url(%23blur)'/%3E%3C/svg%3E")`,
        medium: `${color} url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='8'/%3E%3C/filter%3E%3Ccircle cx='25' cy='25' r='20' fill='rgba(255,255,255,0.4)' filter='url(%23blur)'/%3E%3Ccircle cx='75' cy='75' r='25' fill='rgba(255,255,255,0.3)' filter='url(%23blur)'/%3E%3Ccircle cx='50' cy='80' r='15' fill='rgba(255,255,255,0.25)' filter='url(%23blur)'/%3E%3C/svg%3E")`,
        heavy: `${color} url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='15'/%3E%3C/filter%3E%3Ccircle cx='25' cy='25' r='20' fill='rgba(255,255,255,0.5)' filter='url(%23blur)'/%3E%3Ccircle cx='75' cy='75' r='30' fill='rgba(255,255,255,0.4)' filter='url(%23blur)'/%3E%3Ccircle cx='50' cy='50' r='25' fill='rgba(255,255,255,0.35)' filter='url(%23blur)'/%3E%3C/svg%3E")`,
        glass: `${color} url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='glass'%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100' height='100' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='30' cy='30' r='25' fill='rgba(255,255,255,0.15)' filter='url(%23glass)'/%3E%3Ccircle cx='70' cy='70' r='20' fill='rgba(255,255,255,0.12)' filter='url(%23glass)'/%3E%3C/svg%3E")`
      }
      return blurEffects[blurType]

    case 'pattern':
      // Pattern backgrounds with color
      const patterns: Record<string, string> = {
        // Original patterns
        grid: `${color} url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E")`,

        morph: `${color} url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 Q40 20 30 30 Q20 40 30 50 Q40 40 50 30 Q40 20 30 10z' fill='rgba(255,255,255,0.05)' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E")`,

        organic: `${color} url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='60' cy='60' r='20' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='60' cy='20' r='10' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E")`,

        matrix: `${color} url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fill='rgba(255,255,255,0.06)' font-family='monospace' font-size='12'%3E0%3C/text%3E%3C/svg%3E")`,

        // New patterns
        dots: `${color} url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`,

        waves: `${color} url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 5 50 10 T100 10' stroke='rgba(255,255,255,0.1)' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,

        diagonal: `${color} url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,

        hexagon: `${color} url("data:image/svg+xml,%3Csvg width='56' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0L51 14L51 34L28 48L5 34L5 14Z' stroke='rgba(255,255,255,0.08)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,

        zigzag: `${color} url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10L10 0L20 10L30 0L40 10' stroke='rgba(255,255,255,0.1)' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,

        triangles: `${color} url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10L50 50L10 50Z' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,

        circles: `${color} url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='25' cy='25' r='20' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E")`,

        squares: `${color} url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='30' height='30' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E")`
      }
      return pattern ? (patterns[pattern] || color) : color

    case 'image':
      // Future: Custom image background
      return color

    case 'video':
      // Future: Video background
      return color

    default:
      return color
  }
}

interface BlockData {
  id: string
  type: string
  props: any
}

interface SiteData {
  blocks: BlockData[]
  meta: {
    title: string
    description: string
    theme: Record<string, string>
    font?: string
    backgroundKey?: string // New: Background registry key
    wallpaper?: {
      type: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
      color: string
      pattern?: 'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'
      blur?: 'light' | 'medium' | 'heavy' | 'glass'
    }
    textColors?: {
      title?: string
      pageText?: string
      buttonText?: string
    }
    textSize?: 'small' | 'large'
  }
}

interface DynamicTemplateRendererProps {
  siteData: SiteData
  className?: string
  isPreview?: boolean
}

export function DynamicTemplateRenderer({
  siteData,
  className = "",
  isPreview = false
}: DynamicTemplateRendererProps) {

  console.log(siteData, 'siteData')
  // Apply CSS variables from theme - scoped for preview mode, global for client sites
  useEffect(() => {
    console.log(siteData)
    console.log(getContainerStyle())

    // Load Google Font if needed (this is always safe)
    if (siteData.meta?.font && siteData.meta.font !== 'system') {
      loadGoogleFont(siteData.meta.font)
    }

    // Only apply global CSS variables if NOT in preview mode (i.e., on actual client sites)
    if (!isPreview && siteData.meta.theme) {
      const root = document.documentElement

      // Set template CSS variables globally for client sites
      Object.entries(siteData.meta.theme).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })

      // Set fallback CSS variables if not provided
      const fallbacks = {
        '--text-secondary': 'var(--text-color, #6b7280)',
        '--border': '1px solid var(--primary-color, #d1d5db)',
        '--avatar-border': '2px solid var(--primary-color, #ffffff)',
        '--card-background-hover': 'var(--secondary-color, #f3f4f6)',
        '--text-hover': 'var(--card-background, #ffffff)',
        '--shadow-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.2)'
      }

      Object.entries(fallbacks).forEach(([key, value]) => {
        if (!siteData.meta.theme[key]) {
          root.style.setProperty(key, value)
        }
      })
    }
  }, [siteData.meta?.theme, siteData.meta?.font, isPreview])

  // Helper function to load Google Fonts
  const loadGoogleFont = (fontName: string) => {
    const fontId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`

    // Check if font is already loaded
    if (document.getElementById(fontId)) return

    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`

    const link = document.createElement('link')
    link.id = fontId
    link.rel = 'stylesheet'
    link.href = fontUrl
    document.head.appendChild(link)
  }

  // Helper function to get font family CSS
  const getFontFamily = (fontName: string) => {
    const fontMap: Record<string, string> = {
      // Sans Serif
      'Inter': '"Inter", sans-serif',
      'Poppins': '"Poppins", sans-serif',
      'Roboto': '"Roboto", sans-serif',
      'Montserrat': '"Montserrat", sans-serif',
      'Open Sans': '"Open Sans", sans-serif',
      'Lato': '"Lato", sans-serif',
      'Nunito': '"Nunito", sans-serif',
      'Source Sans Pro': '"Source Sans Pro", sans-serif',
      'Raleway': '"Raleway", sans-serif',
      'Work Sans': '"Work Sans", sans-serif',
      'DM Sans': '"DM Sans", sans-serif',
      'Manrope': '"Manrope", sans-serif',
      'Outfit': '"Outfit", sans-serif',
      'Space Grotesk': '"Space Grotesk", sans-serif',
      'Quicksand': '"Quicksand", sans-serif',

      // Serif
      'Playfair Display': '"Playfair Display", serif',
      'Merriweather': '"Merriweather", serif',
      'Lora': '"Lora", serif',
      'Crimson Text': '"Crimson Text", serif',
      'EB Garamond': '"EB Garamond", serif',
      'Cormorant': '"Cormorant", serif',

      // Monospace
      'JetBrains Mono': '"JetBrains Mono", monospace',
      'Fira Code': '"Fira Code", monospace',
      'Source Code Pro': '"Source Code Pro", monospace',
      'IBM Plex Mono': '"IBM Plex Mono", monospace',
      'Space Mono': '"Space Mono", monospace',

      // Handwriting
      'Dancing Script': '"Dancing Script", cursive',
      'Pacifico': '"Pacifico", cursive',
      'Caveat': '"Caveat", cursive',
      'Satisfy': '"Satisfy", cursive',
      'Great Vibes': '"Great Vibes", cursive',

      // Display
      'Bebas Neue': '"Bebas Neue", display',
      'Righteous': '"Righteous", display',
      'Fredoka': '"Fredoka", display',
      'Bungee': '"Bungee", display',
      'Archivo Black': '"Archivo Black", display'
    }
    return fontMap[fontName] || 'system-ui, -apple-system, sans-serif'
  }

  // Helper function to generate wallpaper background styles (internal use)
  const getWallpaperStyle = (wallpaper: NonNullable<SiteData['meta']['wallpaper']>): string => {
    return generateWallpaperStyle(wallpaper)
  }

  // Dynamic block rendering using registry
  const renderBlock = (block: BlockData) => {
    const BlockComponent = getBlockComponent(block.type)
    if (!BlockComponent) {
      console.warn(`Block component not found for type: ${block.type}`)
      return null
    }

    console.log(BlockComponent, 'BlockComponent')
    console.log(block.type, 'block.type')

    // Enhance props for specific block types in preview mode
    const enhancedProps = { ...block.props }

    // For product-catalog in preview mode (DeviceSimulator), force mobile viewport
    if (block.type === 'product-catalog' && isPreview) {
      enhancedProps.forceViewport = 'mobile'
      enhancedProps.containModal = true // Contain modal within preview frame
    }

    return (
      <BlockComponent
        key={block.id}
        props={enhancedProps}
        isEditing={false}
        className="block-item"
      />
    )
  }

  // Generate container style with scoped CSS variables for preview mode
  const getContainerStyle = () => {
    const style: Record<string, any> = {}

    // Apply font family
    if (siteData.meta?.font) {
      style.fontFamily = getFontFamily(siteData.meta.font)
    }

    // For preview mode, apply CSS variables directly to container
    if (isPreview && siteData.meta.theme) {
      // Apply template theme variables
      Object.entries(siteData.meta.theme).forEach(([key, value]) => {
        style[key] = value
      })

      // Set fallback CSS variables if not provided
      const fallbacks = {
        '--text-secondary': style['--text-color'] || '#6b7280',
        '--border': `1px solid ${style['--primary-color'] || '#d1d5db'}`,
        '--avatar-border': `2px solid ${style['--primary-color'] || '#ffffff'}`,
        '--card-background-hover': style['--secondary-color'] || '#f3f4f6',
        '--text-hover': style['--card-background'] || '#ffffff',
        '--shadow-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.2)'
      }

      Object.entries(fallbacks).forEach(([key, value]) => {
        if (!style[key]) {
          style[key] = value
        }
      })
    }

    // Apply text colors as CSS variables (for preview mode)
    if (isPreview && siteData.meta?.textColors) {
      if (siteData.meta.textColors.title) {
        style['--title-color'] = siteData.meta.textColors.title
      }
      if (siteData.meta.textColors.pageText) {
        style['--page-text-color'] = siteData.meta.textColors.pageText
      }
      if (siteData.meta.textColors.buttonText) {
        style['--button-text-color'] = siteData.meta.textColors.buttonText
      }
    }

    // Apply text size as CSS variable (for preview mode)
    if (isPreview && siteData.meta?.textSize) {
      const textSize = siteData.meta.textSize
      if (textSize === 'small') {
        style['--heading-size'] = '1.25rem'  // 20px
        style['--body-size'] = '0.875rem'     // 14px
        style['--button-size'] = '0.75rem'    // 12px
      } else if (textSize === 'large') {
        style['--heading-size'] = '1.875rem'  // 30px
        style['--body-size'] = '1rem'         // 16px
        style['--button-size'] = '0.875rem'   // 14px
      }
    }

    // Priority 1: Wallpaper (highest priority)
    // Skip background in preview mode karena akan di-apply di DeviceSimulator scroll container
    if (siteData.meta?.wallpaper && !isPreview) {
      style.background = getWallpaperStyle(siteData.meta.wallpaper)
    }
    // Priority 2: Background handling with new registry system
    else if (!isPreview) {
      let backgroundKey = siteData.meta?.backgroundKey

      // Backward compatibility: migrate old --background CSS variable to registry key
      if (!backgroundKey && style['--background']) {
        backgroundKey = migrateOldBackground(style['--background'])
      }

      // Apply background from registry or fallback to old system
      if (backgroundKey) {
        const bgStyles = getBackgroundStyles(backgroundKey)
        Object.assign(style, bgStyles)
      } else {
        // Fallback to old --background CSS variable
        style.background = style['--background'] || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }
    }
    // Preview mode: background transparent (handled by DeviceSimulator)
    else {
      style.background = 'transparent'
    }

    style.color = style['--text-color'] || '#333'

    return style
  }

  // Check if we need to use BackgroundRenderer (for animated/video backgrounds)
  const backgroundKey = siteData.meta?.backgroundKey || (siteData.meta.theme?.['--background'] ? migrateOldBackground(siteData.meta.theme['--background']) : null)
  const background = backgroundKey ? getBackground(backgroundKey) : null
  const needsBackgroundRenderer = background && (background.type === 'animated' || background.type === 'video')

  // If we need BackgroundRenderer, wrap content with it
  if (needsBackgroundRenderer && backgroundKey) {
    return (
      <BackgroundRenderer backgroundKey={backgroundKey} className={`${isPreview ? 'h-full' : 'min-h-screen'} ${className}`}>
        <div className="relative container mx-auto px-4 py-8" style={{ zIndex: 2, ...getContainerStyle() }}>
          <div className="max-w-2xl mx-auto template-content">
            {siteData.blocks
              .filter(block => block.props?._isVisible !== false)
              .map(renderBlock)}

            {/* LinkQ Branding */}
            {!isPreview && (
              <div className="text-center mt-12 pt-8 border-t border-opacity-20"
                style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
                <p className="text-sm opacity-60"
                  style={{ color: 'var(--text-secondary, #6b7280)' }}>
                  Made with{" "}
                  <a
                    href="https://linkq.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary-color, #66A38A)' }}
                  >
                    LinkQ
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </BackgroundRenderer>
    )
  }

  // Otherwise, use regular CSS background
  return (
    <div
      className={`${isPreview ? 'h-full' : 'min-h-screen'} template-container ${className} relative`}
      style={getContainerStyle()}
    >
      {/* Background overlay untuk background image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--background-overlay, transparent)',
          zIndex: 1
        }}
      />

      <div className="relative container mx-auto px-4 py-8" style={{ zIndex: 2 }}>
        <div className="max-w-2xl mx-auto template-content">
          {siteData.blocks
            .filter(block => block.props?._isVisible !== false)
            .map(renderBlock)}

          {/* LinkQ Branding */}
          {!isPreview && (
            <div className="text-center mt-12 pt-8 border-t border-opacity-20"
              style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
              <p className="text-sm opacity-60"
                style={{ color: 'var(--text-secondary, #6b7280)' }}>
                Made with{" "}
                <a
                  href="https://linkq.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--primary-color, #66A38A)' }}
                >
                  LinkQ
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}