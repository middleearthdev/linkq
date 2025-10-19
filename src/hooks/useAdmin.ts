/**
 * useAdmin Hook
 * Check if current user has admin access
 */

import { useSession } from "@/lib/auth-client"
import { useState, useEffect } from "react"

export function useAdmin() {
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
        // Simple check - dalam production sebaiknya pakai API endpoint
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

  return { isAdmin, loading }
}