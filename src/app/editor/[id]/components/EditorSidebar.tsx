/**
 * Editor Sidebar Component
 * Desktop sidebar navigation with stats
 */

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { ArrowLeft, Edit3, Palette, Settings } from "lucide-react"
import Link from "next/link"

interface EditorSidebarProps {
  handle: string
  status: 'DRAFT' | 'PUBLISHED'
  linkCount: number
  activeTab: 'edit' | 'design' | 'settings'
  onTabChange: (tab: 'edit' | 'design' | 'settings') => void
}

export function EditorSidebar({
  handle,
  status,
  linkCount,
  activeTab,
  onTabChange
}: EditorSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-border/50 lg:bg-gradient-to-b lg:from-card lg:to-card/95 backdrop-blur-sm flex-shrink-0">
      {/* Sidebar Header with Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            LinkQ Editor
          </h2>
          <p className="text-xs text-muted-foreground mt-1">@{handle}</p>
        </div>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 rounded-xl group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Sidebar Menu with Enhanced Styling */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => onTabChange('edit')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'edit'
                ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-4 border-primary shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'edit' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
              <Edit3 className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left">Links</span>
            {activeTab === 'edit' && (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onTabChange('design')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'design'
                ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-600 dark:text-purple-400 border-l-4 border-purple-500 shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'design' ? 'bg-purple-500/20' : 'bg-secondary/50'}`}>
              <Palette className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left">Design</span>
            {activeTab === 'design' && (
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500 shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'settings' ? 'bg-orange-500/20' : 'bg-secondary/50'}`}>
              <Settings className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left">Settings</span>
            {activeTab === 'settings' && (
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Quick Stats Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                status === 'PUBLISHED'
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
              }`}>
                {status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Links</span>
              <span className="text-xs font-medium text-foreground">
                {linkCount}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Footer with Enhanced Theme Toggle */}
      <div className="p-4 border-t border-border/50 bg-secondary/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Appearance</span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
