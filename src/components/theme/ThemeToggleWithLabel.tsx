'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggleWithLabel() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-border text-foreground"
      >
        <Sun className="h-4 w-4" />
        <span className="text-sm">Dark</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="gap-2 border-border hover:bg-secondary text-foreground"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="text-sm">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="text-sm">Dark Mode</span>
        </>
      )}
    </Button>
  )
}
