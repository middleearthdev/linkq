/**
 * Payment Success Page
 * Displayed after successful payment
 */

"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Download, Sparkles } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const externalId = searchParams.get('external_id')

  useEffect(() => {
    if (externalId) {
      fetchPaymentData()
    }
  }, [externalId])

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/payments/status?external_id=${externalId}`)
      const data = await response.json()
      
      if (data.success) {
        setPaymentData(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pembayaran Berhasil!
          </h1>
          <p className="text-gray-600">
            Terima kasih atas pembayaran Anda. Akun Anda telah diupgrade.
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 border-green-200 bg-white shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge className="bg-green-500 text-white">Terbayar</Badge>
            </div>
            <CardTitle className="text-xl">Detail Pembayaran</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {paymentData && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Paket</span>
                  <span className="font-medium">
                    {paymentData.type === 'subscription' ? 'Subscription Plan' : 'Template Purchase'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Jumlah</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(paymentData.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">ID Transaksi</span>
                  <span className="font-mono text-sm text-gray-500">
                    {paymentData.externalId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium">
                    {new Date(paymentData.paidAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Apa Selanjutnya?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Akses Fitur Premium</p>
                <p className="text-sm text-gray-600">
                  Semua fitur premium sekarang tersedia di dashboard Anda
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Jelajahi Template Premium</p>
                <p className="text-sm text-gray-600">
                  Akses koleksi template premium yang eksklusif
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Mulai Membuat</p>
                <p className="text-sm text-gray-600">
                  Buat bio link yang menakjubkan dengan editor visual
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            Buka Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Unduh Struk
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Butuh bantuan? Hubungi support kami di</p>
          <a href="mailto:support@linkq.app" className="text-blue-600 hover:underline">
            support@linkq.app
          </a>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}