/**
 * LinkQ Logo Component
 * Reusable logo component extracted from loading animation
 */

"use client"

import { cn } from "@/lib/utils"

interface LinkQLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'animated' | 'minimal' | 'text-only'
  className?: string
  showText?: boolean
}

export function LinkQLogo({ 
  size = 'md', 
  variant = 'default',
  className,
  showText = true
}: LinkQLogoProps) {
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm', 
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  }

  if (variant === 'text-only') {
    return (
      <div className={cn("font-bold text-white", textSizes[size], className)}>
        LinkQ
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div 
          className={cn(
            "rounded-lg flex items-center justify-center",
            sizeClasses[size]
          )}
          style={{ 
            background: 'linear-gradient(135deg, #66A38A 0%, #4A7C59 100%)'
          }}
        >
          <div className="text-white font-bold">Q</div>
        </div>
        {showText && (
          <span className={cn("font-bold text-white", textSizes[size])}>
            LinkQ
          </span>
        )}
      </div>
    )
  }

  // Default and animated variants
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        <div 
          className={cn(
            "rounded-2xl flex items-center justify-center relative overflow-hidden",
            sizeClasses[size],
            variant === 'animated' && 'animate-pulse'
          )}
          style={{ 
            background: 'linear-gradient(135deg, #66A38A 0%, #4A7C59 100%)',
            ...(variant === 'animated' && {
              animation: 'breathe 2s ease-in-out infinite'
            })
          }}
        >
          {/* Logo content - always show LinkQ in the box */}
          <div className="text-white font-bold relative z-10">
            LinkQ
          </div>
          
          {/* Animated gradient overlay - only for animated variant */}
          {variant === 'animated' && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
          )}
        </div>
        
        {/* Outer ring animation - only for animated variant */}
        {variant === 'animated' && (
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl border-2 animate-ping",
              sizeClasses[size]
            )}
            style={{ 
              borderColor: '#66A38A',
              opacity: 0.3,
              animationDuration: '2s'
            }}
          />
        )}
      </div>
    </div>
  )
}

// CSS animations (add to global CSS)
export const linkqLogoAnimations = `
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`

// Usage examples:
// <LinkQLogo size="lg" variant="animated" />
// <LinkQLogo size="sm" variant="minimal" showText={false} />
// <LinkQLogo variant="text-only" />