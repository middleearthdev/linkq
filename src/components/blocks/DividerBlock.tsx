/**
 * DividerBlock Component
 * Visual separator with multiple styles and customization options
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DividerBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { Sparkles, Minus, Circle, Square, Star, Heart, Zap } from 'lucide-react'

interface DividerBlockComponentProps {
  props: DividerBlockProps
  className?: string
  isEditing?: boolean
}

export function DividerBlock({ props, className, isEditing = false }: DividerBlockComponentProps) {
  const {
    style = 'solid',
    thickness = 1,
    color = '#e5e7eb',
    spacing = 'md',
    width = '100',
    alignment = 'center',
    icon = 'none',
    animated = false,
  } = props

  // Spacing mapping
  const spacingMap = {
    none: 'my-0',
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
    xl: 'my-16',
  }

  // Style mapping
  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
  }

  // Width mapping
  const widthMap = {
    '25': 'w-1/4',
    '50': 'w-1/2',
    '75': 'w-3/4',
    '100': 'w-full',
  }

  // Alignment mapping
  const alignmentMap = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  // Icon components
  const iconComponents = {
    none: null,
    sparkles: <Sparkles className="w-5 h-5" />,
    circle: <Circle className="w-5 h-5" />,
    square: <Square className="w-5 h-5" />,
    star: <Star className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
  }

  // Gradient styles
  const gradientStyles = {
    gradient: 'linear-gradient(90deg, transparent, currentColor, transparent)',
    'gradient-rainbow': 'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
    'gradient-sunset': 'linear-gradient(90deg, #ff6b6b, #feca57, #ee5a6f)',
    'gradient-ocean': 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
  }

  // Render gradient divider
  if (style.startsWith('gradient')) {
    return (
      <div className={cn(spacingMap[spacing], className, 'divider-block')}>
        <div
          className={cn(
            widthMap[width],
            alignmentMap[alignment],
            'h-0.5 rounded-full',
            animated && 'animate-pulse'
          )}
          style={{
            background: gradientStyles[style as keyof typeof gradientStyles],
            height: `${thickness}px`,
          }}
        />
      </div>
    )
  }

  // Render icon divider
  if (icon !== 'none') {
    return (
      <div
        className={cn(
          spacingMap[spacing],
          className,
          'divider-block flex items-center gap-4',
          alignmentMap[alignment]
        )}
      >
        <hr
          className={cn('flex-1', styleClasses[style as keyof typeof styleClasses])}
          style={{
            borderColor: color,
            borderWidth: `${thickness}px 0 0 0`,
          }}
        />
        <div
          style={{ color }}
          className={cn(animated && 'animate-pulse')}
        >
          {iconComponents[icon as keyof typeof iconComponents]}
        </div>
        <hr
          className={cn('flex-1', styleClasses[style as keyof typeof styleClasses])}
          style={{
            borderColor: color,
            borderWidth: `${thickness}px 0 0 0`,
          }}
        />
      </div>
    )
  }

  // Render standard divider
  return (
    <div className={cn(spacingMap[spacing], className, 'divider-block')}>
      <hr
        className={cn(
          'border-t',
          styleClasses[style as keyof typeof styleClasses],
          widthMap[width],
          alignmentMap[alignment],
          animated && 'animate-pulse',
          isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
        )}
        style={{
          borderColor: color,
          borderWidth: `${thickness}px 0 0 0`,
        }}
      />
    </div>
  )
}

// Editor component for customizing DividerBlock props
export function DividerBlockEditor({
  props,
  onChange,
  className,
}: {
  props: DividerBlockProps
  onChange: (props: DividerBlockProps) => void
  className?: string
}) {
  const handleChange = (field: keyof DividerBlockProps, value: any) => {
    onChange({ ...props, [field]: value })
  }

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Style Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Divider Style</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'gradient-rainbow', label: 'Rainbow' },
            { value: 'gradient-sunset', label: 'Sunset' },
            { value: 'gradient-ocean', label: 'Ocean' },
          ] as const).map(({ value, label }) => (
            <Button
              key={value}
              variant={props.style === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('style', value)}
              className="text-xs h-9"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Icon Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Icon (Optional)</label>
        <div className="grid grid-cols-4 gap-2">
          {([
            { value: 'none', label: 'None', icon: Minus },
            { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
            { value: 'circle', label: 'Circle', icon: Circle },
            { value: 'square', label: 'Square', icon: Square },
            { value: 'star', label: 'Star', icon: Star },
            { value: 'heart', label: 'Heart', icon: Heart },
            { value: 'zap', label: 'Zap', icon: Zap },
          ] as const).map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={props.icon === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('icon', value)}
              className="text-xs h-9 flex flex-col gap-1"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Thickness Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Thickness</label>
          <span className="text-xs text-gray-500">{props.thickness || 1}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={props.thickness || 1}
          onChange={(e) => handleChange('thickness', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={props.color || '#e5e7eb'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-12 h-9 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={props.color || '#e5e7eb'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="#e5e7eb"
          />
        </div>
        {/* Color presets */}
        <div className="grid grid-cols-8 gap-2 mt-2">
          {['#e5e7eb', '#9ca3af', '#374151', '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'].map((color) => (
            <button
              key={color}
              onClick={() => handleChange('color', color)}
              className={cn(
                'w-full h-8 rounded border-2 transition-all',
                props.color === color ? 'border-blue-500 scale-110' : 'border-gray-200'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Width Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Width</label>
        <div className="grid grid-cols-4 gap-2">
          {(['25', '50', '75', '100'] as const).map((width) => (
            <Button
              key={width}
              variant={props.width === width ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('width', width)}
              className="text-xs h-9"
            >
              {width}%
            </Button>
          ))}
        </div>
      </div>

      {/* Alignment Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <Button
              key={align}
              variant={props.alignment === align ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('alignment', align)}
              className="capitalize h-9"
            >
              {align}
            </Button>
          ))}
        </div>
      </div>

      {/* Spacing Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Spacing (Vertical)</label>
        <div className="grid grid-cols-5 gap-2">
          {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((space) => (
            <Button
              key={space}
              variant={props.spacing === space ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('spacing', space)}
              className="capitalize text-xs h-9"
            >
              {space}
            </Button>
          ))}
        </div>
      </div>

      {/* Animated Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="animated"
          checked={props.animated ?? false}
          onChange={(e) => handleChange('animated', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="animated" className="text-sm font-medium">
          Animated (pulse effect)
        </label>
      </div>
    </div>
  )
}
