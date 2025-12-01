'use client'

import React, { useState } from 'react'
import { FooterBlock } from '@/components/blocks/FooterBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FooterBlockProps } from '@/types'
import { Smartphone, Tablet } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet'

export default function FooterBlockDemoPage() {
  // State for live customization
  const [selectedLayout, setSelectedLayout] = useState<any>('centered')
  const [copyrightText, setCopyrightText] = useState('© 2024 Your Company')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#374151')
  const [selectedSpacing, setSelectedSpacing] = useState<any>('md')
  const [showSocial, setShowSocial] = useState(true)
  const [showLinks, setShowLinks] = useState(true)
  const [borderTop, setBorderTop] = useState(false)
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile')

  const deviceFrameClass = {
    mobile: 'max-w-[375px] mx-auto',
    tablet: 'max-w-2xl mx-auto'
  }

  // Sample data
  const sampleLinks = [
    { label: 'Privacy Policy', url: '/privacy', external: false },
    { label: 'Terms of Service', url: '/terms', external: false },
    { label: 'Contact', url: '/contact', external: false },
  ]

  const sampleSocialLinks = [
    { platform: 'twitter' as const, url: 'https://twitter.com' },
    { platform: 'instagram' as const, url: 'https://instagram.com' },
    { platform: 'github' as const, url: 'https://github.com' },
  ]

  const layouts = [
    { value: 'centered', label: 'Centered', description: 'All elements centered vertically' },
    { value: 'minimal', label: 'Minimal', description: 'Copyright text only' },
    { value: 'stacked', label: 'Stacked', description: 'Social, links, and copyright stacked' },
    { value: 'split', label: 'Split', description: 'Copyright left, links right' },
  ] as const

  const spacings = ['none', 'sm', 'md', 'lg', 'xl'] as const

  const backgroundPresets = [
    { color: '#ffffff', label: 'White' },
    { color: '#f9fafb', label: 'Light Gray' },
    { color: '#f3f4f6', label: 'Gray 50' },
    { color: '#e5e7eb', label: 'Gray 200' },
    { color: '#1f2937', label: 'Dark Gray' },
    { color: '#111827', label: 'Gray 900' },
    { color: '#000000', label: 'Black' },
    { color: '#3b82f6', label: 'Blue' },
  ]

  const textPresets = [
    { color: '#000000', label: 'Black' },
    { color: '#111827', label: 'Gray 900' },
    { color: '#374151', label: 'Gray 700' },
    { color: '#6b7280', label: 'Gray 500' },
    { color: '#9ca3af', label: 'Gray 400' },
    { color: '#d1d5db', label: 'Gray 300' },
    { color: '#f3f4f6', label: 'Gray 100' },
    { color: '#ffffff', label: 'White' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FooterBlock Demo
          </h1>
          <p className="text-xl text-gray-600">
            4 Layout Styles • Custom Links • Social Icons • Full Customization
          </p>
          <div className="flex gap-4 justify-center text-sm text-gray-500">
            <span>✅ Flexible Layouts</span>
            <span>✅ Color Control</span>
            <span>✅ Social Integration</span>
            <span>✅ Mobile-First</span>
          </div>
        </div>

        {/* Live Interactive Preview */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🎨 Live Interactive Preview</h2>

          {/* Controls */}
          <div className="space-y-6 mb-8">
            {/* Layout Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Footer Layout</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {layouts.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedLayout === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLayout(value)}
                    className="h-9"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Copyright Text */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Copyright Text</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="© 2024 Your Company"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Background Color</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-9 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="#ffffff"
                />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {backgroundPresets.map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`w-full h-8 rounded border-2 transition-all ${
                      backgroundColor === color ? 'border-purple-500 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Text Color</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-9 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="#374151"
                />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {textPresets.map(({ color, label }) => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className={`w-full h-8 rounded border-2 transition-all ${
                      textColor === color ? 'border-purple-500 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Spacing Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">Vertical Spacing</label>
              <div className="grid grid-cols-5 gap-2">
                {spacings.map((space) => (
                  <Button
                    key={space}
                    variant={selectedSpacing === space ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSpacing(space)}
                    className="capitalize text-xs h-9"
                  >
                    {space}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showLinks"
                  checked={showLinks}
                  onChange={(e) => setShowLinks(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <label htmlFor="showLinks" className="text-sm font-medium cursor-pointer">
                  Show Footer Links
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showSocial"
                  checked={showSocial}
                  onChange={(e) => setShowSocial(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <label htmlFor="showSocial" className="text-sm font-medium cursor-pointer">
                  Show Social Icons
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="borderTop"
                  checked={borderTop}
                  onChange={(e) => setBorderTop(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <label htmlFor="borderTop" className="text-sm font-medium cursor-pointer">
                  Top Border
                </label>
              </div>
            </div>
          </div>

          {/* Device Preview Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Device Preview
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setDeviceType('mobile')}
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
                <span className="text-xs opacity-70">(375px)</span>
              </Button>
              <Button
                onClick={() => setDeviceType('tablet')}
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
                <span className="text-xs opacity-70">(672px)</span>
              </Button>
            </div>
          </div>

          {/* Device Frame Preview */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
              {deviceType === 'mobile' ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Preview</span>
                </>
              ) : (
                <>
                  <Tablet className="w-4 h-4" />
                  <span>Tablet Preview</span>
                </>
              )}
            </div>
          </div>

          <div className={deviceFrameClass[deviceType]}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              <div className="bg-gray-900 h-6 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
              </div>
              <div className={`bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-y-auto flex flex-col ${
                deviceType === 'mobile' ? 'h-[500px]' : 'h-[400px]'
              }`}>
                <div className="flex-1 bg-white p-6">
                  <div className="text-center text-gray-600">
                    <p className="text-sm">Page content above footer...</p>
                  </div>
                </div>
                <FooterBlock
                  props={{
                    copyrightText,
                    layout: selectedLayout,
                    showSocial,
                    showLinks,
                    links: sampleLinks,
                    socialLinks: sampleSocialLinks,
                    backgroundColor,
                    textColor,
                    spacing: selectedSpacing,
                    borderTop,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* All Layout Styles Showcase */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">All 4 Layout Styles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {layouts.map(({ value, label, description }) => (
              <Card key={value} className="bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="text-sm opacity-90">{description}</p>
                </div>
                <div className="bg-gray-50">
                  <FooterBlock
                    props={{
                      copyrightText: '© 2024 Demo Company',
                      layout: value,
                      showSocial: true,
                      showLinks: true,
                      links: sampleLinks,
                      socialLinks: sampleSocialLinks,
                      backgroundColor: '#ffffff',
                      textColor: '#374151',
                      spacing: 'md',
                      borderTop: true,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Real-World Use Cases */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Real-World Use Cases</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dark Footer */}
            <Card className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                <h3 className="text-xl font-bold mb-2 text-center">Dark Theme Footer</h3>
                <p className="text-sm opacity-90 text-center">Professional & Modern</p>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="p-8 text-center text-gray-600">
                    <h4 className="text-lg font-semibold mb-2">Main Content</h4>
                    <p className="text-sm">Your beautiful landing page content</p>
                  </div>
                  <FooterBlock
                    props={{
                      copyrightText: '© 2024 TechStart Inc. All rights reserved.',
                      layout: 'split',
                      showSocial: true,
                      showLinks: true,
                      links: [
                        { label: 'About', url: '/about', external: false },
                        { label: 'Blog', url: '/blog', external: false },
                        { label: 'Careers', url: '/careers', external: false },
                        { label: 'Contact', url: '/contact', external: false },
                      ],
                      socialLinks: [
                        { platform: 'twitter', url: 'https://twitter.com' },
                        { platform: 'linkedin', url: 'https://linkedin.com' },
                        { platform: 'github', url: 'https://github.com' },
                      ],
                      backgroundColor: '#111827',
                      textColor: '#d1d5db',
                      spacing: 'lg',
                      borderTop: true,
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Colorful Footer */}
            <Card className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h3 className="text-xl font-bold mb-2 text-center">Branded Footer</h3>
                <p className="text-sm opacity-90 text-center">Bold & Creative</p>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="p-8 text-center text-gray-600">
                    <h4 className="text-lg font-semibold mb-2">Main Content</h4>
                    <p className="text-sm">Your vibrant portfolio site</p>
                  </div>
                  <FooterBlock
                    props={{
                      copyrightText: '© 2024 Creative Studio',
                      layout: 'centered',
                      showSocial: true,
                      showLinks: true,
                      links: [
                        { label: 'Portfolio', url: '/portfolio', external: false },
                        { label: 'Services', url: '/services', external: false },
                        { label: 'Hire Me', url: '/contact', external: false },
                      ],
                      socialLinks: [
                        { platform: 'instagram', url: 'https://instagram.com' },
                        { platform: 'twitter', url: 'https://twitter.com' },
                        { platform: 'youtube', url: 'https://youtube.com' },
                      ],
                      backgroundColor: '#3b82f6',
                      textColor: '#ffffff',
                      spacing: 'xl',
                      borderTop: false,
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Minimal Footer */}
            <Card className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                <h3 className="text-xl font-bold mb-2 text-center">Minimal Clean</h3>
                <p className="text-sm opacity-90 text-center">Simple & Elegant</p>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="p-12 text-center text-gray-600">
                    <h4 className="text-2xl font-bold mb-2">Less is More</h4>
                    <p className="text-sm">Minimalist design philosophy</p>
                  </div>
                  <FooterBlock
                    props={{
                      copyrightText: '© 2024 Minimal Co.',
                      layout: 'minimal',
                      showSocial: false,
                      showLinks: false,
                      links: [],
                      socialLinks: [],
                      backgroundColor: '#f9fafb',
                      textColor: '#6b7280',
                      spacing: 'sm',
                      borderTop: true,
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Full Featured Footer */}
            <Card className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <h3 className="text-xl font-bold mb-2 text-center">Full Featured</h3>
                <p className="text-sm opacity-90 text-center">Complete Solution</p>
              </div>
              <div className="bg-gray-100 p-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="p-8 text-center text-gray-600">
                    <h4 className="text-lg font-semibold mb-2">Main Content</h4>
                    <p className="text-sm">Feature-rich business site</p>
                  </div>
                  <FooterBlock
                    props={{
                      copyrightText: '© 2024 Business Corp. All rights reserved.',
                      layout: 'stacked',
                      showSocial: true,
                      showLinks: true,
                      links: [
                        { label: 'Privacy', url: '/privacy', external: false },
                        { label: 'Terms', url: '/terms', external: false },
                        { label: 'Cookies', url: '/cookies', external: false },
                        { label: 'Support', url: '/support', external: false },
                      ],
                      socialLinks: [
                        { platform: 'facebook', url: 'https://facebook.com' },
                        { platform: 'twitter', url: 'https://twitter.com' },
                        { platform: 'linkedin', url: 'https://linkedin.com' },
                        { platform: 'youtube', url: 'https://youtube.com' },
                      ],
                      backgroundColor: '#ffffff',
                      textColor: '#374151',
                      spacing: 'lg',
                      borderTop: true,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">4</div>
              <div className="text-sm opacity-90">Layout Styles</div>
            </div>
            <div>
              <div className="text-4xl font-bold">8</div>
              <div className="text-sm opacity-90">Social Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-bold">∞</div>
              <div className="text-sm opacity-90">Custom Links</div>
            </div>
            <div>
              <div className="text-4xl font-bold">🎨</div>
              <div className="text-sm opacity-90">Color Control</div>
            </div>
            <div>
              <div className="text-4xl font-bold">📱</div>
              <div className="text-sm opacity-90">Mobile First</div>
            </div>
          </div>
        </Card>

        {/* Features List */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">🚀 All Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">4 Layout Styles</div>
                <div className="text-sm text-gray-600">Centered, minimal, stacked, split</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Custom Footer Links</div>
                <div className="text-sm text-gray-600">Unlimited navigation links</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">8 Social Platforms</div>
                <div className="text-sm text-gray-600">Facebook, Twitter, Instagram, and more</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Color Customization</div>
                <div className="text-sm text-gray-600">Background and text colors</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Spacing Control</div>
                <div className="text-sm text-gray-600">5 vertical padding options</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Optional Top Border</div>
                <div className="text-sm text-gray-600">Visual separation from content</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">External Link Support</div>
                <div className="text-sm text-gray-600">Open links in new tabs</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Mobile-First Design</div>
                <div className="text-sm text-gray-600">Responsive on all devices</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="font-semibold">Type-Safe</div>
                <div className="text-sm text-gray-600">Full TypeScript & Zod validation</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">💡 Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Business & Professional</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Company websites with legal links</li>
                <li>• Professional portfolios with social proof</li>
                <li>• SaaS landing pages with navigation</li>
                <li>• Corporate sites with branding</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Personal & Creative</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Personal bio pages with social links</li>
                <li>• Creator profiles with custom branding</li>
                <li>• Minimal portfolios with clean footers</li>
                <li>• Link-in-bio pages with copyright</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
