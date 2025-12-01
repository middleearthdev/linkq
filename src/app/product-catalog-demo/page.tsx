"use client"

import { useState } from 'react'
import { ProductCatalogBlock } from '@/components/blocks/ProductCatalogBlock'
import type { ProductItem } from '@/components/blocks/ProductCatalogBlock'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Tablet, Monitor } from 'lucide-react'

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=600&fit=crop',
    price: 25000,
    originalPrice: 30000,
    description: 'Nasi goreng dengan telur, ayam suwir, sayuran segar, dan kerupuk. Cocok untuk makan siang atau malam.',
    category: 'Main Course',
    stock: 'available',
    stockCount: 20,
    badges: ['Hot', 'Promo'],
    rating: 4.8,
    reviewCount: 142,
    variants: [
      { name: 'Pedas', options: ['Tidak Pedas', 'Sedang', 'Pedas', 'Extra Pedas'] },
      { name: 'Tambahan', options: ['Telur Mata Sapi', 'Ayam Goreng', 'Kerupuk Extra'] }
    ]
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop',
    price: 20000,
    description: 'Mie ayam dengan bakso sapi, pangsit goreng, dan kuah kaldu segar',
    category: 'Main Course',
    stock: 'available',
    stockCount: 15,
    badges: ['Popular'],
    rating: 4.7,
    reviewCount: 98
  },
  {
    id: '3',
    name: 'Soto Ayam',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
    price: 22000,
    description: 'Soto ayam kuning dengan telur rebus, soun, dan bumbu rempah',
    category: 'Main Course',
    stock: 'available',
    stockCount: 18,
    rating: 4.6,
    reviewCount: 76
  },
  {
    id: '4',
    name: 'Gado-Gado',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop',
    price: 18000,
    description: 'Sayuran segar dengan saus kacang kental, telur rebus, dan kerupuk',
    category: 'Salad & Healthy',
    stock: 'low',
    stockCount: 5,
    badges: ['Limited'],
    rating: 4.5,
    reviewCount: 54
  },
  {
    id: '5',
    name: 'Rendang Daging',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop',
    price: 35000,
    originalPrice: 42000,
    description: 'Rendang daging sapi premium dengan bumbu rempah tradisional',
    category: 'Main Course',
    stock: 'available',
    stockCount: 12,
    badges: ['Premium', 'Best Seller'],
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: '6',
    name: 'Sate Ayam (10 tusuk)',
    image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&h=600&fit=crop',
    price: 28000,
    description: 'Sate ayam bumbu kacang dengan lontong dan sambal kecap',
    category: 'Snacks & Street Food',
    stock: 'available',
    stockCount: 25,
    badges: ['Popular'],
    rating: 4.7,
    reviewCount: 134
  },
  {
    id: '7',
    name: 'Es Teh Manis',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
    price: 5000,
    description: 'Teh manis dingin segar untuk menemani makanan',
    category: 'Beverages',
    stock: 'available',
    stockCount: 100,
    rating: 4.3,
    reviewCount: 89
  },
  {
    id: '8',
    name: 'Es Jeruk',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop',
    price: 8000,
    description: 'Jeruk peras segar dengan es batu',
    category: 'Beverages',
    stock: 'available',
    stockCount: 50,
    rating: 4.4,
    reviewCount: 67
  },
  {
    id: '9',
    name: 'Martabak Manis',
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&h=600&fit=crop',
    price: 30000,
    description: 'Martabak manis dengan topping coklat, keju, dan kacang',
    category: 'Desserts',
    stock: 'available',
    stockCount: 10,
    badges: ['New'],
    rating: 4.8,
    reviewCount: 156,
    variants: [
      { name: 'Topping', options: ['Coklat Keju', 'Coklat Kacang', 'Green Tea', 'Oreo'] }
    ]
  },
  {
    id: '10',
    name: 'Pisang Goreng',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=600&fit=crop',
    price: 12000,
    description: 'Pisang goreng crispy dengan taburan coklat dan keju',
    category: 'Snacks & Street Food',
    stock: 'available',
    stockCount: 30,
    rating: 4.5,
    reviewCount: 92
  },
  {
    id: '11',
    name: 'Nasi Uduk Komplit',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop',
    price: 27000,
    description: 'Nasi uduk dengan ayam goreng, telur balado, tempe orek, dan sambal',
    category: 'Main Course',
    stock: 'available',
    stockCount: 14,
    rating: 4.6,
    reviewCount: 78
  },
  {
    id: '12',
    name: 'Klepon',
    image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=600&h=600&fit=crop',
    price: 15000,
    description: 'Klepon isi gula merah dengan kelapa parut (10 pcs)',
    category: 'Desserts',
    stock: 'low',
    stockCount: 3,
    badges: ['Limited'],
    rating: 4.7,
    reviewCount: 45
  }
]

const STYLES = [
  {
    value: 'instagram-card',
    label: 'Instagram Card',
    description: 'Social media style dengan like, comment, share buttons',
    emoji: '📸'
  },
  {
    value: 'modern-minimal',
    label: 'Modern Minimal',
    description: 'Minimalist design dengan subtle animations',
    emoji: '✨'
  },
  {
    value: 'compact-grid',
    label: 'Compact Grid',
    description: 'Image-focused compact layout untuk banyak produk',
    emoji: '🎯'
  },
  {
    value: 'instagram-shop',
    label: 'Instagram Shop',
    description: 'Simple Instagram shopping style dengan large CTA',
    emoji: '🛍️'
  }
] as const

