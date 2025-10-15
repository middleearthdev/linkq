/**
 * LinkListBlock Component
 * Displays a list of clickable links in various styles
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LinkListBlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'

interface LinkListBlockComponentProps {
  props: LinkListBlockProps
  className?: string
  isEditing?: boolean
}

export function LinkListBlock({ props, className, isEditing = false }: LinkListBlockComponentProps) {
  const { style = 'pill', items = [], maxItems } = props
  
  const displayItems = maxItems ? items.slice(0, maxItems) : items
  const activeItems = displayItems.filter(item => item.isActive !== false)

  const handleLinkClick = (item: any) => {
    if (!isEditing) {
      trackEvent('link_click', {
        linkId: item.id,
        linkTitle: item.title,
        linkUrl: item.url,
      })
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  const renderLink = (item: any, index: number) => {
    const baseClasses = cn(
      'w-full flex items-center justify-center gap-3 transition-all duration-200',
      'link-item', // CSS class for template styling
      isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
    )

    const content = (
      <>
        {item.icon && (
          <span className="text-lg">{item.icon}</span>
        )}
        <span className="font-medium">{item.title}</span>
        <ExternalLink className="w-4 h-4 opacity-70" />
      </>
    )

    if (style === 'pill') {
      return (
        <Button
          key={item.id || index}
          variant="default"
          size="lg"
          className={cn(baseClasses, 'rounded-full h-14 px-6')}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {content}
        </Button>
      )
    }

    if (style === 'underline') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-12 px-4 text-lg border-b-2 border-transparent hover:border-current',
            'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {content}
        </button>
      )
    }

    if (style === 'card') {
      return (
        <Card
          key={item.id || index}
          className={cn(
            'cursor-pointer hover:shadow-md transition-shadow',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
        >
          <div className={cn(baseClasses, 'h-16 px-6')}>
            {content}
          </div>
        </Card>
      )
    }

    if (style === 'modern') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-14 px-6 rounded-3xl font-medium text-base',
            'bg-[var(--card-background)] text-[var(--card-text)]',
            'hover:bg-[var(--button-hover)] hover:scale-[1.02]',
            'shadow-[var(--shadow)] border border-[var(--border-color)]',
            'transition-all duration-200 active:scale-[0.98]',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          {content}
        </button>
      )
    }

    if (style === 'modern-cream') {
      return (
        <button
          key={item.id || index}
          className={cn(
            baseClasses,
            'h-16 px-8 rounded-2xl font-semibold text-lg tracking-wide',
            'bg-[var(--card-background)] text-[var(--card-text)]',
            'border-[var(--card-border)] shadow-[var(--shadow-light)]',
            'hover:bg-[var(--button-hover)] hover:shadow-[var(--shadow-heavy)]',
            'transition-all duration-300 active:scale-[0.97]',
            'uppercase letterspacing tracking-widest',
            isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2'
          )}
          onClick={() => handleLinkClick(item)}
          disabled={isEditing}
        >
          <span className="font-bold tracking-wide">{item.title}</span>
        </button>
      )
    }

    return null
  }

  if (activeItems.length === 0 && !isEditing) {
    return null
  }

  return (
    <div className={cn(
      'w-full max-w-md mx-auto space-y-4 p-6',
      'link-list-block', // CSS class for template styling
      className
    )}>
      {activeItems.map(renderLink)}
      
      {isEditing && activeItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No links added yet</p>
          <p className="text-sm">Add some links to get started</p>
        </div>
      )}
    </div>
  )
}

// Editor component for customizing LinkListBlock props
export function LinkListBlockEditor({ 
  props, 
  onChange, 
  className 
}: {
  props: LinkListBlockProps
  onChange: (props: LinkListBlockProps) => void
  className?: string
}) {
  const handleStyleChange = (style: 'pill' | 'underline' | 'card' | 'modern' | 'modern-cream') => {
    onChange({ ...props, style })
  }

  const handleAddLink = () => {
    const newLink = {
      id: Math.random().toString(36).substring(7),
      title: 'New Link',
      url: 'https://yoursite.com',
      isActive: true,
    }
    onChange({ ...props, items: [...(props.items || []), newLink] })
  }

  const handleUpdateLink = (index: number, updates: any) => {
    const items = [...(props.items || [])]
    items[index] = { ...items[index], ...updates }
    onChange({ ...props, items })
  }

  const handleRemoveLink = (index: number) => {
    const items = [...(props.items || [])]
    items.splice(index, 1)
    onChange({ ...props, items })
  }

  return (
    <div className={cn('space-y-6 p-4', className)}>
      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Link Style</label>
        <div className="flex gap-2">
          {(['pill', 'underline', 'card', 'modern', 'modern-cream'] as const).map((style) => (
            <Button
              key={style}
              variant={props.style === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange(style)}
              className="capitalize"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Max items */}
      <div>
        <label className="block text-sm font-medium mb-2">Max Items (optional)</label>
        <input
          type="number"
          value={props.maxItems || ''}
          onChange={(e) => onChange({ ...props, maxItems: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="No limit"
          min="1"
        />
      </div>

      {/* Links list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Links</label>
          <Button size="sm" onClick={handleAddLink} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>
        
        <div className="space-y-3">
          {(props.items || []).map((item, index) => (
            <Card key={item.id || index} className="p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateLink(index, { title: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link title"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => handleUpdateLink(index, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yoursite.com"
                />
                
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => handleUpdateLink(index, { icon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    placeholder="Icon (emoji or text)"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`active-${index}`}
                      checked={item.isActive !== false}
                      onChange={(e) => handleUpdateLink(index, { isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor={`active-${index}`} className="text-sm">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {(!props.items || props.items.length === 0) && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No links added yet</p>
              <p className="text-sm">Click "Add Link" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}