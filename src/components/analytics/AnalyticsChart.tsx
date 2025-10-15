/**
 * Analytics Chart Component
 * Display analytics data in charts
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, MousePointer, BarChart3 } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ComponentType<any>
}

export function MetricCard({ title, value, description, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SimpleChartProps {
  data: Array<{ date: string; views: number; clicks: number }>
  title: string
  description?: string
}

export function SimpleChart({ data, title, description }: SimpleChartProps) {
  const maxViews = Math.max(...data.map(d => d.views))
  const maxClicks = Math.max(...data.map(d => d.clicks))
  const maxValue = Math.max(maxViews, maxClicks)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Clicks</span>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-2">
            {data.slice(-14).map((item, index) => (
              <div key={item.date} className="flex items-center gap-2">
                <div className="w-16 text-xs text-gray-500">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1 flex gap-1">
                  <div 
                    className="bg-blue-500 h-6 rounded-sm flex items-center justify-end pr-2"
                    style={{ 
                      width: maxValue > 0 ? `${(item.views / maxValue) * 100}%` : '0%',
                      minWidth: item.views > 0 ? '20px' : '0px'
                    }}
                  >
                    {item.views > 0 && (
                      <span className="text-white text-xs font-medium">
                        {item.views}
                      </span>
                    )}
                  </div>
                  <div 
                    className="bg-green-500 h-6 rounded-sm flex items-center justify-end pr-2"
                    style={{ 
                      width: maxValue > 0 ? `${(item.clicks / maxValue) * 100}%` : '0%',
                      minWidth: item.clicks > 0 ? '20px' : '0px'
                    }}
                  >
                    {item.clicks > 0 && (
                      <span className="text-white text-xs font-medium">
                        {item.clicks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TopLinksProps {
  data: Array<{
    target: string
    clicks: number
    percentage: number
  }>
  title: string
}

export function TopLinks({ data, title }: TopLinksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Most clicked links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No clicks yet</p>
          ) : (
            data.slice(0, 5).map((link, index) => (
              <div key={link.target} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium truncate">
                      {link.target.startsWith('http') 
                        ? new URL(link.target).hostname 
                        : link.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${link.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-bold">{link.clicks}</div>
                  <div className="text-xs text-gray-500">{link.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface TopReferrersProps {
  data: Array<{
    referrer: string
    views: number
    percentage: number
  }>
  title: string
}

export function TopReferrers({ data, title }: TopReferrersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Where your visitors come from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No referrers yet</p>
          ) : (
            data.slice(0, 5).map((referrer, index) => (
              <div key={referrer.referrer} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium truncate">
                      {referrer.referrer === 'Direct' ? 'Direct traffic' : referrer.referrer}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${referrer.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-bold">{referrer.views}</div>
                  <div className="text-xs text-gray-500">{referrer.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface DeviceBreakdownProps {
  data: Array<{
    device: string
    views: number
    percentage: number
  }>
  title: string
}

export function DeviceBreakdown({ data, title }: DeviceBreakdownProps) {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return '📱'
      case 'tablet':
        return '📱'
      case 'desktop':
        return '💻'
      default:
        return '📊'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Device breakdown of your visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No device data yet</p>
          ) : (
            data.map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getDeviceIcon(device.device)}</span>
                  <span className="text-sm font-medium">{device.device}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-8 text-right">{device.views}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}