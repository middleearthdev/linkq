/**
 * BlockWrapper Component
 * Standardizes max-width and padding for all blocks across mobile, tablet, and desktop
 */

import { cn } from '@/lib/utils'

interface BlockWrapperProps {
  children: React.ReactNode
  className?: string
}

export function BlockWrapper({ children, className }: BlockWrapperProps) {
  return (
    <div className={cn(
      'w-full mx-auto',
      // Mobile (default): Full width dengan padding horizontal
      'px-4',
      // Tablet: 640px max width
      'sm:px-6 sm:max-w-screen-sm',
      // Desktop Small: 768px max width
      'md:px-8 md:max-w-screen-md',
      // Desktop Large: 896px max width
      'lg:px-10 lg:max-w-3xl',
      className
    )}>
      {children}
    </div>
  )
}
