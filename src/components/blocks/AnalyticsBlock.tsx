/**
 * AnalyticsBlock Component
 * Display site analytics and metrics (Premium feature)
 */

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eye, MousePointer, Users, TrendingUp, Lock, BarChart3, Calendar } from 'lucide-react'

interface AnalyticsBlockProps {
  showViews?: boolean
  showClicks?: boolean
  showVisitors?: boolean
  period?: '7d' | '30d' | '90d' | 'all'
  style?: 'minimal' | 'detailed' | 'chart'
}

interface AnalyticsBlockComponentProps {
  props: AnalyticsBlockProps
  className?: string
  isEditing?: boolean
  isLocked?: boolean
}

interface AnalyticsData {
  views: number
  clicks: number
  visitors: number
}

export function AnalyticsBlock({ 
  props, 
  className, 
  isEditing = false, 
  isLocked = false,
  siteId,
  analyticsData 
}: AnalyticsBlockComponentProps & { 
  siteId?: string
  analyticsData?: AnalyticsData 
}) {
  const { 
    showViews = true, 
    showClicks = true, 
    showVisitors = false, 
    period = '30d',
    style = 'minimal'
  } = props

  if (isLocked) {
    return (
      <Card className={cn(
        'relative p-6 bg-gray-50 border-dashed',
        'analytics-block', // CSS class for template styling
        className
      )}>
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Pro Feature</p>
            <p className="text-xs text-gray-500">Upgrade to Pro to unlock Analytics</p>
          </div>
        </div>
        
        <div className="opacity-30">
          <h3 className="text-lg font-semibold mb-4">Analytics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">1.2K</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-gray-600">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">567</div>
              <div className="text-sm text-gray-600">Visitors</div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Use provided analytics data or show loading state
  const analytics = analyticsData || { views: 0, clicks: 0, visitors: 0 }
  const metrics: Array<{
    icon: any
    label: string
    value: number
    color: string
    bgColor: string
  }> = []

  if (showViews) {
    metrics.push({
      icon: Eye,
      label: 'Views',
      value: analytics.views,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    })
  }

  if (showClicks) {
    metrics.push({
      icon: MousePointer,
      label: 'Clicks',
      value: analytics.clicks,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    })
  }

  if (showVisitors) {
    metrics.push({
      icon: Users,
      label: 'Visitors',
      value: analytics.visitors,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    })
  }

  if (metrics.length === 0 && !isEditing) {
    return null
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      case 'all': return 'All time'
      default: return 'Last 30 days'
    }
  }

  if (style === 'minimal') {
    return (
      <Card className={cn(
        'p-4',
        'analytics-block', // CSS class for template styling
        isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-lg font-bold">{formatNumber(metric.value)}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {getPeriodLabel(period)}
          </div>
        </div>
      </Card>
    )
  }

  if (style === 'detailed') {
    return (
      <Card className={cn(
        'p-6',
        'analytics-block', // CSS class for template styling
        isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {getPeriodLabel(period)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const IconComponent = metric.icon
            return (
              <div key={metric.label} className={cn('p-3 rounded-lg', metric.bgColor)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={cn('text-2xl font-bold', metric.color)}>
                      {formatNumber(metric.value)}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                  <IconComponent className={cn('w-6 h-6', metric.color)} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  // Chart style (simplified chart representation)
  return (
    <Card className={cn(
      'p-6',
      'analytics-block', // CSS class for template styling
      isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analytics
        </h3>
        <div className="text-xs text-gray-500">
          {getPeriodLabel(period)}
        </div>
      </div>
      
      {/* Simple bar chart representation */}
      <div className="space-y-3">
        {metrics.map((metric) => {
          const percentage = (metric.value / Math.max(...metrics.map(m => m.value))) * 100
          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-semibold">{formatNumber(metric.value)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn('h-2 rounded-full transition-all duration-300', metric.color.replace('text-', 'bg-'))}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// Editor component for customizing AnalyticsBlock props
export function AnalyticsBlockEditor({ 
  props, 
  onChange, 
  className 
}: {
  props: AnalyticsBlockProps
  onChange: (props: AnalyticsBlockProps) => void
  className?: string
}) {
  const handleChange = (field: keyof AnalyticsBlockProps, value: any) => {
    onChange({ ...props, [field]: value })
  }

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div>
        <label className="block text-sm font-medium mb-2">Display Style</label>
        <div className="flex gap-2">
          {(['minimal', 'detailed', 'chart'] as const).map((style) => (
            <Button
              key={style}
              variant={props.style === style ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleChange('style', style)}
              className="capitalize"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Time Period</label>
        <select
          value={props.period}
          onChange={(e) => handleChange('period', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Metrics to Show</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showViews"
              checked={props.showViews ?? true}
              onChange={(e) => handleChange('showViews', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showViews" className="text-sm">
              Page Views
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showClicks"
              checked={props.showClicks ?? true}
              onChange={(e) => handleChange('showClicks', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showClicks" className="text-sm">
              Link Clicks
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showVisitors"
              checked={props.showVisitors ?? false}
              onChange={(e) => handleChange('showVisitors', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showVisitors" className="text-sm">
              Unique Visitors
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}