import React from 'react'
import VirtualTourViewer from '@/components/VirtualTourViewer'
import type { VirtualTour, Sphere, Hotspot } from '@/types/SphereView'

interface VirtualTourViewerContainerProps {
  virtualTour: VirtualTour | null
  initialSphereId?: number
  onSphereChange?: (sphere: Sphere) => void
  onHotspotClick?: (hotspot: Hotspot) => void
  height?: 'small' | 'medium' | 'large' | 'full' | 'responsive'
  className?: string
  showOverlay?: boolean
  overlayInfo?: {
    title?: string
    subtitle?: string
  }
  showNavigation?: boolean
  isLoading?: boolean
  error?: boolean
}

const heightClasses = {
  small: 'h-[300px] md:h-[400px]',
  medium: 'h-[420px] md:h-[500px]',
  large: 'h-[500px] md:h-[600px]',
  responsive: 'h-[280px] sm:h-[320px] md:h-[70vh] lg:h-[80vh]', // ubah mobile jadi 280px, tablet 320px, desktop tetap responsif
  full: 'h-full'
}

export default function VirtualTourViewerContainer({
  virtualTour,
  initialSphereId,
  onSphereChange,
  onHotspotClick,
  height = 'medium',
  className = '',
  showOverlay = false,
  overlayInfo,
  showNavigation = true,
  isLoading = false,
  error = false
}: VirtualTourViewerContainerProps) {
  const heightClass = heightClasses[height]

  if (isLoading) {
    return (
      <div className={`w-full ${heightClass} bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Loading virtual tour...</p>
        </div>
      </div>
    )
  }

  if (error || !virtualTour || !virtualTour.spheres?.length) {
    return (
      <div className={`w-full ${heightClass} bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center p-4 max-w-md">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🗺️</div>
          <h3 className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-2">
            {error ? 'Virtual Tour Unavailable' : 'No Virtual Tour Available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error 
              ? 'This virtual tour has media issues and cannot be displayed.'
              : virtualTour 
                ? 'This virtual tour doesn\'t have any spheres yet.'
                : 'No virtual tour data available.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${heightClass} bg-black relative ${className}`}>
      {showOverlay && overlayInfo && (
        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/10">
          {overlayInfo.title && (
            <h3 className="font-semibold">{overlayInfo.title}</h3>
          )}
          {overlayInfo.subtitle && (
            <p className="text-sm text-blue-200">{overlayInfo.subtitle}</p>
          )}
        </div>
      )}
      <VirtualTourViewer
        virtualTour={virtualTour}
        initialSphereId={initialSphereId}
        onSphereChange={onSphereChange}
        onHotspotClick={onHotspotClick}
        showNavigation={showNavigation}
      />
    </div>
  )
}
