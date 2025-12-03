/**
 * Enhanced Design Tab Component
 * Sub-navigation structure inspired by Linktree
 * Organized sections for better UX
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Palette,
  ImageIcon,
  Type,
  RectangleHorizontal,
  Droplet,
  ChevronDown,
  ChevronRight,
  User,
  Sparkles
} from "lucide-react"
import FontPicker from "@/components/FontPicker"

interface DesignTabEnhancedProps {
  templateName: string
  currentFont?: string
  onFontChange: (font: string | undefined) => void
  onOpenTemplatePicker: () => void
  // Desktop only - shows sub-navigation
  isMobile?: boolean
}

type DesignSection = 'profile' | 'theme' | 'typography' | 'buttons' | 'colors' | null

export function DesignTabEnhanced({
  templateName,
  currentFont,
  onFontChange,
  onOpenTemplatePicker,
  isMobile = false
}: DesignTabEnhancedProps) {
  const [activeSection, setActiveSection] = useState<DesignSection>('theme')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['theme', 'typography']))

  const sections = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      description: 'Bio and avatar settings',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'theme' as const,
      label: 'Theme',
      icon: Palette,
      description: 'Template and color schemes',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10'
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
    },
    {
      id: 'colors' as const,
      label: 'Colors',
      icon: Droplet,
      description: 'Background and accents',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-500/10'
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

  // Mobile: Collapsible sections
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Profile Section */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('profile')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground dark:text-white">Profile</h3>
                <p className="text-xs text-muted-foreground">Bio and avatar settings</p>
              </div>
            </div>
            {expandedSections.has('profile') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('profile') && (
            <div className="p-4 pt-0 border-t border-border">
              <p className="text-sm text-muted-foreground">Profile settings managed in Edit tab</p>
            </div>
          )}
        </Card>

        {/* Theme Section */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('theme')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground dark:text-white">Theme</h3>
                <p className="text-xs text-muted-foreground">Template selection</p>
              </div>
            </div>
            {expandedSections.has('theme') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('theme') && (
            <div className="p-4 pt-0 border-t border-border space-y-3">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground dark:text-white mb-0.5">Current</h4>
                    <p className="text-xs text-muted-foreground">{templateName}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-border flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-border hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={onOpenTemplatePicker}
              >
                <Palette className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          )}
        </Card>

        {/* Typography Section */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('typography')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Type className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground dark:text-white">Typography</h3>
                <p className="text-xs text-muted-foreground">Font settings</p>
              </div>
            </div>
            {expandedSections.has('typography') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('typography') && (
            <div className="p-4 pt-0 border-t border-border">
              <FontPicker
                value={currentFont}
                onChange={onFontChange}
                label="Font Family"
              />
            </div>
          )}
        </Card>

        {/* Buttons Section */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('buttons')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <RectangleHorizontal className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground dark:text-white">Buttons</h3>
                <p className="text-xs text-muted-foreground">Link button styles</p>
              </div>
            </div>
            {expandedSections.has('buttons') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('buttons') && (
            <div className="p-4 pt-0 border-t border-border">
              <p className="text-sm text-muted-foreground">Button customization coming soon</p>
            </div>
          )}
        </Card>

        {/* Colors Section */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Droplet className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground dark:text-white">Colors</h3>
                <p className="text-xs text-muted-foreground">Background colors</p>
              </div>
            </div>
            {expandedSections.has('colors') ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.has('colors') && (
            <div className="p-4 pt-0 border-t border-border">
              <p className="text-sm text-muted-foreground">Color customization coming soon</p>
            </div>
          )}
        </Card>
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
        {activeSection === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Profile Settings</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Profile settings are managed in the Edit tab</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'theme' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Theme & Templates</h2>
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
          </div>
        )}

        {activeSection === 'typography' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Typography</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground dark:text-white flex items-center">
                  <Type className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
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
          </div>
        )}

        {activeSection === 'buttons' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Button Styles</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Button style customization coming soon</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'colors' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Colors & Backgrounds</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Color customization coming soon</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
