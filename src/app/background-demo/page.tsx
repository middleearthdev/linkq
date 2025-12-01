/**
 * Background System Demo Page
 * Interactive showcase of all 56+ backgrounds
 */

'use client'

import { useState } from 'react'
import { BackgroundPicker } from '@/components/editor/BackgroundPicker'
import { BackgroundRenderer } from '@/components/backgrounds/BackgroundRenderer'
import {
  BACKGROUND_REGISTRY,
  getBackground,
  getBackgroundsByType,
  getFreeBackgrounds,
  getPremiumBackgrounds
} from '@/lib/backgrounds/registry'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Crown,
  Palette,
  Smartphone,
  Monitor,
  Code,
  Info,
  Copy,
  Check,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BackgroundDemoPage() {
  const [selectedBg, setSelectedBg] = useState('gradient-ocean-breeze')
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPremiumUser, setIsPremiumUser] = useState(false)

  const currentBg = getBackground(selectedBg)
  const allBackgrounds = Object.keys(BACKGROUND_REGISTRY)
  const freeBackgrounds = getFreeBackgrounds()
  const premiumBackgrounds = getPremiumBackgrounds()

  const copyCode = () => {
    const code = `import { BackgroundRenderer } from '@/components/backgrounds/BackgroundRenderer'

<BackgroundRenderer backgroundKey="${selectedBg}">
  <YourContent />
</BackgroundRenderer>`

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                Background System Demo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {allBackgrounds.length} professional backgrounds • {freeBackgrounds.length} free • {premiumBackgrounds.length} premium
              </p>
            </div>

            {/* Premium Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremiumUser}
                  onChange={(e) => setIsPremiumUser(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Premium User
                </span>
              </label>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left: Background Picker */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Select Background</h2>
                <Badge variant="outline">
                  {currentBg?.type.toUpperCase()}
                </Badge>
              </div>

              <BackgroundPicker
                value={selectedBg}
                onChange={setSelectedBg}
                isPremiumUser={isPremiumUser}
              />
            </Card>

            {/* Current Background Info */}
            {currentBg && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Current Background
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{currentBg.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{currentBg.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Key</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {selectedBg}
                    </code>
                  </div>

                  {currentBg.tags && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {currentBg.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentBg.type === 'gradient' && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Colors</p>
                      <div className="flex gap-2">
                        {/* @ts-ignore */}
                        {currentBg.colors?.map((color: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-8 h-8 rounded border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <code className="text-xs">{color}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentBg.isPremium && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </Card>
            )}

            {/* Code Example */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  Code Example
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`import { BackgroundRenderer } from '@/components/backgrounds/BackgroundRenderer'

<BackgroundRenderer backgroundKey="${selectedBg}">
  <YourContent />
</BackgroundRenderer>

// Or with registry
import { getBackgroundStyles } from '@/lib/backgrounds/registry'

const styles = getBackgroundStyles('${selectedBg}')
<div style={styles}>
  <YourContent />
</div>`}</code>
              </pre>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">
                    {getBackgroundsByType('gradient').length}
                  </p>
                  <p className="text-sm text-blue-700">Gradients</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-900">
                    {getBackgroundsByType('pattern').length}
                  </p>
                  <p className="text-sm text-purple-700">Patterns</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">
                    {getBackgroundsByType('solid').length}
                  </p>
                  <p className="text-sm text-green-700">Solid Colors</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-900">
                    {getBackgroundsByType('animated').length}
                  </p>
                  <p className="text-sm text-yellow-700">Animated</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="flex justify-center">
                <div
                  className={cn(
                    'relative rounded-lg overflow-hidden shadow-2xl transition-all duration-300',
                    viewMode === 'mobile' ? 'w-[375px]' : 'w-full'
                  )}
                  style={{
                    height: viewMode === 'mobile' ? '667px' : '600px',
                  }}
                >
                  {/* iPhone Frame for mobile view */}
                  {viewMode === 'mobile' && (
                    <>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-10" />
                      <div className="absolute inset-0 border-8 border-black rounded-[2.5rem] pointer-events-none z-10" />
                    </>
                  )}

                  {/* Background Preview Content */}
                  <BackgroundRenderer backgroundKey={selectedBg}>
                    <div className="h-full overflow-y-auto">
                      <div className="container mx-auto px-6 py-12">
                        <div className="max-w-md mx-auto space-y-6">
                          {/* Bio Block Mock */}
                          <div className="text-center space-y-4">
                            <div className="w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm mx-auto shadow-lg" />
                            <div>
                              <h1 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
                                Your Name
                              </h1>
                              <p className="text-gray-700 mt-2 drop-shadow-sm">
                                Welcome to my LinkQ page! Check out my content below.
                              </p>
                            </div>
                          </div>

                          {/* Link List Mock */}
                          <div className="space-y-3">
                            {['Portfolio', 'YouTube Channel', 'Twitter', 'Contact Me'].map((link, i) => (
                              <button
                                key={i}
                                className="w-full bg-white/90 backdrop-blur-sm hover:bg-white/100 text-gray-900 font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                              >
                                {link}
                              </button>
                            ))}
                          </div>

                          {/* Social Icons Mock */}
                          <div className="flex justify-center gap-4 pt-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-200"
                              />
                            ))}
                          </div>

                          {/* Footer Mock */}
                          <div className="text-center pt-8 text-sm text-gray-700 drop-shadow-sm">
                            <p>© 2024 Your Name</p>
                            <p className="text-xs mt-2 opacity-70">Made with LinkQ</p>
                          </div>

                          {/* Background Credit */}
                          <div className="text-center pt-4">
                            <Badge className="bg-black/50 backdrop-blur-sm text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {currentBg?.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BackgroundRenderer>
                </div>
              </div>

              {/* Preview Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  {viewMode === 'mobile'
                    ? '📱 iPhone view (375x667px)'
                    : '💻 Desktop view (full width)'}
                </p>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Toggle <strong>Premium User</strong> to see all animated backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Switch between <strong>Mobile</strong> and <strong>Desktop</strong> views</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Use the <strong>Search</strong> to find backgrounds quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Copy code</strong> example to use in your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Browse by <strong>category</strong>: Solid, Gradient, Pattern, Animated</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Bottom Gallery - All Backgrounds */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">All Backgrounds Gallery</h2>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({allBackgrounds.length})
              </TabsTrigger>
              <TabsTrigger value="free">
                Free ({freeBackgrounds.length})
              </TabsTrigger>
              <TabsTrigger value="premium">
                Premium ({premiumBackgrounds.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allBackgrounds.map((key) => {
                const bg = BACKGROUND_REGISTRY[key]
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedBg(key)}
                    className={cn(
                      'relative h-32 rounded-lg border-2 transition-all hover:scale-105',
                      selectedBg === key
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ background: bg.preview }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center p-2">
                      <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        {bg.name}
                      </div>
                    </div>
                    {bg.isPremium && (
                      <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-400 drop-shadow" />
                    )}
                  </button>
                )
              })}
            </TabsContent>

            <TabsContent value="free" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {freeBackgrounds.map((bg) => {
                const key = Object.keys(BACKGROUND_REGISTRY).find(k => BACKGROUND_REGISTRY[k] === bg)!
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedBg(key)}
                    className={cn(
                      'relative h-32 rounded-lg border-2 transition-all hover:scale-105',
                      selectedBg === key
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ background: bg.preview }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center p-2">
                      <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        {bg.name}
                      </div>
                    </div>
                  </button>
                )
              })}
            </TabsContent>

            <TabsContent value="premium" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {premiumBackgrounds.map((bg) => {
                const key = Object.keys(BACKGROUND_REGISTRY).find(k => BACKGROUND_REGISTRY[k] === bg)!
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedBg(key)}
                    className={cn(
                      'relative h-32 rounded-lg border-2 transition-all hover:scale-105',
                      selectedBg === key
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ background: bg.preview }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center p-2">
                      <div className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {bg.name}
                      </div>
                    </div>
                  </button>
                )
              })}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
