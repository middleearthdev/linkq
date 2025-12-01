/**
 * LocationBlock Component
 * Google Maps location display with address, phone, and opening hours
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LocationBlockProps } from '@/types'
import { cn } from '@/lib/utils'
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react'

interface LocationBlockComponentProps {
  props: LocationBlockProps
  className?: string
  isEditing?: boolean
}

// Extract Google Maps embed URL from various formats
function extractGoogleMapsEmbedUrl(url: string): string {
  // If already an embed URL, return as-is
  if (url.includes('/embed')) {
    return url
  }

  // If it's a place URL or regular maps URL, try to extract place ID or coordinates
  const placeIdMatch = url.match(/place\/([^\/]+)/)
  if (placeIdMatch) {
    const placeQuery = encodeURIComponent(placeIdMatch[1].replace(/\+/g, ' '))
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${placeQuery}`
  }

  // If it's coordinates
  const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (coordsMatch) {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${coordsMatch[2]}!3d${coordsMatch[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`
  }

  // Fallback: return the URL as iframe src
  return url
}

// Check if location is currently open
function isCurrentlyOpen(openingHours?: { day: string; hours: string; isOpen?: boolean }[]): boolean {
  if (!openingHours || openingHours.length === 0) return false

  const now = new Date()
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const currentDay = dayNames[now.getDay()]

  // Find today's hours
  const todayHours = openingHours.find(h => h.day.includes(currentDay))

  // If explicitly set, use isOpen
  if (todayHours && typeof todayHours.isOpen === 'boolean') {
    return todayHours.isOpen
  }

  // Otherwise, check if "Tutup" is in the hours string
  if (todayHours && todayHours.hours.toLowerCase().includes('tutup')) {
    return false
  }

  // Default to open if hours are specified
  return todayHours ? true : false
}

export function LocationBlock({
  props,
  className,
  isEditing = false
}: LocationBlockComponentProps) {
  const {
    googleMapsUrl,
    address,
    phone,
    openingHours,
    locationName,
    showDirectionsButton = true,
    mapHeight = 300,
    showCurrentStatus = true,
  } = props

  const embedUrl = extractGoogleMapsEmbedUrl(googleMapsUrl)
  const isOpen = showCurrentStatus ? isCurrentlyOpen(openingHours) : undefined

  const handleDirectionsClick = () => {
    if (!isEditing) {
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePhoneClick = () => {
    if (!isEditing && phone) {
      window.location.href = `tel:${phone.replace(/\D/g, '')}`
    }
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto overflow-hidden', className)}>
      {/* Map Embed */}
      <div
        className="relative w-full bg-gray-200"
        style={{ height: `${mapHeight}px` }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={locationName || 'Location Map'}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MapPin className="w-12 h-12" />
            <p className="ml-2">Map not available</p>
          </div>
        )}

        {/* Current Status Badge */}
        {showCurrentStatus && isOpen !== undefined && (
          <div className="absolute top-4 right-4">
            <div className={cn(
              'px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm',
              isOpen
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            )}>
              {isOpen ? '🟢 Buka Sekarang' : '🔴 Tutup'}
            </div>
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="p-6 space-y-4">
        {/* Location Name */}
        {locationName && (
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {locationName}
          </h3>
        )}

        {/* Address */}
        <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
          <p className="text-sm">{address}</p>
        </div>

        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 flex-shrink-0 text-blue-500" />
            <button
              onClick={handlePhoneClick}
              disabled={isEditing}
              className={cn(
                'text-sm text-blue-600 dark:text-blue-400 hover:underline',
                isEditing && 'pointer-events-none'
              )}
            >
              {phone}
            </button>
          </div>
        )}

        {/* Opening Hours */}
        {openingHours && openingHours.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Clock className="w-5 h-5 flex-shrink-0 text-green-500" />
              <span className="text-sm font-semibold">Jam Buka</span>
            </div>
            <div className="ml-8 space-y-1">
              {openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{schedule.day}</span>
                  <span className={cn(
                    'font-medium',
                    schedule.hours.toLowerCase().includes('tutup')
                      ? 'text-red-500'
                      : 'text-gray-900 dark:text-gray-100'
                  )}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directions Button */}
        {showDirectionsButton && (
          <Button
            onClick={handleDirectionsClick}
            disabled={isEditing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Dapatkan Petunjuk Arah
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  )
}
