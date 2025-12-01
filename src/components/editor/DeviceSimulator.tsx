"use client"

import { Smartphone } from 'lucide-react'
import { DynamicTemplateRenderer } from '@/components/DynamicTemplateRenderer'

interface DeviceSimulatorProps {
  siteData: any
  className?: string
}

export function DeviceSimulator({ siteData, className = '' }: DeviceSimulatorProps) {

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-foreground dark:text-white font-semibold text-sm">Live Preview</h3>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
          <Smartphone className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">iPhone 14 Pro</span>
          <div className="ml-auto text-xs text-muted-foreground">393×852</div>
        </div>
      </div>

      {/* Mobile Frame */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-card to-secondary/20 overflow-hidden">
        <div className="relative scale-75">
          {/* Phone Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-50 rounded-[3rem]" />

          {/* Phone Body */}
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2.5rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="bg-white dark:bg-gray-950 rounded-[2rem] w-[393px] h-[852px] overflow-hidden relative border-4 border-gray-800 dark:border-gray-950">
              {/* Status Bar with Dynamic Island */}
              <div className="h-14 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative z-10">
                <div className="w-36 h-7 bg-black rounded-full absolute top-3 shadow-inner" />
                <div className="absolute top-3.5 left-6 text-white text-xs font-semibold">9:41</div>
                <div className="absolute top-3.5 right-6 flex items-center gap-1.5">
                  <div className="flex gap-0.5 items-end">
                    <div className="w-1 h-2 bg-white rounded-full" />
                    <div className="w-1 h-3 bg-white rounded-full" />
                    <div className="w-1 h-4 bg-white rounded-full" />
                  </div>
                  <svg className="w-4 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-14C6.48 4 2 8.48 2 14h2c0-4.42 3.58-8 8-8s8 3.58 8 8h2c0-5.52-4.48-10-10-10zm0 4c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6z"/>
                  </svg>
                  <div className="w-6 h-3 border-2 border-white rounded-sm relative">
                    <div className="absolute right-[-2px] top-[2px] w-1 h-2 bg-white rounded-r-sm" />
                    <div className="w-4 h-1.5 bg-white rounded-sm m-0.5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="h-[794px] overflow-y-auto scrollbar-thin">
                <DynamicTemplateRenderer
                  siteData={siteData}
                  isPreview={true}
                  className="min-h-full"
                />
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-border/50 bg-card/50 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Auto-updating</span>
          </div>
          <span>iPhone 14 Pro • 393×852</span>
        </div>
      </div>
    </div>
  )
}
