/**
 * Modern Login Form Component
 * Matches the mobile design with icons and green button
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModernLoginForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      })

      if (result.error) {
        setError(result.error.message || "Failed to sign in")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      })
    } catch (err) {
      setError("Failed to sign in with Google")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="pl-12 h-14 rounded-2xl text-base text-gray-900 placeholder-gray-400"
              style={{
                backgroundColor: '#EFF2F5',
                borderColor: '#DFE5EB',
                color: '#0F1419'
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="pl-12 pr-12 h-14 rounded-2xl text-base text-gray-900 placeholder-gray-400"
              style={{
                backgroundColor: '#EFF2F5',
                borderColor: '#DFE5EB',
                color: '#0F1419'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="rounded border-gray-300"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <Button variant="link" className="text-sm text-gray-500 hover:text-gray-700 p-0">
            Forgot Password?
          </Button>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-white font-medium rounded-2xl text-base shadow-sm"
          style={{
            backgroundColor: '#66A38A',
            borderColor: '#66A38A',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5A8F7A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#66A38A'
          }}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Login
        </Button>
      </form>

      {/* Social Login Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: '#DFE5EB' }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500" style={{ backgroundColor: '#F7F9FA' }}>Or login with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="w-full h-12 lg:h-14 rounded-2xl lg:rounded-xl text-gray-700 hover:text-gray-900"
        style={{
          backgroundColor: '#EFF2F5',
          borderColor: '#DFE5EB'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#E5E7EB'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#EFF2F5'
        }}
      >
        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}