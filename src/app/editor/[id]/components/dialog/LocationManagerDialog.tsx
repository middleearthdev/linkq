/**
 * Location Manager Dialog
 * Mobile-friendly dialog for managing location block settings
 */

import { useState, useEffect } from "react"
import { Copy, MapPin, Phone, Clock, Plus, Trash2, Map } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Block {
  id: string
  type: string
  props: any
}

interface LocationManagerDialogProps {
  block: Block
  onUpdateBlock: (blockId: string, newProps: any) => void
  onClose: () => void
}

const DAYS_OF_WEEK = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu'
]

const MAP_HEIGHT_OPTIONS = [
  { value: 200, label: 'Kecil' },
  { value: 300, label: 'Sedang' },
  { value: 400, label: 'Besar' }
]

export default function LocationManagerDialog({
  block,
  onUpdateBlock,
  onClose
}: LocationManagerDialogProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'hours' | 'settings'>('basic')

  const googleMapsUrl = block.props.googleMapsUrl || ''
  const address = block.props.address || ''
  const phone = block.props.phone || ''
  const locationName = block.props.locationName || ''
  const openingHours = block.props.openingHours || []
  const showDirectionsButton = block.props.showDirectionsButton ?? true
  const mapHeight = block.props.mapHeight || 300
  const showCurrentStatus = block.props.showCurrentStatus ?? true

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (field: string, value: any) => {
    onUpdateBlock(block.id, {
      ...block.props,
      [field]: value
    })
  }

  const addOpeningHour = () => {
    const newHour = {
      day: DAYS_OF_WEEK[0],
      hours: '09:00 - 17:00',
      isOpen: true
    }
    updateField('openingHours', [...openingHours, newHour])
  }

  const updateOpeningHour = (index: number, field: string, value: any) => {
    const updated = [...openingHours]
    updated[index] = { ...updated[index], [field]: value }
    updateField('openingHours', updated)
  }

  const deleteOpeningHour = (index: number) => {
    updateField('openingHours', openingHours.filter((_: any, i: number) => i !== index))
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-background border-t sm:border sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="font-bold text-lg">Location Manager</h2>
              <p className="text-xs text-muted-foreground">
                Manage location details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4 rotate-45" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'basic'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'hours'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              Hours ({openingHours.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'basic' && (
            <div className="p-4 space-y-4">
              {/* Location Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location Name
                </label>
                <Input
                  value={locationName}
                  onChange={(e) => updateField('locationName', e.target.value)}
                  placeholder="e.g., Kopi Kenangan Sudirman"
                  className="h-10"
                />
              </div>

              {/* Google Maps URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Map className="inline h-4 w-4 mr-1" />
                  Google Maps URL
                </label>
                <Input
                  value={googleMapsUrl}
                  onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the share link from Google Maps
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Jl. Jend. Sudirman No. 123, Jakarta Selatan"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number (Optional)
                </label>
                <Input
                  value={phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="h-10"
                />
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="p-4 space-y-3">
              {/* Add Hour Button */}
              <button
                onClick={addOpeningHour}
                className="w-full border-2 border-dashed hover:border-primary rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Opening Hour
              </button>

              {/* Hours List */}
              {openingHours.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No hours added</p>
                  <p className="text-xs text-muted-foreground">Click "Add Opening Hour" to start</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openingHours.map((hour: any, index: number) => (
                    <div key={index} className="p-3 rounded-lg border-2 border-border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          {/* Day Selector */}
                          <select
                            value={hour.day}
                            onChange={(e) => updateOpeningHour(index, 'day', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {DAYS_OF_WEEK.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>

                          {/* Hours Input */}
                          <Input
                            value={hour.hours}
                            onChange={(e) => updateOpeningHour(index, 'hours', e.target.value)}
                            placeholder="09:00 - 17:00"
                            className="h-9 text-sm"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteOpeningHour(index)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-6">
              {/* Map Height */}
              <div>
                <label className="block text-sm font-semibold mb-2">Map Height</label>
                <div className="grid grid-cols-3 gap-2">
                  {MAP_HEIGHT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateField('mapHeight', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        mapHeight === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.value}px</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Show Directions Button */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
                  <div>
                    <p className="font-semibold text-sm">Show Directions Button</p>
                    <p className="text-xs text-muted-foreground">Display "Get Directions" button</p>
                  </div>
                  <button
                    onClick={() => updateField('showDirectionsButton', !showDirectionsButton)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showDirectionsButton ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        showDirectionsButton ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Current Status */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border">
                  <div>
                    <p className="font-semibold text-sm">Show Current Status</p>
                    <p className="text-xs text-muted-foreground">Display "Open Now" badge</p>
                  </div>
                  <button
                    onClick={() => updateField('showCurrentStatus', !showCurrentStatus)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showCurrentStatus ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        showCurrentStatus ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
