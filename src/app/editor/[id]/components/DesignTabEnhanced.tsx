/**
 * Enhanced Design Tab Component
 * Focus on STYLING & DESIGN only (not content editing)
 * Sections: Profile Style, Theme, Wallpaper, Typography, Buttons
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Palette,
  Type,
  RectangleHorizontal,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  User,
  Sparkles,
  Check
} from "lucide-react"
import FontPicker from "@/components/FontPicker"
import { generateWallpaperStyle } from "@/components/DynamicTemplateRenderer"
import { STYLE_TEMPLATES, COLOR_PRESETS, type LinkListStyle } from "@/lib/link-list-styles"
import { cn } from "@/lib/utils"
import { LinkListBlock } from "@/components/blocks/LinkListBlock"

interface Block {
  id: string
  type: string
  props: any
}

interface DesignTabEnhancedProps {
  templateName: string
  currentFont?: string
  onFontChange: (font: string | undefined) => void
  onOpenTemplatePicker: () => void

  // Bio block for styling only
  bioBlock?: Block
  onUpdateBlock?: (blockId: string, newProps: any) => void

  // Wallpaper configuration
  wallpaperConfig?: {
    type?: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
    color?: string
    pattern?: 'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'
    blur?: 'light' | 'medium' | 'heavy' | 'glass'
  }
  onWallpaperChange?: (config: {
    type: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
    color: string
    pattern?: 'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'
    blur?: 'light' | 'medium' | 'heavy' | 'glass'
  }) => void

  // Text styling configuration
  textColors?: {
    title?: string
    pageText?: string
    buttonText?: string
  }
  textSize?: 'small' | 'large'
  onTextColorsChange?: (colors: { title?: string; pageText?: string; buttonText?: string }) => void
  onTextSizeChange?: (size: 'small' | 'large') => void

  // LinkList button colors configuration
  linkListColors?: {
    primary?: string
    secondary?: string
    text?: string
  }
  onLinkListColorsChange?: (colors: { primary?: string; secondary?: string; text?: string }) => void

  // LinkList style configuration
  linkListStyle?: LinkListStyle
  onLinkListStyleChange?: (style: LinkListStyle) => void

  // Desktop only - shows sub-navigation
  isMobile?: boolean
}

type DesignSection = 'profile' | 'theme' | 'wallpaper' | 'typography' | 'buttons' | null

export function DesignTabEnhanced({
  templateName,
  currentFont,
  onFontChange,
  onOpenTemplatePicker,
  bioBlock,
  onUpdateBlock,
  wallpaperConfig,
  onWallpaperChange,
  textColors,
  textSize,
  onTextColorsChange,
  onTextSizeChange,
  linkListColors,
  onLinkListColorsChange,
  linkListStyle,
  onLinkListStyleChange,
  isMobile = false
}: DesignTabEnhancedProps) {
  const [activeSection, setActiveSection] = useState<DesignSection>('wallpaper')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['wallpaper']))

  // Wallpaper state - Initialize from props or defaults
  const [wallpaperType, setWallpaperType] = useState<'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'>(
    wallpaperConfig?.type || 'fill'
  )
  const [wallpaperColor, setWallpaperColor] = useState(wallpaperConfig?.color || '#8B2E3D')
  const [wallpaperPattern, setWallpaperPattern] = useState<'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'>(
    wallpaperConfig?.pattern || 'grid'
  )
  const [wallpaperBlur, setWallpaperBlur] = useState<'light' | 'medium' | 'heavy' | 'glass'>(
    wallpaperConfig?.blur || 'medium'
  )

  // Sync wallpaper changes to parent
  const updateWallpaper = (updates: Partial<{
    type: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video'
    color: string
    pattern: 'grid' | 'morph' | 'organic' | 'matrix' | 'dots' | 'waves' | 'diagonal' | 'hexagon' | 'zigzag' | 'triangles' | 'circles' | 'squares'
    blur: 'light' | 'medium' | 'heavy' | 'glass'
  }>) => {
    const newConfig = {
      type: updates.type ?? wallpaperType,
      color: updates.color ?? wallpaperColor,
      pattern: updates.pattern ?? wallpaperPattern,
      blur: updates.blur ?? wallpaperBlur
    }

    if (updates.type !== undefined) setWallpaperType(updates.type)
    if (updates.color !== undefined) setWallpaperColor(updates.color)
    if (updates.pattern !== undefined) setWallpaperPattern(updates.pattern)
    if (updates.blur !== undefined) setWallpaperBlur(updates.blur)

    onWallpaperChange?.(newConfig)
  }

  const sections = [
    {
      id: 'profile' as const,
      label: 'Profile Style',
      icon: User,
      description: 'Avatar & bio styling',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'theme' as const,
      label: 'Theme',
      icon: Palette,
      description: 'Template selection',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'wallpaper' as const,
      label: 'Wallpaper',
      icon: ImageIcon,
      description: 'Background customization',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      id: 'typography' as const,
      label: 'Typography',
      icon: Type,
      description: 'Fonts and text styles',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'buttons' as const,
      label: 'Buttons',
      icon: RectangleHorizontal,
      description: 'Link button styles',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ]

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Profile Style Content (Styling only, no content editing)
  const ProfileStyleContent = () => {
    const hasBio = !!bioBlock

    if (!hasBio) {
      return (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h4 className="font-semibold text-foreground dark:text-white mb-2">No Profile Section</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Enable profile section in the Edit tab first
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                Go to Edit Tab
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {/* Avatar Style */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Avatar Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Size */}
            <div>
              <Label className="text-xs mb-2 block">Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {['sm', 'md', 'lg'].map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateBlock?.(bioBlock.id, { ...bioBlock.props, avatarSize: size })}
                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all ${bioBlock.props.avatarSize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Style (formerly Shape) */}
            <div>
              <Label className="text-xs mb-2 block">Avatar Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'circle', label: 'Circle' },
                  { value: 'square', label: 'Square' },
                  { value: 'rounded-frame', label: 'Rounded' },
                  { value: 'wave', label: 'Wave' },
                  { value: 'polaroid', label: 'Polaroid' },
                  { value: 'vintage', label: 'Vintage' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onUpdateBlock?.(bioBlock.id, { ...bioBlock.props, avatarStyle: style.value })}
                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all ${bioBlock.props.avatarStyle === style.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio Text Style - NEW */}
            <div>
              <Label className="text-xs mb-2 block">Bio Text Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'default', label: 'Default' },
                  { value: 'large', label: 'Large' },
                  { value: 'small', label: 'Small' },
                  { value: 'quote', label: 'Quote' },
                  { value: 'modern', label: 'Modern' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onUpdateBlock?.(bioBlock.id, { ...bioBlock.props, bioStyle: style.value })}
                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all ${bioBlock.props.bioStyle === style.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <Label className="text-xs mb-2 block">Text Alignment</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' }
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={() => onUpdateBlock?.(bioBlock.id, { ...bioBlock.props, textAlign: align.value })}
                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all ${bioBlock.props.textAlign === align.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Helper function to generate preview wallpaper style
  const getPreviewWallpaperStyle = (type: typeof wallpaperType) => {
    // Generate wallpaper dengan current color dan pattern
    return generateWallpaperStyle({
      type,
      color: wallpaperColor,
      pattern: wallpaperPattern,
      blur: wallpaperBlur
    })
  }

  // Wallpaper Content (Like Linktree)
  const WallpaperContent = () => (
    <div className="space-y-4">
      {/* Wallpaper Style */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground dark:text-white">
            Wallpaper Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'fill' as const, label: 'Fill' },
              { type: 'gradient' as const, label: 'Gradient' },
              { type: 'blur' as const, label: 'Blur' },
              { type: 'pattern' as const, label: 'Pattern' },
              { type: 'image' as const, label: 'Image' },
              { type: 'video' as const, label: 'Video' }
            ].map((item) => {
              // Generate preview style untuk setiap type
              const previewStyle = item.type !== 'image' && item.type !== 'video'
                ? { background: getPreviewWallpaperStyle(item.type) }
                : {}

              return (
                <button
                  key={item.type}
                  onClick={() => updateWallpaper({ type: item.type })}
                  className={`relative p-3 rounded-lg border-2 transition-all ${wallpaperType === item.type
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/* Preview Box - Shows actual wallpaper */}
                    <div
                      className="w-full h-16 rounded-md border border-border/50 overflow-hidden relative"
                      style={previewStyle}
                    >
                      {/* Untuk Image dan Video, tampilkan placeholder */}
                      {(item.type === 'image' || item.type === 'video') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      {/* Overlay untuk visual depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <span className={`text-xs font-medium ${wallpaperType === item.type ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                      {item.label}
                    </span>
                  </div>
                  {wallpaperType === item.type && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Picker - Show for all types except Image and Video */}
      {(wallpaperType !== 'image' && wallpaperType !== 'video') && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={wallpaperColor}
                    onChange={(e) => updateWallpaper({ color: e.target.value })}
                    className="sr-only"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: wallpaperColor }}
                  />
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={wallpaperColor}
                    onChange={(e) => updateWallpaper({ color: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Suggested Colors */}
              <div>
                <Label className="text-xs mb-2 block text-muted-foreground">
                  Suggested colors
                </Label>
                <div className="flex gap-2">
                  {['#8B2E3D', '#FFFFFF', '#000000', '#4F46E5', '#10B981'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateWallpaper({ color })}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-all"
                      style={{ backgroundColor: color }}
                    >
                      {wallpaperColor === color && (
                        <Check className="h-4 w-4 text-white mx-auto drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Selector */}
      {wallpaperType === 'pattern' && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {[
                { type: 'grid' as const, label: 'Grid' },
                { type: 'dots' as const, label: 'Dots' },
                { type: 'waves' as const, label: 'Waves' },
                { type: 'diagonal' as const, label: 'Diagonal' },
                { type: 'hexagon' as const, label: 'Hexagon' },
                { type: 'zigzag' as const, label: 'Zigzag' },
                { type: 'morph' as const, label: 'Morph' },
                { type: 'organic' as const, label: 'Organic' },
                { type: 'triangles' as const, label: 'Triangles' },
                { type: 'circles' as const, label: 'Circles' },
                { type: 'squares' as const, label: 'Squares' },
                { type: 'matrix' as const, label: 'Matrix' }
              ].map((pattern) => {
                // Generate preview dengan current color
                const patternPreviewStyle = {
                  background: generateWallpaperStyle({
                    type: 'pattern',
                    color: wallpaperColor,
                    pattern: pattern.type,
                    blur: wallpaperBlur
                  })
                }

                return (
                  <button
                    key={pattern.type}
                    onClick={() => updateWallpaper({ pattern: pattern.type })}
                    className={`relative p-2 rounded-lg border-2 transition-all ${wallpaperPattern === pattern.type
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      {/* Preview Box - Shows actual pattern */}
                      <div
                        className="w-full h-12 rounded-md border border-border/50 overflow-hidden relative"
                        style={patternPreviewStyle}
                      >
                        {/* Overlay untuk depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <span className={`text-xs font-medium ${wallpaperPattern === pattern.type ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        {pattern.label}
                      </span>
                    </div>
                    {wallpaperPattern === pattern.type && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blur Selector */}
      {wallpaperType === 'blur' && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Blur Intensity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'light' as const, label: 'Light' },
                { type: 'medium' as const, label: 'Medium' },
                { type: 'heavy' as const, label: 'Heavy' },
                { type: 'glass' as const, label: 'Glass' }
              ].map((blurOption) => {
                // Generate preview dengan current color dan blur type
                const blurPreviewStyle = {
                  background: generateWallpaperStyle({
                    type: 'blur',
                    color: wallpaperColor,
                    blur: blurOption.type
                  })
                }

                return (
                  <button
                    key={blurOption.type}
                    onClick={() => updateWallpaper({ blur: blurOption.type })}
                    className={`relative p-3 rounded-lg border-2 transition-all ${wallpaperBlur === blurOption.type
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {/* Preview Box - Shows actual blur */}
                      <div
                        className="w-full h-16 rounded-md border border-border/50 overflow-hidden relative"
                        style={blurPreviewStyle}
                      >
                        {/* Overlay untuk depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <span className={`text-xs font-medium ${wallpaperBlur === blurOption.type ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        {blurOption.label}
                      </span>
                    </div>
                    {wallpaperBlur === blurOption.type && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon for Image/Video */}
      {(wallpaperType === 'image' || wallpaperType === 'video') && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center py-4">
              <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {wallpaperType === 'image' ? 'Image' : 'Video'} wallpaper coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Theme Content
  const ThemeContent = () => (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-foreground dark:text-white font-medium mb-1">Current Template</h4>
              <p className="text-muted-foreground text-sm">{templateName}</p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-border flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-border hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
          onClick={onOpenTemplatePicker}
        >
          <Palette className="w-4 h-4 mr-2" />
          Browse All Templates
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Switch templates anytime without losing your content
        </p>
      </CardContent>
    </Card>
  )

  // Typography Content
  const TypographyContent = () => {
    const titleColor = textColors?.title || '#000000'
    const pageTextColor = textColors?.pageText || '#000000'
    const buttonTextColor = textColors?.buttonText || '#FFFFFF'
    const currentTextSize = textSize || 'small'

    const updateTitleColor = (color: string) => {
      onTextColorsChange?.({ ...textColors, title: color })
    }

    const updatePageTextColor = (color: string) => {
      onTextColorsChange?.({ ...textColors, pageText: color })
    }

    const updateButtonTextColor = (color: string) => {
      onTextColorsChange?.({ ...textColors, buttonText: color })
    }

    return (
      <div className="space-y-4">
        {/* Text Styling */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Font */}
            <div>
              <Label className="text-xs mb-2 block text-muted-foreground">
                Title font
              </Label>
              <FontPicker
                value={currentFont}
                onChange={onFontChange}
                label=""
              />
            </div>

            {/* Title Color */}
            <div>
              <Label className="text-xs mb-2 block text-muted-foreground">
                Title color
              </Label>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => updateTitleColor(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: titleColor }}
                  />
                </label>
                <input
                  type="text"
                  value={titleColor}
                  onChange={(e) => updateTitleColor(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Text Size Toggle */}
            <div>
              <Label className="text-xs mb-2 block text-muted-foreground">
                Text size
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onTextSizeChange?.('small')}
                  className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${currentTextSize === 'small'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                >
                  Small
                </button>
                <button
                  onClick={() => onTextSizeChange?.('large')}
                  className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${currentTextSize === 'large'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                >
                  Large
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page and Buttons */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground dark:text-white">
              Page and buttons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Page Text Color */}
            <div>
              <Label className="text-xs mb-2 block text-muted-foreground">
                Page text color
              </Label>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={pageTextColor}
                    onChange={(e) => updatePageTextColor(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: pageTextColor }}
                  />
                </label>
                <input
                  type="text"
                  value={pageTextColor}
                  onChange={(e) => updatePageTextColor(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Button Text Color */}
            <div>
              <Label className="text-xs mb-2 block text-muted-foreground">
                Button text color
              </Label>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={buttonTextColor}
                    onChange={(e) => updateButtonTextColor(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: buttonTextColor }}
                  />
                </label>
                <input
                  type="text"
                  value={buttonTextColor}
                  onChange={(e) => updateButtonTextColor(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Buttons Content
  const ButtonsContent = () => {
    const handleColorChange = (colorKey: 'primary' | 'secondary' | 'text', value: string) => {
      if (onLinkListColorsChange) {
        onLinkListColorsChange({
          ...linkListColors,
          [colorKey]: value
        })
      }
    }

    const handleResetColors = () => {
      if (onLinkListColorsChange) {
        onLinkListColorsChange({
          primary: undefined,
          secondary: undefined,
          text: undefined
        })
      }
    }

    const handleStyleChange = (style: LinkListStyle) => {
      if (onLinkListStyleChange) {
        onLinkListStyleChange(style)
      }
    }

    const hasCustomColors = linkListColors?.primary || linkListColors?.secondary || linkListColors?.text
    const currentStyle = linkListStyle || 'pill'

    // Group styles by category
    const basicStyles = STYLE_TEMPLATES.filter(s => s.category === 'basic')
    const creativeStyles = STYLE_TEMPLATES.filter(s => s.category === 'creative')
    const gameStyles = STYLE_TEMPLATES.filter(s => s.category === 'game')
    const culinaryStyles = STYLE_TEMPLATES.filter(s => s.category === 'culinary')

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground dark:text-white">Link Buttons</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Choose style and customize colors
            </p>
          </div>
          {hasCustomColors && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetColors}
              className="text-xs"
            >
              Reset Colors
            </Button>
          )}
        </div>

        {/* Style Picker */}
        <div className="space-y-4">
          <Label className="text-sm font-medium block">Button Style ({STYLE_TEMPLATES.length} styles)</Label>

          {/* Render helper function to avoid repetition */}
          {(() => {
            const renderStyleCategory = (styles: typeof STYLE_TEMPLATES, categoryName: string) => {
              if (styles.length === 0) return null

              return (
                <div key={categoryName}>
                  <p className="text-xs text-muted-foreground mb-2">{categoryName} ({styles.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {styles.map((style) => {
                      const isSelected = currentStyle === style.id

                      return (
                        <div
                          key={style.id}
                          onClick={() => handleStyleChange(style.id)}
                          className={cn(
                            'relative p-2 border-2 rounded-lg transition-all hover:scale-105 bg-card overflow-hidden cursor-pointer',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          {/* Actual LinkListBlock preview in mini scale */}
                          <div className="h-10 overflow-hidden flex items-center justify-center bg-muted/30 rounded pointer-events-none">
                            <div className="scale-[0.6] w-[166%] origin-center">
                              <LinkListBlock
                                props={{
                                  style: style.id,
                                  items: [{ id: '1', title: '', url: '#', isActive: true }],
                                  customColors: linkListColors?.primary || linkListColors?.secondary || linkListColors?.text ? {
                                    primary: linkListColors?.primary,
                                    secondary: linkListColors?.secondary,
                                    text: linkListColors?.text,
                                  } : undefined
                                }}
                                isEditing={true}
                              />
                            </div>
                          </div>

                          {/* Style name label */}
                          <p className="text-[10px] font-medium text-center mt-1.5 truncate text-foreground">
                            {style.name}
                          </p>

                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }

            return (
              <>
                {renderStyleCategory(basicStyles, 'Basic')}
                {renderStyleCategory(creativeStyles, 'Creative')}
                {renderStyleCategory(gameStyles, 'Game Inspired')}
                {renderStyleCategory(culinaryStyles, 'Culinary & F&B')}
              </>
            )
          })()}
        </div>

        {/* Color Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium block">Color Presets</Label>
          <p className="text-xs text-muted-foreground">Quick start with popular color combinations</p>

          <div className="grid grid-cols-2 gap-2">
            {COLOR_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  if (onLinkListColorsChange) {
                    onLinkListColorsChange({
                      primary: preset.colors.primary,
                      secondary: preset.colors.secondary,
                      text: preset.colors.text
                    })
                  }
                }}
                className="flex items-center justify-between p-3 border-2 border-border rounded-lg hover:border-primary/50 transition-all bg-card hover:bg-accent/50"
              >
                <span className="text-xs font-medium">{preset.name}</span>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.colors.text }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-medium block">Custom Colors</Label>

          {/* Primary Color (Background) */}
          <div>
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">
              Background
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={linkListColors?.primary || '#3b82f6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={linkListColors?.primary || ''}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#3b82f6 (default)"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">
              Secondary (Gradient/Accent)
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={linkListColors?.secondary || '#2563eb'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={linkListColors?.secondary || ''}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#2563eb (default)"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">
              Text
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={linkListColors?.text || textColors?.buttonText || '#ffffff'}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={linkListColors?.text || ''}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  placeholder={textColors?.buttonText || '#ffffff (default)'}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            {!linkListColors?.text && textColors?.buttonText && (
              <p className="text-xs text-muted-foreground mt-1">
                Using Typography button text color
              </p>
            )}
          </div>
        </div>


        {/* Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💡 <strong>Tip:</strong> Style and colors apply to all link buttons. Pick a style first, then customize the colors.
          </p>
        </div>
      </div>
    )
  }

  // Mobile: Collapsible sections
  if (isMobile) {
    return (
      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedSections.has(section.id)

          return (
            <Card key={section.id} className="bg-card border-border shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`h-4 w-4 ${section.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground dark:text-white">{section.label}</h3>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-border">
                  {section.id === 'profile' && <ProfileStyleContent />}
                  {section.id === 'theme' && <ThemeContent />}
                  {section.id === 'wallpaper' && <WallpaperContent />}
                  {section.id === 'typography' && <TypographyContent />}
                  {section.id === 'buttons' && <ButtonsContent />}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    )
  }

  // Desktop: Side navigation + content
  return (
    <div className="flex gap-6 min-h-0">
      {/* Left Sidebar - Sub Navigation */}
      <div className="w-56 flex-shrink-0">
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive
                    ? `${section.bgColor} ${section.color} font-medium shadow-sm`
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">
          {sections.find(s => s.id === activeSection)?.label || 'Design'}
        </h2>

        {activeSection === 'profile' && <ProfileStyleContent />}
        {activeSection === 'theme' && <ThemeContent />}
        {activeSection === 'wallpaper' && <WallpaperContent />}
        {activeSection === 'typography' && <TypographyContent />}
        {activeSection === 'buttons' && <ButtonsContent />}
      </div>
    </div>
  )
}
