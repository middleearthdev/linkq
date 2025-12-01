/**
 * Template Category System
 * Industry-specific categories for Indonesian market
 */

export type TemplateCategoryId =
  | 'creator'
  | 'umkm'
  | 'fnb'
  | 'skincare'
  | 'photography'
  | 'event'
  | 'portfolio'
  | 'affiliate'

export type TemplateSubCategoryId =
  // Creator
  | 'beauty-creator'
  | 'food-creator'
  | 'tech-reviewer'
  | 'lifestyle'
  | 'travel'
  // UMKM
  | 'fashion-umkm'
  | 'food-seller'
  | 'handicraft'
  | 'service-business'
  | 'dropship'
  // F&B
  | 'cafe'
  | 'restaurant'
  | 'food-delivery'
  | 'catering'
  | 'bakery'
  // Skincare
  | 'skincare-brand'
  | 'makeup-brand'
  | 'haircare-brand'
  | 'beauty-service'
  // Photography
  | 'wedding-photo'
  | 'product-photo'
  | 'event-photo'
  | 'videography'
  // Event
  | 'wedding-organizer'
  | 'venue'
  | 'decoration'
  | 'mua'
  | 'catering-event'
  // Portfolio
  | 'designer'
  | 'developer'
  | 'writer'
  | 'marketer'
  | 'consultant'
  // Affiliate
  | 'product-review'
  | 'deal-hunter'
  | 'coupon'
  | 'shopping-guide'

export interface LocalizedText {
  en: string
  id: string
}

export interface SubCategory {
  id: TemplateSubCategoryId
  name: LocalizedText
  description?: LocalizedText
  icon?: string
}

export interface TemplateCategory {
  id: TemplateCategoryId
  name: LocalizedText
  description: LocalizedText
  icon: string
  color: string
  gradient: string
  subCategories: SubCategory[]
  features: string[]
  targetAudience: LocalizedText[]
  popularTemplates?: string[] // Template slugs
  sampleUseCase: LocalizedText
  keywords: string[]
  marketSize?: string
  sortOrder: number
}

