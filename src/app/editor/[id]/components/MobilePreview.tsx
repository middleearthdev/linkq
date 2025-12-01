/**
 * Mobile Preview Component
 * Fullscreen preview for mobile devices
 */

import { Button } from "@/components/ui/button"
import { Smartphone, X } from "lucide-react"
import { DynamicTemplateRenderer } from "@/components/DynamicTemplateRenderer"

interface MobilePreviewProps {
  isOpen: boolean
  onClose: () => void
  siteData: any
}

export function MobilePreview({ isOpen, onClose, siteData }: MobilePreviewProps) {
  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-background">
      <div className="h-full overflow-hidden">
        {/* Compact Preview Header */}
        <div className="px-3 py-2 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground dark:text-white font-medium">Preview</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground dark:hover:text-white p-1.5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Preview Content - Full Width */}
        <div className="h-[calc(100vh-50px)] overflow-y-auto editor-preview-bg">
          <div className="w-full h-full">
            <DynamicTemplateRenderer
              siteData={siteData}
              isPreview={true}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
