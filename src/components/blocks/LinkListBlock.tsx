/**
 * LinkListBlock Component
 * Displays a list of clickable links in various styles
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LinkListBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { generateCustomStyle, isValidStyle, LinkListStyle } from '@/lib/link-list-styles'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'

interface LinkListBlockComponentProps {
  props: LinkListBlockProps
  className?: string
  isEditing?: boolean
}

export function LinkListBlock({ props, className, isEditing = false }: LinkListBlockComponentProps) {
  const { style = 'pill', items = [], maxItems, customColors } = props

  // Validate style and fallback to 'card' if invalid
  let validatedStyle = style
  if (!isValidStyle(style)) {
    console.warn(`[LinkListBlock] Style "${style}" not found in registry. Falling back to 'pill' style.`)
    validatedStyle = 'pill'
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const activeItems = displayItems.filter(item => item.isActive !== false)

  // Generate CSS variables for custom colors using centralized function
  const customStyle = generateCustomStyle(customColors)

  const handleLinkClick = (item: any) => {
    if (!isEditing) {
      trackEvent('link_click', {
        linkId: item.id,
        linkTitle: item.title,
        linkUrl: item.url,
      })
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  const renderLink = (item: any, index: number) => {
    const baseClasses = cn(
      'w-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200',
      'link-item', // CSS class for template styling
      isEditing && 'pointer-events-none'
    )

    const content = (
      <>
        {item.thumbnail && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {item.icon && (
          <span className="text-base sm:text-lg">{item.icon}</span>
        )}
        <span className="font-medium text-sm sm:text-base truncate">{item.title}</span>
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 flex-shrink-0" />
      </>
    )

    if (validatedStyle === 'pill') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'rounded-full h-14 px-4 sm:px-6 font-medium',
            customColors
              ? 'text-[var(--custom-text)] hover:scale-105'
              : 'bg-[var(--primary-color)] text-[var(--card-background)] hover:bg-[var(--secondary-color)] hover:scale-105',
            'shadow-[var(--shadow)] border-[var(--border)]',
            'transition-all duration-200 active:scale-95'
          )}
          style={{
            ...(customColors && {
              backgroundColor: customColors.primary,
              color: customColors.text,
              ...customStyle
            })
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {content}
        </button>
      )
    }

    if (validatedStyle === 'vintage') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 rounded-2xl font-semibold text-base sm:text-lg tracking-wide',
            'shadow-[var(--shadow-light)] hover:shadow-[var(--shadow-heavy)]',
            'transition-all duration-300 active:scale-[0.97]',
            'uppercase letterspacing tracking-widest'
          )}
          style={{
            ...(customColors ? {
              backgroundColor: customColors.background || '#fef7ed',
              color: customColors.text || customColors.primary,
              borderColor: customColors.primary,
              ...customStyle
            } : {
              backgroundColor: 'var(--card-background)',
              color: 'var(--card-text)',
              borderColor: 'var(--card-border)'
            })
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          <span className="font-bold tracking-wide">{item.title}</span>
        </button>
      )
    }

    if (validatedStyle === 'ticket') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-200 active:scale-[0.98]'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main ticket background */}
          <div 
            className="absolute inset-0 group-hover:opacity-90 transition-colors duration-200" 
            style={{
              backgroundColor: customColors?.primary || '#d97706'
            }}
          />

          {/* Left notch */}
          <div 
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full" 
            style={{
              backgroundColor: customColors?.background || '#ffffff'
            }}
          />

          {/* Right notch */}
          <div 
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full" 
            style={{
              backgroundColor: customColors?.background || '#ffffff'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm tracking-wide"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'brush') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 sm:px-6 relative group overflow-visible',
            'transition-all duration-200 active:scale-[0.98]'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            clipPath: 'polygon(2% 20%, 6% 5%, 12% 8%, 18% 2%, 25% 10%, 32% 3%, 40% 12%, 48% 6%, 55% 15%, 62% 8%, 70% 18%, 78% 10%, 85% 22%, 92% 15%, 98% 25%, 96% 35%, 92% 42%, 88% 50%, 94% 58%, 90% 65%, 85% 72%, 78% 78%, 70% 85%, 62% 82%, 55% 88%, 48% 80%, 40% 90%, 32% 82%, 25% 85%, 18% 78%, 12% 82%, 6% 75%, 2% 65%, 4% 55%, 1% 45%, 3% 35%)'
          }}
        >
          {/* Brush stroke background */}
          <div 
            className="absolute inset-0 group-hover:opacity-80 transition-colors duration-200" 
            style={{
              backgroundColor: customColors?.background || customColors?.secondary || '#a7f3d0'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2 py-1">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm tracking-wide uppercase"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'neon') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group rounded-lg overflow-hidden',
            'transition-all duration-300 active:scale-[0.98]'
          )}
          style={{
            backgroundColor: customColors?.background || '#000000',
            boxShadow: customColors 
              ? `0 0 20px ${customColors.glow || customColors.primary}50` 
              : '0 0 20px rgba(236,72,153,0.3)'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Neon border */}
          <div 
            className="absolute inset-0 rounded-lg border-2 group-hover:brightness-110 transition-all duration-300"
            style={{
              borderColor: customColors?.primary || '#ec4899'
            }}
          />

          {/* Inner glow */}
          <div 
            className="absolute inset-1 rounded-md transition-all duration-300"
            style={{
              background: customColors 
                ? `linear-gradient(${customColors.gradientDirection || 'to right'}, ${customColors.primary}10, ${customColors.tertiary || customColors.accent || customColors.primary}10)`
                : 'linear-gradient(to right, rgba(236,72,153,0.1), rgba(168,85,247,0.1))'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base font-bold text-sm uppercase tracking-wider"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: customColors 
                    ? `drop-shadow(0 0 8px ${customColors.glow || customColors.primary}80)`
                    : 'drop-shadow(0 0 8px rgba(236,72,153,0.8))'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm uppercase tracking-wider"
              style={{
                color: 'var(--custom-text-color)',
                filter: customColors 
                  ? `drop-shadow(0 0 8px ${customColors.glow || customColors.primary}80)`
                  : 'drop-shadow(0 0 8px rgba(236,72,153,0.8))'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'origami') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden',
            'transition-all duration-200 active:scale-[0.98]'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            clipPath: 'polygon(0% 0%, 90% 0%, 100% 25%, 100% 100%, 0% 100%)'
          }}
        >
          {/* Main paper background */}
          <div 
            className="absolute inset-0 group-hover:opacity-90 transition-all duration-200" 
            style={{
              background: customColors 
                ? `linear-gradient(to bottom right, ${customColors.background || customColors.secondary || '#dbeafe'}, ${customColors.secondary || '#bfdbfe'})`
                : 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)'
            }}
          />

          {/* Fold shadow */}
          <div 
            className="absolute top-0 right-0 w-8 h-8 opacity-60"
            style={{
              clipPath: 'polygon(75% 0%, 100% 0%, 100% 100%)',
              background: customColors 
                ? `linear-gradient(to bottom left, ${customColors.primary || '#3b82f6'}40, transparent)`
                : 'linear-gradient(to bottom left, #3b82f640, transparent)'
            }}
          />

          {/* Fold highlight */}
          <div 
            className="absolute top-0 right-0 w-6 h-6 opacity-30"
            style={{
              clipPath: 'polygon(85% 0%, 100% 0%, 100% 85%)',
              background: 'linear-gradient(to bottom left, rgba(255,255,255,0.7), transparent)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'pixel') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 relative group rounded-none overflow-hidden',
            'transition-all duration-100 active:scale-[0.95]',
            'hover:translate-x-[2px] hover:translate-y-[2px]',
            'border-2',
          )}
          style={{
            backgroundColor: customColors?.primary || '#4ade80',
            borderColor: customColors?.secondary || customColors?.primary || '#16a34a',
            boxShadow: `4px 4px 0px 0px ${customColors?.secondary || customColors?.primary || '#16a34a'}80`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `2px 2px 0px 0px ${customColors?.secondary || customColors?.primary || '#16a34a'}80`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${customColors?.secondary || customColors?.primary || '#16a34a'}80`
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Pixelated pattern overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                   linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.1) 50%),
                   linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)
                 `,
              backgroundSize: '4px 4px'
            }} />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base font-mono"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-xs uppercase tracking-wider font-mono"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'hologram') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group rounded-xl overflow-hidden',
            'transition-all duration-500 active:scale-[0.98]',
          )}
          style={{
            background: customColors 
              ? `linear-gradient(${customColors.gradientDirection || 'to right'}, ${customColors.primary || '#8b5cf6'}, ${customColors.secondary || '#ec4899'}, ${customColors.tertiary || '#06b6d4'}, ${customColors.quaternary || '#3b82f6'})`
              : 'linear-gradient(to right, #8b5cf6, #ec4899, #06b6d4, #3b82f6)'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Holographic shimmer */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] 
                          transition-transform duration-1000 ease-out" />

          {/* Rainbow reflection */}
          <div className="absolute inset-0 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              backgroundSize: '20px 20px',
              animation: 'move-bg 3s linear infinite'
            }} />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base drop-shadow-lg"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm tracking-wider drop-shadow-lg"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'bubble') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden',
            'transition-all duration-300 active:scale-[0.95]',
            'rounded-full shadow-lg hover:shadow-xl'
          )}
          style={{
            background: customColors 
              ? `linear-gradient(${customColors.gradientDirection || '135deg'}, ${customColors.primary}, ${customColors.secondary}, ${customColors.tertiary || customColors.accent || customColors.secondary})`
              : 'linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Bubble highlights */}
          <div 
            className="absolute top-2 left-4 w-3 h-3 rounded-full"
            style={{ backgroundColor: `${customColors?.highlight || '#ffffff'}30` }}
          ></div>
          <div 
            className="absolute top-4 right-6 w-2 h-2 rounded-full"
            style={{ backgroundColor: `${customColors?.highlight || '#ffffff'}20` }}
          ></div>
          <div 
            className="absolute bottom-3 left-8 w-1 h-1 rounded-full"
            style={{ backgroundColor: `${customColors?.highlight || '#ffffff'}40` }}
          ></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{ color: 'var(--custom-text-color)' }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm"
              style={{ color: 'var(--custom-text-color)' }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'cyberpunk') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 sm:px-6 relative group border',
            'transition-all duration-200 active:scale-[0.98]',
          )}
          style={{
            backgroundColor: customColors?.background || '#000000',
            borderColor: customColors?.primary || '#06b6d4',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            boxShadow: customColors 
              ? `0 0 10px ${customColors.primary}80` 
              : '0 0 10px rgba(6,182,212,0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = customColors 
              ? `0 0 20px ${customColors.primary}CC` 
              : '0 0 20px rgba(6,182,212,0.8)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = customColors 
              ? `0 0 10px ${customColors.primary}80` 
              : '0 0 10px rgba(6,182,212,0.5)'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Scan lines */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: customColors 
                ? `repeating-linear-gradient(0deg, transparent, transparent 2px, ${customColors.glow || customColors.primary}30 2px, ${customColors.glow || customColors.primary}30 4px)`
                : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.3) 2px, rgba(6,182,212,0.3) 4px)',
            }} 
          />

          {/* Glitch effect */}
          <div 
            className="absolute inset-0 group-hover:opacity-20 transition-colors duration-200 opacity-10"
            style={{
              backgroundColor: customColors?.primary || '#06b6d4'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base font-mono"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-xs uppercase tracking-widest font-mono"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'sketch') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group',
            'transition-all duration-200 active:scale-[0.98]',
            'border-2',
          )}
          style={{
            backgroundColor: customColors?.background || '#ffffff',
            borderColor: customColors?.primary || '#1f2937',
            borderRadius: '15px 25px 20px 18px',
            transform: 'rotate(-0.5deg)',
            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.3))'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Hand-drawn lines */}
          <div 
            className="absolute inset-1 border opacity-30"
            style={{
              borderColor: customColors?.secondary || customColors?.primary || '#374151',
              borderRadius: '12px 20px 18px 15px',
              transform: 'rotate(0.3deg)'
            }} 
          />

          {/* Sketch texture */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20V6H0V4h20V2H0V0h20.5L0 20.5z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }} />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm" 
              style={{ 
                fontFamily: 'cursive',
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'metallic') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group rounded-lg overflow-hidden',
            'transition-all duration-300 active:scale-[0.98]',
            'border shadow-lg',
          )}
          style={{
            background: customColors 
              ? `linear-gradient(${customColors.gradientDirection || 'to bottom'}, ${customColors.highlight || '#e5e7eb'}, ${customColors.primary || '#9ca3af'}, ${customColors.secondary || '#6b7280'}, ${customColors.tertiary || '#4b5563'})`
              : 'linear-gradient(to bottom, #e5e7eb, #9ca3af, #6b7280, #4b5563)',
            borderColor: customColors?.primary || '#4b5563'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Metal reflection */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                          transform skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] 
                          transition-transform duration-700 ease-out" />

          {/* Brushed metal texture */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
            }} />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base drop-shadow-sm"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm drop-shadow-sm"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'neon-outline') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group bg-transparent rounded-lg',
            'transition-all duration-300 active:scale-[0.98]',
            'border-2',
          )}
          style={{
            borderColor: customColors?.primary || '#06b6d4',
            boxShadow: customColors 
              ? `0 0 10px ${customColors.glow || customColors.primary}50, inset 0 0 10px ${customColors.glow || customColors.primary}1A`
              : '0 0 10px rgba(6,182,212,0.3), inset 0 0 10px rgba(6,182,212,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = customColors 
              ? `0 0 20px ${customColors.glow || customColors.primary}99, inset 0 0 20px ${customColors.glow || customColors.primary}33`
              : '0 0 20px rgba(6,182,212,0.6), inset 0 0 20px rgba(6,182,212,0.2)'
            e.currentTarget.style.borderColor = customColors?.tertiary || customColors?.accent || customColors?.primary || '#67e8f9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = customColors 
              ? `0 0 10px ${customColors.glow || customColors.primary}50, inset 0 0 10px ${customColors.glow || customColors.primary}1A`
              : '0 0 10px rgba(6,182,212,0.3), inset 0 0 10px rgba(6,182,212,0.1)'
            e.currentTarget.style.borderColor = customColors?.primary || '#06b6d4'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base group-hover:brightness-110"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: customColors 
                    ? `drop-shadow(0 0 6px ${customColors.glow || customColors.primary}CC)`
                    : 'drop-shadow(0 0 6px rgba(6,182,212,0.8))'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm group-hover:brightness-110"
              style={{
                color: 'var(--custom-text-color)',
                filter: customColors 
                  ? `drop-shadow(0 0 6px ${customColors.glow || customColors.primary}CC)`
                  : 'drop-shadow(0 0 6px rgba(6,182,212,0.8))'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (validatedStyle === 'terminal') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 relative group border font-mono',
            'transition-all duration-200 active:scale-[0.98]',
          )}
          style={{
            backgroundColor: customColors?.background || '#000000',
            borderColor: customColors?.primary || '#22c55e',
            boxShadow: customColors
              ? `0 0 10px ${customColors.glow || customColors.primary}50`
              : '0 0 10px rgba(34,197,94,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = customColors
              ? `0 0 15px ${customColors.glow || customColors.primary}80`
              : '0 0 15px rgba(34,197,94,0.5)'
            e.currentTarget.style.borderColor = customColors?.tertiary || customColors?.accent || customColors?.primary || '#4ade80'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = customColors
              ? `0 0 10px ${customColors.glow || customColors.primary}50`
              : '0 0 10px rgba(34,197,94,0.3)'
            e.currentTarget.style.borderColor = customColors?.primary || '#22c55e'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Terminal cursor */}
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-4
                            opacity-0 group-hover:opacity-100 animate-pulse"
            style={{
              backgroundColor: customColors?.primary || '#22c55e'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            <span
              className="text-sm"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >$</span>
            {item.icon && (
              <span
                className="text-sm font-mono"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >{item.icon}</span>
            )}
            <span
              className="font-normal text-sm font-mono"
              style={{
                color: 'var(--custom-text-color)'
              }}
            >
              {item.title.toLowerCase().replace(/\s+/g, '_')}
            </span>
          </div>
        </button>
      )
    }

    // ========== GAME-INSPIRED STYLES ==========

    // RPG Fantasy - Medieval/Fantasy RPG style inspired by WoW, Final Fantasy
    if (validatedStyle === 'rpg-fantasy') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-visible',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Outer golden border frame */}
          <div
            className="absolute inset-0 border-4 rounded-lg"
            style={{
              borderColor: customColors?.primary || '#ca8a04',
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#d97706'}, ${customColors.secondary || '#92400e'})`
                : 'linear-gradient(to bottom, #d97706, #92400e)',
              boxShadow: customColors
                ? `0 4px 15px ${customColors.primary || '#d97706'}40, inset 0 2px 5px rgba(255,255,255,0.3)`
                : '0 4px 15px rgba(217,119,6,0.4), inset 0 2px 5px rgba(255,255,255,0.3)'
            }}
          />

          {/* Inner decorative border */}
          <div
            className="absolute inset-[6px] border-2 rounded-md opacity-70"
            style={{
              borderColor: customColors?.accent || '#fbbf24'
            }}
          />

          {/* Corner ornaments */}
          <div className="absolute -top-2 -left-2 w-4 h-4 transform rotate-45"
            style={{ backgroundColor: customColors?.accent || '#fbbf24' }}
          />
          <div className="absolute -top-2 -right-2 w-4 h-4 transform rotate-45"
            style={{ backgroundColor: customColors?.accent || '#fbbf24' }}
          />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 transform rotate-45"
            style={{ backgroundColor: customColors?.accent || '#fbbf24' }}
          />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 transform rotate-45"
            style={{ backgroundColor: customColors?.accent || '#fbbf24' }}
          />

          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: 'var(--custom-text-color)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >{item.icon}</span>
            )}
            <span
              className="font-bold text-sm sm:text-base uppercase tracking-wider"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    // Battle Royale - Modern tactical shooter style inspired by Fortnite, Apex, PUBG
    if (validatedStyle === 'battle-royale') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden',
            'transition-all duration-200 hover:translate-x-1 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main background */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.background || customColors.secondary || '#1e293b'}, ${customColors.secondary || '#0f172a'})`
                : 'linear-gradient(to right, #1e293b, #0f172a)'
            }}
          />

          {/* Accent stripe on left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-200"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#06b6d4'}, ${customColors.accent || '#0891b2'})`
                : 'linear-gradient(to bottom, #06b6d4, #0891b2)',
              boxShadow: customColors
                ? `0 0 10px ${customColors.glow || customColors.primary || '#06b6d4'}80`
                : '0 0 10px rgba(6,182,212,0.5)'
            }}
          />

          {/* Scan line effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
            }}
          />

          {/* Animated glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: customColors
                ? `linear-gradient(90deg, transparent, ${customColors.primary || '#06b6d4'}20, transparent)`
                : 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {item.icon && (
                <span
                  className="text-lg font-semibold"
                  style={{
                    color: customColors?.primary || '#06b6d4'
                  }}
                >{item.icon}</span>
              )}
              <span
                className="font-semibold text-sm uppercase tracking-wide"
                style={{
                  color: 'var(--custom-text-color)'
                }}
              >
                {item.title}
              </span>
            </div>

            {/* Arrow indicator */}
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke={customColors?.primary || '#06b6d4'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )
    }

    // Casual Game - Colorful, playful mobile game style inspired by Candy Crush, Among Us
    if (validatedStyle === 'casual-game') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden rounded-3xl',
            'transition-all duration-300 hover:scale-110 active:scale-95',
            'shadow-lg hover:shadow-2xl'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Vibrant gradient background */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#ec4899'}, ${customColors.secondary || '#8b5cf6'}, ${customColors.tertiary || customColors.accent || '#3b82f6'})`
                : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
              boxShadow: customColors
                ? `0 8px 25px ${customColors.primary || '#ec4899'}40`
                : '0 8px 25px rgba(236,72,153,0.4)'
            }}
          />

          {/* Shine overlay */}
          <div
            className="absolute inset-0 rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)'
            }}
          />

          {/* Floating bubbles decoration */}
          <div className="absolute top-2 left-4 w-3 h-3 rounded-full bg-white opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-white opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="absolute bottom-3 left-8 w-2 h-2 rounded-full bg-white opacity-25 group-hover:opacity-45 transition-opacity" />

          {/* Bottom highlight */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl opacity-50"
            style={{
              background: 'rgba(0,0,0,0.2)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-2xl"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="font-black text-base tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.2)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Bounce animation hint */}
          <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300" />
        </button>
      )
    }

    // JRPG Anime - Vibrant anime-style RPG inspired by Genshin Impact, Blue Archive
    if (validatedStyle === 'jrpg-anime') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden rounded-xl',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main gradient background */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.primary || '#a855f7'}, ${customColors.secondary || '#ec4899'})`
                : 'linear-gradient(to right, #a855f7, #ec4899)',
              boxShadow: '0 4px 15px rgba(168,85,247,0.4)'
            }}
          />

          {/* Decorative border frame */}
          <div
            className="absolute inset-[3px] rounded-lg border-2"
            style={{
              borderColor: customColors?.accent || '#fbbf24',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)'
            }}
          />

          {/* Sparkle decorations */}
          <div className="absolute top-2 right-4 text-yellow-300 opacity-80 group-hover:opacity-100 text-xs">✦</div>
          <div className="absolute bottom-2 left-4 text-yellow-300 opacity-70 group-hover:opacity-100 text-xs">✧</div>
          <div className="absolute top-1/2 right-8 text-yellow-200 opacity-60 group-hover:opacity-90 text-xs transform -translate-y-1/2">✦</div>

          {/* Animated shine */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
              animation: 'group-hover:shine 1.5s ease-in-out infinite'
            }}
          />

          {/* Top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-8 rounded-t-xl opacity-30"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-xl"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="font-bold text-base tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 6px rgba(0,0,0,0.4), 0 0 20px rgba(251,191,36,0.3)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}80`
            }}
          />
        </button>
      )
    }

    // Dark Souls - Dark fantasy gothic style inspired by Dark Souls, Elden Ring, Diablo
    if (validatedStyle === 'dark-souls') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-300 hover:brightness-110 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Dark stone background */}
          <div
            className="absolute inset-0 border"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.secondary || '#292524'}, ${customColors.background || '#1c1917'})`
                : 'linear-gradient(to bottom, #292524, #1c1917)',
              borderColor: customColors?.primary || '#92400e',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.6)'
            }}
          />

          {/* Worn texture overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />

          {/* Glowing ember border */}
          <div
            className="absolute inset-0 border-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              borderColor: customColors?.accent || '#d97706',
              boxShadow: customColors
                ? `inset 0 0 20px ${customColors.accent || '#d97706'}30, 0 0 20px ${customColors.accent || '#d97706'}20`
                : 'inset 0 0 20px rgba(217,119,6,0.3), 0 0 20px rgba(217,119,6,0.2)'
            }}
          />

          {/* Corner decorations (worn metal) */}
          <div
            className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 opacity-50"
            style={{ borderColor: customColors?.primary || '#78350f' }}
          />
          <div
            className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 opacity-50"
            style={{ borderColor: customColors?.primary || '#78350f' }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 opacity-50"
            style={{ borderColor: customColors?.primary || '#78350f' }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 opacity-50"
            style={{ borderColor: customColors?.primary || '#78350f' }}
          />

          {/* Ember glow effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: customColors
                ? `radial-gradient(circle at center, ${customColors.accent || '#d97706'}10, transparent 70%)`
                : 'radial-gradient(circle at center, rgba(217,119,6,0.1), transparent 70%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg opacity-90 group-hover:opacity-100"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: customColors
                    ? `drop-shadow(0 0 6px ${customColors.accent || '#d97706'}60)`
                    : 'drop-shadow(0 0 6px rgba(217,119,6,0.6))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="font-serif text-base tracking-wider uppercase opacity-90 group-hover:opacity-100"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: customColors
                  ? `0 0 8px ${customColors.accent || '#d97706'}60, 0 2px 4px rgba(0,0,0,0.8)`
                  : '0 0 8px rgba(217,119,6,0.6), 0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Dust particles effect */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-amber-700 opacity-20 group-hover:opacity-40" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-amber-600 opacity-15 group-hover:opacity-35" />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-amber-700 opacity-25 group-hover:opacity-45" />
        </button>
      )
    }

    // ========== GAME-INSPIRED STYLES (ROUND 2) ==========

    // Arcade Retro - 80s neon arcade with CRT scanlines inspired by Pac-Man, Space Invaders
    if (validatedStyle === 'arcade-retro') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden font-bold uppercase tracking-widest',
            'transition-all duration-200 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Black CRT background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: customColors?.background || '#000000'
            }}
          />

          {/* Neon border glow */}
          <div
            className="absolute inset-0 border-2"
            style={{
              borderColor: customColors?.primary || '#ec4899',
              boxShadow: customColors
                ? `0 0 20px ${customColors.glow || customColors.primary}90, inset 0 0 20px ${customColors.glow || customColors.primary}20`
                : '0 0 20px rgba(236,72,153,0.9), inset 0 0 20px rgba(236,72,153,0.2)'
            }}
          />

          {/* CRT Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              animation: 'scanline 8s linear infinite'
            }}
          />

          {/* Neon glow corners */}
          <div
            className="absolute top-0 left-0 w-2 h-2"
            style={{
              backgroundColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}`
            }}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2"
            style={{
              backgroundColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}`
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2"
            style={{
              backgroundColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}`
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2"
            style={{
              backgroundColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}`
            }}
          />

          {/* Hover glow pulse */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: customColors
                ? `radial-gradient(circle at center, ${customColors.primary || '#ec4899'}30, transparent 70%)`
                : 'radial-gradient(circle at center, rgba(236,72,153,0.3), transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {item.icon && (
              <span
                className="text-xl animate-pulse"
                style={{
                  color: 'var(--custom-text-color)',
                  textShadow: customColors
                    ? `0 0 10px ${customColors.glow || customColors.primary}FF, 0 0 20px ${customColors.glow || customColors.primary}80`
                    : '0 0 10px #ec4899, 0 0 20px rgba(236,72,153,0.8)'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm font-black tracking-widest"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: customColors
                  ? `0 0 10px ${customColors.glow || customColors.primary}FF, 0 0 20px ${customColors.glow || customColors.primary}80, 0 2px 4px rgba(0,0,0,0.8)`
                  : '0 0 10px #ec4899, 0 0 20px rgba(236,72,153,0.8), 0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Retro pixel corners */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-white opacity-50" />
          <div className="absolute top-1 right-1 w-1 h-1 bg-white opacity-50" />
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white opacity-50" />
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-white opacity-50" />
        </button>
      )
    }

    // Racing Speed - Racing game HUD style inspired by Need for Speed, Forza
    if (validatedStyle === 'racing-speed') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-200 hover:pr-12 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main racing gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.primary || '#dc2626'}, ${customColors.secondary || '#ea580c'})`
                : 'linear-gradient(to right, #dc2626, #ea580c)',
              boxShadow: '0 4px 15px rgba(220,38,38,0.4)'
            }}
          />

          {/* Speed stripe left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-3 transition-all duration-200"
            style={{
              background: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 15px ${customColors?.accent || '#fbbf24'}`
            }}
          />

          {/* Motion blur stripes */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
            <div
              className="absolute left-0 top-0 bottom-0 w-16 transform -skew-x-12"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
              }}
            />
            <div
              className="absolute left-20 top-0 bottom-0 w-12 transform -skew-x-12"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)'
              }}
            />
            <div
              className="absolute left-36 top-0 bottom-0 w-8 transform -skew-x-12"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)'
              }}
            />
          </div>

          {/* Speed lines animation on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-0.5 bg-white opacity-30"
                style={{
                  left: `${20 + i * 15}%`,
                  transform: 'skewX(-15deg)',
                  animation: `speedLine 0.5s ease-out ${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Diagonal corner accent */}
          <div
            className="absolute top-0 right-0 w-16 h-full transform skew-x-12 origin-top-right opacity-30"
            style={{
              background: customColors?.tertiary || customColors?.accent || '#fbbf24'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {item.icon && (
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{
                    color: 'var(--custom-text-color)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                  }}
                >{item.icon}</span>
              )}
              <span
                className="text-sm font-black uppercase tracking-wider italic"
                style={{
                  color: 'var(--custom-text-color)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(251,191,36,0.3)'
                }}
              >
                {item.title}
              </span>
            </div>

            {/* Speed indicator chevrons */}
            <div className="flex gap-0.5 transform group-hover:translate-x-2 transition-transform duration-200">
              <div className="w-2 h-6 bg-white transform skew-x-12 opacity-60" />
              <div className="w-2 h-6 bg-white transform skew-x-12 opacity-80" />
              <div className="w-2 h-6 bg-white transform skew-x-12 opacity-100" />
            </div>
          </div>

          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-70"
            style={{
              background: customColors?.accent || '#fbbf24',
              boxShadow: `0 0 10px ${customColors?.accent || '#fbbf24'}`
            }}
          />
        </button>
      )
    }

    // Horror Glitch - Horror game corrupted effect inspired by Resident Evil, Silent Hill
    if (validatedStyle === 'horror-glitch') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden font-mono',
            'transition-all duration-200 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          onMouseEnter={(e) => {
            // Random glitch effect on hover
            const glitchDuration = 150
            e.currentTarget.style.transform = `translateX(${Math.random() * 4 - 2}px)`
            setTimeout(() => {
              e.currentTarget.style.transform = 'translateX(0)'
            }, glitchDuration)
          }}
        >
          {/* Dark background */}
          <div
            className="absolute inset-0 border"
            style={{
              backgroundColor: customColors?.background || '#000000',
              borderColor: customColors?.primary || '#7f1d1d',
              boxShadow: 'inset 0 0 30px rgba(127,29,29,0.3)'
            }}
          />

          {/* Corrupted overlay */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
            }}
          />

          {/* Glitch stripes */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            <div
              className="absolute left-0 right-0 h-0.5"
              style={{
                top: '20%',
                backgroundColor: customColors?.accent || '#ef4444',
                boxShadow: `0 0 5px ${customColors?.accent || '#ef4444'}`,
                animation: 'glitchStripe 0.3s infinite'
              }}
            />
            <div
              className="absolute left-0 right-0 h-0.5"
              style={{
                top: '60%',
                backgroundColor: customColors?.tertiary || '#dc2626',
                boxShadow: `0 0 5px ${customColors?.tertiary || '#dc2626'}`,
                animation: 'glitchStripe 0.4s infinite reverse'
              }}
            />
          </div>

          {/* RGB split effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-100"
            style={{
              background: `linear-gradient(90deg,
                ${customColors?.primary || '#7f1d1d'} 0%,
                transparent 33%,
                ${customColors?.secondary || '#991b1b'} 66%,
                transparent 100%)`,
              mixBlendMode: 'screen'
            }}
          />

          {/* Static noise */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
              animation: 'static 0.1s steps(10) infinite'
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
            }}
          />

          {/* Content with glitch effect */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg opacity-90 group-hover:opacity-100"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 0 3px rgba(239,68,68,0.8))',
                  animation: 'group-hover:textGlitch 0.5s infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm font-normal tracking-wide uppercase"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: customColors
                  ? `2px 0 0 ${customColors.primary}80, -2px 0 0 ${customColors.secondary || customColors.primary}80`
                  : '2px 0 0 rgba(127,29,29,0.5), -2px 0 0 rgba(153,27,27,0.5)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Blood drip effect (corner accents) */}
          <div
            className="absolute top-0 left-4 w-1 h-4 opacity-50 group-hover:h-8 transition-all duration-300"
            style={{
              backgroundColor: customColors?.accent || '#991b1b',
              filter: 'blur(1px)'
            }}
          />
          <div
            className="absolute top-0 right-8 w-1 h-6 opacity-40 group-hover:h-10 transition-all duration-400"
            style={{
              backgroundColor: customColors?.accent || '#991b1b',
              filter: 'blur(1px)'
            }}
          />
        </button>
      )
    }

    // Fighting Combo - Fighting game combo meter inspired by Street Fighter, Mortal Kombat
    if (validatedStyle === 'fighting-combo') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-200 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main combo gradient */}
          <div
            className="absolute inset-0 border-4"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.primary || '#eab308'}, ${customColors.secondary || '#dc2626'})`
                : 'linear-gradient(to right, #eab308, #dc2626)',
              borderColor: customColors?.accent || '#ffffff',
              boxShadow: customColors
                ? `0 0 20px ${customColors.primary || '#eab308'}60, inset 0 -4px 0 rgba(0,0,0,0.3)`
                : '0 0 20px rgba(234,179,8,0.6), inset 0 -4px 0 rgba(0,0,0,0.3)'
            }}
          />

          {/* Impact flash on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.6), transparent 60%)',
              animation: 'group-hover:flash 0.3s ease-out'
            }}
          />

          {/* Combo meter bars */}
          <div className="absolute top-1 left-1 right-1 h-1 flex gap-0.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex-1 group-hover:bg-white transition-colors duration-100"
                style={{
                  backgroundColor: customColors?.accent || '#fbbf24',
                  opacity: 0.7 + (i * 0.04),
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>

          {/* Corner impact effects */}
          <div
            className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              borderColor: customColors?.highlight || '#ffffff'
            }}
          />
          <div
            className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              borderColor: customColors?.highlight || '#ffffff'
            }}
          />
          <div
            className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              borderColor: customColors?.highlight || '#ffffff'
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              borderColor: customColors?.highlight || '#ffffff'
            }}
          />

          {/* Speed lines */}
          <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-0.5 bg-white"
                style={{
                  top: `${30 + i * 20}%`,
                  transform: 'skewY(-2deg)',
                  opacity: 0.3 - (i * 0.1)
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-2xl font-black transform group-hover:scale-110 transition-transform duration-200"
                style={{
                  color: 'var(--custom-text-color)',
                  textShadow: '0 0 10px rgba(0,0,0,0.8), 0 4px 0 rgba(0,0,0,0.5)',
                  WebkitTextStroke: '2px rgba(0,0,0,0.3)'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base font-black uppercase tracking-wider italic transform group-hover:scale-105 transition-transform duration-200"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 0 10px rgba(0,0,0,0.8), 0 4px 0 rgba(0,0,0,0.5), 0 0 20px rgba(234,179,8,0.5)',
                WebkitTextStroke: '1.5px rgba(0,0,0,0.3)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Bottom shadow bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))'
            }}
          />

          {/* Hit spark */}
          <div
            className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            style={{
              width: '20px',
              height: '20px',
              background: `radial-gradient(circle, ${customColors?.highlight || '#ffffff'}, transparent 60%)`,
              animation: 'group-hover:spark 0.3s ease-out'
            }}
          />
        </button>
      )
    }

    // Card Holographic - Trading card holographic foil inspired by Pokemon, Yu-Gi-Oh, MTG
    if (validatedStyle === 'card-holo') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden rounded-xl',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Card background with holographic gradient */}
          <div
            className="absolute inset-0 rounded-xl border-2"
            style={{
              background: customColors
                ? `linear-gradient(135deg,
                    ${customColors.primary || '#a78bfa'} 0%,
                    ${customColors.secondary || '#f9a8d4'} 25%,
                    ${customColors.tertiary || '#93c5fd'} 50%,
                    ${customColors.quaternary || customColors.accent || '#fbbf24'} 75%,
                    ${customColors.primary || '#a78bfa'} 100%)`
                : 'linear-gradient(135deg, #a78bfa 0%, #f9a8d4 25%, #93c5fd 50%, #fbbf24 75%, #a78bfa 100%)',
              borderColor: customColors?.accent || '#fbbf24',
              backgroundSize: '400% 400%',
              boxShadow: customColors
                ? `0 8px 25px ${customColors.primary || '#a78bfa'}40, inset 0 1px 3px rgba(255,255,255,0.5)`
                : '0 8px 25px rgba(167,139,250,0.4), inset 0 1px 3px rgba(255,255,255,0.5)',
              animation: 'holoShift 6s ease-in-out infinite'
            }}
          />

          {/* Holographic shimmer overlay */}
          <div
            className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`,
              animation: 'shimmerSlide 3s linear infinite'
            }}
          />

          {/* Rainbow reflection effect */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              transform: 'translateX(-100%)',
              animation: 'group-hover:rainbowSlide 1.5s ease-in-out infinite'
            }}
          />

          {/* Sparkle effects */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                top: '20%',
                left: '15%',
                animation: 'group-hover:sparkle 2s ease-in-out infinite'
              }}
            >
              <div className="w-2 h-2 bg-white transform rotate-45" style={{ boxShadow: '0 0 10px #ffffff' }} />
            </div>
            <div
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                top: '60%',
                right: '20%',
                animation: 'group-hover:sparkle 2s ease-in-out 0.5s infinite'
              }}
            >
              <div className="w-2 h-2 bg-white transform rotate-45" style={{ boxShadow: '0 0 10px #ffffff' }} />
            </div>
            <div
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                top: '40%',
                left: '70%',
                animation: 'group-hover:sparkle 2s ease-in-out 1s infinite'
              }}
            >
              <div className="w-1.5 h-1.5 bg-white transform rotate-45" style={{ boxShadow: '0 0 8px #ffffff' }} />
            </div>
          </div>

          {/* Card frame border */}
          <div
            className="absolute inset-[4px] rounded-lg border-2 opacity-40"
            style={{
              borderColor: customColors?.highlight || '#ffffff',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2)'
            }}
          />

          {/* Foil pattern */}
          <div
            className="absolute inset-0 rounded-xl opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, transparent 30%, rgba(255,255,255,0.3) 40%, transparent 50%),
                                radial-gradient(circle at 80% 80%, transparent 30%, rgba(255,255,255,0.3) 40%, transparent 50%)`,
              animation: 'foilMove 4s ease-in-out infinite alternate'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.5)) drop-shadow(0 0 10px rgba(251,191,36,0.5))',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(251,191,36,0.4)',
                WebkitTextStroke: '0.5px rgba(255,255,255,0.3)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Top highlight shine */}
          <div
            className="absolute top-0 left-0 right-0 h-8 rounded-t-xl opacity-50"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)'
            }}
          />

          {/* Star decoration */}
          <div className="absolute top-2 right-2 text-yellow-300 opacity-70 group-hover:opacity-100 text-xs animate-pulse">★</div>
          <div className="absolute bottom-2 left-2 text-yellow-300 opacity-60 group-hover:opacity-100 text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>★</div>
        </button>
      )
    }

    // ========== GAME-INSPIRED STYLES (ROUND 3) ==========

    // Puzzle Block - Tetris/puzzle game style inspired by Tetris, Portal, Monument Valley
    if (validatedStyle === 'puzzle-block') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-300 hover:translate-y-[-4px] active:translate-y-0'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Block gradient background */}
          <div
            className="absolute inset-0 border-2"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#22d3ee'}, ${customColors.secondary || '#3b82f6'})`
                : 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              borderColor: customColors?.accent || '#1e40af',
              boxShadow: customColors
                ? `0 4px 0 ${customColors.secondary || '#3b82f6'}, 0 8px 20px ${customColors.primary || '#22d3ee'}40`
                : '0 4px 0 #3b82f6, 0 8px 20px rgba(34,211,238,0.4)'
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.2) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.2) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '8px 8px'
            }}
          />

          {/* Falling animation hint */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)'
            }}
          />

          {/* Block segments (Tetris-like) */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-20" />
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-white opacity-30" />
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-black opacity-20" />

          {/* Corner blocks */}
          <div
            className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-50"
            style={{ borderColor: customColors?.highlight || '#ffffff' }}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 opacity-50"
            style={{ borderColor: customColors?.highlight || '#ffffff' }}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 opacity-50"
            style={{ borderColor: customColors?.highlight || '#ffffff' }}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-50"
            style={{ borderColor: customColors?.highlight || '#ffffff' }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 0 10px rgba(34,211,238,0.3)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Hover shadow increase */}
          <div
            className="absolute -bottom-2 left-0 right-0 h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: customColors
                ? `radial-gradient(ellipse at center, ${customColors.primary || '#22d3ee'}60, transparent 70%)`
                : 'radial-gradient(ellipse at center, rgba(34,211,238,0.6), transparent 70%)',
              filter: 'blur(4px)'
            }}
          />
        </button>
      )
    }

    // Strategy RTS - Real-time strategy style inspired by StarCraft, Age of Empires, C&C
    if (validatedStyle === 'strategy-rts') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden font-mono',
            'transition-all duration-200 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Tactical background */}
          <div
            className="absolute inset-0 border"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.secondary || '#064e3b'}, ${customColors.background || customColors.secondary || '#065f46'})`
                : 'linear-gradient(to right, #064e3b, #065f46)',
              borderColor: customColors?.primary || '#10b981',
              boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px ${customColors?.primary || '#10b981'}40`
            }}
          />

          {/* Tactical grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${customColors?.primary || '#10b981'} 1px, transparent 1px),
                linear-gradient(90deg, ${customColors?.primary || '#10b981'} 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top command bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: customColors?.primary || '#10b981',
              boxShadow: `0 0 8px ${customColors?.primary || '#10b981'}`
            }}
          />

          {/* Resource indicators (decorative) */}
          <div className="absolute top-1 right-2 flex gap-1">
            <div
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: customColors?.accent || '#34d399',
                boxShadow: `0 0 4px ${customColors?.accent || '#34d399'}`
              }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: customColors?.tertiary || '#fbbf24',
                boxShadow: `0 0 4px ${customColors?.tertiary || '#fbbf24'}`
              }}
            />
            <div
              className="w-1 h-1 rounded-full opacity-50"
              style={{
                backgroundColor: customColors?.quaternary || '#ef4444'
              }}
            />
          </div>

          {/* Corner brackets */}
          <div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
            style={{ borderColor: customColors?.accent || '#34d399' }}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
            style={{ borderColor: customColors?.accent || '#34d399' }}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
            style={{ borderColor: customColors?.accent || '#34d399' }}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
            style={{ borderColor: customColors?.accent || '#34d399' }}
          />

          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.1) 2px, rgba(16,185,129,0.1) 4px)',
              animation: 'scanline 3s linear infinite'
            }}
          />

          {/* Hover highlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: customColors
                ? `linear-gradient(90deg, transparent, ${customColors.primary || '#10b981'}20, transparent)`
                : 'linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            <div
              className="w-1 h-6"
              style={{
                backgroundColor: customColors?.primary || '#10b981',
                boxShadow: `0 0 8px ${customColors?.glow || customColors?.primary || '#10b981'}`
              }}
            />
            {item.icon && (
              <span
                className="text-lg font-mono"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: `drop-shadow(0 0 4px ${customColors?.glow || customColors?.primary || '#10b981'})`
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: `0 0 8px ${customColors?.glow || customColors?.primary || '#10b981'}80`
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    // MOBA Ability - MOBA ability button inspired by League of Legends, Dota 2
    if (validatedStyle === 'moba-ability') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden rounded-lg',
            'transition-all duration-200 hover:brightness-110 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Ability background */}
          <div
            className="absolute inset-0 rounded-lg border-2"
            style={{
              background: customColors
                ? `radial-gradient(circle at center, ${customColors.primary || '#4f46e5'}, ${customColors.secondary || '#6366f1'})`
                : 'radial-gradient(circle at center, #4f46e5, #6366f1)',
              borderColor: customColors?.accent || '#06b6d4',
              boxShadow: customColors
                ? `0 0 20px ${customColors.accent || '#06b6d4'}60, inset 0 0 30px ${customColors.primary || '#4f46e5'}40`
                : '0 0 20px rgba(6,182,212,0.6), inset 0 0 30px rgba(79,70,229,0.4)'
            }}
          />

          {/* Ability icon glow */}
          <div
            className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${customColors?.glow || customColors?.accent || '#06b6d4'}40, transparent 60%)`
            }}
          />

          {/* Cooldown overlay (decorative) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-70"
            style={{
              background: customColors?.tertiary || '#14b8a6',
              boxShadow: `0 0 10px ${customColors?.tertiary || '#14b8a6'}`
            }}
          />

          {/* Mana cost indicator */}
          <div className="absolute top-1 right-1 flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: customColors?.quaternary || '#06b6d4',
                boxShadow: `0 0 6px ${customColors?.quaternary || '#06b6d4'}`
              }}
            />
            <span
              className="text-xs font-bold"
              style={{
                color: customColors?.quaternary || '#06b6d4',
                textShadow: `0 0 4px ${customColors?.quaternary || '#06b6d4'}`
              }}
            >●</span>
          </div>

          {/* Level dots */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i < 3 ? (customColors?.accent || '#fbbf24') : 'rgba(255,255,255,0.2)',
                  boxShadow: i < 3 ? `0 0 4px ${customColors?.accent || '#fbbf24'}` : 'none'
                }}
              />
            ))}
          </div>

          {/* Hotkey indicator */}
          <div
            className="absolute top-1 left-1 text-xs font-bold opacity-60"
            style={{
              color: 'var(--custom-text-color)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            Q
          </div>

          {/* Hexagonal pattern overlay */}
          <div
            className="absolute inset-0 rounded-lg opacity-10 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpolygon points='13.99 9.25 13.99 1.5 1.52 1.5 1.52 9.25 7.26 13.13 13.99 9.25'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-2xl font-bold"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: `drop-shadow(0 0 8px ${customColors?.glow || customColors?.accent || '#06b6d4'})`
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm font-bold uppercase tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: `0 0 10px ${customColors?.glow || customColors?.accent || '#06b6d4'}80, 0 2px 4px rgba(0,0,0,0.8)`
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Active border pulse */}
          <div
            className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              borderColor: customColors?.highlight || '#ffffff',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </button>
      )
    }

    // Sandbox Craft - Minecraft/sandbox style inspired by Minecraft, Terraria
    if (validatedStyle === 'sandbox-craft') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-8 relative group overflow-hidden',
            'transition-all duration-200 active:scale-95',
            'image-rendering-pixelated'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            imageRendering: 'pixelated'
          }}
        >
          {/* Crafting grid background */}
          <div
            className="absolute inset-0 border-2"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#d97706'}, ${customColors.secondary || '#78350f'})`
                : 'linear-gradient(to bottom, #d97706, #78350f)',
              borderColor: customColors?.accent || '#1c1917',
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), inset 2px 2px 4px rgba(255,255,255,0.1), 0 4px 0 rgba(0,0,0,0.3)'
            }}
          />

          {/* Pixelated grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 46%, rgba(0,0,0,0.3) 49%, rgba(0,0,0,0.3) 51%, transparent 54%),
                linear-gradient(90deg, transparent 46%, rgba(0,0,0,0.3) 49%, rgba(0,0,0,0.3) 51%, transparent 54%)
              `,
              backgroundSize: '4px 4px'
            }}
          />

          {/* Block highlight (top-left) */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
            }}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)'
            }}
          />

          {/* Block shadow (bottom-right) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
            }}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-2"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)'
            }}
          />

          {/* Corner pixels */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-black opacity-30" />
          <div className="absolute top-0 right-0 w-1 h-1 bg-black opacity-30" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-black opacity-40" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-black opacity-40" />

          {/* Texture noise */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`
            }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              boxShadow: `inset 0 0 20px ${customColors?.glow || customColors?.accent || '#fbbf24'}40`
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: 'var(--custom-text-color)',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                  filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.3))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm font-bold uppercase tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
                fontFamily: 'monospace'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Inventory slot indicator */}
          <div
            className="absolute bottom-1 right-1 w-2 h-2 border opacity-50"
            style={{
              borderColor: customColors?.highlight || '#fbbf24'
            }}
          />
        </button>
      )
    }

    // Rhythm Beat - Rhythm game style inspired by Guitar Hero, Beat Saber, osu!
    if (validatedStyle === 'rhythm-beat') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-8 relative group overflow-hidden rounded-full',
            'transition-all duration-200 hover:scale-110 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Rainbow gradient background */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.primary || '#ec4899'}, ${customColors.secondary || '#a855f7'}, ${customColors.tertiary || '#6366f1'})`
                : 'linear-gradient(to right, #ec4899, #a855f7, #6366f1)',
              backgroundSize: '200% 100%',
              boxShadow: customColors
                ? `0 0 30px ${customColors.primary || '#ec4899'}60, 0 8px 20px rgba(0,0,0,0.3)`
                : '0 0 30px rgba(236,72,153,0.6), 0 8px 20px rgba(0,0,0,0.3)',
              animation: 'gradientSlide 3s ease-in-out infinite'
            }}
          />

          {/* Audio visualizer bars */}
          <div className="absolute inset-0 flex items-center justify-center gap-0.5 opacity-30 group-hover:opacity-50 transition-opacity">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-white rounded-full"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 15}%`,
                  animation: `beatPulse 0.6s ease-in-out infinite ${i * 0.05}s`,
                  opacity: 0.6 + (i % 3) * 0.1
                }}
              />
            ))}
          </div>

          {/* Beat circles */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-white"
                style={{
                  animation: `beatRing 1.5s ease-out infinite ${i * 0.5}s`,
                  opacity: 0.3 - (i * 0.1)
                }}
              />
            ))}
          </div>

          {/* Glow pulse */}
          <div
            className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
            style={{
              background: `radial-gradient(circle at center, ${customColors?.glow || '#ffffff'}40, transparent 70%)`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />

          {/* Note track lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: '30%' }} />
            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: '50%' }} />
            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: '70%' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-lg sm:text-2xl font-black transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
                  animation: 'beatBounce 0.6s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base font-black uppercase tracking-widest italic"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.8)',
                WebkitTextStroke: '1px rgba(0,0,0,0.3)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Perfect hit indicator */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              width: '8px',
              height: '8px',
              background: customColors?.accent || '#fbbf24',
              borderRadius: '50%',
              boxShadow: `0 0 12px ${customColors?.accent || '#fbbf24'}`,
              animation: 'perfectHit 0.6s ease-out infinite'
            }}
          />

          {/* Score multiplier */}
          <div
            className="absolute top-1 right-2 text-xs font-black opacity-70 group-hover:opacity-100"
            style={{
              color: customColors?.accent || '#fbbf24',
              textShadow: `0 0 8px ${customColors?.accent || '#fbbf24'}`,
              animation: 'scoreFlash 0.6s ease-in-out infinite'
            }}
          >
            x3
          </div>
        </button>
      )
    }

    // ========== CULINARY & F&B STYLES ==========

    // Coffee Shop - Warm coffee aesthetic with beans, steam, and latte art
    if (validatedStyle === 'coffee-shop') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-2xl',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Wooden counter background */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#78350f'} 0%, ${customColors.secondary || '#451a03'} 100%)`
                : 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#92400e',
              boxShadow: `0 8px 25px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.1)`
            }}
          />

          {/* Wood grain texture */}
          <div
            className="absolute inset-0 opacity-30 rounded-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wood' x='0' y='0' width='20' height='100' patternUnits='userSpaceOnUse'%3E%3Crect x='0' y='0' width='10' height='100' fill='%23000' opacity='0.1'/%3E%3Crect x='10' y='0' width='10' height='100' fill='%23fff' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23wood)'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 100%'
            }}
          />

          {/* Coffee beans scattered */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${6 + (i % 3) * 2}px`,
                  height: `${6 + (i % 3) * 2}px`,
                  background: customColors?.shadow || '#451a03',
                  left: `${10 + i * 11}%`,
                  top: `${15 + (i % 2) * 60}%`,
                  transform: `rotate(${i * 45}deg)`,
                  boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.5)'
                }}
              />
            ))}
          </div>

          {/* Steam effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white rounded-full opacity-30"
                style={{
                  height: '40%',
                  animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
                  filter: 'blur(3px)',
                  left: `${40 + i * 10}%`
                }}
              />
            ))}
          </div>

          {/* Latte art swirl */}
          <div
            className="absolute top-2 right-3 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${customColors?.highlight || '#d4a574'}, transparent 60%)`,
              borderRadius: '50%',
              transform: 'rotate(45deg)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:rotate-12 transition-transform duration-300"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                fontFamily: 'serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Cup ring stain */}
          <div
            className="absolute bottom-2 left-4 w-10 h-10 rounded-full border opacity-10 group-hover:opacity-20 transition-opacity"
            style={{
              borderColor: customColors?.accent || '#92400e',
              borderWidth: '2px'
            }}
          />
        </button>
      )
    }

    // Bakery Sweet - Sweet bakery style with frosting swirls and sprinkles
    if (validatedStyle === 'bakery-sweet') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-visible rounded-3xl',
            'transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Frosting gradient background */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#fbcfe8'} 0%, ${customColors.secondary || '#f9a8d4'} 50%, ${customColors.tertiary || '#f472b6'} 100%)`
                : 'linear-gradient(to bottom, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#ec4899',
              boxShadow: `0 8px 20px ${customColors?.primary || '#fbcfe8'}80, inset 0 2px 8px rgba(255,255,255,0.5)`
            }}
          />

          {/* Frosting swirls */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-40">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${30 + i * 10}px`,
                  height: `${30 + i * 10}px`,
                  background: `radial-gradient(circle at center, ${customColors?.highlight || '#fce7f3'}, transparent 70%)`,
                  left: `${-10 + i * 20}%`,
                  top: `${-10 + (i % 2) * 80}%`,
                  animation: `float 4s ease-in-out infinite ${i * 0.3}s`
                }}
              />
            ))}
          </div>

          {/* Sprinkles */}
          <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity">
            {[...Array(20)].map((_, i) => {
              const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#ec4899']
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: '4px',
                    height: '12px',
                    background: colors[i % colors.length],
                    left: `${5 + (i * 4.5)}%`,
                    top: `${10 + (i % 5) * 15}%`,
                    transform: `rotate(${i * 20}deg)`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                />
              )
            })}
          </div>

          {/* Oven warmth glow */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${customColors?.glow || '#fbbf24'}, transparent 70%)`
            }}
          />

          {/* Dripping frosting effect */}
          <div className="absolute bottom-0 left-0 right-0 h-3 opacity-50 group-hover:opacity-70 transition-opacity">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-3 h-4 rounded-b-full"
                style={{
                  background: customColors?.secondary || '#f9a8d4',
                  left: `${10 + i * 12}%`,
                  transform: `translateY(${2 + (i % 2)}px)`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 3px rgba(255,255,255,0.5))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(255,255,255,0.5)',
                fontFamily: 'cursive'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Cherry on top */}
          <div
            className="absolute -top-3 right-4 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: customColors?.accent || '#dc2626',
              boxShadow: `0 4px 8px ${customColors?.accent || '#dc2626'}60, inset -2px -2px 4px rgba(0,0,0,0.3)`,
              animation: 'beatBounce 0.8s ease-in-out infinite'
            }}
          />
        </button>
      )
    }

    // Cocktail Bar - Sophisticated bar style with ice cubes and neon lights
    if (validatedStyle === 'cocktail-bar') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-lg',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Dark bar background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#1e1b4b'} 0%, ${customColors.secondary || '#4c1d95'} 100%)`
                : 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#22d3ee',
              boxShadow: `0 0 30px ${customColors?.accent || '#22d3ee'}40, 0 8px 20px rgba(0,0,0,0.6)`
            }}
          />

          {/* Neon glow border */}
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: `inset 0 0 20px ${customColors?.glow || customColors?.accent || '#22d3ee'}60, inset 0 0 40px ${customColors?.glow || '#22d3ee'}30`
            }}
          />

          {/* Ice cubes */}
          <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-sm backdrop-blur-sm"
                style={{
                  width: `${20 + (i % 3) * 8}px`,
                  height: `${20 + (i % 3) * 8}px`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.3)',
                  left: `${10 + i * 14}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  transform: `rotate(${i * 25}deg)`,
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)'
                }}
              />
            ))}
          </div>

          {/* Condensation drops */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + (i % 2) * 2}px`,
                  height: `${2 + (i % 2) * 2}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
                  left: `${5 + i * 6}%`,
                  top: `${10 + (i % 7) * 12}%`,
                  animation: `float 5s ease-in-out infinite ${i * 0.2}s`
                }}
              />
            ))}
          </div>

          {/* Citrus slice */}
          <div
            className="absolute top-3 right-4 w-12 h-12 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"
            style={{
              background: `conic-gradient(from 0deg, ${customColors?.highlight || '#fbbf24'}, transparent 30deg, ${customColors?.highlight || '#fbbf24'} 60deg, transparent 90deg, ${customColors?.highlight || '#fbbf24'} 120deg, transparent 150deg, ${customColors?.highlight || '#fbbf24'} 180deg, transparent 210deg, ${customColors?.highlight || '#fbbf24'} 240deg, transparent 270deg, ${customColors?.highlight || '#fbbf24'} 300deg, transparent 330deg, ${customColors?.highlight || '#fbbf24'} 360deg)`,
              border: `2px solid ${customColors?.highlight || '#fbbf24'}40`,
              transform: 'rotate(15deg)'
            }}
          />

          {/* Neon bar lights */}
          <div className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <div
              className="h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${customColors?.accent || '#22d3ee'}, transparent)`,
                boxShadow: `0 0 10px ${customColors?.accent || '#22d3ee'}`
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-4 h-full">
            {item.icon && (
              <span
                className="text-sm sm:text-base sm:text-3xl transform group-hover:rotate-12 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: `drop-shadow(0 0 8px ${customColors?.text || '#ffffff'})`
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base sm:text-lg font-semibold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: `0 0 15px ${customColors?.text || '#ffffff'}80, 0 2px 4px rgba(0,0,0,0.8)`,
                fontFamily: 'sans-serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Glass reflection */}
          <div
            className="absolute top-0 left-0 w-full h-1/2 rounded-t-lg opacity-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)'
            }}
          />
        </button>
      )
    }

    // Fine Dining - Elegant restaurant menu style with silver cloche
    if (validatedStyle === 'fine-dining') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden',
            'transition-all duration-500 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            borderRadius: '8px 8px 0 0'
          }}
        >
          {/* Elegant dark background */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#1e293b'} 0%, ${customColors.secondary || '#0f172a'} 100%)`
                : 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
              borderTop: `3px solid ${customColors?.accent || '#d4af37'}`,
              borderLeft: `2px solid ${customColors?.accent || '#d4af37'}40`,
              borderRight: `2px solid ${customColors?.accent || '#d4af37'}40`,
              boxShadow: `0 -4px 20px ${customColors?.accent || '#d4af37'}30, 0 8px 25px rgba(0,0,0,0.7)`
            }}
          />

          {/* Ornate corner decorations */}
          <div
            className="absolute top-0 left-0 w-8 h-8 opacity-60"
            style={{
              borderTop: `2px solid ${customColors?.accent || '#d4af37'}`,
              borderLeft: `2px solid ${customColors?.accent || '#d4af37'}`,
              background: `linear-gradient(135deg, ${customColors?.accent || '#d4af37'}20, transparent 50%)`
            }}
          />
          <div
            className="absolute top-0 right-0 w-8 h-8 opacity-60"
            style={{
              borderTop: `2px solid ${customColors?.accent || '#d4af37'}`,
              borderRight: `2px solid ${customColors?.accent || '#d4af37'}`,
              background: `linear-gradient(225deg, ${customColors?.accent || '#d4af37'}20, transparent 50%)`
            }}
          />

          {/* Silver cloche (dome cover) */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-t-full opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              background: 'linear-gradient(to bottom, #e5e7eb 0%, #9ca3af 50%, #6b7280 100%)',
              boxShadow: `0 -4px 15px rgba(212,175,55,0.3), inset 0 -2px 5px rgba(255,255,255,0.3)`,
              border: `2px solid ${customColors?.accent || '#d4af37'}`,
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            {/* Cloche handle */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full"
              style={{
                background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            />
          </div>

          {/* Candle flame glow */}
          <div
            className="absolute top-2 right-3 w-2 h-6 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
            style={{
              background: `linear-gradient(to top, ${customColors?.glow || '#f59e0b'}, ${customColors?.highlight || '#fbbf24'}, transparent)`,
              boxShadow: `0 0 15px ${customColors?.glow || '#f59e0b'}80`,
              animation: 'breathe 2s ease-in-out infinite'
            }}
          />

          {/* Menu texture lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-white"
                style={{
                  top: `${30 + i * 20}%`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-4 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-serif italic tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Bottom plate line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(to right, transparent, ${customColors?.accent || '#d4af37'}, transparent)`,
              boxShadow: `0 0 10px ${customColors?.accent || '#d4af37'}60`
            }}
          />
        </button>
      )
    }

    // Street Food - Vibrant street food style with smoke and spice effects
    if (validatedStyle === 'street-food') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-visible rounded-xl',
            'transition-all duration-300 hover:scale-110 hover:rotate-1 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Vibrant gradient background */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: customColors
                ? `linear-gradient(to right, ${customColors.primary || '#dc2626'} 0%, ${customColors.secondary || '#ea580c'} 50%, ${customColors.tertiary || '#eab308'} 100%)`
                : 'linear-gradient(to right, #dc2626 0%, #ea580c 50%, #eab308 100%)',
              borderWidth: '3px',
              borderStyle: 'dashed',
              borderColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 8px 25px ${customColors?.primary || '#dc2626'}60, 0 4px 12px rgba(0,0,0,0.4)`
            }}
          />

          {/* Grunge texture overlay */}
          <div
            className="absolute inset-0 rounded-xl opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`
            }}
          />

          {/* Smoke effect */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: `${30 + i * 15}px`,
                  height: `${30 + i * 15}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)',
                  animation: `float 4s ease-out infinite ${i * 0.3}s`,
                  filter: 'blur(8px)',
                  left: `${40 + i * 5}%`
                }}
              />
            ))}
          </div>

          {/* Spice particles */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`,
                  background: i % 3 === 0 ? '#dc2626' : i % 3 === 1 ? '#eab308' : '#22c55e',
                  left: `${5 + i * 7.5}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  boxShadow: `0 0 4px ${i % 3 === 0 ? '#dc2626' : i % 3 === 1 ? '#eab308' : '#22c55e'}`
                }}
              />
            ))}
          </div>

          {/* Food truck awning stripes */}
          <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden rounded-t-xl opacity-70">
            <div
              className="h-full"
              style={{
                background: `repeating-linear-gradient(90deg, ${customColors?.accent || '#fbbf24'}, ${customColors?.accent || '#fbbf24'} 10px, transparent 10px, transparent 20px)`
              }}
            />
          </div>

          {/* Sizzle effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 3) * 15}%`,
                  animation: `spark 1s ease-out infinite ${i * 0.15}s`,
                  boxShadow: '0 0 6px #fff'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-sm sm:text-base sm:text-3xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.7))',
                  animation: 'beatBounce 0.8s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base sm:text-lg font-black uppercase tracking-wider italic"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '3px 3px 0 rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)',
                WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                transform: 'skew(-5deg)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Price tag */}
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold opacity-80"
            style={{
              background: customColors?.accent || '#fbbf24',
              color: customColors?.shadow || '#78350f',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transform: 'rotate(5deg)'
            }}
          >
            HOT!
          </div>
        </button>
      )
    }

    // Sushi Bar - Japanese sushi bar with bamboo mat and minimalist design
    if (validatedStyle === 'sushi-bar') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-16 px-4 sm:px-6 relative group overflow-hidden rounded-sm',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Clean white background */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#fafaf9'} 0%, ${customColors.secondary || '#f5f5f4'} 100%)`
                : 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
              borderLeft: `4px solid ${customColors?.accent || '#7f1d1d'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
            }}
          />

          {/* Bamboo mat texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, ${customColors?.border || '#57534e'} 8px, ${customColors?.border || '#57534e'} 10px)`,
              backgroundSize: '10px 100%'
            }}
          />

          {/* Wasabi dot */}
          <div
            className="absolute top-3 left-3 w-3 h-3 rounded-full opacity-60"
            style={{
              background: customColors?.tertiary || '#22c55e',
              boxShadow: '0 0 8px rgba(34,197,94,0.4)'
            }}
          />

          {/* Ginger slice */}
          <div
            className="absolute bottom-2 right-3 w-6 h-4 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"
            style={{
              background: `radial-gradient(ellipse at center, ${customColors?.highlight || '#fbbf24'}, ${customColors?.highlight || '#fde047'})`,
              transform: 'rotate(-15deg)'
            }}
          />

          {/* Chopsticks */}
          <div className="absolute top-0 right-0 w-20 h-full opacity-10 group-hover:opacity-20 transition-opacity overflow-hidden">
            <div
              className="absolute top-2 -right-4 w-1 h-24 rounded-full"
              style={{
                background: customColors?.border || '#78350f',
                transform: 'rotate(25deg)'
              }}
            />
            <div
              className="absolute top-3 -right-2 w-1 h-24 rounded-full"
              style={{
                background: customColors?.border || '#78350f',
                transform: 'rotate(25deg)'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base font-medium tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                fontFamily: 'sans-serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Rising sun accent */}
          <div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
            style={{
              background: `radial-gradient(circle, ${customColors?.accent || '#7f1d1d'}, transparent 70%)`
            }}
          />
        </button>
      )
    }

    // Pizza Oven - Italian pizza style with wood fire and cheese stretch
    if (validatedStyle === 'pizza-oven') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-full',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Pizza dough background */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: customColors
                ? `radial-gradient(circle, ${customColors.primary || '#dc2626'} 0%, ${customColors.secondary || '#ea580c'} 100%)`
                : 'radial-gradient(circle, #dc2626 0%, #ea580c 100%)',
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: customColors?.tertiary || '#16a34a',
              boxShadow: `0 8px 25px ${customColors?.primary || '#dc2626'}60, inset 0 -4px 8px rgba(0,0,0,0.3)`,
              borderImage: `linear-gradient(45deg, ${customColors?.tertiary || '#16a34a'}, ${customColors?.accent || '#15803d'}, ${customColors?.tertiary || '#16a34a'}) 1`
            }}
          />

          {/* Italian flag stripes */}
          <div className="absolute top-0 left-0 bottom-0 w-1/4 opacity-30 rounded-l-full overflow-hidden">
            <div className="h-1/3 bg-green-600" />
            <div className="h-1/3 bg-white" />
            <div className="h-1/3 bg-red-600" />
          </div>

          {/* Cheese melting effect */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity rounded-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${12 + (i % 3) * 6}px`,
                  height: `${12 + (i % 3) * 6}px`,
                  background: `radial-gradient(circle, ${customColors?.highlight || '#fef08a'}, ${customColors?.quaternary || '#fde047'})`,
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>

          {/* Wood fire flames */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-t-full"
                style={{
                  width: `${8 + (i % 2) * 4}px`,
                  height: `${16 + (i % 3) * 8}px`,
                  background: `linear-gradient(to top, ${customColors?.glow || '#f59e0b'}, ${customColors?.highlight || '#fbbf24'}, transparent)`,
                  left: `${20 + i * 15}%`,
                  animation: `breathe ${1.5 + (i % 2) * 0.5}s ease-in-out infinite ${i * 0.1}s`,
                  filter: 'blur(2px)'
                }}
              />
            ))}
          </div>

          {/* Oven heat waves */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity rounded-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-white"
                style={{
                  top: `${20 + i * 20}%`,
                  animation: `shimmer 2s ease-in-out infinite ${i * 0.25}s`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-sm sm:text-base sm:text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
                  animation: 'beatBounce 1s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base sm:text-lg font-bold italic tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                fontFamily: 'serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Basil leaf */}
          <div
            className="absolute top-2 right-4 w-5 h-8 opacity-50 group-hover:opacity-70 transition-opacity"
            style={{
              background: customColors?.tertiary || '#16a34a',
              borderRadius: '0 50% 50% 0',
              transform: 'rotate(-30deg)',
              boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)'
            }}
          />
        </button>
      )
    }

    // Ice Cream - Sweet ice cream parlor with pastel colors and drips
    if (validatedStyle === 'ice-cream') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-visible',
            'transition-all duration-300 hover:scale-105 hover:-translate-y-2 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            borderRadius: '12px 12px 50% 50%'
          }}
        >
          {/* Ice cream scoop gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#fbcfe8'} 0%, ${customColors.secondary || '#bfdbfe'} 50%, ${customColors.tertiary || '#ddd6fe'} 100%)`
                : 'linear-gradient(135deg, #fbcfe8 0%, #bfdbfe 50%, #ddd6fe 100%)',
              borderRadius: '12px 12px 50% 50%',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#ec4899',
              boxShadow: `0 8px 20px ${customColors?.primary || '#fbcfe8'}80, inset 0 -4px 12px rgba(255,255,255,0.6)`
            }}
          />

          {/* Melting drips */}
          <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-b-full"
                style={{
                  width: `${8 + (i % 2) * 4}px`,
                  height: `${12 + (i % 3) * 6}px`,
                  background: i % 3 === 0
                    ? (customColors?.primary || '#fbcfe8')
                    : i % 3 === 1
                    ? (customColors?.secondary || '#bfdbfe')
                    : (customColors?.tertiary || '#ddd6fe'),
                  left: `${12 + i * 14}%`,
                  transform: `translateY(${3 + (i % 2) * 2}px)`,
                  animation: `float 3s ease-in-out infinite ${i * 0.3}s`
                }}
              />
            ))}
          </div>

          {/* Sprinkles */}
          <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
            {[...Array(25)].map((_, i) => {
              const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#ec4899', '#f97316']
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: '3px',
                    height: '10px',
                    background: colors[i % colors.length],
                    left: `${5 + (i * 3.8)}%`,
                    top: `${15 + (i % 6) * 12}%`,
                    transform: `rotate(${i * 15}deg)`,
                    borderRadius: '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                />
              )
            })}
          </div>

          {/* Wafer cone texture at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 opacity-30"
            style={{
              background: `repeating-linear-gradient(45deg, ${customColors?.border || '#d4a574'}, ${customColors?.border || '#d4a574'} 2px, transparent 2px, transparent 4px), repeating-linear-gradient(-45deg, ${customColors?.border || '#d4a574'}, ${customColors?.border || '#d4a574'} 2px, transparent 2px, transparent 4px)`,
              borderRadius: '0 0 50% 50%'
            }}
          />

          {/* Cherry on top */}
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full group-hover:scale-110 transition-transform"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${customColors?.accent || '#dc2626'}, ${customColors?.shadow || '#991b1b'})`,
              boxShadow: `0 4px 12px ${customColors?.accent || '#dc2626'}60, inset -3px -3px 6px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,255,255,0.4)`,
              animation: 'beatBounce 1s ease-in-out infinite'
            }}
          >
            {/* Cherry stem */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-4 rounded-t-full"
              style={{
                background: customColors?.tertiary || '#16a34a',
                boxShadow: 'inset -1px 0 1px rgba(0,0,0,0.3)'
              }}
            />
          </div>

          {/* Cold mist effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderRadius: '12px 12px 50% 50%' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${20 + i * 10}px`,
                  height: `${20 + i * 10}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)',
                  left: `${20 + i * 15}%`,
                  bottom: `${10 + (i % 2) * 30}%`,
                  animation: `float 4s ease-out infinite ${i * 0.4}s`,
                  filter: 'blur(4px)'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full pt-2">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.6))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(255,255,255,0.6)',
                fontFamily: 'cursive'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    // Burger Joint - American diner burger style with grill marks and sesame seeds
    if (validatedStyle === 'burger-joint') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            borderRadius: '50% 50% 12px 12px'
          }}
        >
          {/* Burger bun gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: customColors
                ? `linear-gradient(to bottom, ${customColors.primary || '#eab308'} 0%, ${customColors.secondary || '#ca8a04'} 100%)`
                : 'linear-gradient(to bottom, #eab308 0%, #ca8a04 100%)',
              borderRadius: '50% 50% 12px 12px',
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#dc2626',
              boxShadow: `0 8px 20px ${customColors?.primary || '#eab308'}60, inset 0 -3px 8px rgba(0,0,0,0.2)`
            }}
          />

          {/* Sesame seeds */}
          <div className="absolute inset-0 opacity-70">
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${3 + (i % 2)}px`,
                  height: `${2 + (i % 2)}px`,
                  background: customColors?.highlight || '#fef3c7',
                  left: `${8 + i * 5}%`,
                  top: `${10 + (i % 5) * 8}%`,
                  transform: `rotate(${i * 20}deg)`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>

          {/* Grill marks */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-1"
                style={{
                  background: customColors?.shadow || '#78350f',
                  top: `${20 + i * 12}%`,
                  transform: `rotate(${-2 + (i % 2)}deg)`
                }}
              />
            ))}
          </div>

          {/* Cheese layer */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background: customColors?.tertiary || '#fbbf24',
              clipPath: 'polygon(0 30%, 100% 20%, 100% 100%, 0 100%)',
              borderRadius: '0 0 12px 12px'
            }}
          />

          {/* Lettuce peek */}
          <div
            className="absolute bottom-6 left-0 right-0 h-2 opacity-60"
            style={{
              background: customColors?.quaternary || '#22c55e',
              clipPath: 'polygon(0 50%, 10% 0, 20% 80%, 30% 20%, 40% 70%, 50% 10%, 60% 60%, 70% 30%, 80% 80%, 90% 20%, 100% 50%, 100% 100%, 0 100%)'
            }}
          />

          {/* Retro diner shine */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
              borderRadius: '50% 50% 0 0'
            }}
          />

          {/* Steam from hot burger */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-full"
                style={{
                  width: `${12 + i * 4}px`,
                  height: `${12 + i * 4}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)',
                  left: `${30 + i * 15}%`,
                  animation: `float 3s ease-out infinite ${i * 0.4}s`,
                  filter: 'blur(4px)'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.4))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-black uppercase tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(255,255,255,0.4)',
                fontFamily: 'sans-serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* "Fresh" label */}
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity"
            style={{
              background: customColors?.accent || '#dc2626',
              color: customColors?.highlight || '#fef3c7',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transform: 'rotate(-8deg)'
            }}
          >
            FRESH
          </div>
        </button>
      )
    }

    // Ramen Shop - Japanese ramen style with steam, chopsticks, and noodles
    if (validatedStyle === 'ramen-shop') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-2xl',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Ramen bowl gradient */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#ea580c'} 0%, ${customColors.secondary || '#dc2626'} 100%)`
                : 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 8px 25px ${customColors?.primary || '#ea580c'}60, inset 0 2px 8px rgba(255,255,255,0.2)`
            }}
          />

          {/* Japanese lantern pattern */}
          <div
            className="absolute top-1 right-2 w-8 h-12 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: `repeating-linear-gradient(0deg, ${customColors?.highlight || '#fbbf24'}, ${customColors?.highlight || '#fbbf24'} 4px, transparent 4px, transparent 8px)`,
              borderRadius: '50%'
            }}
          />

          {/* Noodles swirls */}
          <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${40 + i * 8}px`,
                  height: '3px',
                  background: customColors?.highlight || '#fef3c7',
                  borderRadius: '50%',
                  left: `${10 + i * 8}%`,
                  top: `${30 + (i % 3) * 15}%`,
                  transform: `rotate(${i * 15}deg)`,
                  opacity: 0.6 - (i * 0.08)
                }}
              />
            ))}
          </div>

          {/* Boiling broth bubbles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${4 + (i % 3) * 3}px`,
                  height: `${4 + (i % 3) * 3}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
                  left: `${10 + i * 8}%`,
                  top: `${50 + (i % 4) * 10}%`,
                  animation: `float 2s ease-in-out infinite ${i * 0.2}s`
                }}
              />
            ))}
          </div>

          {/* Hot steam */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 bg-white rounded-full opacity-40"
                style={{
                  height: '50%',
                  animation: `float 3s ease-in-out infinite ${i * 0.4}s`,
                  filter: 'blur(4px)',
                  left: `${35 + i * 10}%`
                }}
              />
            ))}
          </div>

          {/* Chopsticks */}
          <div className="absolute top-0 right-0 w-24 h-full opacity-20 group-hover:opacity-30 transition-opacity overflow-hidden">
            <div
              className="absolute top-1 -right-2 w-1.5 h-28 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${customColors?.border || '#78350f'}, ${customColors?.shadow || '#451a03'})`,
                transform: 'rotate(20deg)',
                boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.4)'
              }}
            />
            <div
              className="absolute top-2 right-1 w-1.5 h-28 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${customColors?.border || '#78350f'}, ${customColors?.shadow || '#451a03'})`,
                transform: 'rotate(20deg)',
                boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.4)'
              }}
            />
          </div>

          {/* Egg half */}
          <div
            className="absolute top-3 left-3 w-8 h-10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${customColors?.quaternary || '#fbbf24'}, transparent 50%), radial-gradient(circle, ${customColors?.highlight || '#fef3c7'}, transparent 70%)`,
              transform: 'rotate(-15deg)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                  animation: 'beatBounce 1.2s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Spicy level indicator */}
          <div className="absolute bottom-2 right-2 flex gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-3 rounded-full"
                style={{
                  background: customColors?.accent || '#dc2626',
                  animation: `breathe ${1 + i * 0.2}s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </button>
      )
    }

    // Wine Cellar - Elegant wine cellar with barrel wood and grape vines
    if (validatedStyle === 'wine-cellar') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-lg',
            'transition-all duration-500 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Dark wine cellar background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#581c87'} 0%, ${customColors.secondary || '#7f1d1d'} 100%)`
                : 'linear-gradient(135deg, #581c87 0%, #7f1d1d 100%)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#d4af37',
              boxShadow: `0 8px 25px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.05)`
            }}
          />

          {/* Barrel wood texture */}
          <div
            className="absolute inset-0 opacity-20 rounded-lg"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 30px, ${customColors?.border || '#92400e'} 30px, ${customColors?.border || '#92400e'} 32px)`,
              backgroundSize: '32px 100%'
            }}
          />

          {/* Wine bottle silhouette */}
          <div
            className="absolute top-2 left-3 w-6 h-16 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, transparent 20%, ${customColors?.shadow || '#1c1917'} 20%, ${customColors?.shadow || '#1c1917'} 80%, transparent 80%)`,
              borderRadius: '4px 4px 8px 8px'
            }}
          />

          {/* Grape vines */}
          <div className="absolute top-0 right-0 w-20 h-full opacity-20 group-hover:opacity-30 transition-opacity overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${6 + (i % 2) * 3}px`,
                  height: `${6 + (i % 2) * 3}px`,
                  background: customColors?.tertiary || '#7c3aed',
                  right: `${5 + (i % 3) * 10}px`,
                  top: `${10 + i * 10}%`,
                  boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.4)'
                }}
              />
            ))}
          </div>

          {/* Cork texture */}
          <div
            className="absolute bottom-2 right-3 w-8 h-4 opacity-30 rounded-sm"
            style={{
              background: customColors?.highlight || '#d4a574',
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px)`
            }}
          />

          {/* Wine pour effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full opacity-0 group-hover:opacity-40 transition-opacity duration-700">
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to bottom, transparent 30%, ${customColors?.primary || '#7f1d1d'}60 50%, ${customColors?.primary || '#7f1d1d'} 100%)`,
                filter: 'blur(2px)'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-4 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-serif italic tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Vintage year label */}
          <div
            className="absolute top-2 right-3 px-2 py-0.5 text-xs font-serif italic opacity-50 group-hover:opacity-70 transition-opacity"
            style={{
              color: customColors?.accent || '#d4af37',
              border: `1px solid ${customColors?.accent || '#d4af37'}`,
              borderRadius: '2px'
            }}
          >
            EST. 1982
          </div>
        </button>
      )
    }

    // Tea House - Zen tea house with ceramic cups and tea leaves
    if (validatedStyle === 'tea-house') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-18 px-4 sm:px-6 relative group overflow-hidden rounded-xl',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Zen minimalist background */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#f0fdf4'} 0%, ${customColors.secondary || '#dcfce7'} 100%)`
                : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#16a34a',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.5)'
            }}
          />

          {/* Tea leaves pattern */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${8 + (i % 3) * 4}px`,
                  height: `${3 + (i % 2) * 2}px`,
                  background: customColors?.tertiary || '#15803d',
                  borderRadius: '50% 0',
                  left: `${8 + i * 7}%`,
                  top: `${15 + (i % 5) * 15}%`,
                  transform: `rotate(${i * 30}deg)`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>

          {/* Zen circle (enso) */}
          <div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
            style={{
              border: `3px solid ${customColors?.border || '#16a34a'}`,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent'
            }}
          />

          {/* Steam from teacup */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 rounded-full opacity-30"
                style={{
                  height: '50%',
                  background: customColors?.shadow || '#6b7280',
                  animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
                  filter: 'blur(2px)',
                  left: `${40 + i * 8}%`
                }}
              />
            ))}
          </div>

          {/* Ceramic cup */}
          <div
            className="absolute bottom-2 left-3 w-10 h-6 opacity-30 group-hover:opacity-40 transition-opacity"
            style={{
              background: `linear-gradient(to bottom, ${customColors?.highlight || '#fef3c7'}, ${customColors?.quaternary || '#fde047'})`,
              borderRadius: '0 0 50% 50%',
              border: `2px solid ${customColors?.border || '#a16207'}`,
              borderTop: 'none'
            }}
          />

          {/* Bamboo mat lines */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-20"
            style={{
              background: `repeating-linear-gradient(90deg, ${customColors?.border || '#16a34a'}, ${customColors?.border || '#16a34a'} 8px, transparent 8px, transparent 10px)`
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-sm sm:text-base transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base font-medium tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                fontFamily: 'serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Zen stone */}
          <div
            className="absolute bottom-2 right-3 w-6 h-4 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: `radial-gradient(ellipse at 30% 30%, ${customColors?.shadow || '#6b7280'}, ${customColors?.border || '#4b5563'})`,
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)'
            }}
          />
        </button>
      )
    }

    // Chocolate Factory - Rich chocolate factory with cocoa swirls and gold wrapper
    if (validatedStyle === 'chocolate-factory') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-hidden rounded-lg',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Rich chocolate background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#78350f'} 0%, ${customColors.secondary || '#451a03'} 100%)`
                : 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#fbbf24',
              boxShadow: `0 8px 25px ${customColors?.primary || '#78350f'}80, inset 0 2px 8px rgba(255,255,255,0.1)`
            }}
          />

          {/* Gold foil wrapper texture */}
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity rounded-lg mix-blend-overlay"
            style={{
              background: `repeating-linear-gradient(45deg, ${customColors?.accent || '#fbbf24'}20, ${customColors?.accent || '#fbbf24'}20 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, ${customColors?.highlight || '#fde047'}20, ${customColors?.highlight || '#fde047'}20 10px, transparent 10px, transparent 20px)`,
              animation: 'foilMove 20s linear infinite'
            }}
          />

          {/* Cocoa swirls */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${30 + i * 10}px`,
                  height: `${30 + i * 10}px`,
                  border: `2px solid ${customColors?.shadow || '#292524'}`,
                  borderRadius: '50%',
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  left: `${10 + i * 15}%`,
                  top: `${10 + (i % 2) * 40}%`,
                  transform: `rotate(${i * 45}deg)`,
                  opacity: 0.4 - (i * 0.05)
                }}
              />
            ))}
          </div>

          {/* Melting chocolate drip */}
          <div className="absolute top-0 left-0 right-0 h-8 opacity-50 group-hover:opacity-70 transition-opacity">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 rounded-b-full"
                style={{
                  width: `${6 + (i % 2) * 3}px`,
                  height: `${10 + (i % 3) * 5}px`,
                  background: customColors?.secondary || '#451a03',
                  left: `${10 + i * 13}%`,
                  transform: `translateY(-${2 + (i % 2)}px)`
                }}
              />
            ))}
          </div>

          {/* Truffle texture bumps */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${3 + (i % 2) * 2}px`,
                  height: `${3 + (i % 2) * 2}px`,
                  background: customColors?.shadow || '#1c1917',
                  left: `${8 + i * 6}%`,
                  top: `${20 + (i % 4) * 20}%`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
              />
            ))}
          </div>

          {/* Golden shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg overflow-hidden"
          >
            <div
              className="absolute -left-full top-0 w-full h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${customColors?.accent || '#fbbf24'}40, transparent)`,
                animation: 'shimmerSlide 2s ease-in-out infinite',
                transform: 'skewX(-20deg)'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-base sm:text-lg transform group-hover:scale-110 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: `drop-shadow(0 0 8px ${customColors?.accent || '#fbbf24'}60)`
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: `0 0 12px ${customColors?.accent || '#fbbf24'}80, 0 2px 4px rgba(0,0,0,0.8)`,
                fontFamily: 'serif'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Premium label */}
          <div
            className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background: customColors?.accent || '#fbbf24',
              color: customColors?.shadow || '#78350f',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              border: `1px solid ${customColors?.highlight || '#fde047'}`
            }}
          >
            PREMIUM
          </div>
        </button>
      )
    }

    // Juice Bar - Fresh juice bar with fruit splash and tropical vibes
    if (validatedStyle === 'juice-bar') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-22 px-4 sm:px-6 relative group overflow-visible rounded-2xl',
            'transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Vibrant tropical gradient */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#f97316'} 0%, ${customColors.secondary || '#ec4899'} 50%, ${customColors.tertiary || '#a855f7'} 100%)`
                : 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#22c55e',
              boxShadow: `0 8px 25px ${customColors?.primary || '#f97316'}60, inset 0 2px 8px rgba(255,255,255,0.4)`
            }}
          />

          {/* Fruit slices */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity">
            {/* Orange slice */}
            <div
              className="absolute top-2 right-3 w-10 h-10 rounded-full opacity-80"
              style={{
                background: `conic-gradient(from 0deg, ${customColors?.quaternary || '#fb923c'}, transparent 30deg, ${customColors?.quaternary || '#fb923c'} 60deg, transparent 90deg, ${customColors?.quaternary || '#fb923c'} 120deg, transparent 150deg, ${customColors?.quaternary || '#fb923c'} 180deg, transparent 210deg, ${customColors?.quaternary || '#fb923c'} 240deg, transparent 270deg, ${customColors?.quaternary || '#fb923c'} 300deg, transparent 330deg)`,
                border: `2px solid ${customColors?.highlight || '#fed7aa'}`
              }}
            />

            {/* Kiwi slice */}
            <div
              className="absolute bottom-2 left-3 w-8 h-8 rounded-full opacity-80"
              style={{
                background: `radial-gradient(circle, ${customColors?.highlight || '#bef264'} 30%, ${customColors?.tertiary || '#22c55e'} 70%)`,
                border: `2px solid ${customColors?.accent || '#16a34a'}`
              }}
            >
              {/* Kiwi seeds */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-1 bg-black rounded-full opacity-60"
                  style={{
                    left: `${30 + Math.cos(i * 0.785) * 20}%`,
                    top: `${30 + Math.sin(i * 0.785) * 20}%`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Splash droplets */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
                  left: `${15 + i * 7}%`,
                  top: `${10 + (i % 5) * 18}%`,
                  animation: `float ${2 + (i % 3) * 0.5}s ease-in-out infinite ${i * 0.1}s`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>

          {/* Vitamins sparkle */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: '6px',
                  height: '6px',
                  background: customColors?.glow || '#fbbf24',
                  left: `${20 + i * 12}%`,
                  top: `${25 + (i % 3) * 20}%`,
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animation: `sparkle ${1.5 + (i % 2) * 0.5}s ease-in-out infinite ${i * 0.2}s`,
                  boxShadow: `0 0 8px ${customColors?.glow || '#fbbf24'}`
                }}
              />
            ))}
          </div>

          {/* Straw */}
          <div
            className="absolute -top-4 right-6 w-3 h-20 opacity-70 group-hover:opacity-100 transition-opacity"
            style={{
              background: `repeating-linear-gradient(45deg, ${customColors?.accent || '#22c55e'}, ${customColors?.accent || '#22c55e'} 8px, ${customColors?.highlight || '#86efac'} 8px, ${customColors?.highlight || '#86efac'} 16px)`,
              borderRadius: '4px',
              transform: 'rotate(-15deg)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-sm sm:text-base sm:text-3xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
                  animation: 'beatBounce 1s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-base sm:text-lg font-black uppercase tracking-wide italic"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.5)',
                WebkitTextStroke: '1px rgba(0,0,0,0.2)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Fresh label */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold opacity-90"
            style={{
              background: customColors?.accent || '#22c55e',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transform: 'rotate(-5deg)'
            }}
          >
            100% FRESH
          </div>
        </button>
      )
    }

    // BBQ Grill - BBQ grill style with smoke, char marks, and flame effects
    if (validatedStyle === 'bbq-grill') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 sm:h-14 px-4 sm:px-6 relative group overflow-visible rounded-lg',
            'transition-all duration-300 hover:scale-105 active:scale-95'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Charred grill background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: customColors
                ? `linear-gradient(135deg, ${customColors.primary || '#292524'} 0%, ${customColors.secondary || '#0c0a09'} 100%)`
                : 'linear-gradient(135deg, #292524 0%, #0c0a09 100%)',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: customColors?.accent || '#ea580c',
              boxShadow: `0 8px 25px rgba(0,0,0,0.8), inset 0 -4px 8px ${customColors?.accent || '#ea580c'}40`
            }}
          />

          {/* Grill marks (horizontal) */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity rounded-lg">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-1.5 rounded-full"
                style={{
                  background: customColors?.shadow || '#000000',
                  top: `${10 + i * 13}%`,
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.8)'
                }}
              />
            ))}
          </div>

          {/* Charcoal texture */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`
            }}
          />

          {/* Smoke wisps */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: `${25 + i * 12}px`,
                  height: `${25 + i * 12}px`,
                  background: 'radial-gradient(circle, rgba(120,113,108,0.6), transparent 70%)',
                  left: `${30 + i * 8}%`,
                  animation: `float 4s ease-out infinite ${i * 0.4}s`,
                  filter: 'blur(6px)'
                }}
              />
            ))}
          </div>

          {/* Fire flames from bottom */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-t-full"
                style={{
                  width: `${10 + (i % 3) * 6}px`,
                  height: `${20 + (i % 4) * 10}px`,
                  background: `linear-gradient(to top, ${customColors?.accent || '#ea580c'}, ${customColors?.glow || '#f59e0b'}, ${customColors?.highlight || '#fbbf24'}, transparent)`,
                  left: `${15 + i * 10}%`,
                  animation: `breathe ${1.2 + (i % 3) * 0.4}s ease-in-out infinite ${i * 0.12}s`,
                  filter: 'blur(2px)',
                  boxShadow: `0 0 15px ${customColors?.accent || '#ea580c'}80`
                }}
              />
            ))}
          </div>

          {/* Hot embers */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + (i % 2)}px`,
                  height: `${2 + (i % 2)}px`,
                  background: i % 2 === 0 ? (customColors?.accent || '#ea580c') : (customColors?.glow || '#f59e0b'),
                  left: `${8 + i * 6}%`,
                  top: `${30 + (i % 5) * 15}%`,
                  boxShadow: `0 0 8px ${i % 2 === 0 ? (customColors?.accent || '#ea580c') : (customColors?.glow || '#f59e0b')}`,
                  animation: `breathe ${1 + (i % 3) * 0.3}s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Sizzle sparks */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${25 + (i % 4) * 15}%`,
                  animation: `spark 1.5s ease-out infinite ${i * 0.2}s`,
                  boxShadow: '0 0 6px #fff'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3 h-full">
            {item.icon && (
              <span
                className="text-xl sm:text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform"
                style={{
                  color: 'var(--custom-text-color)',
                  filter: `drop-shadow(0 0 12px ${customColors?.accent || '#ea580c'}80)`,
                  animation: 'beatBounce 0.8s ease-in-out infinite'
                }}
              >{item.icon}</span>
            )}
            <span
              className="text-lg sm:text-xl font-black uppercase tracking-widest"
              style={{
                color: 'var(--custom-text-color)',
                textShadow: `0 0 15px ${customColors?.accent || '#ea580c'}90, 2px 2px 0 rgba(0,0,0,0.9)`,
                WebkitTextStroke: '1px rgba(0,0,0,0.5)'
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Temperature gauge */}
          <div className="absolute top-2 right-2 flex flex-col items-center opacity-70 group-hover:opacity-100 transition-opacity">
            <div
              className="text-xs font-bold"
              style={{
                color: customColors?.accent || '#ea580c',
                textShadow: `0 0 8px ${customColors?.accent || '#ea580c'}`
              }}
            >
              HOT
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1.5 rounded-full mt-0.5"
                style={{
                  background: customColors?.accent || '#ea580c',
                  boxShadow: `0 0 4px ${customColors?.accent || '#ea580c'}`,
                  animation: `breathe ${0.8 + i * 0.2}s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </button>
      )
    }

    return null
  }

  if (activeItems.length === 0 && !isEditing) {
    return null
  }

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto space-y-4 p-6',
        'link-list-block', // CSS class for template styling
        className
      )}
      style={customStyle}
    >
      {activeItems.map(renderLink)}

      {isEditing && activeItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No links added yet</p>
          <p className="text-sm">Add some links to get started</p>
        </div>
      )}
    </div>
  )
}

