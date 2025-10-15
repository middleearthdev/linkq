/**
 * Modern Auth Layout Component
 * Based on mobile-first design with dark header and modern UI
 */

"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  currentTab: 'login' | 'register'
  onTabChange: (tab: 'login' | 'register') => void
  showBackButton?: boolean
  backHref?: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  currentTab,
  onTabChange,
  showBackButton = true,
  backHref = "/"
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: '#0F1419' }}>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col" style={{ backgroundColor: '#0F1419' }}>
        {/* Dark Header - Mobile */}
        <div className="text-white px-6 py-6" style={{ backgroundColor: '#0F1419' }}>
          {showBackButton && (
            <Link href={backHref} className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="text-white p-2" style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#212A33'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <div className="space-y-1">
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            <p className="text-gray-400 text-base">{subtitle}</p>
          </div>
        </div>

        {/* Content Area - Mobile */}
        <div className="flex-1 flex items-end px-4 pb-0" style={{ backgroundColor: '#0F1419' }}>
          {/* Auth Card - Mobile */}
          <div className="w-full rounded-t-3xl p-5 shadow-xl" style={{
            backgroundColor: '#F7F9FA',
            boxShadow: '0 -25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Tab Switcher - Mobile */}
            <div className="rounded-full p-1 mb-5 flex" style={{ backgroundColor: '#EFF2F5' }}>
              <button
                onClick={() => onTabChange('login')}
                className="flex-1 py-3 px-6 text-sm font-medium rounded-full transition-all"
                style={{
                  backgroundColor: currentTab === 'login' ? '#FFFFFF' : 'transparent',
                  color: currentTab === 'login' ? '#0F1419' : '#6B7280',
                  boxShadow: currentTab === 'login' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none'
                }}
              >
                Login
              </button>
              <button
                onClick={() => onTabChange('register')}
                className="flex-1 py-3 px-6 text-sm font-medium rounded-full transition-all"
                style={{
                  backgroundColor: currentTab === 'register' ? '#FFFFFF' : 'transparent',
                  color: currentTab === 'register' ? '#0F1419' : '#6B7280',
                  boxShadow: currentTab === 'register' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none'
                }}
              >
                Register
              </button>
            </div>

            {/* Form Content - Mobile */}
            {children}
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden lg:flex lg:min-h-screen lg:w-full">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8" style={{ backgroundColor: '#0F1419' }}>
          <div className="text-center text-white space-y-6 max-w-md">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <h1 className="text-4xl font-bold">LinkQ</h1>
              </Link>
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-lg text-gray-400">{subtitle}</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#66A38A' }}>
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <span>Beautiful bio link pages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#66A38A' }}>
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <span>Advanced analytics & insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#66A38A' }}>
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <span>Custom domains & branding</span>
              </div>
            </div>
          </div>
        </div >

        {/* Right Side - Form */}
        <div className="lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8" style={{ backgroundColor: '#0F1419' }}>
          <div className="w-full max-w-md">
            {showBackButton && (
              <Link href={backHref} className="inline-block mb-6">
                <Button variant="ghost" size="sm" className="text-white p-2" style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#212A33'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Auth Card - Desktop */}
            <div className="rounded-3xl p-8 shadow-xl" style={{
              backgroundColor: '#F7F9FA',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Tab Switcher - Desktop */}
              <div className="rounded-full p-1 mb-8 flex" style={{ backgroundColor: '#EFF2F5' }}>
                <button
                  onClick={() => onTabChange('login')}
                  className="flex-1 py-3 px-6 text-sm font-medium rounded-full transition-all"
                  style={{
                    backgroundColor: currentTab === 'login' ? '#FFFFFF' : 'transparent',
                    color: currentTab === 'login' ? '#0F1419' : '#6B7280',
                    boxShadow: currentTab === 'login' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => onTabChange('register')}
                  className="flex-1 py-3 px-6 text-sm font-medium rounded-full transition-all"
                  style={{
                    backgroundColor: currentTab === 'register' ? '#FFFFFF' : 'transparent',
                    color: currentTab === 'register' ? '#0F1419' : '#6B7280',
                    boxShadow: currentTab === 'register' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none'
                  }}
                >
                  Register
                </button>
              </div>

              {/* Form Content - Desktop */}
              {children}
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}