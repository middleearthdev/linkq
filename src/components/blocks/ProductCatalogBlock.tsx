/**
 * ProductCatalogBlock Component
 * E-commerce product catalog with multiple beautiful styles
 * Perfect for UMKM food sellers, fashion shops, handicraft, and any product-based business
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ShoppingCart,
  Search,
  Filter,
  Package,
  AlertCircle,
  Check,
  X,
  Heart,
  Eye,
  Tag,
  Percent,
  MessageCircle,
  Send,
  Bookmark
} from 'lucide-react'
import Image from 'next/image'

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ProductItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number  // For discount display
  description?: string
  category?: string
  stock: 'available' | 'low' | 'out'
  stockCount?: number
  whatsappMessage?: string
  variants?: {
    name: string
    options: string[]
  }[]
  badges?: string[]  // "Hot", "New", "Promo", "Best Seller"
  rating?: number
  reviewCount?: number
}

export interface ProductCatalogBlockProps {
  items: ProductItem[]
  style?: 'instagram-card' | 'modern-minimal' | 'compact-grid' | 'instagram-shop'
  columns?: 'medium' | 'large'  // medium: 3 cols tablet/2 cols mobile | large: 2 cols tablet/1 col mobile
  showSearch?: boolean
  showCategories?: boolean
  categoryFilter?: string[]
  showPriceRange?: boolean
  priceRange?: [number, number]
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  showStockIndicator?: boolean
  whatsappNumber?: string  // Business WhatsApp for all products
  ctaText?: string  // Default: "Order Now"
  forceViewport?: 'mobile' | 'tablet'  // Force specific viewport for preview/demo purposes
  containModal?: boolean  // If true, modal will be contained within the component (for preview frames)
}

interface ProductCatalogBlockComponentProps {
  props: ProductCatalogBlockProps
  className?: string
  isEditing?: boolean
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProductCatalogBlock({
  props,
  className,
  isEditing = false
}: ProductCatalogBlockComponentProps) {
  const {
    items = [],
    style = 'instagram-card',
    columns = 'medium',
    showSearch = true,
    showCategories = true,
    showStockIndicator = true,
    whatsappNumber = '081234567890',
    ctaText = 'Order Sekarang',
    forceViewport,
    containModal = false
  } = props

  const spacing: 'none' | 'sm' | 'md' | 'lg' = props.spacing ?? 'md'
  const rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = props.rounded ?? 'lg'

  // Determine if we should use tablet styles
  const isTablet = forceViewport ? forceViewport === 'tablet' : true // Default to tablet styles if no forceViewport

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category).filter((cat): cat is string => Boolean(cat)))
    return ['all', ...Array.from(cats)] as string[]
  }, [items])

  // Filter products
  const filteredProducts = useMemo(() => {
    return items.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  // WhatsApp order handler
  const handleOrder = (product: ProductItem) => {
    if (isEditing) return

    const message = product.whatsappMessage ||
      `Halo, saya ingin order *${product.name}* dengan harga ${formatPrice(product.price)}`

    const phoneNumber = whatsappNumber.replace(/^0/, '62').replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
  }

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Spacing classes
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  // Responsive Grid System
  // If forceViewport is set, use fixed classes; otherwise use responsive classes
  const gridCols = forceViewport ? {
    // Fixed columns based on forced viewport
    medium: isTablet ? 'grid-cols-3' : 'grid-cols-2',  // Medium: 3 cols tablet, 2 cols mobile
    large: isTablet ? 'grid-cols-2' : 'grid-cols-1'     // Large: 2 cols tablet, 1 col mobile
  } : {
    // Responsive columns using Tailwind breakpoints
    medium: 'grid-cols-2 sm:grid-cols-3',    // 2 cols mobile → 3 cols tablet
    large: 'grid-cols-1 sm:grid-cols-2'      // 1 col mobile → 2 cols tablet
  }

  if (items.length === 0 && !isEditing) {
    return null
  }

  // Helper function for responsive classes
  const getResponsiveClass = (mobileClass: string, tabletClass: string) => {
    if (forceViewport) {
      return isTablet ? tabletClass : mobileClass
    }
    return `${mobileClass} sm:${tabletClass}`
  }

  return (
    <div className={cn(
      'w-full product-catalog-block',
      containModal && 'relative', // Only add relative positioning if modal should be contained
      forceViewport ? (isTablet ? 'px-4 py-5' : 'px-3 py-4') : 'px-3 sm:px-4 py-4 sm:py-5',
      className
    )}>
      {/* Header: Search & Categories - Responsive */}
      <div className={forceViewport ? (isTablet ? 'mb-6 space-y-3' : 'mb-5 space-y-3') : 'mb-5 sm:mb-6 space-y-3'}>
        {/* Search Bar - Responsive */}
        {showSearch && (
          <div className="relative">
            <Search className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
              forceViewport ? (isTablet ? 'w-5 h-5' : 'w-4 h-4') : 'w-4 sm:w-5 h-4 sm:h-5'
            )} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400',
                forceViewport
                  ? (isTablet ? 'pl-11 py-3.5 text-base' : 'pl-10 py-3 text-sm')
                  : 'pl-10 sm:pl-11 py-3 sm:py-3.5 text-sm sm:text-base'
              )}
              disabled={isEditing}
              aria-label="Cari produk"
            />
          </div>
        )}

        {/* Category Filter - Responsive horizontal scroll */}
        {showCategories && categories.length > 1 && (
          <div className={cn(
            'flex overflow-x-auto pb-2 scrollbar-hide',
            forceViewport
              ? (isTablet ? 'gap-2 -mx-4 px-4' : 'gap-1.5 -mx-3 px-3')
              : 'gap-1.5 sm:gap-2 -mx-3 sm:-mx-4 px-3 sm:px-4'
          )}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => !isEditing && setSelectedCategory(category)}
                disabled={isEditing}
                className={cn(
                  'rounded-full font-medium whitespace-nowrap transition-all flex items-center',
                  forceViewport
                    ? (isTablet ? 'px-5 py-2.5 text-sm min-h-[40px]' : 'px-3 py-2 text-xs min-h-[36px]')
                    : 'px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]',
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 shadow-sm'
                )}
                aria-pressed={selectedCategory === category}
              >
                {category === 'all' ? 'Semua' : category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && !isEditing && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">Tidak ada produk ditemukan</p>
        </div>
      )}

      {/* Products Grid - Mobile optimized spacing */}
      <div className={cn(
        'grid',
        gridCols[columns],
        spacingClasses[spacing]
      )}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            style={style}
            rounded={rounded}
            showStockIndicator={showStockIndicator}
            ctaText={ctaText}
            onOrder={handleOrder}
            onQuickView={() => setSelectedProduct(product)}
            isEditing={isEditing}
            formatPrice={formatPrice}
            forceViewport={forceViewport}
            isTablet={isTablet}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !isEditing && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Produk tidak ditemukan
          </h3>
          <p className="text-gray-500">
            Coba kata kunci lain atau pilih kategori berbeda
          </p>
        </div>
      )}

      {/* Editor Empty State */}
      {items.length === 0 && isEditing && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada produk</p>
          <p className="text-sm text-gray-400">Tambahkan produk untuk mulai berjualan</p>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && !isEditing && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrder={handleOrder}
          formatPrice={formatPrice}
          ctaText={ctaText}
          containModal={containModal}
        />
      )}
    </div>
  )
}

