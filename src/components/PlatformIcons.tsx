/**
 * Platform Icons Component
 * Custom icons for Indonesian platforms and popular international platforms
 */

"use client"

import { LucideIcon, ExternalLink, MessageCircle, ShoppingBag, CreditCard, Car, Youtube, Linkedin, Instagram } from "lucide-react"

interface PlatformIconProps {
  platform: string
  className?: string
  size?: number
}

// WhatsApp Icon
const WhatsAppIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
  </svg>
)

// Telegram Icon
const TelegramIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.93 3.821l.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693L18.953 5.78c.595-.394 1.136-.176.691.218"/>
  </svg>
)

// TikTok Icon
const TikTokIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
)

// Shopee Icon
const ShopeeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.5 1A1.5 1.5 0 0120 2.5V22a1 1 0 01-1.7.7L12 17.4l-6.3 5.3A1 1 0 014 22V2.5A1.5 1.5 0 015.5 1h13z"/>
  </svg>
)

// Tokopedia Icon
const TokopediaIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

// Gojek Icon
const GojekIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
)

// Grab Icon  
const GrabIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

// OVO Icon
const OVOIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
)

// GoPay Icon
const GoPayIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
)

// DANA Icon
const DANAIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V22h2v-2.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3zM7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm10 0c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 12c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V22h2v-2.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3z"/>
  </svg>
)

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  instagram: ({ className, size }) => <Instagram className={className} size={size} />,
  tiktok: TikTokIcon,
  youtube: ({ className, size }) => <Youtube className={className} size={size} />,
  linkedin: ({ className, size }) => <Linkedin className={className} size={size} />,
  shopee: ShopeeIcon,
  tokopedia: TokopediaIcon,
  gojek: GojekIcon,
  grab: GrabIcon,
  ovo: OVOIcon,
  gopay: GoPayIcon,
  dana: DANAIcon,
  link: ({ className, size }) => <ExternalLink className={className} size={size} />,
  message: ({ className, size }) => <MessageCircle className={className} size={size} />,
  shop: ({ className, size }) => <ShoppingBag className={className} size={size} />,
  payment: ({ className, size }) => <CreditCard className={className} size={size} />,
  transport: ({ className, size }) => <Car className={className} size={size} />
}

export default function PlatformIcon({ platform, className, size = 24 }: PlatformIconProps) {
  const IconComponent = iconMap[platform] || iconMap.link
  return <IconComponent className={className} size={size} />
}

export { iconMap }