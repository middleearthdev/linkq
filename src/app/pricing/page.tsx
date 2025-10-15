/**
 * Pricing Page
 * Display subscription plans and handle payments
 */

"use client"

import { useState } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { PricingCard } from "@/components/payment/PricingCard"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Star } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/xendit"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'plans' | 'payment'>('plans')

  const handleSubscribe = (planId: string) => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    setSelectedPlan(planId)
    setStep('payment')
  }

  const handlePaymentMethodsSelect = (methods: string[]) => {
    setSelectedPaymentMethods(methods)
  }

  const handleProceedPayment = async () => {
    if (!selectedPlan || selectedPaymentMethods.length === 0) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payments/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'subscription',
          planId: selectedPlan,
          paymentMethods: selectedPaymentMethods
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Xendit invoice URL
        window.location.href = data.data.invoiceUrl
      } else {
        console.error('Payment creation failed:', data.error)
        alert('Gagal membuat pembayaran. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPlans = () => {
    setStep('plans')
    setSelectedPlan(null)
    setSelectedPaymentMethods([])
  }

  if (step === 'payment') {
    const plan = selectedPlan ? SUBSCRIPTION_PLANS[selectedPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS] : null
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToPlans}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Paket
            </Button>
            
            {plan && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
                <h2 className="text-xl font-bold mb-2">Paket yang Dipilih</h2>
                <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-blue-500 text-white">
                    {plan.name}
                  </Badge>
                  <span className="text-2xl font-bold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(plan.price)}/bulan
                  </span>
                </div>
              </div>
            )}
          </div>

          <PaymentMethodSelector
            onPaymentMethodsSelect={handlePaymentMethodsSelect}
            onProceed={handleProceedPayment}
            isLoading={isLoading}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket yang Tepat untuk Anda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mulai gratis dan upgrade kapan saja. Semua paket termasuk hosting unlimited dan dukungan 24/7.
          </p>
        </div>

        {/* Free Plan */}
        <div className="mb-12">
          <Card className="max-w-md mx-auto border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">Free Plan</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">Gratis</span>
                <span className="text-gray-600 ml-1">selamanya</span>
              </div>
              <p className="text-gray-600 mt-2">
                Sempurna untuk memulai
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Template dasar',
                  'Bio dan link blocks',
                  'Social media links',
                  'Subdomain LinkQ',
                  'Branding LinkQ'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/auth/signup')}
              >
                Mulai Gratis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            plan={SUBSCRIPTION_PLANS.STARTER}
            onSubscribe={handleSubscribe}
            isLoading={isLoading}
            currentPlan={(session?.user as any)?.plan}
          />
          
          <PricingCard
            plan={SUBSCRIPTION_PLANS.PRO}
            isPopular={true}
            onSubscribe={handleSubscribe}
            isLoading={isLoading}
            currentPlan={(session?.user as any)?.plan}
          />
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Bandingkan Semua Fitur
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              {/* Header */}
              <div className="p-6 bg-gray-50 font-semibold">Fitur</div>
              <div className="p-6 bg-gray-50 text-center font-semibold">Free</div>
              <div className="p-6 bg-blue-50 text-center font-semibold">Starter</div>
              <div className="p-6 bg-purple-50 text-center font-semibold">Pro</div>
              
              {/* Features */}
              {[
                { name: 'Template dasar', free: true, starter: true, pro: true },
                { name: 'Template premium', free: false, starter: true, pro: true },
                { name: 'Analytics dasar', free: false, starter: true, pro: true },
                { name: 'Analytics lanjutan', free: false, starter: false, pro: true },
                { name: 'Custom domain', free: false, starter: false, pro: true },
                { name: 'Custom CSS', free: false, starter: false, pro: true },
                { name: 'Remove branding', free: false, starter: true, pro: true },
                { name: 'Priority support', free: false, starter: true, pro: true },
              ].map((feature, index) => (
                <>
                  <div key={`name-${index}`} className="p-4 border-t border-gray-100">
                    {feature.name}
                  </div>
                  <div key={`free-${index}`} className="p-4 border-t border-gray-100 text-center">
                    {feature.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : '-'}
                  </div>
                  <div key={`starter-${index}`} className="p-4 border-t border-gray-100 text-center bg-blue-25">
                    {feature.starter ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : '-'}
                  </div>
                  <div key={`pro-${index}`} className="p-4 border-t border-gray-100 text-center bg-purple-25">
                    {feature.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : '-'}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Apakah saya bisa upgrade kapan saja?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ya, Anda bisa upgrade atau downgrade paket kapan saja. Perubahan akan berlaku segera setelah pembayaran dikonfirmasi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metode pembayaran apa yang diterima?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Kami menerima berbagai metode pembayaran Indonesia seperti Virtual Account (BCA, BNI, BRI, Mandiri), e-wallet (OVO, DANA, GoPay), dan kartu kredit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Apakah ada garansi uang kembali?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ya, kami memberikan garansi uang kembali 14 hari untuk semua paket premium jika Anda tidak puas dengan layanan kami.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bagaimana cara membatalkan subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Anda dapat membatalkan subscription kapan saja melalui dashboard. Akun Anda akan tetap aktif hingga akhir periode yang sudah dibayar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}