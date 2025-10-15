/**
 * Indonesian Platform Detection and Configuration
 * Detects popular platforms used in Indonesia and provides platform-specific settings
 */

export interface PlatformConfig {
  id: string
  name: string
  color: string
  backgroundColor?: string
  icon: string
  category: 'social' | 'ecommerce' | 'payment' | 'transport' | 'content' | 'professional' | 'messaging' | 'other'
  customFields?: {
    phone?: boolean
    amount?: boolean
    username?: boolean
    message?: boolean
  }
  urlPatterns: string[]
  defaultStyle: 'pill' | 'card' | 'minimal'
}

export const INDONESIAN_PLATFORMS: PlatformConfig[] = [
  // Messaging
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    backgroundColor: '#25D366',
    icon: 'whatsapp',
    category: 'messaging',
    customFields: { phone: true, message: true },
    urlPatterns: ['wa.me', 'api.whatsapp.com', 'whatsapp.com'],
    defaultStyle: 'pill'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#0088CC',
    backgroundColor: '#0088CC',
    icon: 'telegram',
    category: 'messaging',
    customFields: { username: true },
    urlPatterns: ['t.me', 'telegram.me'],
    defaultStyle: 'pill'
  },

  // Social Media
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    backgroundColor: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    icon: 'instagram',
    category: 'social',
    customFields: { username: true },
    urlPatterns: ['instagram.com', 'instagr.am'],
    defaultStyle: 'card'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    backgroundColor: '#000000',
    icon: 'tiktok',
    category: 'content',
    customFields: { username: true },
    urlPatterns: ['tiktok.com', 'vm.tiktok.com'],
    defaultStyle: 'pill'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    backgroundColor: '#FF0000',
    icon: 'youtube',
    category: 'content',
    urlPatterns: ['youtube.com', 'youtu.be'],
    defaultStyle: 'card'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077B5',
    backgroundColor: '#0077B5',
    icon: 'linkedin',
    category: 'professional',
    urlPatterns: ['linkedin.com'],
    defaultStyle: 'card'
  },

  // E-commerce
  {
    id: 'shopee',
    name: 'Shopee',
    color: '#EE4D2D',
    backgroundColor: '#EE4D2D',
    icon: 'shopee',
    category: 'ecommerce',
    customFields: { username: true },
    urlPatterns: ['shopee.co.id', 'shp.ee'],
    defaultStyle: 'card'
  },
  {
    id: 'tokopedia',
    name: 'Tokopedia',
    color: '#42B549',
    backgroundColor: '#42B549',
    icon: 'tokopedia',
    category: 'ecommerce',
    customFields: { username: true },
    urlPatterns: ['tokopedia.com', 'tokopedia.link'],
    defaultStyle: 'card'
  },

  // Transportation
  {
    id: 'gojek',
    name: 'Gojek',
    color: '#00AA13',
    backgroundColor: '#00AA13',
    icon: 'gojek',
    category: 'transport',
    urlPatterns: ['gojek.com', 'go-jek.com'],
    defaultStyle: 'pill'
  },
  {
    id: 'grab',
    name: 'Grab',
    color: '#00B14F',
    backgroundColor: '#00B14F',
    icon: 'grab',
    category: 'transport',
    urlPatterns: ['grab.com'],
    defaultStyle: 'pill'
  },

  // Payment
  {
    id: 'ovo',
    name: 'OVO',
    color: '#4C3494',
    backgroundColor: '#4C3494',
    icon: 'ovo',
    category: 'payment',
    customFields: { phone: true, amount: true },
    urlPatterns: ['ovo.id'],
    defaultStyle: 'card'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    color: '#00AA13',
    backgroundColor: '#00AA13',
    icon: 'gopay',
    category: 'payment',
    customFields: { phone: true, amount: true },
    urlPatterns: ['gopay.co.id'],
    defaultStyle: 'card'
  },
  {
    id: 'dana',
    name: 'DANA',
    color: '#118EEA',
    backgroundColor: '#118EEA',
    icon: 'dana',
    category: 'payment',
    customFields: { phone: true, amount: true },
    urlPatterns: ['dana.id'],
    defaultStyle: 'card'
  }
]

export function detectPlatform(url: string): PlatformConfig | undefined {
  const normalizedUrl = url.toLowerCase()
  
  for (const platform of INDONESIAN_PLATFORMS) {
    for (const pattern of platform.urlPatterns) {
      if (normalizedUrl.includes(pattern)) {
        return platform
      }
    }
  }
  
  return undefined
}

export function getPlatformIcon(platformId: string): string {
  const platform = INDONESIAN_PLATFORMS.find(p => p.id === platformId)
  return platform?.icon || 'link'
}

export function formatWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const phoneWithCountryCode = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`
  
  if (message) {
    return `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(message)}`
  }
  
  return `https://wa.me/${phoneWithCountryCode}`
}

export function getUrlPreview(url: string): { platform?: PlatformConfig; displayUrl: string } {
  const platform = detectPlatform(url)
  let displayUrl = url
  
  // Clean up display URL
  try {
    const urlObj = new URL(url)
    displayUrl = urlObj.hostname + urlObj.pathname
  } catch {
    displayUrl = url
  }
  
  return { platform, displayUrl }
}