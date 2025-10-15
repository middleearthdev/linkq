/**
 * Dynamic Template Renderer Component
 * Renders templates using Block Registry - Zero Code Changes for New Templates!
 */

"use client"

import { useEffect } from "react"
import { getBlockComponent } from "@/components/blocks/registry"

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

  // Apply CSS variables from theme
  useEffect(() => {
    if (siteData.meta.theme) {
      const root = document.documentElement
      Object.entries(siteData.meta.theme).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }

    // Load Google Font if needed
    if (siteData.meta?.font && siteData.meta.font !== 'system') {
      loadGoogleFont(siteData.meta.font)
    }

    // Cleanup CSS variables on unmount for preview
    return () => {
      if (isPreview && siteData.meta.theme) {
        const root = document.documentElement
        Object.keys(siteData.meta.theme).forEach((key) => {
          root.style.removeProperty(key)
        })
      }
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
      'JetBrains Mono': '"JetBrains Mono", monospace'
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

    return (
      <BlockComponent
        key={block.id}
        props={block.props}
        isEditing={false}
        className="block-item"
      />
    )
  }

  const containerStyle = siteData.meta?.font ? {
    fontFamily: getFontFamily(siteData.meta.font)
  } : {}

  return (
    <div
      className={`min-h-screen template-container ${className}`}
      style={{
        background: 'var(--background, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%))',
        color: 'var(--text-color, #333)',
        ...containerStyle
      }}
    >
      {/* Optional background pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--background-pattern, none)',
          opacity: 'var(--pattern-opacity, 1)'
        }}
      />

      {/* Optional background overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--background-overlay, none)'
        }}
      />

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto template-content">
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