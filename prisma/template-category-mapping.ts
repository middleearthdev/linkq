/**
 * Template to Category Mapping
 * Maps existing templates to industry-specific categories
 */

export const TEMPLATE_CATEGORY_MAPPING: Record<string, {
  primaryCategory: string
  subCategory?: string
  industryTags: string[]
  targetAudience: string[]
  recommendedFor: string[]
  includesFeatures: string[]
  localizedName: { en: string; id: string }
  localizedDesc: { en: string; id: string }
}> = {
  'minimal': {
    primaryCategory: 'portfolio',
    subCategory: 'designer',
    industryTags: ['professional', 'clean', 'modern'],
    targetAudience: ['freelancer', 'professional', 'job-seeker'],
    recommendedFor: ['portfolio', 'personal-brand', 'freelance'],
    includesFeatures: ['bio', 'link-list', 'social-icons', 'clean-design'],
    localizedName: {
      en: 'Minimal Professional',
      id: 'Profesional Minimalis'
    },
    localizedDesc: {
      en: 'Clean and simple design perfect for professionals and freelancers',
      id: 'Desain bersih dan simple sempurna untuk profesional dan freelancer'
    }
  },

  'modern': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['modern', 'dark', 'elegant'],
    targetAudience: ['creator', 'influencer', 'content-creator'],
    recommendedFor: ['content-creator', 'personal-brand', 'influencer'],
    includesFeatures: ['bio', 'link-list', 'social-icons', 'dark-mode'],
    localizedName: {
      en: 'Modern Creator',
      id: 'Kreator Modern'
    },
    localizedDesc: {
      en: 'Sleek dark design perfect for content creators and influencers',
      id: 'Desain dark yang sleek sempurna untuk kreator konten dan influencer'
    }
  },

  'professional': {
    primaryCategory: 'portfolio',
    subCategory: 'consultant',
    industryTags: ['professional', 'corporate', 'business'],
    targetAudience: ['professional', 'consultant', 'business'],
    recommendedFor: ['corporate', 'consulting', 'professional-services'],
    includesFeatures: ['bio', 'link-list', 'analytics', 'custom-domain'],
    localizedName: {
      en: 'Professional Business',
      id: 'Bisnis Profesional'
    },
    localizedDesc: {
      en: 'Corporate design with advanced analytics for business professionals',
      id: 'Desain korporat dengan analytics canggih untuk profesional bisnis'
    }
  },

  'cosmic-gradient': {
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    industryTags: ['gradient', 'futuristic', 'tech', 'gaming'],
    targetAudience: ['creator', 'tech-reviewer', 'gamer', 'influencer'],
    recommendedFor: ['tech-content', 'gaming', 'modern-creator'],
    includesFeatures: ['gradient-background', 'hologram-links', 'social-icons'],
    localizedName: {
      en: 'Cosmic Tech Creator',
      id: 'Kreator Tech Cosmic'
    },
    localizedDesc: {
      en: 'Futuristic gradient design perfect for tech reviewers and gamers',
      id: 'Desain gradient futuristik sempurna untuk tech reviewer dan gamer'
    }
  },

  'retro-synthwave': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['retro', 'neon', '80s', 'music'],
    targetAudience: ['creator', 'influencer', 'musician'],
    recommendedFor: ['music-creator', 'retro-aesthetic', 'neon-theme'],
    includesFeatures: ['neon-effects', 'gradient-background', 'social-media'],
    localizedName: {
      en: 'Retro Synthwave Creator',
      id: 'Kreator Retro Synthwave'
    },
    localizedDesc: {
      en: 'Nostalgic 80s synthwave aesthetic for music and lifestyle creators',
      id: 'Estetika synthwave 80s nostalgia untuk kreator musik dan lifestyle'
    }
  },

  'forest-nature': {
    primaryCategory: 'umkm',
    subCategory: 'handicraft',
    industryTags: ['nature', 'eco-friendly', 'organic', 'green'],
    targetAudience: ['small-business', 'eco-brand', 'natural-products'],
    recommendedFor: ['eco-business', 'natural-products', 'green-brand'],
    includesFeatures: ['product-showcase', 'whatsapp', 'natural-theme'],
    localizedName: {
      en: 'Nature & Eco Business',
      id: 'Bisnis Alam & Eco'
    },
    localizedDesc: {
      en: 'Eco-friendly green theme perfect for natural and organic businesses',
      id: 'Tema hijau eco-friendly sempurna untuk bisnis natural dan organik'
    }
  },

  'ocean-waves': {
    primaryCategory: 'creator',
    subCategory: 'travel',
    industryTags: ['ocean', 'blue', 'travel', 'beach'],
    targetAudience: ['travel-blogger', 'creator', 'lifestyle'],
    recommendedFor: ['travel-content', 'beach-lifestyle', 'ocean-theme'],
    includesFeatures: ['bubble-links', 'photo-gallery', 'social-media'],
    localizedName: {
      en: 'Ocean Travel Creator',
      id: 'Kreator Travel Laut'
    },
    localizedDesc: {
      en: 'Serene ocean theme perfect for travel bloggers and beach lifestyle',
      id: 'Tema laut yang serene sempurna untuk travel blogger dan beach lifestyle'
    }
  },

  'sunset-desert': {
    primaryCategory: 'creator',
    subCategory: 'travel',
    industryTags: ['sunset', 'warm', 'adventure', 'travel'],
    targetAudience: ['travel-blogger', 'adventurer', 'creator'],
    recommendedFor: ['travel-content', 'adventure', 'outdoor'],
    includesFeatures: ['warm-colors', 'photo-gallery', 'social-media'],
    localizedName: {
      en: 'Desert Adventure Creator',
      id: 'Kreator Petualangan Gurun'
    },
    localizedDesc: {
      en: 'Warm sunset theme for adventure and travel content creators',
      id: 'Tema sunset hangat untuk kreator konten petualangan dan travel'
    }
  },

  'midnight-gamer': {
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    industryTags: ['gaming', 'dark', 'neon', 'tech'],
    targetAudience: ['gamer', 'streamer', 'esports'],
    recommendedFor: ['gaming-content', 'streaming', 'esports'],
    includesFeatures: ['gaming-theme', 'dark-mode', 'rgb-effects'],
    localizedName: {
      en: 'Gaming & Esports Creator',
      id: 'Kreator Gaming & Esports'
    },
    localizedDesc: {
      en: 'RGB gaming theme perfect for gamers, streamers, and esports',
      id: 'Tema gaming RGB sempurna untuk gamer, streamer, dan esports'
    }
  },

  'marble-luxury': {
    primaryCategory: 'skincare',
    subCategory: 'skincare-brand',
    industryTags: ['luxury', 'premium', 'elegant', 'beauty'],
    targetAudience: ['beauty-brand', 'luxury-brand', 'premium-products'],
    recommendedFor: ['luxury-brand', 'premium-products', 'high-end'],
    includesFeatures: ['premium-design', 'product-showcase', 'testimonials'],
    localizedName: {
      en: 'Luxury Beauty Brand',
      id: 'Brand Kecantikan Mewah'
    },
    localizedDesc: {
      en: 'Elegant marble theme for luxury beauty and skincare brands',
      id: 'Tema marmer elegan untuk brand kecantikan dan skincare mewah'
    }
  },

  'sakura-zen': {
    primaryCategory: 'skincare',
    subCategory: 'skincare-brand',
    industryTags: ['japanese', 'minimal', 'zen', 'beauty'],
    targetAudience: ['beauty-brand', 'skincare', 'wellness'],
    recommendedFor: ['skincare-brand', 'wellness', 'beauty-products'],
    includesFeatures: ['minimal-design', 'product-showcase', 'soft-colors'],
    localizedName: {
      en: 'Zen Skincare Brand',
      id: 'Brand Skincare Zen'
    },
    localizedDesc: {
      en: 'Japanese-inspired zen theme for skincare and wellness brands',
      id: 'Tema zen inspirasi Jepang untuk brand skincare dan wellness'
    }
  },

  'electric-music': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['music', 'vibrant', 'electric', 'entertainment'],
    targetAudience: ['musician', 'dj', 'music-creator'],
    recommendedFor: ['music-creator', 'dj', 'entertainment'],
    includesFeatures: ['vibrant-colors', 'social-media', 'music-links'],
    localizedName: {
      en: 'Music & Entertainment',
      id: 'Musik & Hiburan'
    },
    localizedDesc: {
      en: 'Vibrant electric theme for musicians and entertainment creators',
      id: 'Tema electric vibrant untuk musisi dan kreator hiburan'
    }
  },

  'arctic-ice': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['minimal', 'cool', 'ice', 'clean'],
    targetAudience: ['creator', 'influencer', 'minimal-aesthetic'],
    recommendedFor: ['minimal-content', 'clean-aesthetic', 'ice-theme'],
    includesFeatures: ['glass-effect', 'minimal-design', 'cool-colors'],
    localizedName: {
      en: 'Arctic Minimal Creator',
      id: 'Kreator Minimalis Arctic'
    },
    localizedDesc: {
      en: 'Cool arctic theme with glass effects for minimal aesthetic',
      id: 'Tema arctic sejuk dengan efek kaca untuk estetika minimal'
    }
  },

  'space-explorer': {
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    industryTags: ['space', 'tech', 'futuristic', 'science'],
    targetAudience: ['tech-creator', 'science', 'educator'],
    recommendedFor: ['tech-content', 'science', 'education'],
    includesFeatures: ['space-theme', 'dark-mode', 'modern-design'],
    localizedName: {
      en: 'Space & Tech Explorer',
      id: 'Penjelajah Ruang & Tech'
    },
    localizedDesc: {
      en: 'Deep space theme for tech and science content creators',
      id: 'Tema luar angkasa dalam untuk kreator konten tech dan sains'
    }
  },

  'tropical-paradise': {
    primaryCategory: 'fnb',
    subCategory: 'cafe',
    industryTags: ['tropical', 'beach', 'cafe', 'vacation'],
    targetAudience: ['cafe-owner', 'beach-cafe', 'tropical-theme'],
    recommendedFor: ['beach-cafe', 'tropical-restaurant', 'vacation-spot'],
    includesFeatures: ['menu-digital', 'location', 'whatsapp-order', 'tropical-theme'],
    localizedName: {
      en: 'Tropical Beach Cafe',
      id: 'Kafe Pantai Tropis'
    },
    localizedDesc: {
      en: 'Tropical paradise theme perfect for beach cafes and vacation spots',
      id: 'Tema paradise tropis sempurna untuk kafe pantai dan tempat liburan'
    }
  },

  'mountain-landscape': {
    primaryCategory: 'photography',
    subCategory: 'event-photo',
    industryTags: ['nature', 'photography', 'landscape', 'outdoor'],
    targetAudience: ['photographer', 'nature-photographer', 'outdoor'],
    recommendedFor: ['photography-portfolio', 'nature-photography', 'outdoor'],
    includesFeatures: ['portfolio-gallery', 'photo-showcase', 'booking'],
    localizedName: {
      en: 'Nature Photography',
      id: 'Fotografi Alam'
    },
    localizedDesc: {
      en: 'Mountain landscape theme for nature and outdoor photographers',
      id: 'Tema landscape gunung untuk fotografer alam dan outdoor'
    }
  },

  'restaurant-menu': {
    primaryCategory: 'fnb',
    subCategory: 'restaurant',
    industryTags: ['restaurant', 'food', 'menu', 'dining'],
    targetAudience: ['restaurant-owner', 'food-business', 'dining'],
    recommendedFor: ['restaurant', 'fine-dining', 'food-business'],
    includesFeatures: ['digital-menu', 'food-photos', 'delivery-links', 'reservation'],
    localizedName: {
      en: 'Restaurant & Dining',
      id: 'Restoran & Kuliner'
    },
    localizedDesc: {
      en: 'Professional menu theme for restaurants and dining establishments',
      id: 'Tema menu profesional untuk restoran dan tempat makan'
    }
  },

  'wedding-event': {
    primaryCategory: 'event',
    subCategory: 'wedding-organizer',
    industryTags: ['wedding', 'event', 'elegant', 'romantic'],
    targetAudience: ['wedding-organizer', 'event-vendor', 'wedding-service'],
    recommendedFor: ['wedding-planning', 'event-organization', 'wedding-vendor'],
    includesFeatures: ['portfolio-showcase', 'packages', 'testimonials', 'booking'],
    localizedName: {
      en: 'Wedding & Event Organizer',
      id: 'Wedding & Event Organizer'
    },
    localizedDesc: {
      en: 'Romantic elegant theme for wedding organizers and event vendors',
      id: 'Tema elegan romantis untuk wedding organizer dan vendor event'
    }
  },

  'fitness-energy': {
    primaryCategory: 'umkm',
    subCategory: 'service-business',
    industryTags: ['fitness', 'health', 'energy', 'sports'],
    targetAudience: ['fitness-trainer', 'gym-owner', 'health-coach'],
    recommendedFor: ['fitness-business', 'gym', 'health-coaching'],
    includesFeatures: ['service-showcase', 'booking', 'whatsapp', 'pricing'],
    localizedName: {
      en: 'Fitness & Health Services',
      id: 'Layanan Fitness & Kesehatan'
    },
    localizedDesc: {
      en: 'High-energy theme for fitness trainers and health services',
      id: 'Tema energi tinggi untuk fitness trainer dan layanan kesehatan'
    }
  },

  'coffee-artist': {
    primaryCategory: 'fnb',
    subCategory: 'cafe',
    industryTags: ['coffee', 'cafe', 'artisan', 'cozy'],
    targetAudience: ['cafe-owner', 'coffee-shop', 'barista'],
    recommendedFor: ['coffee-shop', 'artisan-cafe', 'specialty-coffee'],
    includesFeatures: ['menu-digital', 'location', 'whatsapp-order', 'cozy-theme'],
    localizedName: {
      en: 'Coffee Shop & Cafe',
      id: 'Kedai Kopi & Kafe'
    },
    localizedDesc: {
      en: 'Warm cozy theme for coffee shops and artisan cafes',
      id: 'Tema hangat cozy untuk kedai kopi dan kafe artisan'
    }
  },

  'monochrome-artist': {
    primaryCategory: 'portfolio',
    subCategory: 'designer',
    industryTags: ['monochrome', 'minimal', 'art', 'photography'],
    targetAudience: ['artist', 'photographer', 'designer'],
    recommendedFor: ['art-portfolio', 'photography', 'design-showcase'],
    includesFeatures: ['portfolio-gallery', 'minimal-design', 'monochrome'],
    localizedName: {
      en: 'Artist & Photography Portfolio',
      id: 'Portfolio Seniman & Fotografi'
    },
    localizedDesc: {
      en: 'Monochrome minimal theme for artists and photographers',
      id: 'Tema minimal monokrom untuk seniman dan fotografer'
    }
  },

  'student-portfolio': {
    primaryCategory: 'portfolio',
    subCategory: 'designer',
    industryTags: ['student', 'academic', 'portfolio', 'education'],
    targetAudience: ['student', 'graduate', 'job-seeker'],
    recommendedFor: ['student-portfolio', 'job-hunting', 'academic'],
    includesFeatures: ['portfolio-showcase', 'cv-download', 'contact'],
    localizedName: {
      en: 'Student Portfolio',
      id: 'Portfolio Mahasiswa'
    },
    localizedDesc: {
      en: 'Academic portfolio theme for students and fresh graduates',
      id: 'Tema portfolio akademis untuk mahasiswa dan fresh graduate'
    }
  },

  'entrepreneur-startup': {
    primaryCategory: 'umkm',
    subCategory: 'service-business',
    industryTags: ['startup', 'entrepreneur', 'business', 'tech'],
    targetAudience: ['entrepreneur', 'startup-founder', 'business-owner'],
    recommendedFor: ['startup', 'business-pitch', 'entrepreneur'],
    includesFeatures: ['business-showcase', 'contact', 'pitch-deck'],
    localizedName: {
      en: 'Startup & Entrepreneur',
      id: 'Startup & Pengusaha'
    },
    localizedDesc: {
      en: 'Modern theme for startup founders and entrepreneurs',
      id: 'Tema modern untuk founder startup dan pengusaha'
    }
  },

  'developer-tech': {
    primaryCategory: 'portfolio',
    subCategory: 'developer',
    industryTags: ['developer', 'tech', 'coding', 'terminal'],
    targetAudience: ['developer', 'programmer', 'tech-professional'],
    recommendedFor: ['developer-portfolio', 'tech-showcase', 'coding'],
    includesFeatures: ['terminal-theme', 'github-integration', 'project-showcase'],
    localizedName: {
      en: 'Developer & Tech Portfolio',
      id: 'Portfolio Developer & Tech'
    },
    localizedDesc: {
      en: 'Terminal-inspired theme for developers and tech professionals',
      id: 'Tema inspirasi terminal untuk developer dan profesional tech'
    }
  },

  'neon-cyberpunk': {
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    industryTags: ['cyberpunk', 'neon', 'futuristic', 'tech'],
    targetAudience: ['tech-creator', 'gamer', 'cyberpunk-enthusiast'],
    recommendedFor: ['tech-content', 'gaming', 'cyberpunk-aesthetic'],
    includesFeatures: ['neon-effects', 'dark-theme', 'cyberpunk-design'],
    localizedName: {
      en: 'Cyberpunk Tech Creator',
      id: 'Kreator Tech Cyberpunk'
    },
    localizedDesc: {
      en: 'Dark cyberpunk theme with neon effects for tech enthusiasts',
      id: 'Tema cyberpunk gelap dengan efek neon untuk enthusiast tech'
    }
  },

  'aurora': {
    primaryCategory: 'creator',
    subCategory: 'beauty-creator',
    industryTags: ['gradient', 'colorful', 'glassmorphism', 'modern'],
    targetAudience: ['creator', 'influencer', 'beauty-creator'],
    recommendedFor: ['beauty-content', 'lifestyle', 'modern-aesthetic'],
    includesFeatures: ['glassmorphism', 'gradient-background', 'modern-design'],
    localizedName: {
      en: 'Aurora Beauty Creator',
      id: 'Kreator Beauty Aurora'
    },
    localizedDesc: {
      en: 'Glassmorphism aurora theme for beauty and lifestyle creators',
      id: 'Tema aurora glassmorphism untuk kreator beauty dan lifestyle'
    }
  },

  // ============================================
  // NEW 2024 TEMPLATES
  // ============================================

  // Creator Templates
  'gaming-streamer-hub': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['gaming', 'streaming', 'esports', 'twitch', 'youtube'],
    targetAudience: ['gamer', 'streamer', 'content-creator', 'esports-player'],
    recommendedFor: ['gaming-content', 'streaming', 'esports', 'twitch-streamer'],
    includesFeatures: ['gaming-theme', 'schedule-stream', 'highlight-clips', 'donation-links'],
    localizedName: {
      en: 'Gaming Streamer Hub',
      id: 'Hub Streamer Gaming'
    },
    localizedDesc: {
      en: 'Gaming theme perfect for streamers with schedule and donation links',
      id: 'Tema gaming sempurna untuk streamer dengan jadwal dan link donasi'
    }
  },

  'tech-reviewer-pro': {
    primaryCategory: 'creator',
    subCategory: 'tech-reviewer',
    industryTags: ['tech', 'gadget', 'review', 'unboxing', 'technology'],
    targetAudience: ['tech-reviewer', 'gadget-reviewer', 'tech-influencer'],
    recommendedFor: ['tech-review', 'gadget-unboxing', 'tech-content'],
    includesFeatures: ['product-gallery', 'review-links', 'affiliate-links', 'tech-theme'],
    localizedName: {
      en: 'Tech Reviewer Pro',
      id: 'Tech Reviewer Pro'
    },
    localizedDesc: {
      en: 'Professional tech review theme with product showcase and affiliate links',
      id: 'Tema tech review profesional dengan showcase produk dan affiliate link'
    }
  },

  'travel-blogger-wanderlust': {
    primaryCategory: 'creator',
    subCategory: 'travel',
    industryTags: ['travel', 'destination', 'adventure', 'wanderlust', 'tourism'],
    targetAudience: ['travel-blogger', 'travel-influencer', 'travel-vlogger'],
    recommendedFor: ['travel-content', 'destination-guide', 'travel-tips'],
    includesFeatures: ['destination-gallery', 'travel-guides', 'location-map', 'travel-tips'],
    localizedName: {
      en: 'Travel Blogger Wanderlust',
      id: 'Travel Blogger Wanderlust'
    },
    localizedDesc: {
      en: 'Wanderlust theme for travel bloggers with destination guides',
      id: 'Tema wanderlust untuk travel blogger dengan panduan destinasi'
    }
  },

  'lifestyle-influencer-modern': {
    primaryCategory: 'creator',
    subCategory: 'lifestyle',
    industryTags: ['lifestyle', 'daily', 'fashion', 'influencer', 'personal'],
    targetAudience: ['lifestyle-influencer', 'content-creator', 'daily-vlogger'],
    recommendedFor: ['lifestyle-content', 'daily-vlog', 'personal-brand'],
    includesFeatures: ['content-gallery', 'brand-collabs', 'social-media', 'lifestyle-theme'],
    localizedName: {
      en: 'Lifestyle Influencer Modern',
      id: 'Lifestyle Influencer Modern'
    },
    localizedDesc: {
      en: 'Modern theme for lifestyle influencers with brand collaboration showcase',
      id: 'Tema modern untuk lifestyle influencer dengan showcase kolaborasi brand'
    }
  },

  // UMKM Templates
  'food-seller-homemade': {
    primaryCategory: 'umkm',
    subCategory: 'food-seller',
    industryTags: ['food', 'homemade', 'frozen-food', 'snack', 'culinary'],
    targetAudience: ['food-seller', 'home-business', 'food-entrepreneur'],
    recommendedFor: ['homemade-food', 'frozen-food', 'snack-business'],
    includesFeatures: ['product-catalog', 'whatsapp-order', 'qris-payment', 'food-gallery'],
    localizedName: {
      en: 'Food Seller Homemade',
      id: 'Penjual Makanan Rumahan'
    },
    localizedDesc: {
      en: 'Template for homemade food sellers with product catalog and easy ordering',
      id: 'Template untuk penjual makanan rumahan dengan katalog produk dan pemesanan mudah'
    }
  },

  'handicraft-artisan': {
    primaryCategory: 'umkm',
    subCategory: 'handicraft',
    industryTags: ['handicraft', 'handmade', 'artisan', 'craft', 'art'],
    targetAudience: ['handicraft-seller', 'artisan', 'craft-business'],
    recommendedFor: ['handicraft-business', 'handmade-products', 'artisan-products'],
    includesFeatures: ['product-showcase', 'custom-order', 'marketplace-links', 'whatsapp'],
    localizedName: {
      en: 'Handicraft Artisan',
      id: 'Pengrajin Kerajinan'
    },
    localizedDesc: {
      en: 'Artisan theme for handicraft sellers with custom order capabilities',
      id: 'Tema artisan untuk penjual kerajinan dengan kemampuan custom order'
    }
  },

  'service-business-pro': {
    primaryCategory: 'umkm',
    subCategory: 'service-business',
    industryTags: ['service', 'consulting', 'freelance', 'professional', 'business'],
    targetAudience: ['service-provider', 'consultant', 'freelancer'],
    recommendedFor: ['service-business', 'consulting', 'professional-services'],
    includesFeatures: ['service-showcase', 'booking', 'location', 'whatsapp-consultation'],
    localizedName: {
      en: 'Service Business Pro',
      id: 'Bisnis Jasa Pro'
    },
    localizedDesc: {
      en: 'Professional theme for service businesses with booking capabilities',
      id: 'Tema profesional untuk bisnis jasa dengan kemampuan booking'
    }
  },

  'dropship-reseller-hub': {
    primaryCategory: 'umkm',
    subCategory: 'dropship',
    industryTags: ['dropship', 'reseller', 'online-shop', 'marketplace', 'retail'],
    targetAudience: ['dropshipper', 'reseller', 'online-seller'],
    recommendedFor: ['dropship-business', 'reseller', 'online-retail'],
    includesFeatures: ['product-catalog', 'marketplace-links', 'qris-payment', 'whatsapp-order'],
    localizedName: {
      en: 'Dropship Reseller Hub',
      id: 'Hub Dropship Reseller'
    },
    localizedDesc: {
      en: 'Complete template for dropshippers and resellers with multi-marketplace',
      id: 'Template lengkap untuk dropshipper dan reseller dengan multi marketplace'
    }
  },

  'thrift-store-vintage': {
    primaryCategory: 'umkm',
    subCategory: 'fashion-umkm',
    industryTags: ['thrift', 'vintage', 'second', 'fashion', 'sustainable'],
    targetAudience: ['thrift-seller', 'vintage-seller', 'second-shop'],
    recommendedFor: ['thrift-shop', 'vintage-store', 'sustainable-fashion'],
    includesFeatures: ['product-gallery', 'marketplace-links', 'whatsapp-chat', 'vintage-theme'],
    localizedName: {
      en: 'Thrift Store Vintage',
      id: 'Toko Thrift Vintage'
    },
    localizedDesc: {
      en: 'Vintage theme for thrift stores and second-hand fashion sellers',
      id: 'Tema vintage untuk toko thrift dan penjual fashion second'
    }
  },

  // F&B Templates
  'bakery-cake-shop': {
    primaryCategory: 'fnb',
    subCategory: 'bakery',
    industryTags: ['bakery', 'cake', 'pastry', 'dessert', 'baking'],
    targetAudience: ['bakery-owner', 'cake-seller', 'pastry-chef'],
    recommendedFor: ['bakery-shop', 'cake-business', 'pastry-shop'],
    includesFeatures: ['product-catalog', 'custom-order', 'location-map', 'whatsapp-order'],
    localizedName: {
      en: 'Bakery & Cake Shop',
      id: 'Toko Roti & Kue'
    },
    localizedDesc: {
      en: 'Sweet theme for bakeries and cake shops with custom order features',
      id: 'Tema manis untuk toko roti dan kue dengan fitur custom order'
    }
  },

  'catering-service-pro': {
    primaryCategory: 'fnb',
    subCategory: 'catering',
    industryTags: ['catering', 'event', 'food-service', 'corporate', 'party'],
    targetAudience: ['catering-service', 'event-caterer', 'food-business'],
    recommendedFor: ['catering-business', 'event-catering', 'corporate-catering'],
    includesFeatures: ['service-packages', 'event-gallery', 'qris-payment', 'booking'],
    localizedName: {
      en: 'Catering Service Pro',
      id: 'Layanan Katering Pro'
    },
    localizedDesc: {
      en: 'Professional catering theme with packages and booking system',
      id: 'Tema katering profesional dengan paket dan sistem booking'
    }
  },

  'cloud-kitchen-delivery': {
    primaryCategory: 'fnb',
    subCategory: 'food-delivery',
    industryTags: ['cloud-kitchen', 'delivery', 'dark-kitchen', 'ghost-kitchen', 'food'],
    targetAudience: ['cloud-kitchen', 'delivery-only', 'food-entrepreneur'],
    recommendedFor: ['cloud-kitchen', 'delivery-business', 'ghost-kitchen'],
    includesFeatures: ['delivery-platforms', 'food-menu', 'online-order', 'multi-platform'],
    localizedName: {
      en: 'Cloud Kitchen Delivery',
      id: 'Cloud Kitchen Delivery'
    },
    localizedDesc: {
      en: 'Delivery-focused theme for cloud kitchens with multi-platform integration',
      id: 'Tema fokus delivery untuk cloud kitchen dengan integrasi multi platform'
    }
  }
}

// Helper to get category data for a template
export function getTemplateCategoryData(slug: string) {
  return TEMPLATE_CATEGORY_MAPPING[slug] || null
}

// Helper to get all templates in a category
export function getTemplatesByCategory(primaryCategory: string): string[] {
  return Object.entries(TEMPLATE_CATEGORY_MAPPING)
    .filter(([_, data]) => data.primaryCategory === primaryCategory)
    .map(([slug]) => slug)
}

// Count templates per category
export function countTemplatesPerCategory(): Record<string, number> {
  const counts: Record<string, number> = {}
  Object.values(TEMPLATE_CATEGORY_MAPPING).forEach(data => {
    counts[data.primaryCategory] = (counts[data.primaryCategory] || 0) + 1
  })
  return counts
}