// Category Definitions
export const TEMPLATE_CATEGORIES: Record<TemplateCategoryId, TemplateCategory> = {
  creator: {
    id: 'creator',
    name: {
      en: 'Creator & Influencer',
      id: 'Kreator & Influencer'
    },
    description: {
      en: 'Perfect for content creators, influencers, and digital personalities who want to showcase their content and monetize their following',
      id: 'Sempurna untuk kreator konten, influencer, dan digital personality yang ingin showcase konten dan monetisasi follower'
    },
    icon: '🎨',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
    subCategories: [
      {
        id: 'beauty-creator',
        name: { en: 'Beauty Creator', id: 'Beauty Creator' },
        description: {
          en: 'Makeup tutorials, skincare reviews, beauty tips',
          id: 'Tutorial makeup, review skincare, tips kecantikan'
        },
        icon: '💄'
      },
      {
        id: 'food-creator',
        name: { en: 'Food Blogger', id: 'Food Blogger' },
        description: {
          en: 'Food reviews, recipes, restaurant recommendations',
          id: 'Review kuliner, resep, rekomendasi restoran'
        },
        icon: '🍔'
      },
      {
        id: 'tech-reviewer',
        name: { en: 'Tech Reviewer', id: 'Reviewer Gadget' },
        description: {
          en: 'Gadget reviews, tech tutorials, unboxing',
          id: 'Review gadget, tutorial teknologi, unboxing'
        },
        icon: '📱'
      },
      {
        id: 'lifestyle',
        name: { en: 'Lifestyle', id: 'Lifestyle' },
        description: {
          en: 'Daily life, fashion, personal vlogs',
          id: 'Kehidupan sehari-hari, fashion, personal vlog'
        },
        icon: '✨'
      },
      {
        id: 'travel',
        name: { en: 'Travel Blogger', id: 'Travel Blogger' },
        description: {
          en: 'Travel guides, destination reviews, travel tips',
          id: 'Panduan wisata, review destinasi, tips traveling'
        },
        icon: '✈️'
      }
    ],
    features: [
      'Social media embeds',
      'TikTok Shop integration',
      'Affiliate link management',
      'Brand collaboration showcase',
      'Content portfolio',
      'Click analytics'
    ],
    targetAudience: [
      { en: 'Content Creators', id: 'Kreator Konten' },
      { en: 'Influencers', id: 'Influencer' },
      { en: 'YouTubers', id: 'YouTuber' },
      { en: 'TikTokers', id: 'TikToker' },
      { en: 'Instagrammers', id: 'Instagrammer' }
    ],
    sampleUseCase: {
      en: 'Beauty influencer showcasing product reviews, tutorials, and affiliate links',
      id: 'Beauty influencer yang showcase review produk, tutorial, dan link affiliate'
    },
    keywords: ['creator', 'influencer', 'content', 'social media', 'tiktok', 'instagram', 'youtube'],
    marketSize: '10M+ creators in Indonesia',
    sortOrder: 1
  },

  umkm: {
    id: 'umkm',
    name: {
      en: 'UMKM & Online Shop',
      id: 'UMKM & Toko Online'
    },
    description: {
      en: 'Digital storefront for small businesses and online sellers. Perfect for those selling on Instagram, WhatsApp, or marketplaces',
      id: 'Etalase digital untuk usaha kecil dan penjual online. Cocok untuk yang jualan di Instagram, WhatsApp, atau marketplace'
    },
    icon: '🏪',
    color: '#10B981',
    gradient: 'from-green-500 to-emerald-500',
    subCategories: [
      {
        id: 'fashion-umkm',
        name: { en: 'Fashion & Apparel', id: 'Fashion & Pakaian' },
        description: {
          en: 'Clothing, accessories, shoes, bags',
          id: 'Pakaian, aksesoris, sepatu, tas'
        },
        icon: '👗'
      },
      {
        id: 'food-seller',
        name: { en: 'Food Seller', id: 'Penjual Makanan' },
        description: {
          en: 'Homemade food, snacks, frozen food',
          id: 'Makanan rumahan, snack, frozen food'
        },
        icon: '🍱'
      },
      {
        id: 'handicraft',
        name: { en: 'Handicraft', id: 'Kerajinan' },
        description: {
          en: 'Handmade products, crafts, art',
          id: 'Produk handmade, kerajinan, seni'
        },
        icon: '🎨'
      },
      {
        id: 'service-business',
        name: { en: 'Service Business', id: 'Bisnis Jasa' },
        description: {
          en: 'Services, consultation, freelance work',
          id: 'Layanan jasa, konsultasi, freelance'
        },
        icon: '🔧'
      },
      {
        id: 'dropship',
        name: { en: 'Dropship/Reseller', id: 'Dropship/Reseller' },
        description: {
          en: 'Dropshipping, reselling products',
          id: 'Dropship, reseller produk'
        },
        icon: '📦'
      }
    ],
    features: [
      'WhatsApp Business link',
      'Tokopedia/Shopee integration',
      'Product gallery',
      'Customer testimonials',
      'QRIS payment',
      'Store location (Google Maps)'
    ],
    targetAudience: [
      { en: 'Small Business Owners', id: 'Pemilik Usaha Kecil' },
      { en: 'Online Sellers', id: 'Penjual Online' },
      { en: 'Instagram Sellers', id: 'Penjual Instagram' },
      { en: 'Marketplace Sellers', id: 'Penjual Marketplace' },
      { en: 'Entrepreneurs', id: 'Pengusaha' }
    ],
    sampleUseCase: {
      en: 'Fashion online shop showcasing products with direct links to WhatsApp order and marketplace stores',
      id: 'Toko online fashion yang showcase produk dengan link langsung ke order WhatsApp dan toko marketplace'
    },
    keywords: ['umkm', 'toko online', 'online shop', 'bisnis', 'usaha', 'jualan', 'marketplace'],
    marketSize: '19M+ digital UMKM in Indonesia',
    sortOrder: 2
  },

  fnb: {
    id: 'fnb',
    name: {
      en: 'F&B & Restaurant',
      id: 'F&B & Restoran'
    },
    description: {
      en: 'Digital menu and online presence for food & beverage businesses. Perfect for cafes, restaurants, and food delivery services',
      id: 'Menu digital dan online presence untuk bisnis kuliner. Cocok untuk cafe, restoran, dan layanan delivery makanan'
    },
    icon: '🍽️',
    color: '#F59E0B',
    gradient: 'from-orange-500 to-red-500',
    subCategories: [
      {
        id: 'cafe',
        name: { en: 'Cafe', id: 'Kafe' },
        description: {
          en: 'Coffee shop, tea house, dessert cafe',
          id: 'Coffee shop, kedai teh, dessert cafe'
        },
        icon: '☕'
      },
      {
        id: 'restaurant',
        name: { en: 'Restaurant', id: 'Restoran' },
        description: {
          en: 'Dining restaurants, bistro, fine dining',
          id: 'Restoran makan, bistro, fine dining'
        },
        icon: '🍴'
      },
      {
        id: 'food-delivery',
        name: { en: 'Food Delivery', id: 'Delivery Makanan' },
        description: {
          en: 'Delivery-only, cloud kitchen, ghost kitchen',
          id: 'Khusus delivery, cloud kitchen, ghost kitchen'
        },
        icon: '🚚'
      },
      {
        id: 'catering',
        name: { en: 'Catering', id: 'Katering' },
        description: {
          en: 'Event catering, party catering, corporate catering',
          id: 'Katering acara, pesta, corporate'
        },
        icon: '🍱'
      },
      {
        id: 'bakery',
        name: { en: 'Bakery & Pastry', id: 'Toko Roti & Kue' },
        description: {
          en: 'Bakery, cake shop, pastry',
          id: 'Toko roti, toko kue, pastry'
        },
        icon: '🍰'
      }
    ],
    features: [
      'Digital menu with photos',
      'GoFood/GrabFood/ShopeeFood links',
      'WhatsApp order',
      'Opening hours display',
      'Location (Google Maps)',
      'Promo/event banner',
      'Gallery showcase'
    ],
    targetAudience: [
      { en: 'Restaurant Owners', id: 'Pemilik Restoran' },
      { en: 'Cafe Owners', id: 'Pemilik Kafe' },
      { en: 'Food Business', id: 'Bisnis Kuliner' },
      { en: 'Catering Services', id: 'Layanan Katering' },
      { en: 'Cloud Kitchen', id: 'Cloud Kitchen' }
    ],
    sampleUseCase: {
      en: 'Cafe with digital menu, delivery links, and location map for easy customer access',
      id: 'Kafe dengan menu digital, link delivery, dan peta lokasi untuk akses customer yang mudah'
    },
    keywords: ['fnb', 'restaurant', 'cafe', 'food', 'kuliner', 'menu', 'delivery', 'gofood', 'grabfood'],
    marketSize: '8M+ F&B businesses in Indonesia',
    sortOrder: 3
  },

  skincare: {
    id: 'skincare',
    name: {
      en: 'Skincare & Beauty',
      id: 'Skincare & Kecantikan'
    },
    description: {
      en: 'Professional showcase for beauty brands, skincare lines, and beauty services with product information and testimonials',
      id: 'Showcase profesional untuk brand kecantikan, produk skincare, dan layanan kecantikan dengan info produk dan testimoni'
    },
    icon: '💄',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    subCategories: [
      {
        id: 'skincare-brand',
        name: { en: 'Skincare Brand', id: 'Brand Skincare' },
        description: {
          en: 'Skincare products, facial care, body care',
          id: 'Produk skincare, perawatan wajah, perawatan tubuh'
        },
        icon: '🧴'
      },
      {
        id: 'makeup-brand',
        name: { en: 'Makeup Brand', id: 'Brand Makeup' },
        description: {
          en: 'Cosmetics, makeup products, color cosmetics',
          id: 'Kosmetik, produk makeup, color cosmetics'
        },
        icon: '💄'
      },
      {
        id: 'haircare-brand',
        name: { en: 'Haircare Brand', id: 'Brand Haircare' },
        description: {
          en: 'Hair products, hair treatment, styling',
          id: 'Produk rambut, perawatan rambut, styling'
        },
        icon: '💇'
      },
      {
        id: 'beauty-service',
        name: { en: 'Beauty Service', id: 'Layanan Kecantikan' },
        description: {
          en: 'Salon, spa, beauty clinic, MUA',
          id: 'Salon, spa, klinik kecantikan, MUA'
        },
        icon: '💅'
      }
    ],
    features: [
      'Product showcase',
      'Ingredients information',
      'Before/after gallery',
      'Customer testimonials',
      'BPOM certification badge',
      'Official store links',
      'Reseller network'
    ],
    targetAudience: [
      { en: 'Beauty Brand Owners', id: 'Owner Brand Kecantikan' },
      { en: 'Skincare Entrepreneurs', id: 'Pengusaha Skincare' },
      { en: 'Beauty Services', id: 'Layanan Kecantikan' },
      { en: 'Makeup Artists', id: 'Makeup Artist' },
      { en: 'Beauty Resellers', id: 'Reseller Kecantikan' }
    ],
    sampleUseCase: {
      en: 'Skincare brand showcasing product line, ingredients, testimonials, and BPOM certification',
      id: 'Brand skincare yang showcase produk, ingredients, testimoni, dan sertifikasi BPOM'
    },
    keywords: ['skincare', 'beauty', 'kecantikan', 'makeup', 'kosmetik', 'bpom', 'perawatan'],
    marketSize: '2M+ beauty brands in Indonesia',
    sortOrder: 4
  },

  photography: {
    id: 'photography',
    name: {
      en: 'Photography & Video',
      id: 'Fotografi & Video'
    },
    description: {
      en: 'Portfolio showcase for photographers and videographers with galleries, packages, and booking options',
      id: 'Showcase portfolio untuk fotografer dan videografer dengan galeri, paket, dan opsi booking'
    },
    icon: '📸',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    subCategories: [
      {
        id: 'wedding-photo',
        name: { en: 'Wedding Photography', id: 'Fotografi Wedding' },
        description: {
          en: 'Wedding photos, pre-wedding, engagement',
          id: 'Foto pernikahan, pre-wedding, lamaran'
        },
        icon: '💍'
      },
      {
        id: 'product-photo',
        name: { en: 'Product Photography', id: 'Fotografi Produk' },
        description: {
          en: 'Product photos, commercial, e-commerce',
          id: 'Foto produk, komersial, e-commerce'
        },
        icon: '📦'
      },
      {
        id: 'event-photo',
        name: { en: 'Event Photography', id: 'Fotografi Event' },
        description: {
          en: 'Event coverage, corporate, concert',
          id: 'Liputan event, corporate, konser'
        },
        icon: '🎉'
      },
      {
        id: 'videography',
        name: { en: 'Videography', id: 'Videografi' },
        description: {
          en: 'Video production, cinematic video, short film',
          id: 'Produksi video, video sinematik, film pendek'
        },
        icon: '🎥'
      }
    ],
    features: [
      'Portfolio gallery',
      'Service packages',
      'Client testimonials',
      'Booking/inquiry form',
      'Instagram integration',
      'Pricing display',
      'Past projects showcase'
    ],
    targetAudience: [
      { en: 'Photographers', id: 'Fotografer' },
      { en: 'Videographers', id: 'Videografer' },
      { en: 'Creative Studios', id: 'Studio Kreatif' },
      { en: 'Freelance Creatives', id: 'Freelance Kreatif' }
    ],
    sampleUseCase: {
      en: 'Wedding photographer showcasing portfolio, packages, testimonials, and easy booking',
      id: 'Fotografer wedding yang showcase portfolio, paket, testimoni, dan booking mudah'
    },
    keywords: ['photography', 'fotografi', 'videography', 'video', 'foto', 'wedding', 'product'],
    marketSize: '1.5M+ photographers in Indonesia',
    sortOrder: 5
  },

  event: {
    id: 'event',
    name: {
      en: 'Event & Wedding',
      id: 'Event & Pernikahan'
    },
    description: {
      en: 'Professional showcase for wedding vendors and event organizers with portfolio, packages, and testimonials',
      id: 'Showcase profesional untuk vendor wedding dan event organizer dengan portfolio, paket, dan testimoni'
    },
    icon: '💍',
    color: '#F472B6',
    gradient: 'from-pink-400 to-purple-500',
    subCategories: [
      {
        id: 'wedding-organizer',
        name: { en: 'Wedding Organizer', id: 'Wedding Organizer' },
        description: {
          en: 'Wedding planning, coordination, management',
          id: 'Perencanaan wedding, koordinasi, manajemen'
        },
        icon: '💐'
      },
      {
        id: 'venue',
        name: { en: 'Venue', id: 'Venue' },
        description: {
          en: 'Wedding venue, event space, ballroom',
          id: 'Venue wedding, ruang event, ballroom'
        },
        icon: '🏛️'
      },
      {
        id: 'decoration',
        name: { en: 'Decoration', id: 'Dekorasi' },
        description: {
          en: 'Event decoration, wedding decoration, styling',
          id: 'Dekorasi event, dekorasi wedding, styling'
        },
        icon: '🎀'
      },
      {
        id: 'mua',
        name: { en: 'Makeup Artist', id: 'Makeup Artist' },
        description: {
          en: 'Bridal makeup, party makeup, hair styling',
          id: 'Makeup pengantin, makeup pesta, hair styling'
        },
        icon: '💄'
      },
      {
        id: 'catering-event',
        name: { en: 'Catering', id: 'Katering' },
        description: {
          en: 'Wedding catering, event catering, buffet',
          id: 'Katering wedding, katering event, prasmanan'
        },
        icon: '🍽️'
      }
    ],
    features: [
      'Portfolio gallery',
      'Real event showcase',
      'Service packages',
      'Client testimonials',
      'Contact form',
      'Price range display',
      'Featured media mentions'
    ],
    targetAudience: [
      { en: 'Wedding Organizers', id: 'Wedding Organizer' },
      { en: 'Event Vendors', id: 'Vendor Event' },
      { en: 'Venue Owners', id: 'Pemilik Venue' },
      { en: 'Decoration Services', id: 'Jasa Dekorasi' },
      { en: 'Catering Services', id: 'Jasa Katering' }
    ],
    sampleUseCase: {
      en: 'Wedding organizer displaying past weddings, packages, reviews, and easy inquiry process',
      id: 'Wedding organizer yang tampilkan wedding sebelumnya, paket, review, dan proses inquiry mudah'
    },
    keywords: ['wedding', 'event', 'pernikahan', 'organizer', 'venue', 'decoration', 'catering'],
    marketSize: '500K+ wedding vendors in Indonesia',
    sortOrder: 6
  },

  portfolio: {
    id: 'portfolio',
    name: {
      en: 'Portfolio & Professional',
      id: 'Portfolio & Profesional'
    },
    description: {
      en: 'Professional portfolio for freelancers, job seekers, and consultants to showcase skills and experience',
      id: 'Portfolio profesional untuk freelancer, pencari kerja, dan konsultan untuk showcase skill dan pengalaman'
    },
    icon: '💼',
    color: '#6B7280',
    gradient: 'from-gray-600 to-slate-700',
    subCategories: [
      {
        id: 'designer',
        name: { en: 'Designer', id: 'Desainer' },
        description: {
          en: 'UI/UX designer, graphic designer, illustrator',
          id: 'UI/UX designer, graphic designer, illustrator'
        },
        icon: '🎨'
      },
      {
        id: 'developer',
        name: { en: 'Developer', id: 'Developer' },
        description: {
          en: 'Web developer, mobile developer, programmer',
          id: 'Web developer, mobile developer, programmer'
        },
        icon: '💻'
      },
      {
        id: 'writer',
        name: { en: 'Writer', id: 'Penulis' },
        description: {
          en: 'Content writer, copywriter, blogger',
          id: 'Content writer, copywriter, blogger'
        },
        icon: '✍️'
      },
      {
        id: 'marketer',
        name: { en: 'Marketer', id: 'Marketer' },
        description: {
          en: 'Digital marketer, social media specialist, SEO',
          id: 'Digital marketer, social media specialist, SEO'
        },
        icon: '📊'
      },
      {
        id: 'consultant',
        name: { en: 'Consultant', id: 'Konsultan' },
        description: {
          en: 'Business consultant, strategy consultant, coach',
          id: 'Konsultan bisnis, konsultan strategi, coach'
        },
        icon: '🎯'
      }
    ],
    features: [
      'Work showcase',
      'Skills & certifications',
      'Experience timeline',
      'Education background',
      'Contact & hire button',
      'LinkedIn/GitHub integration',
      'Resume download'
    ],
    targetAudience: [
      { en: 'Freelancers', id: 'Freelancer' },
      { en: 'Job Seekers', id: 'Pencari Kerja' },
      { en: 'Consultants', id: 'Konsultan' },
      { en: 'Professionals', id: 'Profesional' },
      { en: 'Creative Workers', id: 'Pekerja Kreatif' }
    ],
    sampleUseCase: {
      en: 'UI/UX designer showcasing portfolio projects, skills, experience, and contact for hiring',
      id: 'UI/UX designer yang showcase project portfolio, skill, pengalaman, dan kontak untuk hiring'
    },
    keywords: ['portfolio', 'freelance', 'professional', 'cv', 'resume', 'job', 'career'],
    marketSize: '5M+ freelancers in Indonesia',
    sortOrder: 7
  },

  affiliate: {
    id: 'affiliate',
    name: {
      en: 'Affiliate & Review',
      id: 'Affiliate & Review'
    },
    description: {
      en: 'Organized showcase for affiliate marketers and product reviewers with tracking and product management',
      id: 'Showcase terorganisir untuk affiliate marketer dan product reviewer dengan tracking dan manajemen produk'
    },
    icon: '🛍️',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-green-500',
    subCategories: [
      {
        id: 'product-review',
        name: { en: 'Product Review', id: 'Review Produk' },
        description: {
          en: 'Product reviews, unboxing, comparisons',
          id: 'Review produk, unboxing, perbandingan'
        },
        icon: '⭐'
      },
      {
        id: 'deal-hunter',
        name: { en: 'Deal Hunter', id: 'Pemburu Diskon' },
        description: {
          en: 'Deals, discounts, flash sales',
          id: 'Promo, diskon, flash sale'
        },
        icon: '🔥'
      },
      {
        id: 'coupon',
        name: { en: 'Coupon & Voucher', id: 'Kupon & Voucher' },
        description: {
          en: 'Discount codes, coupons, vouchers',
          id: 'Kode diskon, kupon, voucher'
        },
        icon: '🎟️'
      },
      {
        id: 'shopping-guide',
        name: { en: 'Shopping Guide', id: 'Panduan Belanja' },
        description: {
          en: 'Shopping recommendations, buying guides',
          id: 'Rekomendasi belanja, panduan membeli'
        },
        icon: '🛒'
      }
    ],
    features: [
      'Product showcase',
      'Affiliate link management',
      'Click tracking',
      'Deal/promo highlight',
      'Product categories',
      'Search function',
      'Analytics dashboard'
    ],
    targetAudience: [
      { en: 'Affiliate Marketers', id: 'Affiliate Marketer' },
      { en: 'Product Reviewers', id: 'Product Reviewer' },
      { en: 'Deal Hunters', id: 'Pemburu Diskon' },
      { en: 'Shopping Influencers', id: 'Shopping Influencer' }
    ],
    sampleUseCase: {
      en: 'Product reviewer organizing affiliate links by category with tracking and easy updates',
      id: 'Product reviewer yang organize link affiliate per kategori dengan tracking dan update mudah'
    },
    keywords: ['affiliate', 'review', 'product', 'deal', 'promo', 'discount', 'shopping'],
    marketSize: '2M+ affiliate marketers in Indonesia',
    sortOrder: 8
  }
}

