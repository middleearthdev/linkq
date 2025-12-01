/**
 * Icon Picker Component
 * Modal for selecting icons for links
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home, Mail, Phone, MessageCircle, Instagram, Twitter, Facebook, Linkedin,
  Youtube, Github, Globe, Link2, ShoppingBag, Coffee, Heart, Star,
  Music, Camera, Book, Briefcase, Calendar, Clock, MapPin, User,
  Users, Settings, Search, Download, Upload, ExternalLink, FileText,
  Image, Video, Headphones, Mic, Zap, TrendingUp, Award, Check,
  X, ChevronRight, Plus, Minus, ArrowRight, ArrowLeft, Eye,
  Shield, Lock, Unlock, Bell, Bookmark, Tag, Package, Truck,
  CreditCard, DollarSign, Gift, Sparkles, Sun, Moon, Cloud,
  Umbrella, Smile, ThumbsUp, Flag, AlertCircle, Info, HelpCircle
} from "lucide-react"

// Icon registry
const ICONS = [
  { name: "Home", icon: Home },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "Message", icon: MessageCircle },
  { name: "Instagram", icon: Instagram },
  { name: "Twitter", icon: Twitter },
  { name: "Facebook", icon: Facebook },
  { name: "LinkedIn", icon: Linkedin },
  { name: "YouTube", icon: Youtube },
  { name: "GitHub", icon: Github },
  { name: "Globe", icon: Globe },
  { name: "Link", icon: Link2 },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Coffee", icon: Coffee },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Book", icon: Book },
  { name: "Briefcase", icon: Briefcase },
  { name: "Calendar", icon: Calendar },
  { name: "Clock", icon: Clock },
  { name: "Location", icon: MapPin },
  { name: "User", icon: User },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
  { name: "Search", icon: Search },
  { name: "Download", icon: Download },
  { name: "Upload", icon: Upload },
  { name: "External", icon: ExternalLink },
  { name: "Document", icon: FileText },
  { name: "Image", icon: Image },
  { name: "Video", icon: Video },
  { name: "Headphones", icon: Headphones },
  { name: "Microphone", icon: Mic },
  { name: "Zap", icon: Zap },
  { name: "Trending", icon: TrendingUp },
  { name: "Award", icon: Award },
  { name: "Check", icon: Check },
  { name: "Close", icon: X },
  { name: "Next", icon: ChevronRight },
  { name: "Plus", icon: Plus },
  { name: "Minus", icon: Minus },
  { name: "Right", icon: ArrowRight },
  { name: "Left", icon: ArrowLeft },
  { name: "Eye", icon: Eye },
  { name: "Shield", icon: Shield },
  { name: "Lock", icon: Lock },
  { name: "Unlock", icon: Unlock },
  { name: "Bell", icon: Bell },
  { name: "Bookmark", icon: Bookmark },
  { name: "Tag", icon: Tag },
  { name: "Package", icon: Package },
  { name: "Truck", icon: Truck },
  { name: "Card", icon: CreditCard },
  { name: "Dollar", icon: DollarSign },
  { name: "Gift", icon: Gift },
  { name: "Sparkles", icon: Sparkles },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "Umbrella", icon: Umbrella },
  { name: "Smile", icon: Smile },
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "Flag", icon: Flag },
  { name: "Alert", icon: AlertCircle },
  { name: "Info", icon: Info },
  { name: "Help", icon: HelpCircle },
]

interface IconPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
  currentIcon?: string
}

export function IconPicker({ isOpen, onClose, onSelect, currentIcon }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (!isOpen) return null

  // Filter icons based on search
  const filteredIcons = ICONS.filter(icon =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
      <div className="relative w-full md:max-w-2xl h-[85vh] md:max-h-[80vh] bg-card dark:bg-[#2A3441] rounded-t-2xl md:rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header - Mobile Optimized */}
        <div className="sticky top-0 z-10 bg-card dark:bg-[#2A3441] border-b border-border p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold text-foreground dark:text-white">
              Choose Icon
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search - Larger touch target on mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons..."
              className="pl-9 md:pl-10 h-10 md:h-9 text-sm"
              autoFocus={false}
            />
          </div>
        </div>

        {/* Icons Grid - Mobile Optimized */}
        <div className="p-3 md:p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* Clear Icon Option - Larger touch target */}
          <div className="mb-3 md:mb-4">
            <Button
              variant="outline"
              onClick={() => {
                onSelect("")
                onClose()
              }}
              className="w-full justify-start h-11 md:h-10 text-sm"
            >
              <X className="h-4 w-4 mr-2" />
              No Icon
            </Button>
          </div>

          {/* Icons - Responsive Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-2.5">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  onSelect(name)
                  onClose()
                }}
                className={`group relative flex flex-col items-center justify-center p-2.5 md:p-3 rounded-lg border transition-all active:scale-95 md:hover:scale-110 md:hover:shadow-lg ${
                  currentIcon === name
                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                    : 'border-border bg-background active:border-primary/50 active:bg-primary/5 md:hover:border-primary/50 md:hover:bg-primary/5'
                }`}
                title={name}
              >
                <Icon className={`h-5 w-5 md:h-6 md:w-6 ${
                  currentIcon === name ? 'text-primary' : 'text-foreground dark:text-white'
                }`} />
                {/* Tooltip - Hidden on mobile, shown on desktop hover */}
                <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background px-2 py-1 rounded border border-border shadow-lg z-10">
                  {name}
                </span>
              </button>
            ))}
          </div>

          {/* No results - Compact on mobile */}
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <Search className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
              <p className="text-sm md:text-base">No icons found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer - Compact on mobile */}
        <div className="sticky bottom-0 bg-card dark:bg-[#2A3441] border-t border-border p-2 md:p-4">
          <p className="text-[11px] md:text-xs text-muted-foreground text-center">
            {filteredIcons.length} icons • Lucide Icons
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper to get icon component by name
export function getIconByName(name: string) {
  const iconData = ICONS.find(i => i.name === name)
  return iconData?.icon || Link2
}
