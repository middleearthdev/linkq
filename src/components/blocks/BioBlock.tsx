/**
 * BioBlock Component
 * Displays user's profile picture, name, and bio text
 */

import Image from 'next/image'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { Button } from '@/components/ui/button'
import { BioBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import '@/styles/avatar-frames.css'

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
    spacing = 'normal',
    bioStyle = 'default'
  } = props

  // Avatar size mapping
  const avatarSizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  }

  // Avatar style mapping with mobile-first responsive design
  const avatarStyles = {
    circle: 'rounded-full',
    'rounded-frame': 'rounded-[1.5rem] sm:rounded-[2rem]',
    square: 'rounded-lg',
    wave: 'wave-shape',
    polaroid: 'polaroid-effect rounded-none',
    vintage: 'vintage-frame rounded-[1.5rem] sm:rounded-[2rem]',
  }

  // Name style mapping
  const nameStyles = {
    default: 'font-bold text-2xl',
    'large-elegant': 'font-bold text-4xl tracking-wide',
    compact: 'font-semibold text-xl',
    'modern-minimal': 'font-light text-3xl tracking-widest uppercase',
    'bold-impact': 'font-black text-5xl leading-none',
    'script-handwritten': 'font-serif text-3xl italic',
    'tech-mono': 'font-mono text-2xl tracking-tight',
    'gradient-text': 'font-bold text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    'neon-glow': 'font-bold text-3xl drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    'vintage-serif': 'font-serif text-3xl font-semibold text-amber-900',
  }

  // Bio style mapping
  const bioStyles = {
    default: 'text-lg font-medium',
    large: 'text-xl font-semibold leading-relaxed',
    small: 'text-base font-normal',
    quote: 'text-lg italic font-light border-l-4 border-gray-300 pl-4 ml-4',
    modern: 'text-base font-light tracking-wide leading-loose',
  }

  // Spacing mapping
  const spacingStyles = {
    tight: 'space-y-2',
    normal: 'space-y-4',
    wide: 'space-y-6'
  }

  // Regular layout for all avatar styles
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
          // Base styles - conditionally applied
          avatarStyle !== 'polaroid' && 'overflow-hidden',
          ['circle', 'rounded-frame', 'square'].includes(avatarStyle) ? 'border-[var(--avatar-border)] shadow-[var(--shadow)]' : '',
          'bg-gradient-to-br from-gray-100 to-gray-200',
          'transition-all duration-300 ease-in-out',
          'relative', // Required for Next.js Image with fill
          // Special handling for custom shapes
          (avatarStyle === 'polaroid') && 'bg-white',
          (avatarStyle === 'wave') && 'animate-morph',
          isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
        )}>
          {avatar ? (
            <Image
              src={avatar}
              alt={name || 'Avatar'}
              fill
              className="object-cover"
              priority={true}
              sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
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
            bioStyles[bioStyle as keyof typeof bioStyles],
            'text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed tracking-wide',
            textAlign === 'left' && 'mx-0',
            textAlign === 'right' && 'ml-auto mr-0',
            bioStyle === 'quote' && textAlign === 'center' && 'mx-auto',
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
    <div className={cn('space-y-6 p-4', className)}>
      {/* Name Input */}
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

      {/* Bio Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Bio</label>
          <span className="text-xs text-gray-500">
            {props.bio?.length || 0}/160 characters
          </span>
        </div>
        <textarea
          value={props.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
          maxLength={160}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Tell people about yourself"
        />
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium mb-3">Profile Picture</label>
        <AvatarUpload
          currentAvatar={props.avatar}
          onAvatarChange={(url) => handleChange('avatar', url)}
          size="lg"
          className="mb-3"
        />
      </div>

      {/* Show Avatar Toggle */}
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

      {/* Avatar Style Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Avatar Frame Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {([
            'circle', 'rounded-frame', 'square', 'wave', 'polaroid', 'vintage'
          ] as const).map((style) => (
            <Button
              key={style}
              variant={props.avatarStyle === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('avatarStyle', style)}
              className="capitalize text-xs h-9"
            >
              {style.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Avatar Size Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Avatar Size</label>
        <div className="grid grid-cols-3 gap-2">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button
              key={size}
              variant={props.avatarSize === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('avatarSize', size)}
              className="uppercase text-xs h-9"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Name Style Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Name Typography</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'default', label: 'Default' },
            { value: 'large-elegant', label: 'Large Elegant' },
            { value: 'compact', label: 'Compact' },
            { value: 'modern-minimal', label: 'Modern Minimal' },
            { value: 'bold-impact', label: 'Bold Impact' },
            { value: 'script-handwritten', label: 'Script' },
            { value: 'tech-mono', label: 'Tech Mono' },
            { value: 'gradient-text', label: 'Gradient' },
            { value: 'neon-glow', label: 'Neon Glow' },
            { value: 'vintage-serif', label: 'Vintage' },
          ] as const).map(({ value, label }) => (
            <Button
              key={value}
              variant={props.nameStyle === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('nameStyle', value)}
              className="text-xs h-9"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Bio Style Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Bio Text Style</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(['default', 'large', 'small', 'quote', 'modern'] as const).map((style) => (
            <Button
              key={style}
              variant={props.bioStyle === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('bioStyle', style)}
              className="capitalize text-xs h-9"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Alignment Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Text Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <Button
              key={align}
              variant={props.textAlign === align ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('textAlign', align)}
              className="capitalize h-9"
            >
              {align}
            </Button>
          ))}
        </div>
      </div>

      {/* Spacing Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Spacing</label>
        <div className="grid grid-cols-3 gap-2">
          {(['tight', 'normal', 'wide'] as const).map((space) => (
            <Button
              key={space}
              variant={props.spacing === space ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('spacing', space)}
              className="capitalize h-9"
            >
              {space}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}