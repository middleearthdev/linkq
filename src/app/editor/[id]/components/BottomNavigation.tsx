/**
 * Bottom Navigation Component
 * Fixed bottom navigation bar for mobile (Linktree-inspired)
 * Ergonomic, thumb-friendly design
 */

import { Link2, Palette, Eye, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab: 'edit' | 'design' | 'preview' | 'settings'
  onTabChange: (tab: 'edit' | 'design' | 'preview' | 'settings') => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'edit' as const,
      label: 'Links',
      icon: Link2,
      activeColor: 'text-primary border-primary',
      inactiveColor: 'text-muted-foreground'
    },
    {
      id: 'design' as const,
      label: 'Design',
      icon: Palette,
      activeColor: 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400',
      inactiveColor: 'text-muted-foreground'
    },
    {
      id: 'preview' as const,
      label: 'Preview',
      icon: Eye,
      activeColor: 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400',
      inactiveColor: 'text-muted-foreground'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      activeColor: 'text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400',
      inactiveColor: 'text-muted-foreground'
    }
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.24)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full relative
                transition-all duration-200 ease-in-out
                min-w-0 px-2
                ${isActive ? 'scale-100' : 'scale-95'}
              `}
            >
              {/* Active Border Top Indicator */}
              {isActive && (
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-12 rounded-b-full ${tab.activeColor.split(' ')[1]} transition-all duration-200`}
                />
              )}

              {/* Icon */}
              <Icon
                className={`
                  h-6 w-6 mb-1 transition-all duration-200
                  ${isActive ? tab.activeColor.split(' ')[0] : tab.inactiveColor}
                  ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}
                `}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Label */}
              <span
                className={`
                  text-[10px] font-medium transition-all duration-200 truncate w-full text-center
                  ${isActive ? tab.activeColor.split(' ')[0] : tab.inactiveColor}
                `}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
