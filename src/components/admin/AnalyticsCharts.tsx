/**
 * Analytics Charts Component for Admin Dashboard
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Globe,
  Crown
} from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  totalSites: number
  totalTemplates: number
  totalRevenue: number
  monthlyGrowth: number
  activeUsers: number
  recentUsers: number
  publishedSites: number
  planDistribution: {
    FREE: number
    STARTER: number
    PRO: number
  }
  insights: {
    averageSitesPerUser: number
    userRetention: number
    conversionRate: number
    publishRate: number
  }
}

interface AnalyticsChartsProps {
  className?: string
}

export function AnalyticsCharts({ className }: AnalyticsChartsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Failed to load analytics data</p>
      </div>
    )
  }

  const planColors = {
    FREE: '#6B7280',
    STARTER: '#3B82F6', 
    PRO: '#8B5CF6'
  }

  const total = data.planDistribution.FREE + data.planDistribution.STARTER + data.planDistribution.PRO

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* User Growth Chart */}
      <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" style={{ color: '#66A38A' }} />
            User Growth
          </CardTitle>
          <CardDescription className="text-gray-400">Monthly user registrations and retention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Growth Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#0F2A44' }}>
                <div className="text-2xl font-bold" style={{ color: '#66A38A' }}>
                  {data.recentUsers}
                </div>
                <div className="text-sm text-blue-300">New Users (30d)</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#0F2A1F' }}>
                <div className="text-2xl font-bold text-green-400">
                  {data.insights.userRetention}%
                </div>
                <div className="text-sm text-green-300">Retention Rate</div>
              </div>
            </div>

            {/* Simple Bar Visualization */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Users</span>
                <span className="font-medium text-white">{data.totalUsers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((data.totalUsers / 1000) * 100, 100)}%`,
                    backgroundColor: '#66A38A'
                  }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Users</span>
                <span className="font-medium text-white">{data.activeUsers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${data.totalUsers > 0 ? (data.activeUsers / data.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-5 w-5 text-purple-400" />
            Plan Distribution
          </CardTitle>
          <CardDescription className="text-gray-400">User subscription breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Plan Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-gray-300">
                  {data.planDistribution.FREE}
                </div>
                <div className="text-xs text-gray-400">Free</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#0F2A44' }}>
                <div className="text-lg font-bold" style={{ color: '#66A38A' }}>
                  {data.planDistribution.STARTER}
                </div>
                <div className="text-xs text-blue-300">Starter</div>
              </div>
              <div className="text-center p-3 bg-purple-900 rounded-lg">
                <div className="text-lg font-bold text-purple-400">
                  {data.planDistribution.PRO}
                </div>
                <div className="text-xs text-purple-300">Pro</div>
              </div>
            </div>

            {/* Plan Visualization */}
            <div className="space-y-3">
              {Object.entries(data.planDistribution).map(([plan, count]) => {
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={plan} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 text-white">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: planColors[plan as keyof typeof planColors] }}
                        />
                        {plan}
                      </span>
                      <span className="font-medium text-white">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: planColors[plan as keyof typeof planColors]
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Conversion Rate */}
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Conversion Rate</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {data.insights.conversionRate}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="h-5 w-5" style={{ color: '#66A38A' }} />
            Revenue Overview
          </CardTitle>
          <CardDescription className="text-gray-400">Platform revenue metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Revenue Stats */}
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#0F2A1F' }}>
              <div className="text-3xl font-bold mb-1" style={{ color: '#66A38A' }}>
                ${(data.totalRevenue / 100).toFixed(2)}
              </div>
              <div className="text-sm text-green-300">Total Revenue</div>
            </div>

            {/* Revenue Insights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-lg font-bold text-white">
                  ${data.totalUsers > 0 ? ((data.totalRevenue / 100) / data.totalUsers).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-400">ARPU</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded">
                <div className="text-lg font-bold text-white">
                  {data.planDistribution.STARTER + data.planDistribution.PRO}
                </div>
                <div className="text-xs text-gray-400">Paying Users</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Activity */}
      <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-5 w-5" style={{ color: '#66A38A' }} />
            Site Activity
          </CardTitle>
          <CardDescription className="text-gray-400">Site creation and publishing metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Site Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#0F2A44' }}>
                <div className="text-2xl font-bold" style={{ color: '#66A38A' }}>
                  {data.totalSites}
                </div>
                <div className="text-sm text-blue-300">Total Sites</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#0F2A1F' }}>
                <div className="text-2xl font-bold text-green-400">
                  {data.publishedSites}
                </div>
                <div className="text-sm text-green-300">Published</div>
              </div>
            </div>

            {/* Publishing Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Publishing Rate</span>
                <span className="font-medium text-white">{data.insights.publishRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${data.insights.publishRate}%`,
                    backgroundColor: '#66A38A'
                  }}
                />
              </div>
            </div>

            {/* Average Sites per User */}
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Avg Sites per User</span>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  {data.insights.averageSitesPerUser}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}