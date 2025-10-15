/**
 * SocialIconsBlock Component
 * Displays social media icons and links
 */

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
  YoutubeIcon 
} from '@/components/icons/social'

interface SocialIconsBlockComponentProps {
  props: SocialIconsBlockProps
  className?: string
  isEditing?: boolean
}

// Social platform configurations
const SOCIAL_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    color: '#1DA1F2',
    baseUrl: 'https://twitter.com/',
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    color: '#E4405F',
    baseUrl: 'https://instagram.com/',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877F2',
    baseUrl: 'https://facebook.com/',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    color: '#0A66C2',
    baseUrl: 'https://linkedin.com/in/',
  },
  github: {
    name: 'GitHub',
    icon: GithubIcon,
    color: '#333',
    baseUrl: 'https://github.com/',
  },
  youtube: {
    name: 'YouTube',
    icon: YoutubeIcon,
    color: '#FF0000',
    baseUrl: 'https://youtube.com/',
  },
  tiktok: {
    name: 'TikTok',
    icon: () => <span className="text-xl font-bold">🎵</span>,
    color: '#000',
    baseUrl: 'https://tiktok.com/@',
  },
} as const

export function SocialIconsBlock({ props, className, isEditing = false }: SocialIconsBlockComponentProps) {
  const { platforms = [], style = 'round', size = 'md' } = props

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

  if (platforms.length === 0 && !isEditing) {
    return null
  }

  return (
    <div className={cn(
      'flex items-center justify-center gap-4 p-6',
      'social-icons-block', // CSS class for template styling
      className
    )}>
      {platforms.map((platform, index) => {
        const config = SOCIAL_PLATFORMS[platform.platform as keyof typeof SOCIAL_PLATFORMS]
        if (!config) return null

        const IconComponent = config.icon
        
        return (
          <Button
            key={`${platform.platform}-${index}`}
            variant="ghost"
            size="icon"
            className={cn(
              sizeClasses[size],
              style === 'round' && 'rounded-full',
              style === 'square' && 'rounded-lg',
              style === 'minimal' && 'rounded-none border-0 bg-transparent hover:bg-transparent',
              'social-icon', // CSS class for template styling
              isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
              'transition-all duration-200 hover:scale-110'
            )}
            style={style !== 'minimal' ? { 
              backgroundColor: config.color + '20',
              borderColor: config.color,
              color: config.color,
            } : { color: config.color }}
            onClick={() => handleSocialClick(platform)}
            disabled={isEditing}
            title={`Visit ${config.name}`}
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
  const handleStyleChange = (style: 'round' | 'square' | 'minimal') => {
    onChange({ ...props, style })
  }

  const handleSizeChange = (size: 'sm' | 'md' | 'lg') => {
    onChange({ ...props, size })
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

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon Style</label>
        <div className="flex gap-2">
          {(['round', 'square', 'minimal'] as const).map((style) => (
            <Button
              key={style}
              variant={props.style === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange(style)}
              className="capitalize"
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

      {/* Social platforms */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Social Platforms</label>
          <Button size="sm" onClick={handleAddPlatform} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Platform
          </Button>
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
                    {Object.entries(SOCIAL_PLATFORMS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name}
                      </option>
                    ))}
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