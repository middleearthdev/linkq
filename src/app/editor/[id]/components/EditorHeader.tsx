/**
 * Editor Header Component
 * Desktop and mobile header with actions
 */

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  Globe,
  ExternalLink,
  Undo2,
  Redo2
} from "lucide-react"
import Link from "next/link"

interface EditorHeaderProps {
  // Site data
  handle: string
  status: 'DRAFT' | 'PUBLISHED'

  // States
  saving: boolean
  publishing: boolean
  showPreview: boolean

  // Actions
  onSave: () => void
  onPublish: () => void
  onTogglePreview: () => void

  // Undo/Redo (optional for mobile)
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void

  // Variant
  variant?: 'mobile' | 'desktop'
}

export function EditorHeader({
  handle,
  status,
  saving,
  publishing,
  showPreview,
  onSave,
  onPublish,
  onTogglePreview,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  variant = 'desktop'
}: EditorHeaderProps) {

  if (variant === 'mobile') {
    return (
      <header className="lg:hidden px-3 sm:px-4 py-2.5 sm:py-3 bg-background/95 backdrop-blur-lg border-b border-border flex-shrink-0 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-2">
          {/* Left Side - Back & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground dark:text-white p-1.5 sm:p-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-foreground dark:text-white truncate">Editor</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">@{handle}</p>
            </div>
          </div>

          {/* Right Side - Undo/Redo & Save */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Undo/Redo Buttons */}
            {onUndo && onRedo && (
              <div className="flex items-center gap-0.5 mr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="p-1.5 sm:p-2 h-8 w-8 disabled:opacity-30 hover:bg-secondary rounded-lg"
                  title="Undo"
                >
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="p-1.5 sm:p-2 h-8 w-8 disabled:opacity-30 hover:bg-secondary rounded-lg"
                  title="Redo"
                >
                  <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={onSave}
              disabled={saving}
              size="sm"
              className="px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-60 font-medium shadow-sm"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                  <span className="hidden xs:inline">Saving...</span>
                  <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
    )
  }

  // Desktop Header
  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-3 border-b bg-card/80 border-border/50 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Globe className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground dark:text-white">
            Edit Site
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your bio link content
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/${handle}`, '_blank')}
          className="h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg group"
        >
          <Globe className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-12 transition-transform" />
          <span>linkq.com/{handle}</span>
          <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
        </Button>

        <div className="h-5 w-px bg-border/50 mx-1" />

        <Button
          onClick={onSave}
          disabled={saving}
          size="sm"
          className="h-9 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-60 text-xs font-medium"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
              Saving
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </>
          )}
        </Button>

        {status === 'DRAFT' ? (
          <Button
            onClick={onPublish}
            disabled={publishing || saving}
            size="sm"
            className="h-9 px-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white disabled:opacity-60 text-xs font-medium"
          >
            {publishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                Publishing
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Publish
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onPublish}
            disabled={publishing || saving}
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 disabled:opacity-60 text-xs font-medium"
          >
            {publishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mr-1.5" />
                Unpublishing
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                Unpublish
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
