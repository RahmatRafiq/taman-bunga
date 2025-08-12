import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import VirtualTourViewerContainer from '@/components/VirtualTourViewerContainer'
import type { VirtualTour, Sphere, Hotspot } from '@/types/SphereView'
import { Header } from '../Header'
import { Footer } from '../Footer'

interface TourShowProps {
  tour: VirtualTour
}

export default function Show({ tour }: TourShowProps) {
  const [currentSphere, setCurrentSphere] = useState<Sphere | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

 

  useEffect(() => {
    if (tour.spheres?.length > 0) {
      // Find first sphere with valid media or just use first sphere
      const validSphere = tour.spheres.find(
        s => (Array.isArray(s.media) && s.media.length > 0) || s.sphere_file || s.sphere_image
      ) || tour.spheres[0]
      setCurrentSphere(validSphere)
    }
  }, [tour.spheres])

  // Handle sphere change from virtual tour viewer
  const handleSphereChange = (sphere: Sphere) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSphere(sphere)
      setTimeout(() => setIsTransitioning(false), 300)
    }, 150)
  }

  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    console.log('Hotspot clicked:', hotspot)
    // You can add custom modal or info panel logic here
    if (hotspot.content) {
      alert(`${hotspot.tooltip || 'Information'}\n\n${hotspot.content}`)
    }
  }

  // Check if tour has valid media
  const hasValidMedia = tour.spheres.some(sphere => 
    Boolean(
      sphere.media?.find(m => m.mime_type?.startsWith('image/'))?.original_url ||
      sphere.media?.[0]?.original_url ||
      sphere.sphere_file ||
      sphere.sphere_image
    )
  )

  // Jika tidak ada sphere
  if (!tour.spheres || tour.spheres.length === 0) {
    return (
      <>
        <Header />
        <Head title={tour.name} />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-4">No spheres available</h1>
          <p className="text-gray-600 mb-4">This virtual tour doesn't have any spheres yet.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Head title={tour.name} />
      
      {/* Virtual Tour Viewer - Responsive Height, Not Fullscreen */}
      <div className="w-full bg-black relative min-h-[300px] md:min-h-[500px] mb-8">
        <VirtualTourViewerContainer
          virtualTour={tour}
          onSphereChange={handleSphereChange}
          onHotspotClick={handleHotspotClick}
          height="responsive"
          showOverlay={true}
          overlayInfo={{
            title: tour.name,
            subtitle: currentSphere ? `Current: ${currentSphere.name}` : undefined
          }}
          className={`transition-opacity duration-300 ${
            isTransitioning ? 'opacity-50' : 'opacity-100'
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Header Info */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {tour.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {tour.description}
          </p>
          
          <div className="flex justify-center items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-medium">{tour.category.name}</span>
          </div>
        </div>

        {/* Tour Stats */}
        <div className="flex gap-4 mb-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tour.spheres.length}
            </div>
            <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
              {tour.spheres.length === 1 ? 'Sphere' : 'Spheres'}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tour.spheres.reduce((acc, s) => acc + s.hotspots.length, 0)}
            </div>
            <div className="text-sm text-green-600/80 dark:text-green-400/80">
              Hotspots
            </div>
          </div>
        </div>

        {/* Current Sphere Information */}
        {currentSphere && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Current Location: {currentSphere.name}
            </h2>
            
            {/* Hotspots for current sphere */}
            {currentSphere.hotspots.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Interactive Points
                </h3>
                {currentSphere.hotspots.map((h: Hotspot) => (
                  <div key={h.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                        h.type === 'info' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {h.tooltip || `${h.type === 'info' ? 'Information' : 'Navigation'} Point`}
                        </h4>
                        {h.content && (
                          <p className="text-gray-500 dark:text-gray-500 text-sm mb-2">{h.content}</p>
                        )}
                        {h.target_sphere && (
                          <p className="text-blue-600 dark:text-blue-400 text-sm">
                            → Links to {h.target_sphere.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentSphere.hotspots.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">📍</div>
                <p>No interactive points available for this location.</p>
              </div>
            )}
          </div>
        )}

        {/* All Spheres List */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            All Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tour.spheres.map((s) => {
              const hasMediaForSphere = Boolean(
                s.media?.find(m => m.mime_type?.startsWith('image/'))?.original_url ||
                s.media?.[0]?.original_url ||
                s.sphere_file ||
                s.sphere_image
              )
              
              return (
                <button
                  key={s.id}
                  onClick={() => handleSphereChange(s)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    s.id === currentSphere?.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : hasMediaForSphere
                      ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 cursor-not-allowed'
                  }`}
                  disabled={!hasMediaForSphere || isTransitioning}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        s.id === currentSphere?.id
                          ? 'text-blue-900 dark:text-blue-100'
                          : hasMediaForSphere
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-red-800 dark:text-red-300'
                      }`}>
                        {s.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {s.hotspots.length} hotspot{s.hotspots.length !== 1 ? 's' : ''}
                        {!hasMediaForSphere && ' • No Media'}
                      </p>
                    </div>
                    {s.id === currentSphere?.id && (
                      <div className="text-blue-600 dark:text-blue-400">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
