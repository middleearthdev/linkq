/**
 * Block Library Sidebar Component
 * Shows available blocks that can be added to the template
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Palette, User, Link2, Share2, Image, BarChart3, Layout } from "lucide-react"
import { 
  BLOCK_REGISTRY, 
  getAllBlockTypes, 
  getBlocksByCategory, 
  searchBlocks,
  filterBlocks
} from "@/components/blocks/registry"
import { cn } from "@/lib/utils"

interface BlockLibrarySidebarProps {
  onAddBlock: (blockType: string) => void
  userRole?: 'admin' | 'customer'
  userPlan?: 'FREE' | 'STARTER' | 'PRO'
  className?: string
}

const BLOCK_ICONS: Record<string, any> = {
  'bio': User,
  'link-list': Link2,
  'social-icons': Share2,
  'cta': Palette,
  'gallery': Image,
  'analytics': BarChart3,
}

const CATEGORY_COLORS = {
  basic: '#66A38A',
  premium: '#F59E0B',
  pro: '#8B5CF6'
}

export function BlockLibrarySidebar({ 
  onAddBlock, 
  userRole = 'customer',
  userPlan = 'FREE',
  className 
}: BlockLibrarySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic']))

  // Get available blocks - for admin show all blocks regardless of plan
  const getAvailableBlocks = () => {
    if (userRole === 'admin') {
      // Admin sees all blocks
      return Object.values(BLOCK_REGISTRY)
    } else {
      // Customer sees blocks based on their plan
      return filterBlocks({ plan: userPlan })
    }
  }

  const availableBlocks = getAvailableBlocks()

  // Filter blocks based on search and category
  const filteredBlocks = availableBlocks.filter(block => {
    const matchesSearch = searchTerm === "" || 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || block.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Group blocks by category
  const blocksByCategory = filteredBlocks.reduce((acc, block) => {
    const category = block.category || 'basic'
    if (!acc[category]) acc[category] = []
    acc[category].push(block)
    return acc
  }, {} as Record<string, typeof filteredBlocks>)

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getBlockIcon = (blockType: string) => {
    const IconComponent = BLOCK_ICONS[blockType] || Layout
    return <IconComponent className="h-4 w-4" />
  }

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      basic: 'Basic Blocks',
      premium: 'Premium Blocks',
      pro: 'Pro Blocks'
    }
    return names[category] || category
  }

  const categories = Object.keys(blocksByCategory).sort((a, b) => {
    const order = { basic: 0, premium: 1, pro: 2 }
    return (order[a as keyof typeof order] || 99) - (order[b as keyof typeof order] || 99)
  })

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Compact Search */}
      <div className="p-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-6 text-xs bg-white border-gray-300"
          />
        </div>

        {/* Compact Category Filter */}
        <div className="flex flex-wrap gap-0.5">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="h-5 px-1.5 text-xs"
          >
            All
          </Button>
          {['basic', 'premium', 'pro'].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-5 px-1.5 text-xs capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Compact Block List */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-1">
          {categories.length === 0 ? (
            <div className="text-center py-6">
              <Layout className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">No blocks found</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="space-y-1">
                {/* Compact Category Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category)}
                  className="w-full justify-between p-1.5 h-6 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] }}
                    />
                    <span className="font-medium">{getCategoryDisplayName(category)}</span>
                    <Badge variant="outline" className="text-xs px-1 h-3 border-gray-300 text-gray-500">
                      {blocksByCategory[category].length}
                    </Badge>
                  </div>
                  <span className={`transform transition-transform text-gray-400 ${expandedCategories.has(category) ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </Button>

                {/* Compact Category Blocks */}
                {expandedCategories.has(category) && (
                  <div className="space-y-0.5 ml-3">
                    {blocksByCategory[category].map((block) => (
                      <div
                        key={block.type}
                        className="cursor-pointer hover:bg-blue-50 transition-colors border border-gray-100 rounded-md group"
                        onClick={() => onAddBlock(block.type)}
                      >
                        <div className="p-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-1 rounded flex-shrink-0"
                              style={{ 
                                backgroundColor: CATEGORY_COLORS[block.category as keyof typeof CATEGORY_COLORS] + '20',
                                color: CATEGORY_COLORS[block.category as keyof typeof CATEGORY_COLORS]
                              }}
                            >
                              {getBlockIcon(block.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-gray-900 text-xs font-medium truncate">
                                {block.name}
                              </div>
                              <div className="text-gray-500 text-xs truncate">
                                {block.description}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-0.5">
                              {block.isPremium && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-1 h-3"
                                  style={{
                                    borderColor: CATEGORY_COLORS[block.category as keyof typeof CATEGORY_COLORS],
                                    color: CATEGORY_COLORS[block.category as keyof typeof CATEGORY_COLORS]
                                  }}
                                >
                                  {block.requiredPlan}
                                </Badge>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-4 w-4 p-0 text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Compact Admin Info */}
          {userRole === 'admin' && (
            <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200">
              <div className="text-blue-700 text-xs font-medium mb-0.5">Admin Mode</div>
              <div className="text-blue-600 text-xs">
                All blocks available for template creation.
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}