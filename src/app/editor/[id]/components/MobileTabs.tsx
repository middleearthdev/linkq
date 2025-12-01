/**
 * Mobile Tabs Component
 * Mobile navigation tabs for editor sections
 */

import { Edit3, Palette, Settings } from "lucide-react"

interface MobileTabsProps {
  activeTab: 'edit' | 'design' | 'settings'
  onTabChange: (tab: 'edit' | 'design' | 'settings') => void
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="mt-3 sm:mt-4 flex rounded-lg sm:rounded-xl p-0.5 sm:p-1 bg-secondary/50 dark:bg-card border border-border">
      <button
        onClick={() => onTabChange('edit')}
        className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${
          activeTab === 'edit'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        }`}
      >
        <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
        <span className="text-[10px] sm:text-xs">Edit</span>
      </button>

      <button
        onClick={() => onTabChange('design')}
        className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${
          activeTab === 'design'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        }`}
      >
        <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
        <span className="text-[10px] sm:text-xs">Design</span>
      </button>

      <button
        onClick={() => onTabChange('settings')}
        className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${
          activeTab === 'settings'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        }`}
      >
        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
        <span className="text-[10px] sm:text-xs">Settings</span>
      </button>
    </div>
  )
}
