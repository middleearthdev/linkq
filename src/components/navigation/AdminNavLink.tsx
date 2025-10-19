/**
 * Admin Navigation Link Component
 * Shows admin link only if user has admin access
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"

interface AdminNavLinkProps {
  variant?: "desktop" | "mobile"
  className?: string
}

export function AdminNavLink({ variant = "desktop", className }: AdminNavLinkProps) {
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!session?.user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/user/me')
        if (response.ok) {
          const userData = await response.json()
          setIsAdmin(userData.user?.isAdmin === true)
        }
      } catch (error) {
        console.error('Failed to check admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [session])

  // Don't render anything if loading or not admin
  if (loading || !isAdmin) {
    return null
  }

  const handleClick = () => {
    window.location.href = '/admin'
  }

  if (variant === "mobile") {
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/30 h-11 rounded-xl ${className}`}
        onClick={handleClick}
      >
        <Settings className="h-5 w-5 mr-3 text-red-400" />
        <span className="flex items-center gap-2">
          Admin Panel
          <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
            Admin
          </Badge>
        </span>
      </Button>
    )
  }

  // Desktop variant
  return (
    <Button 
      variant="ghost" 
      className={`text-gray-400 hover:text-white flex items-center gap-2 ${className}`}
      size="sm"
      onClick={handleClick}
    >
      <Settings className="h-4 w-4 text-red-400" />
      <span>Admin</span>
      <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
        Panel
      </Badge>
    </Button>
  )
}