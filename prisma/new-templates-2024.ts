/**
 * New Templates Collection 2024
 * 12 additional templates focusing on Creator, UMKM, and F&B categories
 */

export const newTemplates2024 = [
  // ============================================
  // CREATOR TEMPLATES (4)
  // ============================================
  {
    slug: 'gaming-streamer-hub',
    name: 'Gaming Streamer Hub',
    description: 'Template untuk gaming streamer dengan schedule stream, highlights, dan donation links',
    category: 'premium',
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Gaming Streamer Hub',
      version: '1.0.0',
      description: 'Template untuk gaming streamer dengan schedule stream, highlights, dan donation links',
      thumbnail: '/templates/gaming-streamer-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['link-list', 'divider', 'gallery', 'divider', 'social-icons'],
        footer: ['footer']
      },
      allowedBlocks: ['bio', 'link-list', 'social-icons', 'gallery', 'divider', 'footer'],
      maxBlocks: {
        'bio': 1,
        'link-list': 1,
        'gallery': 1,
        'social-icons': 1
      },
      defaults: {
        backgroundKey: 'gradient-space-void',
        tokens: {
          '--primary-color': '#22c55e',
          '--secondary-color': '#16a34a',
          '--text-color': '#22c55e',
          '--card-background': '#111111',
          '--border-radius': '8px',
          '--shadow': '0 0 25px rgba(34, 197, 94, 0.4)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'hexagon',
            nameStyle: 'tech-mono',
            textAlign: 'center',
            spacing: 'wide'
          },
          'link-list': {
            style: 'pixel',
            gap: 'md',
            customColors: {
              primary: '#22c55e',
              secondary: '#16a34a',
              text: '#000000',
              accent: '#84cc16',
              background: '#0a0a0a'
            }
          },
          'gallery': {
            layout: 'grid',
            columns: 3,
            gap: 'md',
            rounded: true
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'GAMER.HUB',
          description: 'Join the stream, level up together!'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'tech-reviewer-pro',
    name: 'Tech Reviewer Pro',
    description: 'Template untuk tech reviewer dengan review gadget, unboxing, dan affiliate links',
    category: 'premium',
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Tech Reviewer Pro',
      version: '1.0.0',
      description: 'Template untuk tech reviewer dengan review gadget, unboxing, dan affiliate links',
      thumbnail: '/templates/tech-reviewer-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'marketplace'],
        footer: ['social-icons', 'footer']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'divider', 'footer'],
      defaults: {
        backgroundKey: 'gradient-dark-ocean',
        tokens: {
          '--primary-color': '#3b82f6',
          '--secondary-color': '#2563eb',
          '--text-color': '#3b82f6',
          '--card-background': '#111827',
          '--border-radius': '12px',
          '--shadow': '0 0 20px rgba(59, 130, 246, 0.3)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'hexagon',
            nameStyle: 'tech-mono',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'lg',
            rounded: true
          },
          'link-list': {
            style: 'terminal',
            gap: 'md'
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/tech-store',
                storeName: 'Tech Store'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/tech-store',
                shopId: 'techstore'
              }
            },
            layout: 'buttons',
            showBadges: true,
            showRatings: false
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Tech Review Hub',
          description: 'Honest reviews, detailed specs, best deals'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'travel-blogger-wanderlust',
    name: 'Travel Blogger Wanderlust',
    description: 'Template untuk travel blogger dengan destination guides dan travel tips',
    category: 'premium',
    primaryCategory: 'creator',
    subCategory: 'travel',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Travel Blogger Wanderlust',
      version: '1.0.0',
      description: 'Template untuk travel blogger dengan destination guides dan travel tips',
      thumbnail: '/templates/travel-blogger-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'location'],
        footer: ['social-icons', 'footer']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'location', 'divider', 'footer'],
      defaults: {
        backgroundKey: 'gradient-aqua-splash',
        tokens: {
          '--primary-color': '#06b6d4',
          '--secondary-color': '#0891b2',
          '--text-color': '#0e7490',
          '--card-background': 'rgba(255, 255, 255, 0.85)',
          '--border-radius': '20px',
          '--shadow': '0 8px 24px rgba(6, 182, 212, 0.3)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'circle',
            nameStyle: 'large-elegant',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'grid',
            columns: 3,
            gap: 'md',
            rounded: true
          },
          'link-list': {
            style: 'brush',
            gap: 'lg'
          },
          'location': {
            googleMapsUrl: '',
            showDirectionsButton: true,
            showCurrentStatus: false,
            mapHeight: 300
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: '🌍 Travel Wanderlust',
          description: 'Explore the world one destination at a time'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'lifestyle-influencer-modern',
    name: 'Lifestyle Influencer',
    description: 'Template modern untuk lifestyle influencer dengan daily content dan brand collabs',
    category: 'free',
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Lifestyle Influencer',
      version: '1.0.0',
      description: 'Template modern untuk lifestyle influencer dengan daily content dan brand collabs',
      thumbnail: '/templates/lifestyle-influencer-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['link-list', 'divider', 'gallery'],
        footer: ['social-icons']
      },
      allowedBlocks: ['bio', 'link-list', 'social-icons', 'gallery', 'divider'],
      defaults: {
        backgroundKey: 'gradient-lavender-dream',
        tokens: {
          '--primary-color': '#ec4899',
          '--secondary-color': '#db2777',
          '--text-color': '#831843',
          '--card-background': 'rgba(255, 255, 255, 0.9)',
          '--border-radius': '20px',
          '--shadow': '0 8px 24px rgba(236, 72, 153, 0.25)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'flower',
            nameStyle: 'script-handwritten',
            textAlign: 'center',
            spacing: 'wide'
          },
          'link-list': {
            style: 'glass',
            gap: 'lg'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Lifestyle Hub',
          description: 'Living life, sharing moments'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  // ============================================
  // UMKM TEMPLATES (5) - PRIORITY
  // ============================================
  {
    slug: 'food-seller-homemade',
    name: 'Food Seller Homemade',
    description: 'Template untuk penjual makanan rumahan, frozen food, dan snack dengan katalog produk',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'food-seller',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Food Seller Homemade',
      version: '1.0.0',
      description: 'Template untuk penjual makanan rumahan, frozen food, dan snack dengan katalog produk',
      thumbnail: '/templates/food-seller-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['product-catalog', 'divider', 'qris-payment'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'product-catalog', 'link-list', 'social-icons', 'qris-payment', 'whatsapp-business', 'divider'],
      maxBlocks: {
        'bio': 1,
        'product-catalog': 1,
        'qris-payment': 1,
        'whatsapp-business': 1
      },
      defaults: {
        backgroundKey: 'gradient-peachy-keen',
        tokens: {
          '--primary-color': '#f97316',
          '--secondary-color': '#ea580c',
          '--text-color': '#9a3412',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 6px 20px rgba(249, 115, 22, 0.25)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'bold-impact',
            textAlign: 'center',
            spacing: 'wide'
          },
          'product-catalog': {
            items: [
              {
                id: '1',
                name: 'Nasi Goreng Special',
                description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
                price: 25000,
                originalPrice: 30000,
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
                category: 'Makanan Utama',
                stock: 'available',
                rating: 4.8,
                badges: ['Best Seller', 'Promo']
              },
              {
                id: '2',
                name: 'Ayam Geprek Sambal Matah',
                description: 'Ayam goreng crispy dengan sambal matah pedas',
                price: 22000,
                image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
                category: 'Makanan Utama',
                stock: 'available',
                rating: 4.9,
                badges: ['Best Seller']
              },
              {
                id: '3',
                name: 'Mie Goreng Seafood',
                description: 'Mie goreng dengan topping seafood segar',
                price: 28000,
                image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
                category: 'Makanan Utama',
                stock: 'available',
                rating: 4.7
              },
              {
                id: '4',
                name: 'Soto Ayam Kuning',
                description: 'Soto ayam dengan kuah kuning gurih',
                price: 20000,
                image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
                category: 'Makanan Berkuah',
                stock: 'available',
                rating: 4.6
              },
              {
                id: '5',
                name: 'Es Teh Manis',
                description: 'Teh manis dingin segar',
                price: 5000,
                image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
                category: 'Minuman',
                stock: 'available',
                rating: 4.5
              },
              {
                id: '6',
                name: 'Es Jeruk Peras',
                description: 'Jeruk peras segar tanpa gula tambahan',
                price: 8000,
                image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                category: 'Minuman',
                stock: 'available',
                rating: 4.7
              },
              {
                id: '7',
                name: 'Pisang Goreng Crispy',
                description: 'Pisang goreng renyah dengan taburan keju',
                price: 12000,
                originalPrice: 15000,
                image: 'https://images.unsplash.com/photo-1587334207863-5717f7f1e5c9?w=400',
                category: 'Snack',
                stock: 'low',
                rating: 4.8,
                badges: ['Promo']
              },
              {
                id: '8',
                name: 'Tahu Crispy',
                description: 'Tahu goreng crispy dengan saus kacang',
                price: 10000,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                category: 'Snack',
                stock: 'available',
                rating: 4.5
              }
            ],
            style: 'instagram-card',
            columns: 4,
            showSearch: true,
            showCategories: true,
            showStockIndicator: true,
            showRating: true,
            ctaText: 'Order via WhatsApp',
            rounded: 'lg'
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_FOOD_SELLER',
            merchantName: 'Makanan Rumahan',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            instructions: 'Transfer via QRIS atau order langsung via WhatsApp. Minimal order Rp 50.000',
            showPaymentLogos: true,
            presetAmounts: [50000, 100000, 150000, 200000],
            allowCustomAmount: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order makanan',
            buttonText: 'Order via WhatsApp',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Food'
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Makanan Rumahan',
          description: 'Makanan enak, harga terjangkau, delivery cepat'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'handicraft-artisan',
    name: 'Handicraft Artisan',
    description: 'Template untuk penjual kerajinan tangan, produk handmade, dan karya seni',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'handicraft',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Handicraft Artisan',
      version: '1.0.0',
      description: 'Template untuk penjual kerajinan tangan, produk handmade, dan karya seni',
      thumbnail: '/templates/handicraft-artisan-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'marketplace', 'divider', 'link-list'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-mint-fresh',
        tokens: {
          '--primary-color': '#059669',
          '--secondary-color': '#047857',
          '--text-color': '#064e3b',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 4px 16px rgba(5, 150, 105, 0.2)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'lg',
            avatarStyle: 'rounded-frame',
            nameStyle: 'default',
            textAlign: 'center',
            spacing: 'normal'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/handicraft-store',
                storeName: 'Handicraft Store'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/handicraft-store',
                shopId: 'handicraftstore'
              }
            },
            layout: 'buttons',
            showBadges: true,
            showRatings: true
          },
          'link-list': {
            style: 'wood',
            gap: 'md'
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya tertarik dengan produk kerajinan Anda',
            buttonText: 'Chat untuk Custom Order',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Handicraft'
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Handicraft Artisan',
          description: 'Handmade with love, crafted with care'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'service-business-pro',
    name: 'Service Business Pro',
    description: 'Template untuk bisnis jasa seperti konsultasi, freelance, service teknologi',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'service-business',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Service Business Pro',
      version: '1.0.0',
      description: 'Template untuk bisnis jasa seperti konsultasi, freelance, service teknologi',
      thumbnail: '/templates/service-business-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['link-list', 'divider', 'gallery', 'divider', 'location'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'link-list', 'social-icons', 'gallery', 'location', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-pastel-sky',
        tokens: {
          '--primary-color': '#3b82f6',
          '--secondary-color': '#2563eb',
          '--text-color': '#1e3a8a',
          '--card-background': '#ffffff',
          '--border-radius': '12px',
          '--shadow': '0 4px 12px rgba(59, 130, 246, 0.15)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'lg',
            avatarStyle: 'rounded-frame',
            nameStyle: 'default',
            textAlign: 'center',
            spacing: 'normal'
          },
          'link-list': {
            style: 'card',
            gap: 'md'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'location': {
            googleMapsUrl: '',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya ingin konsultasi untuk layanan jasa',
            buttonText: 'Konsultasi Gratis',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Service'
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Service Pro',
          description: 'Professional service, quality guaranteed'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'dropship-reseller-hub',
    name: 'Dropship Reseller Hub',
    description: 'Template untuk dropshipper dan reseller dengan katalog produk dan link marketplace',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'dropship',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Dropship Reseller Hub',
      version: '1.0.0',
      description: 'Template untuk dropshipper dan reseller dengan katalog produk dan link marketplace',
      thumbnail: '/templates/dropship-reseller-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'marketplace', 'divider', 'qris-payment'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'qris-payment', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-soft-clouds',
        tokens: {
          '--primary-color': '#10b981',
          '--secondary-color': '#059669',
          '--text-color': '#064e3b',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 4px 16px rgba(16, 185, 129, 0.2)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'lg',
            avatarStyle: 'rounded-frame',
            nameStyle: 'default',
            textAlign: 'center',
            spacing: 'normal'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/reseller-store',
                storeName: 'Reseller Store'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/reseller-store',
                shopId: 'resellerstore'
              },
              tiktokshop: {
                storeUrl: 'https://tiktok.com/@resellerstore',
                username: '@resellerstore'
              }
            },
            layout: 'mixed',
            showBadges: true,
            showRatings: true
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_RESELLER',
            merchantName: 'Reseller Hub',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            instructions: 'Transfer via QRIS atau order via WhatsApp',
            showPaymentLogos: true,
            presetAmounts: [100000, 200000, 500000],
            allowCustomAmount: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order produk',
            buttonText: 'Order Sekarang',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Reseller'
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Dropship & Reseller',
          description: 'Produk original, harga reseller'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'thrift-store-vintage',
    name: 'Thrift Store Vintage',
    description: 'Template untuk toko thrift, second branded, dan vintage items',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'fashion-umkm',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Thrift Store Vintage',
      version: '1.0.0',
      description: 'Template untuk toko thrift, second branded, dan vintage items',
      thumbnail: '/templates/thrift-store-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'marketplace'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-desert-sand',
        tokens: {
          '--primary-color': '#92400e',
          '--secondary-color': '#78350f',
          '--text-color': '#451a03',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 4px 16px rgba(146, 64, 14, 0.2)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'lg',
            avatarStyle: 'vintage',
            nameStyle: 'vintage-serif',
            textAlign: 'center',
            spacing: 'normal'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'link-list': {
            style: 'sketch',
            gap: 'md'
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/thrift-store',
                storeName: 'Thrift Store'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/thrift-store',
                shopId: 'thriftstore'
              }
            },
            layout: 'buttons',
            showBadges: false,
            showRatings: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya tertarik dengan item thrift',
            buttonText: 'Chat untuk Info',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Thrift'
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Thrift Store Vintage',
          description: 'Unique finds, sustainable fashion'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  // ============================================
  // F&B TEMPLATES (3)
  // ============================================
  {
    slug: 'bakery-cake-shop',
    name: 'Bakery & Cake Shop',
    description: 'Template untuk toko kue, bakery, dan pastry dengan katalog produk dan custom order',
    category: 'premium',
    primaryCategory: 'fnb',
    subCategory: 'bakery',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Bakery & Cake Shop',
      version: '1.0.0',
      description: 'Template untuk toko kue, bakery, dan pastry dengan katalog produk dan custom order',
      thumbnail: '/templates/bakery-cake-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'location'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'location', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-lavender-dream',
        tokens: {
          '--primary-color': '#f472b6',
          '--secondary-color': '#ec4899',
          '--text-color': '#831843',
          '--card-background': 'rgba(255, 255, 255, 0.9)',
          '--border-radius': '20px',
          '--shadow': '0 8px 24px rgba(244, 114, 182, 0.25)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'script-handwritten',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'link-list': {
            style: 'glass',
            gap: 'md'
          },
          'location': {
            googleMapsUrl: '',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300,
            openingHours: [
              { day: 'Senin - Sabtu', hours: '08:00 - 20:00' },
              { day: 'Minggu', hours: '09:00 - 18:00' }
            ]
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order kue custom',
            buttonText: 'Order Kue Custom',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Bakery'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: '🍰 Bakery & Cake Shop',
          description: 'Fresh baked daily, made with love'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'catering-service-pro',
    name: 'Catering Service Pro',
    description: 'Template untuk layanan katering event, pesta, dan corporate dengan paket lengkap',
    category: 'premium',
    primaryCategory: 'fnb',
    subCategory: 'catering',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Catering Service Pro',
      version: '1.0.0',
      description: 'Template untuk layanan katering event, pesta, dan corporate dengan paket lengkap',
      thumbnail: '/templates/catering-service-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'qris-payment', 'divider', 'location'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'qris-payment', 'location', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-cherry-blossom',
        tokens: {
          '--primary-color': '#dc2626',
          '--secondary-color': '#b91c1c',
          '--text-color': '#7f1d1d',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 6px 20px rgba(220, 38, 38, 0.2)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xxl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'large-elegant',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'grid',
            columns: 3,
            gap: 'md',
            rounded: true
          },
          'link-list': {
            style: 'card',
            gap: 'md'
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_CATERING',
            merchantName: 'Catering Service',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay', 'LinkAja'],
            instructions: 'DP minimal 30% dari total paket. Transfer via QRIS atau transfer bank',
            showPaymentLogos: true,
            presetAmounts: [5000000, 10000000, 20000000],
            allowCustomAmount: true
          },
          'location': {
            googleMapsUrl: '',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau tanya paket catering untuk event',
            buttonText: 'Konsultasi Paket',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Catering'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Catering Service Pro',
          description: 'Delicious food for your special events'
        }
      },
      isPaid: true,
      priceCents: 1500,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'cloud-kitchen-delivery',
    name: 'Cloud Kitchen Delivery',
    description: 'Template untuk dark kitchen/cloud kitchen fokus delivery dengan multi-platform',
    category: 'premium',
    primaryCategory: 'fnb',
    subCategory: 'food-delivery',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Cloud Kitchen Delivery',
      version: '1.0.0',
      description: 'Template untuk dark kitchen/cloud kitchen fokus delivery dengan multi-platform',
      thumbnail: '/templates/cloud-kitchen-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['delivery-platform', 'divider', 'gallery', 'divider', 'link-list'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'delivery-platform', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-dark-ocean',
        tokens: {
          '--primary-color': '#f97316',
          '--secondary-color': '#ea580c',
          '--text-color': '#ffffff',
          '--card-background': 'rgba(255, 255, 255, 0.1)',
          '--border-radius': '16px',
          '--shadow': '0 6px 20px rgba(249, 115, 22, 0.3)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'bold-impact',
            textAlign: 'center',
            spacing: 'wide'
          },
          'delivery-platform': {
            platforms: {
              gofood: {
                url: 'https://gofood.link/a/cloudkitchen',
                merchantName: 'Cloud Kitchen',
                badge: 'official',
                rating: 4.8
              },
              grabfood: {
                url: 'https://food.grab.com/id/en/restaurant/cloud-kitchen',
                restaurantId: '1-CLOUDKITCHEN',
                rating: 4.9
              },
              shopeefood: {
                url: 'https://shopeefood.co.id/jakarta/cloud-kitchen',
                shopId: 'cloudkitchen',
                promoText: 'Gratis ongkir min 50rb!'
              }
            },
            layout: 'grid',
            showRatings: true,
            showPromos: true,
            primaryPlatform: 'gofood'
          },
          'gallery': {
            layout: 'grid',
            columns: 3,
            gap: 'md',
            rounded: true
          },
          'link-list': {
            style: 'modern',
            gap: 'md'
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order makanan dari Cloud Kitchen',
            buttonText: 'Order Direct',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Kitchen'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Cloud Kitchen Delivery',
          description: 'Order now, delivered fast!'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  }
]
