/**
 * TextBlock Component
 * Simple text display block with rich formatting options
 */

import { cn } from '@/lib/utils'
import { TextBlockProps } from '@/types'

interface TextBlockComponentProps {
  props: TextBlockProps
  className?: string
  isEditing?: boolean
}

export function TextBlock({ props, className, isEditing = false }: TextBlockComponentProps) {
  const {
    content = '',
    align = 'left',
    size = 'base',
    weight = 'normal',
    color,
    spacing = 'normal',
    maxWidth = 'md',
  } = props

  // Alignment classes
  const alignmentMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  // Size classes
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  // Weight classes
  const weightMap = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  // Spacing classes (line height)
  const spacingMap = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }

  // Max width classes
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }

  // Empty state
  if (!content && !isEditing) {
    return null
  }

  return (
    <div
      className={cn(
        'w-full py-2',
        align === 'center' && 'flex justify-center',
        align === 'right' && 'flex justify-end',
        className
      )}
    >
      <div
        className={cn(
          'text-block whitespace-pre-wrap',
          alignmentMap[align],
          sizeMap[size],
          weightMap[weight],
          spacingMap[spacing],
          maxWidthMap[maxWidth],
          isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-4 min-h-[3rem]',
          !content && isEditing && 'text-gray-400 italic'
        )}
        style={{
          color: 'var(--page-text-color, inherit)',
        }}
      >
        {content || (isEditing ? 'Enter your text here...' : '')}
      </div>
    </div>
  )
}
