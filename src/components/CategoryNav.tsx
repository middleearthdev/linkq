'use client'

/**
 * Category Navigation Component
 * Horizontal scrollable category navigation for template marketplace
 */

import { getAllCategories, type TemplateCategoryId } from '@/lib/template-categories'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CategoryNavProps {
  selectedCategory?: TemplateCategoryId | 'all'
  onCategoryChange?: (category: TemplateCategoryId | 'all') => void
  className?: string
  locale?: 'en' | 'id'
}

export function CategoryNav({
  selectedCategory = 'all',
  onCategoryChange,
  className,
  locale = 'id'
}: CategoryNavProps) {
  const categories = getAllCategories()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: TemplateCategoryId | 'all') => {
    onCategoryChange?.(categoryId)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Category Pills - Horizontal Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {/* All Templates Button */}
        <button
          onClick={() => handleCategoryClick('all')}
          onMouseEnter={() => setHoveredCategory('all')}
          onMouseLeave={() => setHoveredCategory(null)}
          className={cn(
            'flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-200',
            'border-2 flex items-center gap-2 whitespace-nowrap',
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
          )}
        >
          <span className="text-lg">🎯</span>
          <span>{locale === 'id' ? 'Semua Template' : 'All Templates'}</span>
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={cn(
              'flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-200',
              'border-2 flex items-center gap-2 whitespace-nowrap',
              selectedCategory === category.id
                ? cn(
                    'text-white border-transparent shadow-lg scale-105',
                    `bg-gradient-to-r ${category.gradient}`
                  )
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-md',
              hoveredCategory === category.id && selectedCategory !== category.id && 'scale-105'
            )}
            style={
              selectedCategory === category.id
                ? {}
                : hoveredCategory === category.id
                ? { borderColor: category.color, color: category.color }
                : {}
            }
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name[locale]}</span>
          </button>
        ))}
      </div>

      {/* Category Description (when selected) */}
      {selectedCategory !== 'all' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          {(() => {
            const category = categories.find((c) => c.id === selectedCategory)
            if (!category) return null

            return (
              <div className="flex items-start gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name[locale]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description[locale]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 border border-gray-200"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Gradient Fade for Scroll Indication */}
      <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  )
}

// Category Filter Sidebar Component
interface CategoryFilterProps {
  selectedCategory?: TemplateCategoryId | 'all'
  selectedSubCategory?: string
  onCategoryChange?: (category: TemplateCategoryId | 'all') => void
  onSubCategoryChange?: (subCategory: string | undefined) => void
  className?: string
  locale?: 'en' | 'id'
}

export function CategoryFilter({
  selectedCategory = 'all',
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange,
  className,
  locale = 'id'
}: CategoryFilterProps) {
  const categories = getAllCategories()
  const selectedCategoryData = categories.find((c) => c.id === selectedCategory)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">
          {locale === 'id' ? 'Kategori' : 'Categories'}
        </h3>
        <div className="space-y-2">
          {/* All */}
          <button
            onClick={() => {
              onCategoryChange?.('all')
              onSubCategoryChange?.(undefined)
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            )}
          >
            <span className="text-xl">🎯</span>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {locale === 'id' ? 'Semua Template' : 'All Templates'}
              </div>
              <div className="text-xs opacity-80">26 templates</div>
            </div>
          </button>

          {/* Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange?.(category.id)
                onSubCategoryChange?.(undefined)
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                selectedCategory === category.id
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              )}
              style={
                selectedCategory === category.id
                  ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }
                  : {}
              }
            >
              <span className="text-xl">{category.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{category.name[locale]}</div>
                {category.marketSize && (
                  <div className="text-xs opacity-80">{category.marketSize}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Categories (if category selected) */}
      {selectedCategoryData && selectedCategoryData.subCategories.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {locale === 'id' ? 'Sub Kategori' : 'Sub Categories'}
          </h3>
          <div className="space-y-1">
            {selectedCategoryData.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSubCategoryChange?.(sub.id)}
                className={cn(
                  'w-full text-left px-4 py-2 rounded-lg transition-all text-sm',
                  selectedSubCategory === sub.id
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2">
                  {sub.icon && <span>{sub.icon}</span>}
                  <span>{sub.name[locale]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Category Badge Component (for template cards)
interface CategoryBadgeProps {
  categoryId: TemplateCategoryId
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  locale?: 'en' | 'id'
  className?: string
}

export function CategoryBadge({
  categoryId,
  size = 'md',
  showIcon = true,
  locale = 'id',
  className
}: CategoryBadgeProps) {
  const categories = getAllCategories()
  const category = categories.find((c) => c.id === categoryId)

  if (!category) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'bg-white/90 backdrop-blur-sm border shadow-sm',
        sizeClasses[size],
        className
      )}
      style={{ borderColor: category.color, color: category.color }}
    >
      {showIcon && <span>{category.icon}</span>}
      <span>{category.name[locale]}</span>
    </span>
  )
}
