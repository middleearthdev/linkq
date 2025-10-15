/**
 * BioBlock Component
 * Displays user's profile picture, name, and bio text
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BioBlockProps } from '@/types'
import { cn } from '@/lib/utils'

interface BioBlockComponentProps {
  props: BioBlockProps
  className?: string
  isEditing?: boolean
}

export function BioBlock({ props, className, isEditing = false }: BioBlockComponentProps) {
  const { 
    name, 
    bio, 
    avatar, 
    showAvatar = true, 
    avatarSize = 'lg',
    avatarStyle = 'circle',
    textAlign = 'center',
    nameStyle = 'default',
    spacing = 'normal'
  } = props

  // Avatar size mapping
  const avatarSizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    xxl: 'w-40 h-40'
  }

  // Avatar style mapping
  const avatarStyles = {
    circle: 'rounded-full',
    'rounded-frame': 'rounded-[2rem]', // Matches sample design
    square: 'rounded-lg'
  }

  // Name style mapping
  const nameStyles = {
    default: 'font-bold text-2xl',
    'large-elegant': 'font-bold text-4xl tracking-wide',
    compact: 'font-semibold text-xl'
  }

  // Spacing mapping
  const spacingStyles = {
    tight: 'space-y-2',
    normal: 'space-y-4', 
    wide: 'space-y-6'
  }

  return (
    <div className={cn(
      'flex flex-col items-center p-6',
      textAlign === 'center' && 'text-center',
      textAlign === 'left' && 'text-left items-start',
      textAlign === 'right' && 'text-right items-end',
      spacingStyles[spacing as keyof typeof spacingStyles],
      'bio-block', // CSS class for template styling
      className
    )}>
      {showAvatar && (
        <div className={cn(
          avatarSizes[avatarSize as keyof typeof avatarSizes],
          avatarStyles[avatarStyle as keyof typeof avatarStyles],
          'overflow-hidden border-[var(--avatar-border)] shadow-[var(--shadow)]',
          'bg-gradient-to-br from-gray-100 to-gray-200',
          isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
        )}>
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-2xl font-semibold text-white">
                {name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className={cn(
        'space-y-3',
        spacingStyles[spacing as keyof typeof spacingStyles]
      )}>
        <h1 className={cn(
          nameStyles[nameStyle as keyof typeof nameStyles],
          'text-[var(--text-color)] leading-tight',
          'bio-name', // CSS class for template styling
          isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
        )}>
          {name || 'Your Name'}
        </h1>
        
        {bio && (
          <p className={cn(
            'text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed font-medium tracking-wide',
            textAlign === 'left' && 'mx-0',
            textAlign === 'right' && 'ml-auto mr-0',
            'bio-text', // CSS class for template styling
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}>
            {bio}
          </p>
        )}
      </div>
    </div>
  )
}

// Editor component for customizing BioBlock props
export function BioBlockEditor({ 
  props, 
  onChange, 
  className 
}: {
  props: BioBlockProps
  onChange: (props: BioBlockProps) => void
  className?: string
}) {
  const handleChange = (field: keyof BioBlockProps, value: any) => {
    onChange({ ...props, [field]: value })
  }

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={props.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={props.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell people about yourself"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Avatar URL</label>
        <input
          type="url"
          value={props.avatar || ''}
          onChange={(e) => handleChange('avatar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://yoursite.com/your-photo.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showAvatar"
          checked={props.showAvatar ?? true}
          onChange={(e) => handleChange('showAvatar', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="showAvatar" className="text-sm font-medium">
          Show avatar
        </label>
      </div>
    </div>
  )
}