/**
 * Settings Tab Component
 * Site settings and configuration
 */

import { Settings } from "lucide-react"

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Site Settings</h2>
      <div className="text-center py-12 text-muted-foreground">
        <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Advanced settings coming soon</p>
        <p className="text-sm">Custom domains, analytics, and more</p>
      </div>
    </div>
  )
}
