/**
 * Dashboard Page
 * Mobile-first dashboard for bio link management
 */

"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LinkQLogo } from "@/components/ui/linkq-logo"
import { usePlan } from "@/hooks/usePlan"
import {
  LogOut,
  Plus,
  Settings,
  BarChart3,
  Link,
  Palette,
  Globe,
  Crown,
  Eye,
  Edit3,
  Menu,
  Search,
  Lock,
  TrendingUp
} from "lucide-react"
import { useState, useEffect } from "react"
import { QuickLoading } from "@/components/ui/cool-loading"
import { AdminNavLink } from "@/components/navigation/AdminNavLink"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { ThemeToggleWithLabel } from "@/components/theme/ThemeToggleWithLabel"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const {
    userPlan,
    isFree,
    canUseAnalytics,
    canCreateSite,
    getSiteUsage,
    getPlanColor,
    getPlanIcon
  } = usePlan()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [handle, setHandle] = useState('')
  // Use default template - no selection needed
  const defaultTemplate = 'minimal'
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [sites, setSites] = useState<any[]>([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [sitesError, setSitesError] = useState('')

  // Fetch user sites
  useEffect(() => {
    const fetchSites = async () => {
      if (!session?.user) return

      try {
        setLoadingSites(true)
        setSitesError('')

        const response = await fetch('/api/dashboard/sites')
        const data = await response.json()

        if (data.success) {
          setSites(data.data.sites || [])
        } else {
          setSitesError(data.error?.message || 'Failed to load sites')
        }
      } catch (err) {
        setSitesError('Failed to load sites')
      } finally {
        setLoadingSites(false)
      }
    }

    fetchSites()
  }, [session])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/'
          }
        }
      })
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback redirect
      window.location.href = '/'
    }
  }

  const handleCreateSite = () => {
    if (!canCreateSite(sites.length)) {
      // Show upgrade modal or limit reached message
      const siteUsage = getSiteUsage(sites.length)
      alert(`You've reached your ${userPlan} plan limit of ${siteUsage.max} sites. Upgrade to create more sites.`)
      return
    }
    setShowCreateModal(true)
  }

  const navigateToSites = () => {
    window.location.href = '/sites'
  }

  const navigateToTemplates = () => {
    // TODO: Navigate to templates page
    console.log('Navigate to templates')
  }

  const navigateToAnalytics = () => {
    // TODO: Navigate to analytics page
    console.log('Navigate to analytics')
  }

  const handleCreateSiteSubmit = async () => {
    if (!handle.trim()) {
      setError('Please enter a handle')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(handle) || handle.length < 3 || handle.length > 30) {
      setError('Handle must be 3-30 characters and contain only letters, numbers, hyphens, and underscores')
      return
    }

    setCreating(true)
    setError('')

    try {
      const response = await fetch('/api/sites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: handle.trim(),
          templateSlug: defaultTemplate
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific limit errors
        if (response.status === 403 && data.message) {
          setError(data.message)
        } else {
          setError(data.error || 'Failed to create site')
        }
        return
      }

      // Success - redirect to editor
      window.location.href = data.site.editUrl

    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const resetCreateModal = () => {
    setShowCreateModal(false)
    setHandle('')
    // No template selection needed - using default
    setError('')
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden bg-card border-b border-border shadow-sm">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <LinkQLogo size="sm" variant="minimal" showText={false} />
              <Badge className="text-xs px-2 py-1.5 flex items-center gap-1.5 shadow-sm" style={{ backgroundColor: getPlanColor(), color: '#FFFFFF' }}>
                <span>{getPlanIcon()}</span>
                {userPlan}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground dark:text-white p-2 hover:bg-secondary/80 dark:hover:bg-[#212A33]"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground dark:text-white p-2 hover:bg-secondary/80 dark:hover:bg-[#212A33]"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-primary shadow-md ring-2 ring-primary/20">
                {session.user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">{session.user.name}</p>
                <p className="text-muted-foreground text-xs">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <LinkQLogo size="md" variant="default" />
              <div className="flex items-center space-x-1">
                <Button variant="ghost" className="text-foreground hover:bg-secondary/80 font-medium" size="sm">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60" size="sm" onClick={navigateToSites}>
                  Sites
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60" size="sm">
                  Templates
                </Button>
                <AdminNavLink variant="desktop" />
                <Button
                  variant="ghost"
                  className={`text-muted-foreground hover:text-foreground hover:bg-secondary/60 ${!canUseAnalytics ? 'cursor-not-allowed opacity-60' : ''}`}
                  size="sm"
                  disabled={!canUseAnalytics}
                  onClick={() => {
                    if (!canUseAnalytics) {
                      alert('Analytics is available for Starter and Pro plans. Upgrade to unlock!')
                      return
                    }
                    navigateToAnalytics()
                  }}
                >
                  <span className="flex items-center gap-1">
                    Analytics
                    {!canUseAnalytics && <Lock className="h-3 w-3" />}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggleWithLabel />
              <Badge className="text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-sm" style={{ backgroundColor: getPlanColor(), color: '#FFFFFF' }}>
                <span>{getPlanIcon()}</span>
                {userPlan}
              </Badge>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-primary shadow-md ring-2 ring-primary/20">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-foreground">{session.user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-foreground border-border hover:bg-secondary/80 hover:border-primary/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] shadow-xl bg-card">
            {/* Mobile Menu Header */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-foreground hover:bg-secondary"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="px-4 py-6 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground bg-secondary h-11 rounded-xl"
              >
                <Link className="h-5 w-5 mr-3 text-primary" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-11 rounded-xl"
                onClick={navigateToSites}
              >
                <Globe className="h-5 w-5 mr-3" />
                My Sites
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-11 rounded-xl"
              >
                <Palette className="h-5 w-5 mr-3" />
                Templates
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start h-11 rounded-xl ${
                  canUseAnalytics
                    ? 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    : 'text-muted-foreground/50 cursor-not-allowed'
                }`}
                disabled={!canUseAnalytics}
                onClick={() => {
                  if (!canUseAnalytics) {
                    alert('Analytics is available for Starter and Pro plans. Upgrade to unlock!')
                    return
                  }
                  // Navigate to analytics
                }}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span className="flex items-center gap-2">
                  Analytics
                  {!canUseAnalytics && <Lock className="h-3 w-3" />}
                </span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-11 rounded-xl"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>

              <AdminNavLink variant="mobile" />

              {/* Divider */}
              <div className="my-6 border-t border-border" />

              {/* Upgrade Section */}
              <div className="p-4 rounded-xl bg-yellow-500/10 dark:bg-yellow-900/20 border border-yellow-500/20">
                <div className="flex items-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2" />
                  <span className="text-foreground font-medium">Upgrade Plan</span>
                </div>
                <p className="text-muted-foreground text-sm mb-3">
                  Unlock premium features and templates
                </p>
                <Button
                  size="sm"
                  className="w-full h-8 text-sm rounded-xl bg-primary hover:bg-primary/90 text-white"
                >
                  Upgrade Now
                </Button>
              </div>

              {/* Sign Out */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 dark:hover:bg-red-900/20 h-11 rounded-xl"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 lg:max-w-7xl lg:mx-auto lg:px-6 lg:py-8">
        {/* Mobile Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-2">Dashboard</h2>
          <p className="text-muted-foreground text-sm lg:text-base">
            Manage your bio link pages and track performance
          </p>
        </div>

        {/* Quick Create Button - Mobile Priority */}
        <div className="mb-6 lg:hidden">
          <Button
            onClick={handleCreateSite}
            disabled={!canCreateSite(sites.length)}
            className="w-full h-12 font-medium text-base rounded-2xl shadow-sm"
            style={{
              backgroundColor: canCreateSite(sites.length) ? getPlanColor() : '#6B7280',
              borderColor: canCreateSite(sites.length) ? getPlanColor() : '#6B7280',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              if (canCreateSite(sites.length)) {
                e.currentTarget.style.backgroundColor = '#5A8F7A'
              }
            }}
            onMouseLeave={(e) => {
              if (canCreateSite(sites.length)) {
                e.currentTarget.style.backgroundColor = getPlanColor()
              }
            }}
          >
            {canCreateSite(sites.length) ? (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create New Bio Link
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Site Limit Reached
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <Card
            onClick={handleCreateSite}
            className={`transition-all bg-card border-border shadow-sm hover:shadow-md ${
              canCreateSite(sites.length)
                ? 'cursor-pointer hover:border-primary/60 hover:bg-secondary/30'
                : 'cursor-not-allowed opacity-60'
            }`}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {canCreateSite(sites.length) ? (
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2 lg:mb-0">
                    <Plus className="h-5 w-5 lg:h-4 lg:w-4 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-muted w-fit mb-2 lg:mb-0">
                    <Lock className="h-5 w-5 lg:h-4 lg:w-4 text-muted-foreground" />
                  </div>
                )}
                <CardTitle className="text-sm lg:text-base font-semibold text-card-foreground">
                  {canCreateSite(sites.length) ? 'Create Site' : 'Limit Reached'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm">
                {canCreateSite(sites.length)
                  ? 'Start building your page'
                  : 'Upgrade to create more sites'
                }
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={navigateToSites}
            className="cursor-pointer hover:shadow-md transition-all bg-card border-border shadow-sm hover:border-primary/60 hover:bg-secondary/30"
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2 lg:mb-0">
                  <Link className="h-5 w-5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base font-semibold text-card-foreground">My Sites</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm">
                View & edit sites
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={navigateToTemplates}
            className="cursor-pointer hover:shadow-md transition-all bg-card border-border shadow-sm hover:border-primary/60 hover:bg-secondary/30"
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2 lg:mb-0">
                  <Palette className="h-5 w-5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base font-semibold text-card-foreground">Templates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm">
                Browse themes
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            onClick={() => {
              if (!canUseAnalytics) {
                alert('Analytics is available for Starter and Pro plans. Upgrade to unlock!')
                return
              }
              navigateToAnalytics()
            }}
            className={`transition-all bg-card border-border shadow-sm hover:shadow-md ${
              canUseAnalytics
                ? 'cursor-pointer hover:border-primary/60 hover:bg-secondary/30'
                : 'cursor-not-allowed opacity-60'
            }`}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {canUseAnalytics ? (
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2 lg:mb-0">
                    <BarChart3 className="h-5 w-5 lg:h-4 lg:w-4 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-muted w-fit mb-2 lg:mb-0 flex items-center gap-1">
                    <BarChart3 className="h-5 w-5 lg:h-4 lg:w-4 text-muted-foreground" />
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                <CardTitle className="text-sm lg:text-base font-semibold text-card-foreground">
                  {canUseAnalytics ? 'Analytics' : 'Analytics'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs lg:text-sm">
                {canUseAnalytics ? 'Track performance' : 'Available in Starter+'}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {/* Recent Sites */}
          <Card className="border-border shadow-md bg-card dark:border-gray-700 dark:bg-[#1A2332]">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Link className="h-4 w-4 text-primary" />
                </div>
                Recent Sites
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your recently created or updated sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSites ? (
                <QuickLoading text="Loading sites..." />
              ) : sitesError ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                    <Globe className="h-8 w-8 text-red-500 dark:text-red-400" />
                  </div>
                  <p className="text-red-600 dark:text-red-400 mb-3 font-medium">{sitesError}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    size="sm"
                    className="h-9 px-4 text-sm rounded-xl"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-muted dark:bg-[#2A3441]">
                    <Globe className="h-8 w-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <p className="text-foreground dark:text-gray-400 mb-3 font-medium">No sites created yet</p>
                  <Button
                    onClick={handleCreateSite}
                    size="sm"
                    className="h-9 px-4 text-sm rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md"
                  >
                    Create Your First Site
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Usage Meter */}
                  <div className="p-3 rounded-xl border border-border bg-secondary/50 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground dark:text-white text-sm font-medium">Site Usage</span>
                      <span className="text-xs text-muted-foreground dark:text-gray-400">
                        {getSiteUsage(sites.length).used}/{getSiteUsage(sites.length).max}
                      </span>
                    </div>
                    <div className="w-full bg-muted dark:bg-gray-700 rounded-full h-2.5 shadow-inner">
                      <div
                        className="h-2.5 rounded-full transition-all duration-300 shadow-sm"
                        style={{
                          width: `${Math.min(getSiteUsage(sites.length).percentage, 100)}%`,
                          backgroundColor: getSiteUsage(sites.length).isAtLimit ? '#EF4444' : getPlanColor()
                        }}
                      />
                    </div>
                    {getSiteUsage(sites.length).isAtLimit && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                        Site limit reached. Upgrade to create more sites.
                      </p>
                    )}
                  </div>

                  {sites.slice(0, 3).map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer border border-transparent hover:border-border"
                      onClick={() => window.location.href = `/editor/${site.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-foreground dark:text-white text-sm font-medium truncate">{site.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 ${
                              site.status === 'PUBLISHED'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {site.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs truncate">@{site.handle}</p>
                        <p className="text-muted-foreground/80 text-xs">{site.views} views</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white hover:bg-secondary/60"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/${site.handle}`, '_blank')
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white hover:bg-secondary/60"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/editor/${site.id}`
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {sites.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-sm text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white hover:bg-secondary/60"
                      onClick={() => console.log('Navigate to all sites')}
                    >
                      View all {sites.length} sites
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <Card className="border-border shadow-md bg-card dark:border-gray-700 dark:bg-[#1A2332]">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white flex items-center gap-2">
                {canUseAnalytics ? (
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-muted flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                Analytics Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {canUseAnalytics ? 'Your site performance this week' : 'Upgrade to Starter for analytics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canUseAnalytics ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-muted dark:bg-[#2A3441]">
                    <Lock className="h-8 w-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <p className="text-foreground dark:text-gray-400 mb-1 font-medium">Analytics locked</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-500 mb-3">Available in Starter and Pro plans</p>
                  <Button
                    size="sm"
                    className="h-9 px-4 text-sm rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Upgrade Plan
                  </Button>
                </div>
              ) : loadingSites ? (
                <QuickLoading text="Loading analytics..." />
              ) : sites.length === 0 ? (
                <div className="text-center py-6 lg:py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-muted dark:bg-[#2A3441]">
                    <BarChart3 className="h-8 w-8 text-muted-foreground dark:text-gray-500" />
                  </div>
                  <p className="text-foreground dark:text-gray-400 mb-1 font-medium">No analytics data yet</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-500">Create a site to start tracking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-secondary/50 dark:bg-transparent">
                      <div className="text-2xl font-bold text-foreground dark:text-white mb-1">
                        {sites.reduce((total, site) => total + site.views, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-gray-400">Total Views</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50 dark:bg-transparent">
                      <div className="text-2xl font-bold text-foreground dark:text-white mb-1">
                        {sites.filter(site => site.status === 'PUBLISHED').length}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-gray-400">Published Sites</div>
                    </div>
                  </div>

                  {sites.length > 0 && (
                    <div className="pt-3 border-t border-border dark:border-[#2A3441]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground dark:text-gray-400">Most viewed:</span>
                        <span className="text-foreground dark:text-white font-medium">
                          {sites.sort((a, b) => b.views - a.views)[0]?.title || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Premium Upgrade Banner - Only show for FREE users */}
        {isFree && (
          <div className="mt-6 lg:mt-8">
            <Card className="border-primary/30 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 dark:border-yellow-700 dark:from-[#2A2416] dark:to-[#2A2416]">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Crown className="h-5 w-5 text-primary dark:text-yellow-500 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground dark:text-white font-semibold mb-1">Unlock Premium Features</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Get analytics, custom domains, premium templates and more with Starter or Pro
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="p-1 rounded bg-muted">
                          <Lock className="h-3 w-3" />
                        </div>
                        Analytics Dashboard
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="p-1 rounded bg-muted">
                          <Lock className="h-3 w-3" />
                        </div>
                        Custom Domains
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="p-1 rounded bg-muted">
                          <Lock className="h-3 w-3" />
                        </div>
                        Remove Branding
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="p-1 rounded bg-muted">
                          <Lock className="h-3 w-3" />
                        </div>
                        Premium Templates
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="h-9 px-4 text-sm rounded-xl flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white shadow-md"
                      >
                        Upgrade Now
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 px-4 text-sm rounded-xl text-foreground border-border hover:bg-secondary flex-1 sm:flex-none">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={resetCreateModal}
          />
          <div className="relative w-full max-w-md rounded-3xl p-6 shadow-xl bg-card">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Create New Site</h3>
              <p className="text-muted-foreground text-sm">
                Start building your bio link page in minutes
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Handle Input */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Choose Your Handle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="yourname"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    disabled={creating}
                    className={`w-full pl-16 pr-4 h-12 rounded-xl border text-foreground placeholder-muted-foreground bg-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      creating ? 'opacity-60 cursor-not-allowed' : ''
                    } ${
                      error && error.toLowerCase().includes('handle')
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-border'
                    }`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    linkq.id/
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  3-30 characters, letters, numbers, hyphens and underscores only
                </p>
              </div>

              {/* Info about default template */}
              <div className="text-center py-4 px-3 rounded-xl bg-secondary/50">
                <p className="text-sm text-foreground mb-2">
                  Your new site will be created with our <strong className="text-primary">Minimal Template</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  You can customize and change templates later in the editor
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={resetCreateModal}
                disabled={creating}
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSiteSubmit}
                disabled={creating || !handle.trim()}
                className="flex-1 h-12 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                {creating ? 'Creating...' : 'Create Site'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}