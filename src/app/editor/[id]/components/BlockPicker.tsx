/**
 * Block Picker Modal Component
 * Modal for selecting and adding new blocks
 */

import { Button } from "@/components/ui/button"
import {
  X,
  Link2,
  Hash,
  Minus,
  FootprintsIcon,
  Image,
  BarChart3,
  Package,
  ShoppingBag,
  Sparkles,
  MapPin,
  QrCode
} from "lucide-react"

interface BlockPickerProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (blockType: string) => void
}

export function BlockPicker({ isOpen, onClose, onAddBlock }: BlockPickerProps) {
  if (!isOpen) return null

  const handleAddBlock = (blockType: string) => {
    onAddBlock(blockType)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card dark:bg-[#1A2332] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-card dark:bg-[#1A2332] border-b border-border/50 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground dark:text-white">Add Block</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose a block to add to your page</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Block Options */}
        <div className="p-6 space-y-6">
          {/* Basic Blocks */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Basic Blocks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Link List Block */}
              <BlockOption
                icon={Link2}
                title="Links"
                description="Clickable link buttons"
                color="primary"
                onClick={() => handleAddBlock('link-list')}
              />

              {/* Social Icons Block */}
              <BlockOption
                icon={Hash}
                title="Social Icons"
                description="Social media links"
                color="blue"
                onClick={() => handleAddBlock('social-icons')}
              />

              {/* Divider Block */}
              <BlockOption
                icon={Minus}
                title="Divider"
                description="Horizontal separator"
                color="gray"
                onClick={() => handleAddBlock('divider')}
              />

              {/* Footer Block */}
              <BlockOption
                icon={FootprintsIcon}
                title="Footer"
                description="Copyright & links"
                color="slate"
                onClick={() => handleAddBlock('footer')}
              />
            </div>
          </div>

          {/* Media & Content */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Media & Content</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Gallery Block */}
              <BlockOption
                icon={Image}
                title="Gallery"
                description="Image & video grid"
                color="pink"
                onClick={() => handleAddBlock('gallery')}
              />

              {/* Analytics Block */}
              <BlockOption
                icon={BarChart3}
                title="Analytics"
                description="Site statistics"
                color="indigo"
                onClick={() => handleAddBlock('analytics')}
              />
            </div>
          </div>

          {/* Indonesia Business */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Indonesia Business 🇮🇩</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Delivery Platform */}
              <BlockOption
                icon={Package}
                title="Food Delivery"
                description="GoFood, GrabFood, etc"
                color="orange"
                onClick={() => handleAddBlock('delivery-platform')}
              />

              {/* Marketplace */}
              <BlockOption
                icon={ShoppingBag}
                title="E-Commerce Store"
                description="Tokped, Shopee, TikTok"
                color="red"
                onClick={() => handleAddBlock('marketplace')}
              />

              {/* Product Catalog */}
              <BlockOption
                icon={Sparkles}
                title="Product Catalog"
                description="Showcase products"
                color="purple"
                onClick={() => handleAddBlock('product-catalog')}
              />

              {/* Location */}
              <BlockOption
                icon={MapPin}
                title="Location & Map"
                description="Google Maps embed"
                color="cyan"
                onClick={() => handleAddBlock('location')}
              />

              {/* QRIS Payment */}
              <BlockOption
                icon={QrCode}
                title="QRIS Payment"
                description="QR code payments"
                color="teal"
                onClick={() => handleAddBlock('qris-payment')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Block Option Component
interface BlockOptionProps {
  icon: React.ElementType
  title: string
  description: string
  color: string
  onClick: () => void
}

function BlockOption({ icon: Icon, title, description, color, onClick }: BlockOptionProps) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 group-hover:bg-primary/20 text-primary',
    blue: 'bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-500',
    gray: 'bg-gray-500/10 group-hover:bg-gray-500/20 text-gray-500',
    slate: 'bg-slate-500/10 group-hover:bg-slate-500/20 text-slate-500',
    pink: 'bg-pink-500/10 group-hover:bg-pink-500/20 text-pink-500',
    indigo: 'bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-500',
    orange: 'bg-orange-500/10 group-hover:bg-orange-500/20 text-orange-500',
    red: 'bg-red-500/10 group-hover:bg-red-500/20 text-red-500',
    purple: 'bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-500',
    cyan: 'bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-500',
    teal: 'bg-teal-500/10 group-hover:bg-teal-500/20 text-teal-500',
  }

  return (
    <button
      onClick={onClick}
      className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card dark:bg-[#2A3441] hover:bg-primary/5 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]} transition-colors`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground dark:text-white text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}