// Helper functions
export function getCategoryById(categoryId: TemplateCategoryId): TemplateCategory | undefined {
  return TEMPLATE_CATEGORIES[categoryId]
}

export function getAllCategories(): TemplateCategory[] {
  return Object.values(TEMPLATE_CATEGORIES).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getCategoryName(categoryId: TemplateCategoryId, locale: 'en' | 'id' = 'id'): string {
  const category = getCategoryById(categoryId)
  return category ? category.name[locale] : categoryId
}

export function getCategoriesByIds(categoryIds: TemplateCategoryId[]): TemplateCategory[] {
  return categoryIds
    .map(id => getCategoryById(id))
    .filter((cat): cat is TemplateCategory => cat !== undefined)
}

export function searchCategories(query: string, locale: 'en' | 'id' = 'id'): TemplateCategory[] {
  const lowerQuery = query.toLowerCase()
  return getAllCategories().filter(category => {
    const nameMatch = category.name[locale].toLowerCase().includes(lowerQuery)
    const descMatch = category.description[locale].toLowerCase().includes(lowerQuery)
    const keywordMatch = category.keywords.some(keyword => keyword.includes(lowerQuery))
    return nameMatch || descMatch || keywordMatch
  })
}

// Get categories by target audience
export function getCategoriesByAudience(audience: string, locale: 'en' | 'id' = 'id'): TemplateCategory[] {
  const lowerAudience = audience.toLowerCase()
  return getAllCategories().filter(category =>
    category.targetAudience.some(ta => ta[locale].toLowerCase().includes(lowerAudience))
  )
}
