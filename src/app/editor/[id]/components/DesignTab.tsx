/**
 * Design Tab Component
 * Theme and template customization
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import FontPicker from "@/components/FontPicker"

interface DesignTabProps {
  templateName: string
  currentFont?: string
  onFontChange: (font: string) => void
  onOpenTemplatePicker: () => void
}

export function DesignTab({
  templateName,
  currentFont,
  onFontChange,
  onOpenTemplatePicker
}: DesignTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Design & Typography</h2>

      {/* Global Font Settings */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground dark:text-white flex items-center">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            Global Font Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FontPicker
            value={currentFont}
            onChange={onFontChange}
            label="Choose Font Family"
          />
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground dark:text-white flex items-center">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            Template & Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Template Info */}
            <div className="p-4 rounded-lg bg-secondary/50 dark:bg-secondary/50 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground dark:text-white font-medium mb-1">Current Template</h4>
                  <p className="text-muted-foreground text-sm">{templateName}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-border flex items-center justify-center">
                  <Palette className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Template Picker Button */}
            <Button
              variant="outline"
              className="w-full border-border text-foreground dark:text-white hover:border-primary hover:text-primary dark:hover:text-white"
              onClick={onOpenTemplatePicker}
            >
              <Palette className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              Switch templates anytime without losing your content
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
