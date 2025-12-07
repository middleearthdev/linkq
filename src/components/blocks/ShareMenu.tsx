/**
 * ShareMenu Component
 * Three-dot menu for sharing links via social media
 */

"use client"

import { useState } from "react"
import { MoreVertical, Copy, MessageCircle, Facebook, Instagram, Twitter, Linkedin, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareMenuProps {
  link: {
    title: string
    url: string
  }
  className?: string
  textColor?: string
}

export function ShareMenu({ link, className = "", textColor }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setOpen(false)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(link.url)
    const encodedTitle = encodeURIComponent(link.title)

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct link sharing
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }

    if (platform === 'instagram') {
      // Show toast or message
      alert('Instagram does not support direct link sharing. Please copy the link and share it manually in Instagram.')
      return
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer')
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className={`p-2 rounded-full z-10 ${className}`}
          aria-label="Share link"
          style={{ color: textColor || 'var(--button-text-color, currentColor)' }}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {/* Copy Link */}
        <DropdownMenuItem onClick={handleCopy} className="flex items-center gap-3 cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy Link</span>
            </>
          )}
        </DropdownMenuItem>

        {/* WhatsApp */}
        <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm">WhatsApp</span>
        </DropdownMenuItem>

        {/* Facebook */}
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="flex items-center gap-3 cursor-pointer">
          <Facebook className="h-4 w-4 text-blue-600" />
          <span className="text-sm">Facebook</span>
        </DropdownMenuItem>

        {/* Instagram */}
        <DropdownMenuItem onClick={() => handleShare('instagram')} className="flex items-center gap-3 cursor-pointer">
          <Instagram className="h-4 w-4 text-pink-600" />
          <span className="text-sm">Instagram</span>
        </DropdownMenuItem>

        {/* Twitter / X */}
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="flex items-center gap-3 cursor-pointer">
          <Twitter className="h-4 w-4 text-blue-400" />
          <span className="text-sm">Twitter / X</span>
        </DropdownMenuItem>

        {/* LinkedIn */}
        <DropdownMenuItem onClick={() => handleShare('linkedin')} className="flex items-center gap-3 cursor-pointer">
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span className="text-sm">LinkedIn</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