type DeviceType = 'mobile' | 'tablet'

export default function ProductCatalogDemoPage() {
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLES[number]['value']>('instagram-card')
  const [columns, setColumns] = useState<'small' | 'medium'>('small')
  const [deviceType, setDeviceType] = useState<DeviceType>('tablet')
  const [showSearch, setShowSearch] = useState(true)
  const [showCategories, setShowCategories] = useState(true)
  const [showStockIndicator, setShowStockIndicator] = useState(true)

  // Device frame styles
  const deviceFrameClass = {
    mobile: 'max-w-[375px] mx-auto', // iPhone size
    tablet: 'max-w-2xl mx-auto' // Same as DynamicTemplateRenderer
  }

  const getColumnInfo = () => {
    if (columns === 'small') {
      return deviceType === 'mobile' ? '2 columns' : '3 columns'
    } else {
      return deviceType === 'mobile' ? '1 column' : '2 columns'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 shadow-sm z-100">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Catalog Block</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Interactive demo dengan 4 style variations & responsive preview</p>
            </div>
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Back
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Control Panel */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">🎛️ Customization Controls</h2>

          {/* Device Preview Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📱 Device Preview
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setDeviceType('mobile')}
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
                <span className="text-xs opacity-70">(375px)</span>
              </Button>
              <Button
                onClick={() => setDeviceType('tablet')}
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
                <span className="text-xs opacity-70">(672px)</span>
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
              <strong>Current:</strong> {deviceType === 'mobile' ? 'Mobile view' : 'Tablet view'} • {getColumnInfo()}
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎨 Select Style (4 Variations)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${selectedStyle === style.value
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                >
                  <div className="text-2xl mb-2">{style.emoji}</div>
                  <div className="font-semibold text-gray-900 text-sm">{style.label}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📐 Column Size
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setColumns('small')}
                  variant={columns === 'small' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  title="Mobile: 2 cols | Tablet: 3 cols"
                >
                  Small
                </Button>
                <Button
                  onClick={() => setColumns('medium')}
                  variant={columns === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  title="Mobile: 1 col | Tablet: 2 cols"
                >
                  Medium
                </Button>
              </div>
            </div>

            {/* Toggle Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search
              </label>
              <Button
                onClick={() => setShowSearch(!showSearch)}
                variant={showSearch ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {showSearch ? '✓ ON' : '✗ OFF'}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📂 Categories
              </label>
              <Button
                onClick={() => setShowCategories(!showCategories)}
                variant={showCategories ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {showCategories ? '✓ ON' : '✗ OFF'}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📦 Stock
              </label>
              <Button
                onClick={() => setShowStockIndicator(!showStockIndicator)}
                variant={showStockIndicator ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {showStockIndicator ? '✓ ON' : '✗ OFF'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Product Catalog Display with Device Frame */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
              {deviceType === 'mobile' ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Preview • {getColumnInfo()}</span>
                </>
              ) : (
                <>
                  <Tablet className="w-4 h-4" />
                  <span>Tablet Preview • {getColumnInfo()}</span>
                </>
              )}
            </div>
          </div>

          {/* Device Frame */}
          <div className={deviceFrameClass[deviceType]}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              {/* Device Notch/Status Bar */}
              <div className="bg-gray-900 h-6 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
              </div>

              {/* Content Area - Fixed height with scroll */}
              <div className={`bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-y-auto ${
                deviceType === 'mobile' ? 'h-[667px]' : 'h-[800px]'
              }`}>
                <ProductCatalogBlock
                  props={{
                    items: SAMPLE_PRODUCTS,
                    style: selectedStyle,
                    columns: columns,
                    showSearch: showSearch,
                    showCategories: showCategories,
                    showStockIndicator: showStockIndicator,
                    whatsappNumber: '6281234567890',
                    ctaText: 'Pesan via WhatsApp',
                    forceViewport: deviceType,
                    containModal: true  // Modal contained within preview frame
                  }}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold text-base mb-1">4 Styles</h3>
            <p className="text-blue-100 text-xs">
              Instagram, Modern, Compact, Shop
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-base mb-1">Fully Responsive</h3>
            <p className="text-purple-100 text-xs">
              Adaptive columns & sizing
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold text-base mb-1">WhatsApp</h3>
            <p className="text-green-100 text-xs">
              Direct order integration
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-bold text-base mb-1">Smart Filter</h3>
            <p className="text-orange-100 text-xs">
              Search & category system
            </p>
          </Card>
        </div>

        {/* Implementation Code */}
        <Card className="p-4 sm:p-6 bg-gray-900 text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📝 Implementation Code</h3>
          <pre className="bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
            <code>{`<ProductCatalogBlock
  props={{
    items: products,
    style: '${selectedStyle}',
    columns: '${columns}',          // 'small' | 'medium'
    showSearch: ${showSearch},
    showCategories: ${showCategories},
    showStockIndicator: ${showStockIndicator},
    whatsappNumber: '081234567890',
    ctaText: 'Pesan via WhatsApp'
  }}
/>`}</code>
          </pre>

          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
            <div className="font-semibold mb-2">Column Behavior:</div>
            <div className="space-y-1 text-gray-300">
              <div>• <strong className="text-white">small:</strong> Mobile 2 cols → Tablet 3 cols</div>
              <div>• <strong className="text-white">medium:</strong> Mobile 1 col → Tablet 2 cols</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
