import React, { useState, useEffect } from 'react'
import VirtualTourViewerContainer from '@/components/VirtualTourViewerContainer'
import EmbedLayout from '@/layouts/EmbedLayout'
import type { VirtualTour, Sphere, Hotspot } from '@/types/SphereView'

interface EmbedTourProps { 
    tour: VirtualTour 
}

export default function EmbedTour({ tour }: EmbedTourProps) {
    const [currentSphere, setCurrentSphere] = useState<Sphere | null>(null)
    const [mounted, setMounted] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    // Handle window resize for better responsiveness
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
            
            // Notify parent frame about size changes if embedded
            if (window.parent !== window) {
                try {
                    window.parent.postMessage({
                        type: 'tour-resize',
                        width: window.innerWidth,
                        height: window.innerHeight
                    }, '*')
                } catch (e) {
                    // Ignore cross-origin errors
                }
            }
        }

        handleResize() // Initial call
        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
        }
    }, [])

    useEffect(() => {
        setMounted(true)
        
        // Ensure body and html take full height for iframe embedding
        document.body.style.margin = '0'
        document.body.style.padding = '0'
        document.body.style.height = '100vh'
        document.body.style.width = '100vw'
        document.body.style.overflow = 'hidden'
        document.documentElement.style.height = '100vh'
        document.documentElement.style.width = '100vw'
        document.documentElement.style.margin = '0'
        document.documentElement.style.padding = '0'
        
        // Prevent zoom on mobile devices
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
        }
        
        return () => {
            // Cleanup on unmount
            document.body.style.margin = ''
            document.body.style.padding = ''
            document.body.style.height = ''
            document.body.style.width = ''
            document.body.style.overflow = ''
            document.documentElement.style.height = ''
            document.documentElement.style.width = ''
            document.documentElement.style.margin = ''
            document.documentElement.style.padding = ''
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            // Set first sphere as current
            if (tour.spheres?.length > 0) {
                setCurrentSphere(tour.spheres[0])
            }
            
            // Notify parent frame that tour is loaded
            if (window.parent !== window) {
                try {
                    window.parent.postMessage({
                        type: 'tour-loaded',
                        tourName: tour.name,
                        sphereCount: tour.spheres?.length || 0
                    }, '*')
                } catch (e) {
                    // Ignore cross-origin errors
                }
            }
        }
    }, [mounted, tour.name, tour.spheres?.length])

    // Handle sphere change from virtual tour viewer
    const handleSphereChange = (sphere: Sphere) => {
        setCurrentSphere(sphere)
        
        // Notify parent frame about sphere change
        if (window.parent !== window) {
            try {
                window.parent.postMessage({
                    type: 'sphere-changed',
                    sphereId: sphere.id,
                    sphereName: sphere.name
                }, '*')
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
    }

    // Handle hotspot click
    const handleHotspotClick = (hotspot: Hotspot) => {
        console.log('Hotspot clicked in embed:', hotspot)
        
        // Notify parent frame about hotspot interaction
        if (window.parent !== window) {
            try {
                window.parent.postMessage({
                    type: 'hotspot-clicked',
                    hotspotId: hotspot.id,
                    hotspotType: hotspot.type,
                    hotspotContent: hotspot.content
                }, '*')
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
    }
    
    if (!currentSphere) {
        return (
            <EmbedLayout title="Virtual Tour - Loading">
                <VirtualTourViewerContainer
                    virtualTour={tour}
                    onSphereChange={handleSphereChange}
                    onHotspotClick={handleHotspotClick}
                    height="full"
                    isLoading={true}
                />
            </EmbedLayout>
        )
    }

    return (
        <EmbedLayout title={`Virtual Tour: ${tour.name}`}>
            <div className="w-full h-full bg-black relative overflow-hidden">
                {/* Main Virtual Tour Viewer - full responsive container */}
                <VirtualTourViewerContainer
                    virtualTour={tour}
                    onSphereChange={handleSphereChange}
                    onHotspotClick={handleHotspotClick}
                    height="full"
                    showOverlay={true}
                    overlayInfo={{
                        title: tour.name,
                        subtitle: currentSphere.name
                    }}
                    showNavigation={false} // Hide built-in navigation for cleaner embed
                />

                {/* Optional: Custom sphere indicator for embed */}
                {tour.spheres && tour.spheres.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 md:bottom-4">
                        <div className="flex gap-1 md:gap-2 bg-black/50 px-2 py-1 md:px-3 md:py-2 rounded-full backdrop-blur-sm">
                            {tour.spheres.map((s, index) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleSphereChange(s)}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all touch-manipulation ${
                                        s.id === currentSphere.id 
                                            ? 'bg-white' 
                                            : 'bg-white/40 hover:bg-white/60 active:bg-white/80'
                                    }`}
                                    aria-label={`Go to ${s.name}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </EmbedLayout>
    )
}
