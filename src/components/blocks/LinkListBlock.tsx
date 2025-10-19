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
      isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
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
            'text-[var(--text-color)] hover:text-[var(--primary-color)]',
            'bg-transparent hover:bg-[var(--card-background)]',
            'hover:border-[var(--primary-color)] transition-all duration-200'
          )}
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
            'bg-[var(--card-background)] text-[var(--text-color)]',
            'border border-[var(--border)] rounded-[var(--border-radius)]',
            'shadow-[var(--shadow)] hover:shadow-lg',
            'hover:bg-[var(--primary-color)] hover:text-[var(--card-background)]',
            'transition-all duration-200 active:scale-98',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
            'bg-[var(--card-background)] text-[var(--card-text)]',
            'hover:bg-[var(--button-hover)] hover:scale-[1.02]',
            'shadow-[var(--shadow)] border border-[var(--border-color)]',
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
            'bg-[var(--card-background)] text-[var(--card-text)]',
            'border-[var(--card-border)] shadow-[var(--shadow-light)]',
            'hover:bg-[var(--button-hover)] hover:shadow-[var(--shadow-heavy)]',
            'transition-all duration-300 active:scale-[0.97]',
            'uppercase letterspacing tracking-widest',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Outer border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-gray-800 dark:border-gray-300" />
          
          {/* Inner border with background */}
          <div className="absolute inset-1 rounded-xl border border-gray-700 dark:border-gray-400 bg-amber-50 dark:bg-amber-100 group-hover:bg-amber-100 dark:group-hover:bg-amber-200 transition-colors duration-200" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-gray-800 dark:text-gray-900">{item.icon}</span>
            )}
            <span className="font-medium text-sm uppercase tracking-wider text-gray-800 dark:text-gray-900 group-hover:text-gray-900">
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
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Main ticket background */}
          <div className="absolute inset-0 bg-amber-800 dark:bg-amber-700 group-hover:bg-amber-900 dark:group-hover:bg-amber-800 transition-colors duration-200" />
          
          {/* Left notch */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-100 rounded-full" />
          
          {/* Right notch */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-100 rounded-full" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-white">{item.icon}</span>
            )}
            <span className="font-semibold text-white text-sm tracking-wide">
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
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            clipPath: 'polygon(2% 20%, 6% 5%, 12% 8%, 18% 2%, 25% 10%, 32% 3%, 40% 12%, 48% 6%, 55% 15%, 62% 8%, 70% 18%, 78% 10%, 85% 22%, 92% 15%, 98% 25%, 96% 35%, 92% 42%, 88% 50%, 94% 58%, 90% 65%, 85% 72%, 78% 78%, 70% 85%, 62% 82%, 55% 88%, 48% 80%, 40% 90%, 32% 82%, 25% 85%, 18% 78%, 12% 82%, 6% 75%, 2% 65%, 4% 55%, 1% 45%, 3% 35%)'
          }}
        >
          {/* Brush stroke background */}
          <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-300 group-hover:bg-emerald-300 dark:group-hover:bg-emerald-400 transition-colors duration-200" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2 py-1">
            {item.icon && (
              <span className="text-base text-emerald-900 dark:text-emerald-800">{item.icon}</span>
            )}
            <span className="font-bold text-emerald-900 dark:text-emerald-800 text-sm tracking-wide uppercase">
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
            'h-14 px-6 relative group bg-black dark:bg-gray-900 rounded-lg overflow-hidden',
            'transition-all duration-300 active:scale-[0.98]',
            'shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Neon border */}
          <div className="absolute inset-0 rounded-lg border-2 border-pink-500 group-hover:border-pink-400 transition-colors duration-300" />
          
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-md bg-gradient-to-r from-pink-500/10 to-purple-500/10 group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-pink-400 group-hover:text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">{item.icon}</span>
            )}
            <span className="font-bold text-pink-400 group-hover:text-pink-300 text-sm uppercase tracking-wider drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
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
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            clipPath: 'polygon(0% 0%, 90% 0%, 100% 25%, 100% 100%, 0% 100%)'
          }}
        >
          {/* Main paper background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800 dark:group-hover:to-blue-700 transition-all duration-200" />
          
          {/* Fold shadow */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-blue-200 to-transparent dark:from-blue-700 dark:to-transparent opacity-60" 
               style={{ clipPath: 'polygon(75% 0%, 100% 0%, 100% 100%)' }} />
          
          {/* Fold highlight */}
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-white to-transparent dark:from-blue-300 dark:to-transparent opacity-30"
               style={{ clipPath: 'polygon(85% 0%, 100% 0%, 100% 85%)' }} />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-blue-700 dark:text-blue-200">{item.icon}</span>
            )}
            <span className="font-medium text-blue-700 dark:text-blue-200 text-sm">
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
            'backdrop-blur-md bg-white/10 dark:bg-white/5',
            'border border-white/20 dark:border-white/10',
            'shadow-[0_8px_32px_rgba(31,38,135,0.15)]',
            'hover:bg-white/20 dark:hover:bg-white/10',
            'hover:border-white/30 dark:hover:border-white/20',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Glass shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-gray-700 dark:text-gray-200">{item.icon}</span>
            )}
            <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
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
            'h-12 px-4 relative group bg-green-400 rounded-none overflow-hidden',
            'transition-all duration-100 active:scale-[0.95]',
            'shadow-[4px_4px_0px_0px_rgba(34,197,94,0.8)]',
            'hover:shadow-[2px_2px_0px_0px_rgba(34,197,94,0.8)]',
            'hover:translate-x-[2px] hover:translate-y-[2px]',
            'border-2 border-green-600',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
              <span className="text-base text-green-900 font-mono">{item.icon}</span>
            )}
            <span className="font-bold text-green-900 text-xs uppercase tracking-wider font-mono">
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
            'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600',
            'hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600',
            'animate-gradient-x',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
              <span className="text-base text-white drop-shadow-lg">{item.icon}</span>
            )}
            <span className="font-bold text-white text-sm tracking-wider drop-shadow-lg">
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
            'h-14 px-6 relative group rounded-2xl bg-gray-100 dark:bg-gray-800',
            'transition-all duration-300 active:scale-[0.98]',
            'shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
            'dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)]',
            'hover:shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)]',
            'dark:hover:shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.15)]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-gray-600 dark:text-gray-300">{item.icon}</span>
            )}
            <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
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
            'bg-gradient-to-br from-blue-400 to-purple-500',
            'hover:from-purple-400 hover:to-pink-500',
            'rounded-full shadow-lg hover:shadow-xl',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Bubble highlights */}
          <div className="absolute top-2 left-4 w-3 h-3 bg-white/30 rounded-full"></div>
          <div className="absolute top-4 right-6 w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-3 left-8 w-1 h-1 bg-white/40 rounded-full"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-white">{item.icon}</span>
            )}
            <span className="font-semibold text-white text-sm">
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
            'h-12 px-6 relative group bg-black border border-cyan-400',
            'transition-all duration-200 active:scale-[0.98]',
            'shadow-[0_0_10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.8)]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'
          }}
        >
          {/* Scan lines */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.3) 2px, rgba(6,182,212,0.3) 4px)',
               }} />
          
          {/* Glitch effect */}
          <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors duration-200" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-cyan-400 font-mono">{item.icon}</span>
            )}
            <span className="font-bold text-cyan-400 text-xs uppercase tracking-widest font-mono">
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
            'h-14 px-6 relative group bg-white dark:bg-gray-100',
            'transition-all duration-200 active:scale-[0.98]',
            'border-2 border-gray-800 dark:border-gray-900',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            borderRadius: '15px 25px 20px 18px',
            transform: 'rotate(-0.5deg)',
            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.3))'
          }}
        >
          {/* Hand-drawn lines */}
          <div className="absolute inset-1 border border-gray-600 dark:border-gray-700 opacity-30"
               style={{
                 borderRadius: '12px 20px 18px 15px',
                 transform: 'rotate(0.3deg)'
               }} />
          
          {/* Sketch texture */}
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20V6H0V4h20V2H0V0h20.5L0 20.5z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               }} />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-gray-800 dark:text-gray-900">{item.icon}</span>
            )}
            <span className="font-medium text-gray-800 dark:text-gray-900 text-sm" style={{ fontFamily: 'cursive' }}>
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
            'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500',
            'hover:from-gray-200 hover:via-gray-300 hover:to-gray-400',
            'border border-gray-600 shadow-lg',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
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
              <span className="text-base text-gray-800 drop-shadow-sm">{item.icon}</span>
            )}
            <span className="font-semibold text-gray-800 text-sm drop-shadow-sm">
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
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
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
            'border-2 border-cyan-400',
            'shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.1)]',
            'hover:shadow-[0_0_20px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(6,182,212,0.2)]',
            'hover:border-cyan-300',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {item.icon && (
              <span className="text-base text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">{item.icon}</span>
            )}
            <span className="font-medium text-cyan-400 group-hover:text-cyan-300 text-sm drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
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
            'border-b-2 border-gray-300 dark:border-gray-600',
            'hover:border-gray-600 dark:hover:border-gray-400',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Animated underline */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 w-0 group-hover:w-full transition-all duration-300 ease-out" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {item.icon && (
              <span className="text-base text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200">{item.icon}</span>
            )}
            <span className="font-normal text-gray-600 dark:text-gray-400 group-hover:text-blue-500 text-sm transition-colors duration-200">
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
            'h-14 px-6 relative group rounded-full bg-gradient-to-r from-pink-400 to-purple-500',
            'transition-all duration-150 hover:duration-300',
            'hover:from-pink-500 hover:to-purple-600',
            'hover:scale-110 active:scale-95',
            'shadow-lg hover:shadow-xl',
            'animate-pulse hover:animate-none',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
          style={{
            animation: 'elastic 0.6s ease-out'
          }}
        >
          {/* Elastic shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center gap-2 transform group-hover:scale-105 transition-transform duration-200">
            {item.icon && (
              <span className="text-base text-white">{item.icon}</span>
            )}
            <span className="font-bold text-white text-sm">
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
            'h-12 px-4 relative group bg-black border border-green-400 font-mono',
            'transition-all duration-200 active:scale-[0.98]',
            'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
            'hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]',
            'hover:border-green-300',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {/* Terminal cursor */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-green-400 
                          opacity-0 group-hover:opacity-100 animate-pulse" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-green-400 text-sm">$</span>
            {item.icon && (
              <span className="text-sm text-green-400 font-mono">{item.icon}</span>
            )}
            <span className="font-normal text-green-400 text-sm font-mono">
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