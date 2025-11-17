/**
 * FooterBlock Component
 * Footer section with copyright, links, and social icons
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FooterBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Mail, Globe } from 'lucide-react'

interface FooterBlockComponentProps {
  props: FooterBlockProps
  className?: string
  isEditing?: boolean
}

export function FooterBlock({ props, className, isEditing = false }: FooterBlockComponentProps) {
  const {
    copyrightText = '© 2024 Your Name',
    layout = 'centered',
    showSocial = true,
    showLinks = true,
    links = [],
    socialLinks = [],
    backgroundColor = '#ffffff',
    textColor = '#374151',
    spacing = 'md',
    borderTop = false,
  } = props

  // Spacing mapping
  const spacingMap = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  }

  // Social icon components
  const socialIcons: Record<string, any> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
    youtube: Youtube,
    email: Mail,
    website: Globe,
  }

  // Render social icons
  const renderSocialIcons = () => {
    if (!showSocial || !socialLinks || socialLinks.length === 0) return null

    return (
      <div className="flex gap-4 justify-center">
        {socialLinks.map((social, index) => {
          const Icon = socialIcons[social.platform] || Globe
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              <Icon className="w-5 h-5" />
            </a>
          )
        })}
      </div>
    )
  }

  // Render footer links
  const renderLinks = () => {
    if (!showLinks || !links || links.length === 0) return null

    return (
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.external ? '_blank' : '_self'}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            {link.label}
          </a>
        ))}
      </div>
    )
  }

  // Layout styles
  const layouts = {
    centered: (
      <div className="space-y-4 text-center">
        {renderSocialIcons()}
        {renderLinks()}
        <p className="text-sm" style={{ color: textColor }}>
          {copyrightText}
        </p>
      </div>
    ),
    minimal: (
      <div className="text-center">
        <p className="text-sm" style={{ color: textColor }}>
          {copyrightText}
        </p>
      </div>
    ),
    stacked: (
      <div className="space-y-6">
        {renderSocialIcons()}
        {renderLinks()}
        <div className="text-center">
          <p className="text-sm" style={{ color: textColor }}>
            {copyrightText}
          </p>
        </div>
      </div>
    ),
    split: (
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm order-2 md:order-1" style={{ color: textColor }}>
          {copyrightText}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 order-1 md:order-2">
          {renderLinks()}
          {renderSocialIcons()}
        </div>
      </div>
    ),
  }

  return (
    <div
      className={cn(
        spacingMap[spacing],
        'footer-block',
        borderTop && 'border-t',
        isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
        className
      )}
      style={{
        backgroundColor,
        borderColor: textColor + '20', // 20% opacity
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {layouts[layout]}
      </div>
    </div>
  )
}

// Editor component for customizing FooterBlock props
export function FooterBlockEditor({
  props,
  onChange,
  className,
}: {
  props: FooterBlockProps
  onChange: (props: FooterBlockProps) => void
  className?: string
}) {
  const handleChange = (field: keyof FooterBlockProps, value: any) => {
    onChange({ ...props, [field]: value })
  }

  const handleLinkChange = (index: number, field: 'label' | 'url' | 'external', value: any) => {
    const newLinks = [...(props.links || [])]
    newLinks[index] = { ...newLinks[index], [field]: value }
    handleChange('links', newLinks)
  }

  const addLink = () => {
    const newLinks = [...(props.links || []), { label: 'New Link', url: '#', external: false }]
    handleChange('links', newLinks)
  }

  const removeLink = (index: number) => {
    const newLinks = (props.links || []).filter((_, i) => i !== index)
    handleChange('links', newLinks)
  }

  const handleSocialChange = (index: number, field: 'platform' | 'url', value: any) => {
    const newSocials = [...(props.socialLinks || [])]
    newSocials[index] = { ...newSocials[index], [field]: value }
    handleChange('socialLinks', newSocials)
  }

  const addSocial = () => {
    const newSocials = [...(props.socialLinks || []), { platform: 'website', url: 'https://' }]
    handleChange('socialLinks', newSocials)
  }

  const removeSocial = (index: number) => {
    const newSocials = (props.socialLinks || []).filter((_, i) => i !== index)
    handleChange('socialLinks', newSocials)
  }

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Layout Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Footer Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'centered', label: 'Centered' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'stacked', label: 'Stacked' },
            { value: 'split', label: 'Split' },
          ] as const).map(({ value, label }) => (
            <Button
              key={value}
              variant={props.layout === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('layout', value)}
              className="h-9"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Copyright Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Copyright Text</label>
        <input
          type="text"
          value={props.copyrightText || ''}
          onChange={(e) => handleChange('copyrightText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="© 2024 Your Name"
        />
        <p className="text-xs text-gray-500 mt-1">Tip: Use © symbol for copyright</p>
      </div>

      {/* Footer Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Footer Links</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addLink}
            className="h-7 text-xs"
          >
            + Add Link
          </Button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {(props.links || []).map((link, index) => (
            <Card key={index} className="p-3 bg-gray-50">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="URL"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="h-7 w-7 p-0 text-red-500"
                  >
                    ×
                  </Button>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={link.external ?? false}
                    onChange={(e) => handleLinkChange(index, 'external', e.target.checked)}
                    className="rounded"
                  />
                  Open in new tab
                </label>
              </div>
            </Card>
          ))}
        </div>
        {(!props.links || props.links.length === 0) && (
          <p className="text-xs text-gray-500 text-center py-4">No links added yet</p>
        )}
      </div>

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Social Links</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addSocial}
            className="h-7 text-xs"
          >
            + Add Social
          </Button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {(props.socialLinks || []).map((social, index) => (
            <Card key={index} className="p-3 bg-gray-50">
              <div className="flex gap-2">
                <select
                  value={social.platform}
                  onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                </select>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="URL"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocial(index)}
                  className="h-7 w-7 p-0 text-red-500"
                >
                  ×
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {(!props.socialLinks || props.socialLinks.length === 0) && (
          <p className="text-xs text-gray-500 text-center py-4">No social links added yet</p>
        )}
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="w-12 h-9 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="#ffffff"
          />
        </div>
        {/* Color presets */}
        <div className="grid grid-cols-8 gap-2 mt-2">
          {['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#1f2937', '#111827', '#000000', '#3b82f6'].map((color) => (
            <button
              key={color}
              onClick={() => handleChange('backgroundColor', color)}
              className={cn(
                'w-full h-8 rounded border-2 transition-all',
                props.backgroundColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={props.textColor || '#374151'}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="w-12 h-9 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={props.textColor || '#374151'}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="#374151"
          />
        </div>
        {/* Color presets */}
        <div className="grid grid-cols-8 gap-2 mt-2">
          {['#000000', '#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff'].map((color) => (
            <button
              key={color}
              onClick={() => handleChange('textColor', color)}
              className={cn(
                'w-full h-8 rounded border-2 transition-all',
                props.textColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Spacing Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Spacing (Vertical)</label>
        <div className="grid grid-cols-5 gap-2">
          {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((space) => (
            <Button
              key={space}
              variant={props.spacing === space ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('spacing', space)}
              className="capitalize text-xs h-9"
            >
              {space}
            </Button>
          ))}
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showLinks"
            checked={props.showLinks ?? true}
            onChange={(e) => handleChange('showLinks', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showLinks" className="text-sm font-medium">
            Show Footer Links
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showSocial"
            checked={props.showSocial ?? true}
            onChange={(e) => handleChange('showSocial', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showSocial" className="text-sm font-medium">
            Show Social Icons
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="borderTop"
            checked={props.borderTop ?? false}
            onChange={(e) => handleChange('borderTop', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="borderTop" className="text-sm font-medium">
            Show Top Border
          </label>
        </div>
      </div>
    </div>
  )
}
