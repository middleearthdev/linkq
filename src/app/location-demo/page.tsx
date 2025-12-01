"use client"

import { useState } from 'react'
import { LocationBlock } from '@/components/blocks/LocationBlock'
import type { LocationBlockProps } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Tablet, MapPin } from 'lucide-react'

const SAMPLE_LOCATION: LocationBlockProps = {
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1944491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonas!5e0!3m2!1sen!2sid!4v1234567890',
  address: 'Jl. Medan Merdeka, Jakarta Pusat, DKI Jakarta 10110, Indonesia',
  phone: '021-3441694',
  openingHours: [
    { day: 'Senin - Kamis', hours: '08:00 - 17:00' },
    { day: 'Jumat', hours: '08:00 - 17:00' },
    { day: 'Sabtu - Minggu', hours: '08:00 - 18:00' }
  ],
  locationName: 'Monumen Nasional (Monas)',
  showDirectionsButton: true,
  mapHeight: 300,
  showCurrentStatus: true
}

type DeviceType = 'mobile' | 'tablet'

export default function LocationDemoPage() {
  const [deviceType, setDeviceType] = useState<DeviceType>('tablet')
  const [showDirectionsButton, setShowDirectionsButton] = useState(true)

  // Device frame styles
  const deviceFrameClass = {
    mobile: 'max-w-[375px] mx-auto',
    tablet: 'max-w-2xl mx-auto'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 shadow-sm z-100">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Location Block</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Google Maps integration with responsive preview</p>
            </div>
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Back
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Control Panel */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">🎛️ Customization Controls</h2>

          {/* Device Preview Toggle */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📱 Device Preview
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setDeviceType('mobile')}
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
                <span className="text-xs opacity-70">(375px)</span>
              </Button>
              <Button
                onClick={() => setDeviceType('tablet')}
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                className="flex-1 gap-2"
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
                <span className="text-xs opacity-70">(672px)</span>
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
              <strong>Current:</strong> {deviceType === 'mobile' ? 'Mobile view' : 'Tablet view'}
            </div>
          </div>

          {/* Settings */}
          <div className="flex justify-center">
            {/* Directions Button */}
            <div className="w-full max-w-xs">
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                🧭 Directions Button
              </label>
              <Button
                onClick={() => setShowDirectionsButton(!showDirectionsButton)}
                variant={showDirectionsButton ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {showDirectionsButton ? '✓ ON' : '✗ OFF'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Location Block Display with Device Frame */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
              {deviceType === 'mobile' ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Preview</span>
                </>
              ) : (
                <>
                  <Tablet className="w-4 h-4" />
                  <span>Tablet Preview</span>
                </>
              )}
            </div>
          </div>

          {/* Device Frame */}
          <div className={deviceFrameClass[deviceType]}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800">
              {/* Device Notch/Status Bar */}
              <div className="bg-gray-900 h-6 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
              </div>

              {/* Content Area - Fixed height with scroll */}
              <div className={`bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-y-auto ${
                deviceType === 'mobile' ? 'h-[667px]' : 'h-[800px]'
              }`}>
                <div className="p-4">
                  <LocationBlock
                    props={{
                      ...SAMPLE_LOCATION,
                      showDirectionsButton,
                      showCurrentStatus: true,
                      mapHeight: 300
                    }}
                    isEditing={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="font-bold text-base mb-1">Google Maps</h3>
            <p className="text-blue-100 text-xs">
              Embedded map integration
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-bold text-base mb-1">Full Address</h3>
            <p className="text-green-100 text-xs">
              Complete location details
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-3xl mb-2">🕒</div>
            <h3 className="font-bold text-base mb-1">Opening Hours</h3>
            <p className="text-purple-100 text-xs">
              Auto open/close status
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="text-3xl mb-2">🧭</div>
            <h3 className="font-bold text-base mb-1">Directions</h3>
            <p className="text-orange-100 text-xs">
              Direct navigation link
            </p>
          </Card>
        </div>

        {/* Implementation Code */}
        <Card className="p-4 sm:p-6 bg-gray-900 text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📝 Implementation Code</h3>
          <pre className="bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
            <code>{`<LocationBlock
  props={{
    googleMapsUrl: "https://www.google.com/maps/...",
    address: "Jl. Medan Merdeka, Jakarta...",
    phone: "021-3441694",
    openingHours: [
      { day: "Senin - Kamis", hours: "08:00 - 17:00" },
      { day: "Jumat", hours: "08:00 - 17:00" },
      { day: "Sabtu - Minggu", hours: "08:00 - 18:00" }
    ],
    locationName: "Monumen Nasional (Monas)",
    showDirectionsButton: ${showDirectionsButton},
    mapHeight: 300,
    showCurrentStatus: true
  }}
/>`}</code>
          </pre>

          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
            <div className="font-semibold mb-2">Features:</div>
            <div className="space-y-1 text-gray-300">
              <div>• <strong className="text-white">Google Maps:</strong> Embedded iframe with full interaction</div>
              <div>• <strong className="text-white">Opening Hours:</strong> Auto-detect current day status</div>
              <div>• <strong className="text-white">Phone:</strong> Click to call functionality</div>
              <div>• <strong className="text-white">Directions:</strong> Opens Google Maps navigation</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
