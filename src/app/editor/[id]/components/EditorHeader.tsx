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
  ExternalLink
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
  variant = 'desktop'
}: EditorHeaderProps) {

  if (variant === 'mobile') {
    return (
      <header className="lg:hidden px-3 sm:px-4 py-3 sm:py-4 bg-background border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground dark:text-white p-1.5 sm:p-2 hover:bg-secondary">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-semibold text-foreground dark:text-white truncate">Editor</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">@{handle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="hidden xs:block">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1.5 sm:p-2 ${showPreview ? 'bg-primary text-white hover:bg-primary/90' : 'text-foreground dark:text-white hover:bg-secondary'}`}
              onClick={onTogglePreview}
            >
              {showPreview ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Button
              onClick={onSave}
              disabled={saving}
              size="sm"
              className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-60 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            {status === 'DRAFT' ? (
              <Button
                onClick={onPublish}
                disabled={publishing || saving}
                size="sm"
                className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 shadow-sm hidden xs:inline-flex"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </Button>
            ) : (
              <Button
                onClick={onPublish}
                disabled={publishing || saving}
                variant="outline"
                size="sm"
                className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm rounded-lg sm:rounded-xl border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 disabled:opacity-60 hidden xs:inline-flex"
              >
                {publishing ? 'Unpublishing...' : 'Unpublish'}
              </Button>
            )}
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
