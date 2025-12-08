/**
 * Social Icons Manager - Fullscreen Dialog
 * Manages social media platform links
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, ChevronUp, ChevronDown, Trash2 } from "lucide-react"

interface Block {
  id: string
  type: string
  props: any
}

interface SocialIconsManagerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}

// Popular social platforms with brand colors
const POPULAR_PLATFORMS = [
  { key: 'instagram', name: 'Instagram', color: '#E4405F', icon: '📷' },
  { key: 'twitter', name: 'Twitter', color: '#1DA1F2', icon: '🐦' },
  { key: 'x', name: 'X', color: '#000000', icon: '✖' },
  { key: 'facebook', name: 'Facebook', color: '#1877F2', icon: '👍' },
  { key: 'tiktok', name: 'TikTok', color: '#000000', icon: '🎵' },
  { key: 'youtube', name: 'YouTube', color: '#FF0000', icon: '▶' },
  { key: 'linkedin', name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { key: 'github', name: 'GitHub', color: '#181717', icon: '💻' },
  { key: 'threads', name: 'Threads', color: '#000000', icon: '🧵' },
  { key: 'whatsapp', name: 'WhatsApp', color: '#25D366', icon: '💬' },
  { key: 'telegram', name: 'Telegram', color: '#26A5E4', icon: '✈️' },
  { key: 'discord', name: 'Discord', color: '#5865F2', icon: '🎮' },
  { key: 'snapchat', name: 'Snapchat', color: '#FFFC00', icon: '👻' },
  { key: 'pinterest', name: 'Pinterest', color: '#E60023', icon: '📌' },
  { key: 'twitch', name: 'Twitch', color: '#9146FF', icon: '🎮' },
  { key: 'spotify', name: 'Spotify', color: '#1DB954', icon: '🎵' },
  { key: 'soundcloud', name: 'SoundCloud', color: '#FF5500', icon: '🎧' },
  { key: 'medium', name: 'Medium', color: '#000000', icon: '📝' },
  { key: 'behance', name: 'Behance', color: '#1769FF', icon: '🎨' },
  { key: 'dribbble', name: 'Dribbble', color: '#EA4C89', icon: '🏀' },
]

export default function SocialIconsManagerDialog({
  block,
  onUpdateBlock,
  onClose
}: SocialIconsManagerDialogProps) {
  const platforms = block.props.platforms || []
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Add platform
  const addPlatform = (platformKey: string) => {
    const platformInfo = POPULAR_PLATFORMS.find(p => p.key === platformKey)
    if (!platformInfo) return

    // Check if already exists
    if (platforms.some((p: any) => p.platform === platformKey)) {
      alert(`${platformInfo.name} already added!`)
      return
    }

    const newPlatform = {
      platform: platformKey,
      url: '',
      username: ''
    }

    onUpdateBlock(block.id, {
      platforms: [...platforms, newPlatform]
    })

    // Auto-expand the newly added platform
    setTimeout(() => {
      setExpandedIndex(platforms.length)
    }, 100)
  }

  // Update platform
  const updatePlatform = (index: number, field: string, value: string) => {
    const newPlatforms = [...platforms]
    newPlatforms[index] = { ...newPlatforms[index], [field]: value }
    onUpdateBlock(block.id, { platforms: newPlatforms })
  }

  // Delete platform
  const deletePlatform = (index: number) => {
    const newPlatforms = platforms.filter((_: any, i: number) => i !== index)
    onUpdateBlock(block.id, { platforms: newPlatforms })
    if (expandedIndex === index) setExpandedIndex(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Get added platform keys
  const addedPlatformKeys = platforms.map((p: any) => p.platform)

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg truncate">Social Links Manager</h2>
              <p className="text-xs text-muted-foreground">
                {platforms.length} {platforms.length === 1 ? 'platform' : 'platforms'} connected
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 p-0 flex-shrink-0"
            title="Close (Esc)"
          >
            <Copy className="h-4 w-4 rotate-45" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">

          {/* Added Platforms */}
          {platforms.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Connected Platforms</h3>
              {platforms.map((platform: any, index: number) => {
                const platformInfo = POPULAR_PLATFORMS.find(p => p.key === platform.platform)
                const isExpanded = expandedIndex === index

                return (
                  <div
                    key={index}
                    className="border-2 rounded-lg bg-card overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/30">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: platformInfo?.color + '20' }}
                      >
                        {platformInfo?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{platformInfo?.name || platform.platform}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {platform.username ? `@${platform.username}` : platform.url || 'Not configured'}
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="p-2 hover:bg-background rounded-lg transition-all"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deletePlatform(index)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded Form */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 border-t">
                        <div>
                          <label className="text-xs font-medium block mb-1.5">Username</label>
                          <Input
                            value={platform.username || ''}
                            onChange={(e) => updatePlatform(index, 'username', e.target.value)}
                            placeholder="yourusername"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium block mb-1.5">Full URL (Optional)</label>
                          <Input
                            value={platform.url || ''}
                            onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                            placeholder={`https://${platformInfo?.name.toLowerCase()}.com/yourusername`}
                            className="h-9"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Leave empty to auto-generate from username
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add New Platform */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Add Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {POPULAR_PLATFORMS.map((platform) => {
                const isAdded = addedPlatformKeys.includes(platform.key)
                return (
                  <button
                    key={platform.key}
                    onClick={() => !isAdded && addPlatform(platform.key)}
                    disabled={isAdded}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${isAdded
                      ? 'opacity-50 cursor-not-allowed bg-secondary/50'
                      : 'hover:border-primary hover:bg-primary/5 active:scale-95'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs font-medium truncate">{platform.name}</span>
                    </div>
                    {isAdded && (
                      <span className="text-[10px] text-green-600 font-medium">✓ Added</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Empty State */}
          {platforms.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Share2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold mb-2">No Social Links Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Click on any platform above to add your social media links
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {platforms.length} / {POPULAR_PLATFORMS.length} platforms
          </div>
          <Button onClick={onClose} variant="outline">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
