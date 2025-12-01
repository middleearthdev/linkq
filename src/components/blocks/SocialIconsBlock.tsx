/**
 * SocialIconsBlock Component
 * Displays social media icons and links
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SocialIconsBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import {
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
  YoutubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  TelegramIcon,
  DiscordIcon,
  ThreadsIcon,
  XIcon,
  PinterestIcon,
  SnapchatIcon,
  RedditIcon,
  TwitchIcon,
  SpotifyIcon,
  SoundCloudIcon,
  BehanceIcon,
  DribbbleIcon,
  MediumIcon
} from '@/components/icons/social'

interface SocialIconsBlockComponentProps {
  props: SocialIconsBlockProps
  className?: string
  isEditing?: boolean
}

// Social platform configurations
const SOCIAL_PLATFORMS = {
  // Social Media
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    color: '#1DA1F2',
    baseUrl: 'https://twitter.com/',
    category: 'social',
  },
  x: {
    name: 'X (Twitter)',
    icon: XIcon,
    color: '#000000',
    baseUrl: 'https://x.com/',
    category: 'social',
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    color: '#E4405F',
    baseUrl: 'https://instagram.com/',
    category: 'social',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877F2',
    baseUrl: 'https://facebook.com/',
    category: 'social',
  },
  threads: {
    name: 'Threads',
    icon: ThreadsIcon,
    color: '#000000',
    baseUrl: 'https://threads.net/@',
    category: 'social',
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    color: '#000000',
    baseUrl: 'https://tiktok.com/@',
    category: 'social',
  },
  snapchat: {
    name: 'Snapchat',
    icon: SnapchatIcon,
    color: '#FFFC00',
    baseUrl: 'https://snapchat.com/add/',
    category: 'social',
  },
  pinterest: {
    name: 'Pinterest',
    icon: PinterestIcon,
    color: '#E60023',
    baseUrl: 'https://pinterest.com/',
    category: 'social',
  },
  reddit: {
    name: 'Reddit',
    icon: RedditIcon,
    color: '#FF4500',
    baseUrl: 'https://reddit.com/u/',
    category: 'social',
  },

  // Professional
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    color: '#0A66C2',
    baseUrl: 'https://linkedin.com/in/',
    category: 'professional',
  },
  github: {
    name: 'GitHub',
    icon: GithubIcon,
    color: '#181717',
    baseUrl: 'https://github.com/',
    category: 'professional',
  },
  medium: {
    name: 'Medium',
    icon: MediumIcon,
    color: '#000000',
    baseUrl: 'https://medium.com/@',
    category: 'professional',
  },
  behance: {
    name: 'Behance',
    icon: BehanceIcon,
    color: '#1769FF',
    baseUrl: 'https://behance.net/',
    category: 'professional',
  },
  dribbble: {
    name: 'Dribbble',
    icon: DribbbleIcon,
    color: '#EA4C89',
    baseUrl: 'https://dribbble.com/',
    category: 'professional',
  },

  // Messaging
  whatsapp: {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    color: '#25D366',
    baseUrl: 'https://wa.me/',
    category: 'messaging',
  },
  telegram: {
    name: 'Telegram',
    icon: TelegramIcon,
    color: '#0088cc',
    baseUrl: 'https://t.me/',
    category: 'messaging',
  },
  discord: {
    name: 'Discord',
    icon: DiscordIcon,
    color: '#5865F2',
    baseUrl: 'https://discord.com/users/',
    category: 'messaging',
  },

  // Entertainment & Media
  youtube: {
    name: 'YouTube',
    icon: YoutubeIcon,
    color: '#FF0000',
    baseUrl: 'https://youtube.com/',
    category: 'entertainment',
  },
  twitch: {
    name: 'Twitch',
    icon: TwitchIcon,
    color: '#9146FF',
    baseUrl: 'https://twitch.tv/',
    category: 'entertainment',
  },
  spotify: {
    name: 'Spotify',
    icon: SpotifyIcon,
    color: '#1DB954',
    baseUrl: 'https://open.spotify.com/user/',
    category: 'entertainment',
  },
  soundcloud: {
    name: 'SoundCloud',
    icon: SoundCloudIcon,
    color: '#FF5500',
    baseUrl: 'https://soundcloud.com/',
    category: 'entertainment',
  },
} as const

export function SocialIconsBlock({ props, className, isEditing = false }: SocialIconsBlockComponentProps) {
  const {
    platforms = [],
    style = 'round',
    size = 'md',
    colorMode = 'brand',
    customColors
  } = props

  const handleSocialClick = (platform: any) => {
    if (!isEditing) {
      trackEvent('social_click', {
        platform: platform.platform,
        url: platform.url,
      })
      window.open(platform.url, '_blank', 'noopener,noreferrer')
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  // Get icon style based on color mode
  const getIconStyle = (config: any) => {
    if (colorMode === 'monochrome') {
      return {
        backgroundColor: customColors?.backgroundColor || '#f3f4f6',
        color: customColors?.iconColor || '#374151',
        borderColor: customColors?.borderColor || '#d1d5db',
      }
    }

    if (colorMode === 'custom' && customColors) {
      return {
        backgroundColor: customColors.backgroundColor || config.color + '20',
        color: customColors.iconColor || config.color,
        borderColor: customColors.borderColor || config.color,
      }
    }

    // Default: brand colors
    return {
      backgroundColor: config.color + '20',
      borderColor: config.color,
      color: config.color,
    }
  }

  // Style classes with animations
  const styleClasses: Record<string, string> = {
    round: 'rounded-full',
    square: 'rounded-lg',
    minimal: 'rounded-none border-0 bg-transparent',
    floating: 'rounded-full animate-float',
    pulse: 'rounded-full animate-pulse',
  }

  if (platforms.length === 0 && !isEditing) {
    return null
  }

  return (
    <div className={cn(
      'flex items-center justify-center gap-4 p-6 flex-wrap',
      'social-icons-block', // CSS class for template styling
      className
    )}>
      {platforms.map((platform, index) => {
        const config = SOCIAL_PLATFORMS[platform.platform as keyof typeof SOCIAL_PLATFORMS]
        if (!config) return null

        const IconComponent = config.icon
        const iconStyle = getIconStyle(config)

        return (
          <Button
            key={`${platform.platform}-${index}`}
            variant="ghost"
            size="icon"
            className={cn(
              sizeClasses[size],
              styleClasses[style] || styleClasses.round,
              'social-icon', // CSS class for template styling
              isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
              'transition-all duration-300',
              style !== 'minimal' && 'border-2'
            )}
            style={style !== 'minimal' ? iconStyle : { color: iconStyle.color }}
            onClick={() => handleSocialClick(platform)}
            disabled={isEditing}
            title={`Visit ${config.name}`}
            aria-label={`Visit ${config.name}`}
          >
            <IconComponent className={iconSizeClasses[size]} />
          </Button>
        )
      })}
      
      {isEditing && platforms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No social links added yet</p>
          <p className="text-sm">Add your social media profiles</p>
        </div>
      )}
    </div>
  )
}

// Editor component for customizing SocialIconsBlock props
export function SocialIconsBlockEditor({
  props,
  onChange,
  className
}: {
  props: SocialIconsBlockProps
  onChange: (props: SocialIconsBlockProps) => void
  className?: string
}) {
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')

  const handleStyleChange = (style: string) => {
    onChange({ ...props, style: style as any })
  }

  const handleSizeChange = (size: 'sm' | 'md' | 'lg') => {
    onChange({ ...props, size })
  }

  const handleColorModeChange = (colorMode: 'brand' | 'monochrome' | 'custom') => {
    onChange({ ...props, colorMode })
  }

  const handleCustomColorChange = (field: string, value: string) => {
    onChange({
      ...props,
      customColors: {
        ...props.customColors,
        [field]: value
      }
    })
  }

  const handleAddPlatform = () => {
    const newPlatform = {
      platform: 'twitter',
      url: '',
      username: '',
    }
    onChange({ ...props, platforms: [...(props.platforms || []), newPlatform] })
  }

  const handleUpdatePlatform = (index: number, updates: any) => {
    const platforms = [...(props.platforms || [])]
    platforms[index] = { ...platforms[index], ...updates }
    onChange({ ...props, platforms })
  }

  const handleRemovePlatform = (index: number) => {
    const platforms = [...(props.platforms || [])]
    platforms.splice(index, 1)
    onChange({ ...props, platforms })
  }

  // Filter platforms by category
  const filteredPlatforms = categoryFilter === 'all'
    ? Object.keys(SOCIAL_PLATFORMS)
    : Object.entries(SOCIAL_PLATFORMS)
        .filter(([_, config]) => config.category === categoryFilter)
        .map(([key]) => key)

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon Style (Mobile-Friendly)</label>
        <div className="grid grid-cols-3 gap-2">
          {(['round', 'square', 'minimal', 'floating', 'pulse'] as const).map((style) => (
            <Button
              key={style}
              variant={props.style === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange(style)}
              className="capitalize text-xs"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon Size</label>
        <div className="flex gap-2">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button
              key={size}
              variant={props.size === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className="capitalize"
            >
              {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Mode selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Color Mode</label>
        <div className="flex gap-2">
          {(['brand', 'monochrome', 'custom'] as const).map((mode) => (
            <Button
              key={mode}
              variant={props.colorMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleColorModeChange(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom color pickers */}
      {props.colorMode === 'custom' && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Icon Color</label>
            <input
              type="color"
              value={props.customColors?.iconColor || '#000000'}
              onChange={(e) => handleCustomColorChange('iconColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={props.customColors?.backgroundColor || '#f3f4f6'}
              onChange={(e) => handleCustomColorChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Border Color</label>
            <input
              type="color"
              value={props.customColors?.borderColor || '#d1d5db'}
              onChange={(e) => handleCustomColorChange('borderColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hover Color</label>
            <input
              type="color"
              value={props.customColors?.hoverColor || '#e5e7eb'}
              onChange={(e) => handleCustomColorChange('hoverColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
        </div>
      )}

      {props.colorMode === 'monochrome' && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Icon Color</label>
            <input
              type="color"
              value={props.customColors?.iconColor || '#374151'}
              onChange={(e) => handleCustomColorChange('iconColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={props.customColors?.backgroundColor || '#f3f4f6'}
              onChange={(e) => handleCustomColorChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded border cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Social platforms */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Social Platforms</label>
          <Button size="sm" onClick={handleAddPlatform} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Platform
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filter by Category</label>
          <div className="flex gap-2 flex-wrap">
            {['all', 'social', 'professional', 'messaging', 'entertainment'].map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="capitalize text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {(props.platforms || []).map((platform, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={platform.platform}
                    onChange={(e) => handleUpdatePlatform(index, { platform: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filteredPlatforms.map((key) => {
                      const config = SOCIAL_PLATFORMS[key as keyof typeof SOCIAL_PLATFORMS]
                      return (
                        <option key={key} value={key}>
                          {config.name}
                        </option>
                      )
                    })}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePlatform(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <input
                  type="url"
                  value={platform.url}
                  onChange={(e) => handleUpdatePlatform(index, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/yourusername"
                />
                
                <input
                  type="text"
                  value={platform.username || ''}
                  onChange={(e) => handleUpdatePlatform(index, { username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Username (optional)"
                />
              </div>
            </Card>
          ))}
          
          {(!props.platforms || props.platforms.length === 0) && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No social platforms added yet</p>
              <p className="text-sm">Click "Add Platform" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}