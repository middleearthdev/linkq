/**
 * Payment Failure Page
 * Displayed when payment fails
 */

"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from "lucide-react"

function PaymentFailureContent() {
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

  const handleRetryPayment = () => {
    router.push('/pricing')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Failure Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pembayaran Gagal
          </h1>
          <p className="text-gray-600">
            Maaf, terjadi masalah dengan pembayaran Anda. Silakan coba lagi.
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 border-red-200 bg-white shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive">Gagal</Badge>
            </div>
            <CardTitle className="text-xl">Detail Pembayaran</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {paymentData && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="destructive">
                    {paymentData.status === 'failed' ? 'Gagal' : 
                     paymentData.status === 'expired' ? 'Kedaluwarsa' : 'Dibatalkan'}
                  </Badge>
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
                    {new Date(paymentData.createdAt).toLocaleDateString('id-ID', {
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

        {/* Common Issues */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Kemungkinan Penyebab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Saldo tidak mencukupi</p>
                <p className="text-xs text-gray-600">
                  Pastikan saldo rekening atau e-wallet Anda mencukupi
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Waktu pembayaran habis</p>
                <p className="text-xs text-gray-600">
                  Invoice pembayaran memiliki batas waktu yang terbatas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Masalah teknis</p>
                <p className="text-xs text-gray-600">
                  Gangguan sementara dari penyedia layanan pembayaran
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-sm">Informasi pembayaran salah</p>
                <p className="text-xs text-gray-600">
                  Periksa kembali nomor virtual account atau kode pembayaran
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRetryPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Butuh Bantuan?</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Tim support kami siap membantu Anda menyelesaikan masalah pembayaran
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                <a href="mailto:support@linkq.app">Hubungi Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Tidak ada biaya tambahan untuk mencoba pembayaran kembali</p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  )
}