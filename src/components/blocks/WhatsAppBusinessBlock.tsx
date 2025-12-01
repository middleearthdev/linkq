/**
 * WhatsAppBusinessBlock Component
 * Floating Action Button (FAB) for WhatsApp Business with Indonesia phone number formatting
 */

"use client"
import { WhatsAppBusinessBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface WhatsAppBusinessBlockComponentProps {
  props: WhatsAppBusinessBlockProps
  className?: string
  isEditing?: boolean
}

// Format Indonesian phone number: 08xxx → +628xxx
function formatIndonesianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('08')) {
    return `+62${cleaned.substring(1)}`
  }
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('8')) {
    return `+62${cleaned}`
  }
  return `+${cleaned}`
}

export function WhatsAppBusinessBlock({
  props,
  className,
  isEditing = false
}: WhatsAppBusinessBlockComponentProps) {
  const {
    phoneNumber,
    message,
    buttonText = 'Chat via WhatsApp',
    businessName,
    fabPosition = 'bottom-right',
    enablePulse = true,
  } = props

  const [isHovered, setIsHovered] = useState(false)

  // Format phone number for WhatsApp URL
  const formattedPhone = formatIndonesianPhone(phoneNumber)

  // Create WhatsApp URL with pre-filled message
  const encodedMessage = message ? encodeURIComponent(message) : ''
  const whatsappUrl = `https://wa.me/${formattedPhone.replace(/\D/g, '')}${message ? `?text=${encodedMessage}` : ''}`

  const handleClick = () => {
    if (!isEditing) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // FAB Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  }

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[fabPosition],
        isEditing && 'pointer-events-none opacity-75',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse animation ring */}
      {enablePulse && !isEditing && (
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      )}

      {/* Main FAB button */}
      <button
        onClick={handleClick}
        disabled={isEditing}
        className={cn(
          'relative rounded-full transition-all duration-300',
          'flex items-center justify-center gap-2',
          'font-semibold w-14 h-14',
          'bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-2xl',
          isHovered && 'px-6 w-auto',
          'group'
        )}
        aria-label={buttonText}
      >
        {/* WhatsApp Icon */}
        <MessageCircle className={cn(
          'transition-all duration-300 w-6 h-6',
          isHovered && 'mr-1'
        )} />

        {/* Label (shows on hover) */}
        <span className={cn(
          'transition-all duration-300 whitespace-nowrap text-sm',
          isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0 overflow-hidden'
        )}>
          {buttonText}
        </span>
      </button>

      {/* Business name badge (optional) */}
      {businessName && (
        <div className={cn(
          'absolute -top-2 -right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md',
          'text-xs font-semibold text-gray-700 dark:text-gray-300',
          'border border-gray-200 dark:border-gray-700',
          'whitespace-nowrap',
          'transition-all duration-300',
          isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        )}>
          {businessName}
        </div>
      )}
    </div>
  )
}
