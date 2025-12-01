/**
 * DeliveryPlatformBlock Component
 * Multi-platform food delivery links (GoFood, GrabFood, ShopeeFood)
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DeliveryPlatformBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { ExternalLink, Star } from 'lucide-react'

interface DeliveryPlatformBlockComponentProps {
  props: DeliveryPlatformBlockProps
  className?: string
  isEditing?: boolean
}

// Platform branding
const PLATFORM_CONFIG = {
  gofood: {
    name: 'GoFood',
    color: '#00AA13',
    logo: '🟢', // Using emoji for now, can be replaced with actual logo
    bgColor: 'bg-green-600 hover:bg-green-700',
  },
  grabfood: {
    name: 'GrabFood',
    color: '#00B14F',
    logo: '🍴',
    bgColor: 'bg-emerald-600 hover:bg-emerald-700',
  },
  shopeefood: {
    name: 'ShopeeFood',
    color: '#EE4D2D',
    logo: '🍜',
    bgColor: 'bg-orange-600 hover:bg-orange-700',
  },
}

export function DeliveryPlatformBlock({
  props,
  className,
  isEditing = false
}: DeliveryPlatformBlockComponentProps) {
  const {
    platforms,
    layout = 'buttons',
    showRatings = true,
    showPromos = true,
    primaryPlatform,
  } = props

  const activePlatforms = Object.entries(platforms).filter(([_, config]) => config !== undefined)

  if (activePlatforms.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No delivery platforms configured
      </div>
    )
  }

  const handlePlatformClick = (url: string) => {
    if (!isEditing) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Render platform button
  const renderPlatformButton = (platform: string, config: any, isPrimary = false) => {
    const platformConfig = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
    if (!platformConfig) return null

    return (
      <Button
        key={platform}
        onClick={() => handlePlatformClick(config.url)}
        disabled={isEditing}
        className={cn(
          'w-full h-16 text-white font-semibold rounded-xl transition-all duration-200',
          'flex items-center justify-between px-6',
          platformConfig.bgColor,
          isPrimary && 'ring-2 ring-offset-2 ring-yellow-400',
          isEditing && 'pointer-events-none opacity-75'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{platformConfig.logo}</span>
          <div className="text-left">
            <p className="text-base font-bold">{platformConfig.name}</p>
            {config.merchantName && (
              <p className="text-xs opacity-90">{config.merchantName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showRatings && config.rating && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">{config.rating}</span>
            </div>
          )}
          {config.badge && (
            <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
              {config.badge === 'official' ? '✓ Official' : '⭐ Featured'}
            </div>
          )}
          <ExternalLink className="w-4 h-4" />
        </div>
      </Button>
    )
  }

  // Render grid layout
  if (layout === 'grid') {
    return (
      <div className={cn('w-full max-w-md mx-auto', className)}>
        {showPromos && (
          <div className="mb-4 text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              🎉 Order via Aplikasi Delivery Favorit Kamu!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {activePlatforms.map(([platform, config]) =>
            renderPlatformButton(platform, config, platform === primaryPlatform)
          )}
        </div>

        {showPromos && primaryPlatform && platforms.shopeefood?.promoText && primaryPlatform === 'shopeefood' && (
          <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
              🎁 {platforms.shopeefood.promoText}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Render carousel layout
  if (layout === 'carousel') {
    return (
      <div className={cn('w-full max-w-md mx-auto', className)}>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {activePlatforms.map(([platform, config]) => {
              const platformConfig = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]
              if (!platformConfig) return null

              return (
                <Card
                  key={platform}
                  onClick={() => handlePlatformClick(config.url)}
                  className={cn(
                    'w-48 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg',
                    isEditing && 'pointer-events-none'
                  )}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{platformConfig.logo}</div>
                    <p className="font-semibold text-sm">{platformConfig.name}</p>
                    {platform === 'grabfood' && 'rating' in config && config.rating && showRatings && (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{config.rating}</span>
                      </div>
                    )}
                    <Button size="sm" className="w-full">
                      Order Now
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Default: buttons layout
  return (
    <div className={cn('w-full max-w-md mx-auto space-y-3', className)}>
      {showPromos && (
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            🍽️ Pesan Sekarang via Delivery
          </p>
        </div>
      )}

      {activePlatforms.map(([platform, config]) =>
        renderPlatformButton(platform, config, platform === primaryPlatform)
      )}
    </div>
  )
}