// ============================================
// PRODUCT CARD STYLES
// ============================================

interface ProductCardProps {
  product: ProductItem
  style: ProductCatalogBlockProps['style']
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  showStockIndicator: boolean
  ctaText: string
  onOrder: (product: ProductItem) => void
  onQuickView: () => void
  isEditing: boolean
  formatPrice: (price: number) => string
  forceViewport?: 'mobile' | 'tablet'
  isTablet: boolean
}

function ProductCard({
  product,
  style,
  rounded,
  showStockIndicator,
  ctaText,
  onOrder,
  onQuickView,
  isEditing,
  formatPrice,
  forceViewport,
  isTablet
}: ProductCardProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  const isOutOfStock = product.stock === 'out'
  const isLowStock = product.stock === 'low'
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  // Helper to get responsive class based on forceViewport
  const r = (mobile: string, tablet: string) => {
    if (forceViewport) {
      return isTablet ? tablet : mobile
    }
    // Create responsive class: "mobile sm:tablet"
    const mobileClasses = mobile.split(' ')
    const tabletClasses = tablet.split(' ')

    if (mobile === tablet) return mobile

    return mobileClasses.map((m, i) => {
      const t = tabletClasses[i] || m
      return m === t ? m : `${m} sm:${t}`
    }).join(' ')
  }

  // Style 1: Instagram Card (Social media style) - FULLY RESPONSIVE
  if (style === 'instagram-card') {
    return (
      <div
        onClick={() => !isEditing && onQuickView()}
        className={cn(
          'bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer',
          forceViewport
            ? (isTablet ? 'border-2 border-gray-400' : 'border border-gray-300')
            : 'border border-gray-300 sm:border-2 sm:border-gray-400',
          roundedClasses[rounded],
          isOutOfStock && 'opacity-60'
        )}
      >
        {/* Image Container */}
        <div className={cn(
          'relative aspect-square overflow-hidden bg-gray-50',
          forceViewport ? (isTablet ? 'p-2' : 'p-1.5') : 'p-1.5 sm:p-2'
        )}>
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <div className={cn(
                'absolute bg-red-500 text-white font-bold py-0.5 rounded shadow-md pointer-events-none',
                forceViewport
                  ? (isTablet ? 'top-1.5 right-1.5 text-[10px] px-1.5' : 'top-1 right-1 text-[9px] px-1')
                  : 'top-1 sm:top-1.5 right-1 sm:right-1.5 text-[9px] sm:text-[10px] px-1 sm:px-1.5'
              )}>
                -{discountPercent}%
              </div>
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/95 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                <span className={cn(
                  'text-gray-900 font-bold',
                  forceViewport ? (isTablet ? 'text-sm' : 'text-xs') : 'text-xs sm:text-sm'
                )}>SOLD OUT</span>
              </div>
            )}

            {/* More options (top left) - decorative only */}
            <div
              className={cn(
                'absolute top-1 left-1 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-none',
                forceViewport
                  ? (isTablet ? 'p-1.5 min-h-[36px] min-w-[36px]' : 'p-1 min-h-[32px] min-w-[32px]')
                  : 'p-1 sm:p-1.5 min-h-[32px] sm:min-h-[36px] min-w-[32px] sm:min-w-[36px]'
              )}
              aria-hidden="true"
            >
              <svg className={cn(
                'text-gray-800',
                forceViewport ? (isTablet ? 'w-4 h-4' : 'w-3 h-3') : 'w-3 sm:w-4 h-3 sm:h-4'
              )} fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Social Actions (Instagram style) - Decorative only */}
        <div className={cn(
          'flex items-center justify-between border-t border-gray-100 pb-1 pointer-events-none',
          forceViewport
            ? (isTablet ? 'px-2.5 pt-2' : 'px-2 pt-1.5')
            : 'px-2 sm:px-2.5 pt-1.5 sm:pt-2'
        )}>
          <div className={cn(
            'flex items-center',
            forceViewport ? (isTablet ? 'gap-1' : 'gap-1') : 'gap-1 sm:gap-1'
          )}>
            {/* Like/Heart - decorative */}
            <div
              className={cn(
                'flex items-center justify-center -ml-1',
                forceViewport
                  ? (isTablet ? 'min-h-[40px] min-w-[40px]' : 'min-h-[36px] min-w-[36px]')
                  : 'min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px]'
              )}
              aria-hidden="true"
            >
              <Heart className={cn(
                forceViewport ? (isTablet ? 'w-5 h-5' : 'w-4 h-4') : 'w-4 sm:w-5 h-4 sm:h-5'
              )} strokeWidth={2} />
            </div>

            {/* Comment - decorative */}
            <div
              className={cn(
                'flex items-center justify-center',
                forceViewport
                  ? (isTablet ? 'min-h-[40px] min-w-[40px]' : 'min-h-[36px] min-w-[36px]')
                  : 'min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px]'
              )}
              aria-hidden="true"
            >
              <MessageCircle className={cn(
                forceViewport ? (isTablet ? 'w-5 h-5' : 'w-4 h-4') : 'w-4 sm:w-5 h-4 sm:h-5'
              )} strokeWidth={2} />
            </div>

            {/* Share - decorative */}
            <div
              className={cn(
                'flex items-center justify-center',
                forceViewport
                  ? (isTablet ? 'min-h-[40px] min-w-[40px]' : 'min-h-[36px] min-w-[36px]')
                  : 'min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px]'
              )}
              aria-hidden="true"
            >
              <Send className={cn(
                forceViewport ? (isTablet ? 'w-5 h-5' : 'w-4 h-4') : 'w-4 sm:w-5 h-4 sm:h-5'
              )} strokeWidth={2} />
            </div>
          </div>

          {/* Bookmark - decorative */}
          <div
            className={cn(
              'flex items-center justify-center -mr-1',
              forceViewport
                ? (isTablet ? 'min-h-[40px] min-w-[40px]' : 'min-h-[36px] min-w-[36px]')
                : 'min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px]'
            )}
            aria-hidden="true"
          >
            <Bookmark className={cn(
              forceViewport ? (isTablet ? 'w-5 h-5' : 'w-4 h-4') : 'w-4 sm:w-5 h-4 sm:h-5'
            )} strokeWidth={2} />
          </div>
        </div>

        {/* Product Info - Responsive */}
        <div className={cn(
          'pt-1 space-y-0.5 pointer-events-none',
          forceViewport
            ? (isTablet ? 'px-2.5 pb-2.5' : 'px-2 pb-2')
            : 'px-2 sm:px-2.5 pb-2 sm:pb-2.5'
        )}>
          {/* Product Name */}
          <h3 className={cn(
            'font-semibold text-gray-900 line-clamp-2 leading-tight',
            forceViewport
              ? (isTablet ? 'text-xs min-h-[2rem]' : 'text-[11px] min-h-[1.8rem]')
              : 'text-[11px] sm:text-xs min-h-[1.8rem] sm:min-h-[2rem]'
          )}>
            {product.name}
          </h3>

          {/* Price */}
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            {/* Original Price if discount */}
            {hasDiscount && (
              <div className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
            {showStockIndicator && product.stock === 'available' && (
              <span className="text-[9px] sm:text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
                Tersedia
              </span>
            )}
            {showStockIndicator && isLowStock && (
              <span className="text-[9px] sm:text-[10px] text-orange-600 font-medium flex items-center gap-0.5">
                <AlertCircle className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
                Terbatas
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Style 2: Modern Minimal - FULLY RESPONSIVE
  if (style === 'modern-minimal') {
    return (
      <div className={cn(
        'group cursor-pointer transition-all',
        isOutOfStock && 'opacity-60'
      )}>
        {/* Image */}
        <div className={cn(
          'relative aspect-square overflow-hidden bg-gray-100 mb-2 sm:mb-3',
          roundedClasses[rounded]
        )}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
          />

          {hasDiscount && (
            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              -{discountPercent}%
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content - Responsive */}
        <div className="space-y-1.5 sm:space-y-2 px-0.5 sm:px-1">
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <Button
            onClick={() => onOrder(product)}
            disabled={isEditing || isOutOfStock}
            variant="outline"
            className="w-full border-2 font-semibold hover:bg-gray-900 hover:text-white transition-all active:scale-95 min-h-[40px] sm:min-h-[44px] text-sm sm:text-base"
          >
            {isOutOfStock ? 'Habis' : 'Pesan'}
          </Button>
        </div>
      </div>
    )
  }

  // Style 3: Compact Grid - FULLY RESPONSIVE
  if (style === 'compact-grid') {
    return (
      <div className="group cursor-pointer" onClick={onQuickView}>
        {/* Image */}
        <div className={cn(
          'relative aspect-square overflow-hidden bg-gray-100 mb-1.5 sm:mb-2',
          roundedClasses[rounded]
        )}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
          />

          {hasDiscount && (
            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md">
              -{discountPercent}%
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <X className="w-8 sm:w-10 h-8 sm:h-10 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Content - Responsive */}
        <div className="space-y-0.5 sm:space-y-1 px-0.5">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    )
  }

  // Style 4: Instagram Shop - FULLY RESPONSIVE
  if (style === 'instagram-shop') {
    return (
      <div className="space-y-2 sm:space-y-2.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg sm:rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
          />

          {hasDiscount && (
            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
              <div className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md">
                {discountPercent}% OFF
              </div>
            </div>
          )}

          {product.badges && product.badges.length > 0 && (
            <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2">
              <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md">
                {product.badges[0]}
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center backdrop-blur-sm">
              <span className="text-gray-900 font-bold text-xs sm:text-sm">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content - Responsive */}
        <div className="space-y-1.5 sm:space-y-2 px-0.5 sm:px-1">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <button
            onClick={() => onOrder(product)}
            disabled={isEditing || isOutOfStock}
            className={cn(
              'w-full mt-1.5 sm:mt-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all active:scale-95 min-h-[40px] sm:min-h-[44px]',
              isOutOfStock
                ? 'bg-gray-200 text-gray-500'
                : 'bg-black text-white hover:bg-gray-800 shadow-md'
            )}
          >
            {isOutOfStock ? 'Habis' : 'Beli Sekarang'}
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ============================================
// QUICK VIEW MODAL
// ============================================

interface QuickViewModalProps {
  product: ProductItem
  onClose: () => void
  onOrder: (product: ProductItem) => void
  formatPrice: (price: number) => string
  ctaText: string
  containModal?: boolean
}

function QuickViewModal({ product, onClose, onOrder, formatPrice, ctaText, containModal = false }: QuickViewModalProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0
  const isOutOfStock = product.stock === 'out'

  return (
    <div className={cn(
      'bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200',
      containModal ? 'absolute inset-0' : 'fixed inset-0'
    )}>
      <div className="bg-white rounded-t-2xl w-full max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
        {/* Close Button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b px-3 py-3 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-base font-bold">Detail Produk</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-md text-xs">
                HEMAT {discountPercent}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2.5">
            {/* Category & Badges */}
            <div className="flex flex-wrap gap-1.5">
              {product.category && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              )}
              {product.badges?.map((badge, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              ))}
            </div>

            {/* Name */}
            <h1 className="text-lg font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="space-y-1 py-2.5 border-y">
              {hasDiscount && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice!)}
                </p>
              )}
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
              {hasDiscount && (
                <p className="text-sm text-green-600 font-semibold">
                  Hemat {formatPrice(product.originalPrice! - product.price)}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Deskripsi</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-1.5">
              {product.stock === 'available' && (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-semibold">Stok Tersedia</span>
                </>
              )}
              {product.stock === 'low' && (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 font-semibold">
                    Stok Terbatas {product.stockCount && `(${product.stockCount} tersisa)`}
                  </span>
                </>
              )}
              {isOutOfStock && (
                <>
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-semibold">Stok Habis</span>
                </>
              )}
            </div>

            {/* Variants - Mobile optimized buttons */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                {product.variants.map((variant, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {variant.options.map((option, optIdx) => (
                        <button
                          key={optIdx}
                          className="px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95 min-h-[36px] text-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Button */}
            <Button
              onClick={() => {
                onOrder(product)
                onClose()
              }}
              disabled={isOutOfStock}
              className={cn(
                'w-full py-2.5 text-sm font-bold transition-all active:scale-95 min-h-[40px]',
                isOutOfStock
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              )}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isOutOfStock ? 'Stok Habis' : ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
