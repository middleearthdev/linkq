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
      'Inter': '"Inter", sans-serif',
      'Poppins': '"Poppins", sans-serif',
      'Roboto': '"Roboto", sans-serif',
      'Montserrat': '"Montserrat", sans-serif',
      'Open Sans': '"Open Sans", sans-serif',
      'Lato': '"Lato", sans-serif',
      'Nunito': '"Nunito", sans-serif',
      'Source Sans Pro': '"Source Sans Pro", sans-serif',
      'Playfair Display': '"Playfair Display", serif',
      'Merriweather': '"Merriweather", serif',
      'JetBrains Mono': '"JetBrains Mono", monospace',
      'Cursive': 'cursive'
    }
    return fontMap[fontName] || 'system-ui, -apple-system, sans-serif'
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

    return (
      <BlockComponent
        key={block.id}
        props={block.props}
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

    // Background handling with new registry system
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
      <BackgroundRenderer backgroundKey={backgroundKey} className={`min-h-screen ${className}`}>
        <div className="relative container mx-auto px-4 py-8" style={{ zIndex: 2, ...getContainerStyle() }}>
          <div className="max-w-2xl mx-auto template-content">
            {siteData.blocks.map(renderBlock)}

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
      className={`min-h-screen template-container ${className} relative`}
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
          {siteData.blocks.map(renderBlock)}

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