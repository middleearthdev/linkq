/**
 * MarketplaceBlock Component
 * E-commerce marketplace store links (Tokopedia, Shopee, TikTok Shop)
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MarketplaceBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { ExternalLink, Star, Users, ShoppingBag, CheckCircle2 } from 'lucide-react'

interface MarketplaceBlockComponentProps {
  props: MarketplaceBlockProps
  className?: string
  isEditing?: boolean
}

// Marketplace branding
const MARKETPLACE_CONFIG = {
  tokopedia: {
    name: 'Tokopedia',
    color: '#42B549',
    logo: '🟢',
    bgColor: 'bg-green-600 hover:bg-green-700',
    badgeLabels: {
      'official': 'Official Store',
      'power-merchant': 'Power Merchant',
    },
  },
  shopee: {
    name: 'Shopee',
    color: '#EE4D2D',
    logo: '🛍️',
    bgColor: 'bg-orange-600 hover:bg-orange-700',
    badgeLabels: {
      'star-seller': 'Star Seller',
      'shopee-mall': 'Shopee Mall',
    },
  },
  tiktokshop: {
    name: 'TikTok Shop',
    color: '#000000',
    logo: '🎵',
    bgColor: 'bg-black hover:bg-gray-900',
    badgeLabels: {
      'verified': 'Verified Seller',
    },
  },
}

export function MarketplaceBlock({
  props,
  className,
  isEditing = false
}: MarketplaceBlockComponentProps) {
  const {
    stores,
    featuredProducts = [],
    layout = 'store-links',
    showBadges = true,
    showRatings = true,
  } = props

  const activeStores = Object.entries(stores).filter(([_, config]) => config !== undefined)

  if (activeStores.length === 0 && featuredProducts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No marketplace stores configured
      </div>
    )
  }

  const handleStoreClick = (url: string) => {
    if (!isEditing) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Render store button
  const renderStoreButton = (marketplace: string, config: any) => {
    const marketplaceConfig = MARKETPLACE_CONFIG[marketplace as keyof typeof MARKETPLACE_CONFIG]
    if (!marketplaceConfig) return null

    const badgeLabel = config.badge ? marketplaceConfig.badgeLabels[config.badge as keyof typeof marketplaceConfig.badgeLabels] : null

    return (
      <Button
        key={marketplace}
        onClick={() => handleStoreClick(config.storeUrl)}
        disabled={isEditing}
        className={cn(
          'w-full h-16 text-white font-semibold rounded-xl transition-all duration-200',
          'flex items-center justify-between px-6',
          marketplaceConfig.bgColor,
          isEditing && 'pointer-events-none opacity-75'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{marketplaceConfig.logo}</span>
          <div className="text-left">
            <p className="text-base font-bold">{marketplaceConfig.name}</p>
            {config.storeName && (
              <p className="text-xs opacity-90">{config.storeName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {showRatings && config.rating && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">{config.rating}</span>
              {config.reviewCount && (
                <span className="text-xs opacity-75">({config.reviewCount})</span>
              )}
            </div>
          )}

          {config.followers && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              <span className="text-xs font-semibold">{config.followers}</span>
            </div>
          )}

          {showBadges && badgeLabel && (
            <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {badgeLabel}
            </div>
          )}

          <ExternalLink className="w-4 h-4" />
        </div>
      </Button>
    )
  }

  // Render product card
  const renderProductCard = (product: any, index: number) => {
    const marketplaceConfig = MARKETPLACE_CONFIG[product.marketplace as keyof typeof MARKETPLACE_CONFIG]
    if (!marketplaceConfig) return null

    return (
      <Card
        key={index}
        onClick={() => handleStoreClick(product.productUrl)}
        className={cn(
          'overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg',
          isEditing && 'pointer-events-none'
        )}
      >
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
            {marketplaceConfig.logo} {marketplaceConfig.name}
          </div>
        </div>
        <div className="p-3 space-y-1">
          <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
          <p className="text-lg font-bold text-green-600">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
      </Card>
    )
  }

  // Store links layout
  if (layout === 'store-links') {
    return (
      <div className={cn('w-full max-w-md mx-auto space-y-3 py-6', className)}>
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            🛒 Belanja di Official Store Kami
          </p>
        </div>

        {activeStores.map(([marketplace, config]) =>
          renderStoreButton(marketplace, config)
        )}
      </div>
    )
  }

  // Product grid layout
  if (layout === 'product-grid') {
    return (
      <div className={cn('w-full max-w-2xl mx-auto space-y-4 py-6', className)}>
        {activeStores.length > 0 && (
          <div className="flex gap-2 justify-center flex-wrap">
            {activeStores.map(([marketplace, config]) => {
              const marketplaceConfig = MARKETPLACE_CONFIG[marketplace as keyof typeof MARKETPLACE_CONFIG]
              return (
                <Button
                  key={marketplace}
                  size="sm"
                  onClick={() => handleStoreClick(config.storeUrl)}
                  disabled={isEditing}
                  className={cn(
                    'text-white',
                    marketplaceConfig?.bgColor
                  )}
                >
                  {marketplaceConfig?.logo} {marketplaceConfig?.name}
                </Button>
              )
            })}
          </div>
        )}

        {featuredProducts.length > 0 && (
          <>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Produk Unggulan
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredProducts.map((product, index) => renderProductCard(product, index))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Mixed layout (stores + products)
  return (
    <div className={cn('w-full max-w-2xl mx-auto space-y-6 py-6', className)}>
      {/* Store buttons */}
      {activeStores.length > 0 && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Official Store
            </p>
          </div>
          {activeStores.map(([marketplace, config]) =>
            renderStoreButton(marketplace, config)
          )}
        </div>
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Produk Terlaris
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredProducts.slice(0, 6).map((product, index) => renderProductCard(product, index))}
          </div>

          {featuredProducts.length > 6 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => handleStoreClick(activeStores[0]?.[1]?.storeUrl || '')}
                disabled={isEditing}
              >
                Lihat Semua Produk
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
