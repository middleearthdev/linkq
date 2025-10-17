/**
 * Cool Loading Component - Mobile First
 * Advanced loading animations for site loading states
 */

"use client"

import { cn } from "@/lib/utils"

interface CoolLoadingProps {
  variant?: 'dots' | 'pulse' | 'wave' | 'skeleton' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function CoolLoading({ 
  variant = 'gradient', 
  size = 'md', 
  text = 'Loading...',
  className 
}: CoolLoadingProps) {
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-sage-green animate-bounce",
                sizeClasses[size]
              )}
              style={{
                backgroundColor: '#66A38A',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
        {text && <p className="text-gray-400 text-sm">{text}</p>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div 
          className={cn(
            "rounded-full animate-pulse relative",
            sizeClasses[size]
          )}
          style={{ backgroundColor: '#66A38A' }}
        >
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: '#66A38A', opacity: 0.4 }}
          />
        </div>
        {text && <p className="text-gray-400 text-sm">{text}</p>}
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 bg-sage-green rounded-full animate-pulse"
              style={{
                backgroundColor: '#66A38A',
                height: '24px',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && <p className="text-gray-400 text-sm">{text}</p>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-4 w-full max-w-md mx-auto", className)}>
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-700 rounded-lg animate-pulse flex-1"></div>
          <div className="h-8 bg-gray-700 rounded-lg animate-pulse flex-1"></div>
        </div>
        
        {text && (
          <p className="text-gray-400 text-sm text-center mt-4">{text}</p>
        )}
      </div>
    )
  }

  // Default: gradient variant
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
      {/* Animated LinkQ Logo */}
      <div className="relative">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #66A38A 0%, #4A7C59 100%)',
            animation: 'breathe 2s ease-in-out infinite'
          }}
        >
          {/* LinkQ text */}
          <div className="text-white font-bold text-lg relative z-10">
            LinkQ
          </div>
          
          {/* Animated gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Outer ring animation */}
        <div 
          className="absolute inset-0 w-16 h-16 rounded-2xl border-2 animate-ping"
          style={{ 
            borderColor: '#66A38A',
            opacity: 0.3,
            animationDuration: '2s'
          }}
        />
      </div>

      {/* Loading text with typing animation */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-medium">{text}</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-sage-green animate-pulse"
              style={{
                backgroundColor: '#66A38A',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #66A38A 0%, #4A7C59 100%)',
            animation: 'loading-progress 2s ease-in-out infinite'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20"
            style={{
              backgroundColor: '#66A38A',
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

    </div>
  )
}

// Site Loading - Specialized for editor
export function SiteLoadingScreen({ handle }: { handle?: string }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0F1419' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #66A38A 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #66A38A 0%, transparent 50%)`,
            animation: 'bg-shift 8s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <CoolLoading 
          variant="gradient" 
          text={handle ? `Loading @${handle}...` : 'Preparing your site...'}
          className="mb-8"
        />
        
        {/* Loading tips for mobile */}
        <div className="mt-8 lg:hidden">
          <p className="text-gray-500 text-sm">
            💡 Tip: Swipe right to preview your site
          </p>
        </div>
      </div>

    </div>
  )
}

// Quick Loading - For fast operations
export function QuickLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <CoolLoading variant="pulse" size="sm" text={text} />
    </div>
  )
}