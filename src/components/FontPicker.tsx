/**
 * Font Picker Component
 * Font selection with popular web fonts and Google Fonts
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Type } from "lucide-react"

interface FontPickerProps {
  value?: string
  onChange: (font: string | undefined) => void
  label?: string
}

const POPULAR_FONTS = [
  { 
    name: 'Default',
    value: undefined,
    family: 'system-ui, -apple-system, sans-serif',
    category: 'System'
  },
  { 
    name: 'Inter',
    value: 'Inter',
    family: '"Inter", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Poppins',
    value: 'Poppins',
    family: '"Poppins", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Roboto',
    value: 'Roboto',
    family: '"Roboto", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Montserrat',
    value: 'Montserrat',
    family: '"Montserrat", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Open Sans',
    value: 'Open Sans',
    family: '"Open Sans", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Lato',
    value: 'Lato',
    family: '"Lato", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Nunito',
    value: 'Nunito',
    family: '"Nunito", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Source Sans Pro',
    value: 'Source Sans Pro',
    family: '"Source Sans Pro", sans-serif',
    category: 'Sans Serif'
  },
  { 
    name: 'Playfair Display',
    value: 'Playfair Display',
    family: '"Playfair Display", serif',
    category: 'Serif'
  },
  { 
    name: 'Merriweather',
    value: 'Merriweather',
    family: '"Merriweather", serif',
    category: 'Serif'
  },
  { 
    name: 'JetBrains Mono',
    value: 'JetBrains Mono',
    family: '"JetBrains Mono", monospace',
    category: 'Monospace'
  },
  { 
    name: 'Cursive',
    value: 'Cursive',
    family: 'cursive',
    category: 'Cursive'
  }
]

export default function FontPicker({ 
  value, 
  onChange, 
  label = 'Font Family' 
}: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const selectedFont = POPULAR_FONTS.find(font => font.value === value) || POPULAR_FONTS[0]
  
  // Filter fonts based on search query
  const filteredFonts = POPULAR_FONTS.filter(font =>
    font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    font.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFontSelect = (font: typeof POPULAR_FONTS[0]) => {
    onChange(font.value)
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <div>
      <label className="text-xs text-gray-400 block mb-2">{label}</label>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
            style={{ fontFamily: selectedFont.family }}
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span>{selectedFont.name}</span>
              <span className="text-xs text-gray-400">({selectedFont.category})</span>
            </div>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Choose Font Family</DialogTitle>
          </DialogHeader>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          {/* Font List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredFonts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No fonts found</p>
              </div>
            ) : (
              filteredFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleFontSelect(font)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left hover:scale-[1.02] ${
                    (value === font.value) || (!value && !font.value)
                      ? 'border-[#66A38A] bg-[#66A38A]/10' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm mb-1">
                        {font.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {font.category}
                      </div>
                    </div>
                    <div className="text-white text-lg" style={{ fontFamily: font.family }}>
                      Aa
                    </div>
                  </div>
                  <div className="mt-2 text-gray-300 text-sm" style={{ fontFamily: font.family }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}