/**
 * LinkListBlock Component
 * Displays a list of clickable links in various styles
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LinkListBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'

interface LinkListBlockComponentProps {
  props: LinkListBlockProps
  className?: string
  isEditing?: boolean
}

export function LinkListBlock({ props, className, isEditing = false }: LinkListBlockComponentProps) {
  const { style = 'pill', items = [], maxItems, customColors } = props

  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const activeItems = displayItems.filter(item => item.isActive !== false)

  // Generate CSS variables for custom colors
  const customStyle = customColors ? {
    '--custom-primary': customColors.primary || 'var(--primary-color)',
    '--custom-secondary': customColors.secondary || 'var(--secondary-color)',
    '--custom-text': customColors.text || 'var(--text-color)',
    '--custom-accent': customColors.accent || customColors.primary || 'var(--primary-color)',
    '--custom-background': customColors.background || customColors.secondary || 'var(--card-background)'
  } as React.CSSProperties : {}

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
      'w-full flex items-center justify-center gap-3 transition-all duration-200',
      'link-item', // CSS class for template styling
      isEditing && 'pointer-events-none'
    )

    const content = (
      <>
        {item.icon && (
          <span className="text-lg">{item.icon}</span>
        )}
        <span className="font-medium">{item.title}</span>
        <ExternalLink className="w-4 h-4 opacity-70" />
      </>
    )

    if (style === 'pill') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'rounded-full h-14 px-6 font-medium',
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

    if (style === 'underline') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 text-lg border-b-2 border-transparent',
            customColors
              ? 'text-[var(--custom-text)] hover:text-[var(--custom-primary)]'
              : 'text-[var(--text-color)] hover:text-[var(--primary-color)]',
            'bg-transparent hover:bg-[var(--card-background)]',
            customColors
              ? 'hover:border-[var(--custom-primary)]'
              : 'hover:border-[var(--primary-color)]',
            'transition-all duration-200'
          )}
          style={{
            ...(customColors && {
              color: customColors.text,
              borderBottomColor: 'transparent',
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

    if (style === 'card') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-16 px-6 font-medium',
            customColors
              ? 'bg-[var(--custom-background)] text-[var(--custom-text)]'
              : 'bg-[var(--card-background)] text-[var(--text-color)]',
            'border border-[var(--border)] rounded-[var(--border-radius)]',
            'shadow-[var(--shadow)] hover:shadow-lg',
            customColors
              ? 'hover:bg-[var(--custom-primary)] hover:text-[var(--custom-text)]'
              : 'hover:bg-[var(--primary-color)] hover:text-[var(--card-background)]',
            'transition-all duration-200 active:scale-98'
          )}
          style={{
            ...(customColors && {
              backgroundColor: customColors.background || customColors.secondary,
              color: customColors.text,
              borderColor: customColors.primary,
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

    if (style === 'modern') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 rounded-3xl font-medium text-base',
            'shadow-[var(--shadow)] border',
            'transition-all duration-200 active:scale-[0.98] hover:scale-[1.02]'
          )}
          style={{
            ...(customColors ? {
              backgroundColor: customColors.background || customColors.secondary,
              color: customColors.text,
              borderColor: customColors.primary,
              ...customStyle
            } : {
              backgroundColor: 'var(--card-background)',
              color: 'var(--card-text)',
              borderColor: 'var(--border-color)'
            })
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {content}
        </button>
      )
    }

    if (style === 'modern-cream') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-16 px-8 rounded-2xl font-semibold text-lg tracking-wide',
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

    if (style === 'vintage') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group',
            'transition-all duration-200 active:scale-[0.98]'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Outer border */}
          <div 
            className="absolute inset-0 rounded-2xl border-2" 
            style={{
              borderColor: customColors?.primary || '#1f2937'
            }}
          />

          {/* Inner border with background */}
          <div 
            className="absolute inset-1 rounded-xl border group-hover:bg-opacity-80 transition-colors duration-200" 
            style={{
              borderColor: customColors?.secondary || '#374151',
              backgroundColor: customColors?.background || customColors?.secondary || '#fef7ed'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: customColors?.text || customColors?.primary || '#1f2937'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm uppercase tracking-wider group-hover:opacity-90"
              style={{
                color: customColors?.text || customColors?.primary || '#1f2937'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'ticket') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-8 relative group overflow-hidden',
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
                  color: customColors?.text || '#ffffff'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm tracking-wide"
              style={{
                color: customColors?.text || '#ffffff'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'brush') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-6 relative group overflow-visible',
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
                  color: customColors?.text || customColors?.primary || '#064e3b'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm tracking-wide uppercase"
              style={{
                color: customColors?.text || customColors?.primary || '#064e3b'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'neon') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-lg overflow-hidden',
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
                  color: customColors?.text || customColors?.primary || '#f472b6',
                  filter: customColors 
                    ? `drop-shadow(0 0 8px ${customColors.glow || customColors.primary}80)`
                    : 'drop-shadow(0 0 8px rgba(236,72,153,0.8))'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm uppercase tracking-wider"
              style={{
                color: customColors?.text || customColors?.primary || '#f472b6',
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

    if (style === 'origami') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group overflow-hidden',
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
                  color: customColors?.text || customColors?.primary || '#1d4ed8'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm"
              style={{
                color: customColors?.text || customColors?.primary || '#1d4ed8'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'glass') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-2xl overflow-hidden',
            'transition-all duration-300 active:scale-[0.98]',
            'backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.15)]'
          )}
          style={{
            backgroundColor: customColors 
              ? `${customColors.primary}10` 
              : 'rgba(255,255,255,0.1)',
            borderColor: customColors 
              ? `${customColors.primary}20` 
              : 'rgba(255,255,255,0.2)',
            border: '1px solid'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Glass shine effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"
            style={{
              background: customColors 
                ? `linear-gradient(135deg, ${customColors.primary}20, transparent, transparent)`
                : 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent, transparent)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: customColors?.text || '#374151'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm"
              style={{
                color: customColors?.text || '#374151'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'pixel') {
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
                  color: customColors?.text || '#15803d'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-xs uppercase tracking-wider font-mono"
              style={{
                color: customColors?.text || '#15803d'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'hologram') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-xl overflow-hidden',
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
                  color: customColors?.text || '#ffffff'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm tracking-wider drop-shadow-lg"
              style={{
                color: customColors?.text || '#ffffff'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'neomorphism') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-2xl',
            'transition-all duration-300 active:scale-[0.98]',
            'shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
            'hover:shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)]'
          )}
          style={{
            backgroundColor: customColors?.background || '#f3f4f6',
            color: customColors?.text || '#4b5563'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span 
                className="text-base"
                style={{ color: customColors?.text || '#4b5563' }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm"
              style={{ color: customColors?.text || '#4b5563' }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'bubble') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group overflow-hidden',
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
                style={{ color: customColors?.text || '#ffffff' }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm"
              style={{ color: customColors?.text || '#ffffff' }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'cyberpunk') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-6 relative group border',
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
                  color: customColors?.text || customColors?.primary || '#06b6d4'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-xs uppercase tracking-widest font-mono"
              style={{
                color: customColors?.text || customColors?.primary || '#06b6d4'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'sketch') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group',
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
                  color: customColors?.text || customColors?.primary || '#1f2937'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm" 
              style={{ 
                fontFamily: 'cursive',
                color: customColors?.text || customColors?.primary || '#1f2937'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'metallic') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-lg overflow-hidden',
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
                  color: customColors?.text || '#1f2937'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-semibold text-sm drop-shadow-sm"
              style={{
                color: customColors?.text || '#1f2937'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'wood') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-xl overflow-hidden',
            'transition-all duration-200 active:scale-[0.98]',
            'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800',
            'hover:from-amber-600 hover:via-amber-500 hover:to-amber-700',
            'border-2 border-amber-800 shadow-lg',
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(139,69,19,0.3) 8px, rgba(139,69,19,0.3) 12px),
                                   repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,82,45,0.2) 2px, rgba(160,82,45,0.2) 4px)`,
            }} />

          {/* Wood highlights */}
          <div className="absolute top-2 left-4 w-8 h-1 bg-amber-400/30 rounded-full transform rotate-12"></div>
          <div className="absolute bottom-3 right-6 w-6 h-1 bg-amber-300/20 rounded-full transform -rotate-6"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-amber-100">{item.icon}</span>
            )}
            <span className="font-semibold text-amber-100 text-sm">
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'neon-outline') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group bg-transparent rounded-lg',
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
                  color: customColors?.text || customColors?.primary || '#06b6d4',
                  filter: customColors 
                    ? `drop-shadow(0 0 6px ${customColors.glow || customColors.primary}CC)`
                    : 'drop-shadow(0 0 6px rgba(6,182,212,0.8))'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-medium text-sm group-hover:brightness-110"
              style={{
                color: customColors?.text || customColors?.primary || '#06b6d4',
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

    if (style === 'minimal-line') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-6 relative group bg-transparent',
            'transition-all duration-200 active:scale-[0.98]',
            'border-b-2'
          )}
          style={{
            borderBottomColor: customColors?.secondary || '#d1d5db'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Animated underline */}
          <div 
            className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: customColors?.primary || '#3b82f6'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {item.icon && (
              <span 
                className="text-base transition-colors duration-200"
                style={{
                  color: customColors?.text || '#6b7280'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-normal text-sm transition-colors duration-200"
              style={{
                color: customColors?.text || '#6b7280'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'elastic') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 relative group rounded-full',
            'transition-all duration-150 hover:duration-300',
            'hover:scale-110 active:scale-95',
            'shadow-lg hover:shadow-xl',
            'animate-pulse hover:animate-none',
          )}
          style={{
            background: customColors 
              ? `linear-gradient(${customColors.gradientDirection || 'to right'}, ${customColors.primary || '#f472b6'}, ${customColors.secondary || '#a855f7'}, ${customColors.tertiary || '#ec4899'})`
              : 'linear-gradient(to right, #f472b6, #a855f7, #ec4899)',
            animation: 'elastic 0.6s ease-out'
          }}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Elastic shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2 transform group-hover:scale-105 transition-transform duration-200">
            {item.icon && (
              <span 
                className="text-base"
                style={{
                  color: customColors?.text || '#ffffff'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-bold text-sm"
              style={{
                color: customColors?.text || '#ffffff'
              }}
            >
              {item.title}
            </span>
          </div>
        </button>
      )
    }

    if (style === 'terminal') {
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
                color: customColors?.text || customColors?.primary || '#22c55e'
              }}
            >$</span>
            {item.icon && (
              <span 
                className="text-sm font-mono"
                style={{
                  color: customColors?.text || customColors?.primary || '#22c55e'
                }}
              >{item.icon}</span>
            )}
            <span 
              className="font-normal text-sm font-mono"
              style={{
                color: customColors?.text || customColors?.primary || '#22c55e'
              }}
            >
              {item.title.toLowerCase().replace(/\s+/g, '_')}
            </span>
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
  const handleStyleChange = (style: 'pill' | 'underline' | 'card' | 'modern' | 'modern-cream' | 'vintage' | 'ticket' | 'brush' | 'neon' | 'origami' | 'glass' | 'pixel' | 'hologram' | 'neomorphism' | 'bubble' | 'cyberpunk' | 'sketch' | 'metallic' | 'wood' | 'neon-outline' | 'minimal-line' | 'elastic' | 'terminal') => {
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
          {(['pill', 'underline', 'card', 'modern', 'modern-cream', 'vintage', 'ticket', 'brush', 'neon', 'origami', 'glass', 'pixel', 'hologram', 'neomorphism', 'bubble', 'cyberpunk', 'sketch', 'metallic', 'wood', 'neon-outline', 'minimal-line', 'elastic', 'terminal'] as const).map((style) => (
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