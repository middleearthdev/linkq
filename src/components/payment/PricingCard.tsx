/**
 * Pricing Card Component
 * Display subscription plans with Indonesian pricing
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/xendit"

interface PricingCardProps {
  plan: typeof SUBSCRIPTION_PLANS.STARTER | typeof SUBSCRIPTION_PLANS.PRO
  isPopular?: boolean
  onSubscribe: (planId: string) => void
  isLoading?: boolean
  currentPlan?: string
}

export function PricingCard({ 
  plan, 
  isPopular = false, 
  onSubscribe, 
  isLoading = false,
  currentPlan 
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const isCurrentPlan = currentPlan?.toUpperCase() === plan.id.toUpperCase()

  return (
    <Card 
      className={`relative transition-all duration-300 ${
        isPopular 
          ? 'border-2 border-blue-500 shadow-lg scale-105' 
          : 'border border-gray-200 hover:shadow-md'
      } ${isHovered ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Crown className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          {plan.id === 'starter' ? (
            <Zap className="h-8 w-8 text-blue-500" />
          ) : (
            <Crown className="h-8 w-8 text-purple-500" />
          )}
        </div>
        
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(plan.price)}
          </span>
          <span className="text-gray-600 ml-1">/bulan</span>
        </div>
        
        <CardDescription className="mt-2">
          Perfect for {plan.id === 'starter' ? 'individuals and small creators' : 'professionals and businesses'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          {isCurrentPlan ? (
            <Button 
              variant="outline" 
              className="w-full" 
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Button 
              className={`w-full ${
                isPopular 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
              onClick={() => onSubscribe(plan.id)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <p>Pembayaran aman dengan Xendit</p>
          <p>Batalkan kapan saja</p>
        </div>
      </CardContent>
    </Card>
  )
}