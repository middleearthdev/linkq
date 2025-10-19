/**
 * Admin Dashboard Client Component
 * Contains all the existing admin dashboard logic
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Layout, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  Download
} from "lucide-react"
import { UserManagement } from "./UserManagement"
import { AnalyticsCharts } from "./AnalyticsCharts"

interface AdminStats {
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

interface AdminDashboardClientProps {
  user: {
    id: string
    email: string
    name: string | null
    isAdmin: boolean
  }
}

export function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0F1419', borderBottom: '1px solid #212A33' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '#66A38A' }}>LinkQ Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-red-500 text-red-400" style={{ backgroundColor: '#2A1616', borderColor: '#DC2626' }}>
                Admin Access
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/dashboard")}
                className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-gray-400 mt-2">
            Manage templates, users, and platform analytics. Welcome {user.name}!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-400">
                +{stats?.monthlyGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Sites</CardTitle>
              <Layout className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalSites || 0}</div>
              <p className="text-xs text-gray-400">
                Active bio link pages
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Templates</CardTitle>
              <Layout className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalTemplates || 0}</div>
              <p className="text-xs text-gray-400">
                Available templates
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: '#66A38A' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#66A38A' }}>
                ${((stats?.totalRevenue || 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                Total platform revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="templates" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Templates</TabsTrigger>
            <TabsTrigger value="users" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Template Management</h3>
              <Button 
                onClick={() => router.push("/admin/templates")}
                className="text-white border-gray-600 hover:bg-gray-800"
                style={{ backgroundColor: '#66A38A' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A8F7A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#66A38A'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Templates
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                <CardHeader>
                  <CardTitle className="text-base text-white">Minimal Template</CardTitle>
                  <CardDescription className="text-gray-400">Clean and simple design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">Free</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                <CardHeader>
                  <CardTitle className="text-base text-white">Aurora Template</CardTitle>
                  <CardDescription className="text-gray-400">Modern gradient design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="default" style={{ backgroundColor: '#66A38A', color: 'white' }}>$9</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                <CardHeader>
                  <CardTitle className="text-base text-white">Professional Template</CardTitle>
                  <CardDescription className="text-gray-400">Corporate and elegant</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">Pro Plan</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Platform Analytics</h3>
              <Button 
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
            </div>

            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Platform Settings</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                  <CardDescription className="text-gray-400">Platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Site Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    User Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-700" style={{ backgroundColor: '#1A2332', borderColor: '#2A3441' }}>
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-gray-400">Platform status and monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Database</span>
                      <Badge variant="default" className="bg-green-500 text-white">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">API Status</span>
                      <Badge variant="default" className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Storage</span>
                      <Badge variant="default" className="bg-green-500 text-white">Normal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}