// Editor component for customizing LinkListBlock props
export function LinkListBlockEditor({
  props,
  onChange,
  className
}: {
  props: LinkListBlockProps
  onChange: (props: LinkListBlockProps) => void
  className?: string
}) {
  const handleStyleChange = (style: LinkListStyle) => {
    onChange({ ...props, style })
  }

  const handleAddLink = () => {
    const newLink = {
      id: Math.random().toString(36).substring(7),
      title: 'New Link',
      url: 'https://yoursite.com',
      isActive: true,
    }
    onChange({ ...props, items: [...(props.items || []), newLink] })
  }

  const handleUpdateLink = (index: number, updates: any) => {
    const items = [...(props.items || [])]
    items[index] = { ...items[index], ...updates }
    onChange({ ...props, items })
  }

  const handleRemoveLink = (index: number) => {
    const items = [...(props.items || [])]
    items.splice(index, 1)
    onChange({ ...props, items })
  }

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Link Style</label>
        <div className="flex gap-2 flex-wrap">
          {(['pill', 'vintage', 'ticket', 'brush', 'neon', 'origami', 'pixel', 'hologram', 'bubble', 'cyberpunk', 'sketch', 'metallic', 'neon-outline', 'terminal'] as const).map((style) => (
            <Button
              key={style}
              variant={props.style === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange(style)}
              className="capitalize"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Max items */}
      <div>
        <label className="block text-sm font-medium mb-2">Max Items (optional)</label>
        <input
          type="number"
          value={props.maxItems || ''}
          onChange={(e) => onChange({ ...props, maxItems: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="No limit"
          min="1"
        />
      </div>

      {/* Links list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Links</label>
          <Button size="sm" onClick={handleAddLink} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {(props.items || []).map((item, index) => (
            <Card key={item.id || index} className="p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateLink(index, { title: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link title"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => handleUpdateLink(index, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yoursite.com"
                />

                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => handleUpdateLink(index, { icon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    placeholder="Icon (emoji or text)"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`active-${index}`}
                      checked={item.isActive !== false}
                      onChange={(e) => handleUpdateLink(index, { isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor={`active-${index}`} className="text-sm">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {(!props.items || props.items.length === 0) && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No links added yet</p>
              <p className="text-sm">Click "Add Link" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}