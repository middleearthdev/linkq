/**
 * Payment Method Selector Component
 * Select payment methods for Indonesian market
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Smartphone, Building2, Store } from "lucide-react"
import { PAYMENT_METHODS } from "@/lib/xendit"

interface PaymentMethodSelectorProps {
  onPaymentMethodsSelect: (methods: string[]) => void
  onProceed: () => void
  isLoading?: boolean
}

export function PaymentMethodSelector({ 
  onPaymentMethodsSelect, 
  onProceed, 
  isLoading = false 
}: PaymentMethodSelectorProps) {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  const paymentCategories = [
    {
      id: 'virtual_account',
      name: 'Virtual Account',
      description: 'Transfer bank yang mudah dan aman',
      icon: Building2,
      color: 'blue',
      methods: [
        { code: 'BCA', name: 'BCA Virtual Account', popular: true },
        { code: 'BNI', name: 'BNI Virtual Account', popular: true },
        { code: 'BRI', name: 'BRI Virtual Account', popular: true },
        { code: 'MANDIRI', name: 'Mandiri Virtual Account', popular: true },
        { code: 'PERMATA', name: 'Permata Virtual Account' },
        { code: 'CIMB', name: 'CIMB Niaga Virtual Account' }
      ]
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      description: 'Pembayaran digital yang cepat',
      icon: Smartphone,
      color: 'green',
      methods: [
        { code: 'OVO', name: 'OVO', popular: true },
        { code: 'DANA', name: 'DANA', popular: true },
        { code: 'LINKAJA', name: 'LinkAja' },
        { code: 'SHOPEEPAY', name: 'ShopeePay' },
        { code: 'GOPAY', name: 'GoPay', popular: true }
      ]
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCard,
      color: 'purple',
      methods: [
        { code: 'CREDIT_CARD', name: 'Kartu Kredit/Debit', popular: true }
      ]
    },
    {
      id: 'retail_outlet',
      name: 'Retail Outlet',
      description: 'Bayar di minimarket terdekat',
      icon: Store,
      color: 'orange',
      methods: [
        { code: 'ALFAMART', name: 'Alfamart' },
        { code: 'INDOMARET', name: 'Indomaret' }
      ]
    }
  ]

  const handleMethodToggle = (methodCode: string, checked: boolean) => {
    let updatedMethods: string[]
    
    if (checked) {
      updatedMethods = [...selectedMethods, methodCode]
    } else {
      updatedMethods = selectedMethods.filter(method => method !== methodCode)
    }
    
    setSelectedMethods(updatedMethods)
    onPaymentMethodsSelect(updatedMethods)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      orange: 'border-orange-200 bg-orange-50'
    }
    return colors[color as keyof typeof colors] || 'border-gray-200 bg-gray-50'
  }

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    }
    return colors[color as keyof typeof colors] || 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pilih Metode Pembayaran
        </h2>
        <p className="text-gray-600">
          Pilih satu atau beberapa metode pembayaran yang Anda inginkan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentCategories.map((category) => {
          const IconComponent = category.icon
          
          return (
            <Card 
              key={category.id} 
              className={`transition-all duration-200 ${getColorClasses(category.color)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white ${getIconColor(category.color)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {category.methods.map((method) => (
                  <div 
                    key={method.code}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <Checkbox
                      checked={selectedMethods.includes(method.code)}
                      onCheckedChange={(checked) => 
                        handleMethodToggle(method.code, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{method.name}</span>
                        {method.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Methods Summary */}
      {selectedMethods.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">
                  {selectedMethods.length} metode pembayaran dipilih
                </p>
                <p className="text-sm text-green-600">
                  Anda dapat memilih metode pembayaran di halaman selanjutnya
                </p>
              </div>
              <Button 
                onClick={onProceed}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>🔒 Pembayaran Anda diamankan oleh Xendit</p>
        <p>Semua transaksi dienkripsi dan aman</p>
      </div>
    </div>
  )
}