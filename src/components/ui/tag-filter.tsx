/**
 * Tag Filter Component
 * Provides filtering interface for templates by tags
 */

'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Tag, TagCategory } from '@/types'
import { Filter, X, Hash } from 'lucide-react'

interface TagFilterProps {
  tags: Tag[]
  selectedTags: string[]
  onTagToggle: (tagSlug: string) => void
  onClearAll: () => void
  className?: string
}

export function TagFilter({ tags, selectedTags, onTagToggle, onClearAll, className }: TagFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['industry', 'style']))

  // Group tags by category
  const groupedTags = tags.reduce((acc, tag) => {
    const category = tag.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(tag)
    return acc
  }, {} as Record<string, Tag[]>)

  // Sort tags within each category
  Object.keys(groupedTags).forEach(category => {
    groupedTags[category].sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return a.sortOrder - b.sortOrder
    })
  })

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const categoryDisplayNames: Record<string, string> = {
    industry: 'Industry',
    style: 'Style', 
    purpose: 'Purpose',
    audience: 'Audience',
    other: 'Other'
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Tags
          </CardTitle>
          {selectedTags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear ({selectedTags.length})
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Popular Tags First */}
        {tags.filter(tag => tag.isPopular).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Popular
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags
                .filter(tag => tag.isPopular)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(tag => (
                  <TagBadge
                    key={tag.slug}
                    tag={tag}
                    isSelected={selectedTags.includes(tag.slug)}
                    onToggle={() => onTagToggle(tag.slug)}
                  />
                ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Categorized Tags */}
        {Object.entries(groupedTags).map(([category, categoryTags]) => {
          const isExpanded = expandedCategories.has(category)
          const hasSelectedTags = categoryTags.some(tag => selectedTags.includes(tag.slug))
          
          return (
            <div key={category} className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(category)}
                className={cn(
                  "w-full justify-between p-0 h-auto font-medium text-xs",
                  "hover:bg-transparent",
                  hasSelectedTags && "text-primary"
                )}
              >
                <span className="flex items-center gap-2">
                  <Hash className="h-3 w-3" />
                  {categoryDisplayNames[category]}
                  {hasSelectedTags && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {categoryTags.filter(tag => selectedTags.includes(tag.slug)).length}
                    </Badge>
                  )}
                </span>
                <span className={cn(
                  "transition-transform duration-200",
                  isExpanded ? "rotate-90" : "rotate-0"
                )}>
                  ▶
                </span>
              </Button>
              
              {isExpanded && (
                <div className="flex flex-wrap gap-1.5 pl-4">
                  {categoryTags.map(tag => (
                    <TagBadge
                      key={tag.slug}
                      tag={tag}
                      isSelected={selectedTags.includes(tag.slug)}
                      onToggle={() => onTagToggle(tag.slug)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

interface TagBadgeProps {
  tag: Tag
  isSelected: boolean
  onToggle: () => void
}

function TagBadge({ tag, isSelected, onToggle }: TagBadgeProps) {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-105",
        "text-xs font-normal",
        isSelected && "shadow-sm"
      )}
      style={{
        backgroundColor: isSelected && tag.color ? tag.color : undefined,
        borderColor: !isSelected && tag.color ? tag.color : undefined,
        color: !isSelected && tag.color ? tag.color : undefined
      }}
      onClick={onToggle}
    >
      {tag.icon && <span className="mr-1">{tag.icon}</span>}
      {tag.name}
    </Badge>
  )
}