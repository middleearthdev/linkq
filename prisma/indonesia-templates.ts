/**
 * Indonesia-Specific Templates
 * Templates optimized for Indonesian market with local blocks
 */

export const indonesiaTemplates = [
  // ============================================
  // UMKM TEMPLATES
  // ============================================
  {
    slug: 'toko-online-modern',
    name: 'Toko Online Modern',
    description: 'Template modern untuk UMKM dengan WhatsApp, marketplace, dan QRIS payment',
    category: 'free',
    primaryCategory: 'umkm',
    subCategory: 'fashion-umkm',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Toko Online Modern',
      version: '1.0.0',
      description: 'Template modern untuk UMKM dengan WhatsApp, marketplace, dan QRIS payment',
      thumbnail: '/templates/toko-online-modern-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['marketplace', 'divider', 'link-list', 'divider', 'qris-payment'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'link-list', 'social-icons', 'marketplace', 'qris-payment', 'whatsapp-business', 'divider', 'gallery'],
      maxBlocks: {
        'bio': 1,
        'marketplace': 1,
        'qris-payment': 1,
        'whatsapp-business': 1
      },
      defaults: {
        backgroundKey: 'gradient-mint-fresh',
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
            avatarSize: 'xl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'bold-impact',
            textAlign: 'center',
            spacing: 'wide'
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/your-store',
                storeName: 'Nama Toko Anda',
                badge: 'official'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/your-store',
                shopId: 'yourstore'
              }
            },
            layout: 'buttons',
            showBadges: true,
            showRatings: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order produk dari toko Anda',
            buttonText: 'Chat Sekarang',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            showLabel: true,
            enablePulse: true,
            expandOnHover: true,
            businessName: 'Toko',
            showIcon: true
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_PLACEHOLDER',
            merchantName: 'Nama Toko Anda',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            instructions: 'Scan QR code dengan aplikasi e-wallet Anda (Gopay, OVO, Dana, atau ShopeePay)',
            showPaymentLogos: true,
            presetAmounts: [50000, 100000, 200000, 500000],
            allowCustomAmount: true
          },
          'link-list': {
            style: 'card',
            gap: 'md'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          },
          'divider': {
            style: 'solid',
            thickness: 1,
            spacing: 'lg'
          }
        },
        meta: {
          title: 'Toko Online Saya',
          description: 'Belanja mudah, pembayaran aman'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'umkm-fashion-boutique',
    name: 'Fashion Boutique',
    description: 'Template elegant untuk bisnis fashion dengan gallery dan marketplace',
    category: 'premium',
    primaryCategory: 'umkm',
    subCategory: 'fashion-umkm',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Fashion Boutique',
      version: '1.0.0',
      description: 'Template elegant untuk bisnis fashion dengan gallery dan marketplace',
      thumbnail: '/templates/fashion-boutique-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'marketplace', 'divider', 'link-list'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-lavender-dream',
        tokens: {
          '--primary-color': '#ec4899',
          '--secondary-color': '#db2777',
          '--text-color': '#831843',
          '--card-background': 'rgba(255, 255, 255, 0.95)',
          '--border-radius': '20px',
          '--shadow': '0 8px 24px rgba(236, 72, 153, 0.25)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xxl',
            avatarStyle: 'flower',
            nameStyle: 'large-elegant',
            textAlign: 'center',
            spacing: 'wide'
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
                storeUrl: 'https://tokopedia.com/your-boutique',
                storeName: 'Fashion Boutique',
                badge: 'official'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/your-boutique',
                shopId: 'yourboutique',
                badge: 'star-seller'
              }
            },
            layout: 'mixed',
            showBadges: true,
            showRatings: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya tertarik dengan koleksi fashion Anda',
            buttonText: 'Hubungi Kami',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Boutique'
          },
          'link-list': {
            style: 'glass',
            gap: 'lg'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Fashion Boutique',
          description: 'Koleksi fashion terbaru dan terkini'
        }
      },
      isPaid: true,
      priceCents: 1500,
      requiredFeatures: ['premium-templates']
    }
  },

  // ============================================
  // F&B TEMPLATES
  // ============================================
  {
    slug: 'warung-kopi-cafe',
    name: 'Warung Kopi & Cafe',
    description: 'Template untuk cafe dengan menu, delivery platform, dan lokasi',
    category: 'free',
    primaryCategory: 'fnb',
    subCategory: 'cafe',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Warung Kopi & Cafe',
      version: '1.0.0',
      description: 'Template untuk cafe dengan menu, delivery platform, dan lokasi',
      thumbnail: '/templates/warung-kopi-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['delivery-platform', 'divider', 'gallery', 'divider', 'location'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'delivery-platform', 'location', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-desert-sand',
        tokens: {
          '--primary-color': '#92400e',
          '--secondary-color': '#78350f',
          '--text-color': '#451a03',
          '--card-background': 'rgba(255, 255, 255, 0.9)',
          '--border-radius': '16px',
          '--shadow': '0 4px 20px rgba(146, 64, 14, 0.2)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
            avatarStyle: 'rounded-frame',
            nameStyle: 'large-elegant',
            textAlign: 'center',
            spacing: 'wide'
          },
          'delivery-platform': {
            platforms: {
              gofood: {
                url: 'https://gofood.link/a/aBcDeF',
                merchantName: 'Warung Kopi Anda',
                badge: 'official'
              },
              grabfood: {
                url: 'https://food.grab.com/id/en/restaurant/warung-kopi-anda',
                restaurantId: '1-ABCDEFGH',
                rating: 4.8
              }
            },
            layout: 'buttons',
            showRatings: true,
            showPromos: true,
            primaryPlatform: 'gofood'
          },
          'location': {
            googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1753924',
            address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
            phone: '021-12345678',
            openingHours: [
              { day: 'Senin - Jumat', hours: '08:00 - 22:00' },
              { day: 'Sabtu - Minggu', hours: '09:00 - 23:00' }
            ],
            locationName: 'Warung Kopi Anda',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau reservasi/order dari Warung Kopi',
            buttonText: 'Reservasi',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Cafe'
          },
          'gallery': {
            layout: 'grid',
            columns: 2,
            gap: 'md',
            rounded: true
          },
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Warung Kopi & Cafe',
          description: 'Kopi nikmat, suasana nyaman'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  {
    slug: 'restoran-delivery',
    name: 'Restoran Delivery',
    description: 'Template untuk restoran fokus delivery dengan multi-platform',
    category: 'premium',
    primaryCategory: 'fnb',
    subCategory: 'food-delivery',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Restoran Delivery',
      version: '1.0.0',
      description: 'Template untuk restoran fokus delivery dengan multi-platform',
      thumbnail: '/templates/restoran-delivery-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['delivery-platform', 'divider', 'gallery', 'divider', 'location', 'divider', 'link-list'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'delivery-platform', 'location', 'whatsapp-business', 'divider'],
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
            nameStyle: 'bold-impact',
            textAlign: 'center',
            spacing: 'wide'
          },
          'delivery-platform': {
            platforms: {
              gofood: {
                url: 'https://gofood.link/a/aBcDeF',
                merchantName: 'Restoran Anda',
                badge: 'official'
              },
              grabfood: {
                url: 'https://food.grab.com/id/en/restaurant/restoran-anda',
                restaurantId: '1-ABCDEFGH',
                rating: 4.9
              },
              shopeefood: {
                url: 'https://shopeefood.co.id/jakarta/restoran-anda',
                shopId: 'shop-12345',
                promoText: 'Diskon 30% untuk order pertama!'
              }
            },
            layout: 'grid',
            showRatings: true,
            showPromos: true,
            primaryPlatform: 'gofood'
          },
          'location': {
            googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1753924',
            address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan, DKI Jakarta 12190',
            phone: '021-87654321',
            openingHours: [
              { day: 'Senin - Jumat', hours: '10:00 - 22:00' },
              { day: 'Sabtu - Minggu', hours: '09:00 - 23:00' }
            ],
            locationName: 'Restoran Anda',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order makanan dari Restoran',
            buttonText: 'Order Sekarang',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Restoran'
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
          'social-icons': {
            size: 'md',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Restoran Delivery',
          description: 'Pesan sekarang, nikmati di rumah'
        }
      },
      isPaid: true,
      priceCents: 1200,
      requiredFeatures: ['premium-templates']
    }
  },

  // ============================================
  // CREATOR TEMPLATES
  // ============================================
  {
    slug: 'beauty-creator-hub',
    name: 'Beauty Creator Hub',
    description: 'Template untuk beauty creator dengan affiliate dan product links',
    category: 'premium',
    primaryCategory: 'creator',
    subCategory: 'beauty-creator',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Beauty Creator Hub',
      version: '1.0.0',
      description: 'Template untuk beauty creator dengan affiliate dan product links',
      thumbnail: '/templates/beauty-creator-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'marketplace'],
        footer: ['social-icons', 'whatsapp-business']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'whatsapp-business', 'divider'],
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
            avatarSize: 'xxl',
            avatarStyle: 'flower',
            nameStyle: 'script-handwritten',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'carousel',
            columns: 1,
            gap: 'lg',
            rounded: true
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/beauty-store',
                storeName: 'Beauty Store Official',
                badge: 'official'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/beauty-store',
                shopId: 'beautystore',
                badge: 'star-seller'
              },
              tiktokshop: {
                storeUrl: 'https://tiktok.com/@beautystore',
                username: '@beautystore',
                verified: true
              }
            },
            layout: 'mixed',
            showBadges: true,
            showRatings: true
          },
          'link-list': {
            style: 'glass',
            gap: 'lg'
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya tertarik untuk kolaborasi/tanya produk',
            buttonText: 'Hubungi Saya',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Beauty'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Beauty Creator',
          description: 'Inspiring beauty, sharing joy'
        }
      },
      isPaid: true,
      priceCents: 1500,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'food-blogger-paradise',
    name: 'Food Blogger Paradise',
    description: 'Template untuk food blogger dengan review dan rekomendasi',
    category: 'free',
    primaryCategory: 'creator',
    subCategory: 'food-creator',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Food Blogger Paradise',
      version: '1.0.0',
      description: 'Template untuk food blogger dengan review dan rekomendasi',
      thumbnail: '/templates/food-blogger-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'delivery-platform'],
        footer: ['social-icons', 'whatsapp-business']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'delivery-platform', 'whatsapp-business', 'divider'],
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
          'delivery-platform': {
            platforms: {
              gofood: {
                url: 'https://gofood.link/recommendations',
                merchantName: 'Rekomendasi Favorit',
                badge: 'partner'
              },
              grabfood: {
                url: 'https://food.grab.com/recommendations',
                restaurantId: 'recommendations'
              }
            },
            layout: 'buttons',
            showRatings: false,
            showPromos: true,
            primaryPlatform: 'gofood'
          },
          'link-list': {
            style: 'card',
            gap: 'md'
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau tanya rekomendasi tempat makan',
            buttonText: 'Tanya Rekomendasi',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'default',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Food Blog'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Food Blogger',
          description: 'Exploring culinary delights'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  // ============================================
  // SKINCARE TEMPLATES
  // ============================================
  {
    slug: 'brand-skincare-premium',
    name: 'Brand Skincare Premium',
    description: 'Template premium untuk brand skincare dengan product showcase',
    category: 'premium',
    primaryCategory: 'skincare',
    subCategory: 'skincare-brand',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Brand Skincare Premium',
      version: '1.0.0',
      description: 'Template premium untuk brand skincare dengan product showcase',
      thumbnail: '/templates/skincare-premium-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'marketplace', 'divider', 'link-list', 'divider', 'qris-payment'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'qris-payment', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-pearl-white',
        tokens: {
          '--primary-color': '#d4af37',
          '--secondary-color': '#b8860b',
          '--text-color': '#1e293b',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 8px 32px rgba(212, 175, 55, 0.2)'
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
            columns: 2,
            gap: 'lg',
            rounded: true
          },
          'marketplace': {
            stores: {
              tokopedia: {
                storeUrl: 'https://tokopedia.com/skincare-brand',
                storeName: 'Brand Skincare Official',
                badge: 'official',
                rating: 4.9,
                reviewCount: 5000
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/skincare-brand',
                shopId: 'skincarebrand',
                badge: 'star-seller',
                rating: 4.9,
                followers: 25000
              },
              tiktokshop: {
                storeUrl: 'https://tiktok.com/@skincarebrand',
                username: '@skincarebrand',
                verified: true,
                followers: 50000
              }
            },
            layout: 'mixed',
            showBadges: true,
            showRatings: true
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_SKINCARE_BRAND',
            merchantName: 'Brand Skincare Official',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay', 'LinkAja'],
            instructions: 'Scan QR code dengan aplikasi e-wallet untuk pembayaran langsung. Dapatkan diskon 10% untuk pembayaran via QRIS!',
            showPaymentLogos: true,
            presetAmounts: [100000, 250000, 500000, 1000000],
            allowCustomAmount: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya tertarik dengan produk skincare Anda',
            buttonText: 'Konsultasi Gratis',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Skincare'
          },
          'link-list': {
            style: 'metallic',
            gap: 'lg'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Brand Skincare Premium',
          description: 'Kulit sehat, kecantikan alami'
        }
      },
      isPaid: true,
      priceCents: 1800,
      requiredFeatures: ['premium-templates']
    }
  },

  {
    slug: 'reseller-beauty',
    name: 'Reseller Beauty',
    description: 'Template untuk reseller beauty products dengan katalog lengkap',
    category: 'free',
    primaryCategory: 'skincare',
    subCategory: 'skincare-brand',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Reseller Beauty',
      version: '1.0.0',
      description: 'Template untuk reseller beauty products dengan katalog lengkap',
      thumbnail: '/templates/reseller-beauty-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'marketplace', 'divider', 'qris-payment'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'marketplace', 'qris-payment', 'whatsapp-business', 'divider'],
      defaults: {
        backgroundKey: 'gradient-soft-clouds',
        tokens: {
          '--primary-color': '#ec4899',
          '--secondary-color': '#db2777',
          '--text-color': '#831843',
          '--card-background': '#ffffff',
          '--border-radius': '16px',
          '--shadow': '0 4px 16px rgba(236, 72, 153, 0.2)'
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
                storeUrl: 'https://tokopedia.com/reseller-beauty',
                storeName: 'Reseller Beauty Products'
              },
              shopee: {
                storeUrl: 'https://shopee.co.id/reseller-beauty',
                shopId: 'resellerbeauty'
              }
            },
            layout: 'buttons',
            showBadges: true,
            showRatings: false
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_RESELLER_BEAUTY',
            merchantName: 'Reseller Beauty',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay'],
            instructions: 'Transfer via QRIS atau langsung order via WhatsApp',
            showPaymentLogos: true,
            presetAmounts: [50000, 100000, 200000],
            allowCustomAmount: true
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya mau order produk beauty',
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
          title: 'Reseller Beauty',
          description: 'Beauty products terpercaya'
        }
      },
      requiredPlan: 'FREE'
    }
  },

  // ============================================
  // PHOTOGRAPHY TEMPLATES
  // ============================================
  {
    slug: 'fotografer-wedding',
    name: 'Fotografer Wedding',
    description: 'Portfolio fotografer wedding dengan gallery dan booking',
    category: 'premium',
    primaryCategory: 'photography',
    subCategory: 'wedding-photo',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Fotografer Wedding',
      version: '1.0.0',
      description: 'Portfolio fotografer wedding dengan gallery dan booking',
      thumbnail: '/templates/fotografer-wedding-thumb.jpg',
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
          '--card-background': 'rgba(255, 255, 255, 0.95)',
          '--border-radius': '20px',
          '--shadow': '0 8px 24px rgba(244, 114, 182, 0.25)'
        },
        blockProps: {
          'bio': {
            showAvatar: true,
            avatarSize: 'xl',
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
            style: 'glass',
            gap: 'lg'
          },
          'location': {
            googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1753924',
            address: 'Jl. Studio No. 789, Jakarta',
            phone: '0812-3456-7890',
            openingHours: [
              { day: 'Senin - Jumat', hours: '09:00 - 18:00' },
              { day: 'Sabtu', hours: '09:00 - 15:00' }
            ],
            locationName: 'Studio Fotografer Wedding',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya ingin booking fotografer wedding',
            buttonText: 'Booking Sekarang',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'Photography'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Fotografer Wedding',
          description: 'Capturing your precious moments'
        }
      },
      isPaid: true,
      priceCents: 1500,
      requiredFeatures: ['premium-templates']
    }
  },

  // ============================================
  // EVENT TEMPLATES
  // ============================================
  {
    slug: 'wedding-organizer-elegant',
    name: 'Wedding Organizer Elegant',
    description: 'Template elegant untuk wedding organizer dengan portfolio',
    category: 'premium',
    primaryCategory: 'event',
    subCategory: 'wedding-organizer',
    status: 'PUBLISHED' as const,
    manifest: {
      name: 'Wedding Organizer Elegant',
      version: '1.0.0',
      description: 'Template elegant untuk wedding organizer dengan portfolio',
      thumbnail: '/templates/wedding-organizer-thumb.jpg',
      layout: {
        header: ['bio'],
        body: ['gallery', 'divider', 'link-list', 'divider', 'qris-payment', 'divider', 'location'],
        footer: ['whatsapp-business', 'social-icons']
      },
      allowedBlocks: ['bio', 'gallery', 'link-list', 'social-icons', 'qris-payment', 'location', 'whatsapp-business', 'divider'],
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
            avatarSize: 'xxl',
            avatarStyle: 'flower',
            nameStyle: 'script-handwritten',
            bioStyle: 'quote',
            textAlign: 'center',
            spacing: 'wide'
          },
          'gallery': {
            layout: 'carousel',
            columns: 1,
            gap: 'lg',
            rounded: true
          },
          'link-list': {
            style: 'glass',
            gap: 'lg'
          },
          'qris-payment': {
            qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_WEDDING_ORGANIZER',
            merchantName: 'Wedding Organizer Elegant',
            paymentMethods: ['Gopay', 'OVO', 'Dana', 'ShopeePay', 'LinkAja'],
            instructions: 'Transfer DP via QRIS atau transfer bank. Minimal DP 30% dari total paket',
            showPaymentLogos: true,
            presetAmounts: [5000000, 10000000, 20000000, 50000000],
            allowCustomAmount: true
          },
          'location': {
            googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1753924',
            address: 'Jl. Office No. 999, Jakarta',
            phone: '0812-9999-8888',
            openingHours: [
              { day: 'Senin - Sabtu', hours: '09:00 - 20:00' },
              { day: 'Minggu', hours: 'By Appointment' }
            ],
            locationName: 'Wedding Organizer Office',
            showDirectionsButton: true,
            showCurrentStatus: true,
            mapHeight: 300
          },
          'whatsapp-business': {
            phoneNumber: '081234567890',
            message: 'Halo, saya ingin konsultasi wedding package',
            buttonText: 'Konsultasi Gratis',
            buttonStyle: 'fab',
            fabPosition: 'bottom-right',
            fabSize: 'large',
            enablePulse: true,
            expandOnHover: true,
            showIcon: true,
            showLabel: true,
            businessName: 'WO'
          },
          'social-icons': {
            size: 'lg',
            style: 'rounded'
          }
        },
        meta: {
          title: 'Wedding Organizer',
          description: 'Making your dream wedding come true'
        }
      },
      isPaid: true,
      priceCents: 1800,
      requiredFeatures: ['premium-templates']
    }
  }
]
