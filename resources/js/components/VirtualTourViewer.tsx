import React, { useRef, useEffect, useState } from 'react'
import { Viewer, PluginConstructor } from '@photo-sphere-viewer/core'
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import '../../css/embed-responsive.css'
import type { VirtualTour, Sphere, Hotspot, VirtualTourNode } from '@/types/SphereView'
import ReactDOMServer from 'react-dom/server'
import HotspotMarker from '@/components/VirtualTourHotspotMarker'

interface VirtualTourViewerProps {
  virtualTour: VirtualTour
  initialSphereId?: number
  onSphereChange?: (sphere: Sphere) => void
  onHotspotClick?: (hotspot: Hotspot) => void
  className?: string
  showNavigation?: boolean
}

export default function VirtualTourViewer({
  virtualTour,
  initialSphereId,
  onSphereChange,
  onHotspotClick,
  className = '',
  showNavigation = true
}: VirtualTourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [mounted, setMounted] = useState(false)
  const [currentSphere, setCurrentSphere] = useState<Sphere | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const getPanoramaUrl = (sphere: Sphere): string => {
    return sphere.media?.find(m => m.mime_type?.startsWith('image/'))?.original_url ||
      sphere.media?.[0]?.original_url ||
      sphere.sphere_file ||
      sphere.sphere_image ||
      ''
  }

  const createPlaceholderPanorama = (): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(0.5, '#98FB98')
      gradient.addColorStop(1, '#90EE90')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#333'
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Virtual Tour Preview', canvas.width / 2, canvas.height / 2)
      ctx.font = '24px Arial'
      ctx.fillText('Media not available', canvas.width / 2, canvas.height / 2 + 60)
    }
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!url || url.trim() === '') {
        resolve(false)
        return
      }
      try {
        new URL(url)
      } catch (e) {
        resolve(false)
        return
      }
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.crossOrigin = 'anonymous'
      img.src = url
    })
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const createHotspotMarker = (hotspot: Hotspot): string => {
    return ReactDOMServer.renderToString(<HotspotMarker hotspot={hotspot} />)
  }

  const createNodes = (): VirtualTourNode[] => {
    return virtualTour.spheres.map((sphere) => {
      let panoramaUrl = getPanoramaUrl(sphere)
      if (!panoramaUrl || panoramaUrl.trim() === '') {
        panoramaUrl = createPlaceholderPanorama()
      }
      const initialYawRad = sphere.initial_yaw ? toRad(sphere.initial_yaw) : 0
      const links = sphere.hotspots
        .filter(h => h.type === 'navigation' && h.target_sphere_id)
        .map(h => ({
          nodeId: h.target_sphere_id!.toString(),
          position: {
            yaw: toRad(h.yaw) + initialYawRad, // offset yaw dengan initial_yaw
            pitch: toRad(h.pitch)
          }
        }))
      const markers = sphere.hotspots.map(h => ({
        id: `marker-${h.id}`,
        position: {
          yaw: toRad(h.yaw) + initialYawRad, // offset yaw dengan initial_yaw
          pitch: toRad(h.pitch)
        },
        html: createHotspotMarker(h),
        tooltip: h.tooltip || undefined,
        data: { hotspot: h }
      }))
      return {
        id: sphere.id.toString(),
        panorama: panoramaUrl,
        name: sphere.name,
        caption: sphere.name,
        links,
        markers,
        sphereCorrection: sphere.initial_yaw !== undefined
          ? { pan: `${toRad(sphere.initial_yaw)}rad` }
          : undefined
      }
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !virtualTour.spheres.length) {
      return
    }
    setImageLoading(true)
    setImageError(false)
    const initTimer = setTimeout(() => {
      if (!containerRef.current) {
        setImageError(true)
        setImageLoading(false)
        return
      }
      const initialSphere = initialSphereId 
        ? virtualTour.spheres.find(s => s.id === initialSphereId)
        : virtualTour.spheres[0]
      if (!initialSphere) {
        setImageError(true)
        setImageLoading(false)
        return
      }
      setCurrentSphere(initialSphere)
      setImageLoading(true)
      setImageError(false)
      let panoramaUrl = getPanoramaUrl(initialSphere)
      let usesFallback = false
      if (!panoramaUrl || panoramaUrl.trim() === '') {
        panoramaUrl = createPlaceholderPanorama()
        usesFallback = true
      }
      const validationPromise = usesFallback 
        ? Promise.resolve(true) 
        : validateImageUrl(panoramaUrl)
      validationPromise.then((isValid) => {
        if (!isValid && !usesFallback) {
          panoramaUrl = createPlaceholderPanorama()
        }
        setImageLoading(false)
        try {
          const nodes = createNodes()
          const viewer = new Viewer({
            container: containerRef.current!,
            panorama: panoramaUrl,
            caption: initialSphere.name,
            plugins: [
              [MarkersPlugin as unknown as PluginConstructor, {}],
              [VirtualTourPlugin as unknown as PluginConstructor, {
                nodes: nodes,
                startNodeId: initialSphere.id.toString(),
                renderMode: '3d',
                transitionOptions: {
                  showLoader: true,
                  speed: '20rpm',
                  fadeAlpha: true,
                  rotation: true
                }
              }]
            ],
            mousemove: true,
            mousewheel: true,
            keyboard: true,
            fisheye: false,
            size: { width: '100%', height: '100%' },
            navbar: showNavigation ? ['zoom', 'move', 'fullscreen'] : false,
            defaultYaw: initialSphere.initial_yaw !== undefined ? toRad(initialSphere.initial_yaw) : 0
          })
          viewerRef.current = viewer
          const virtualTourPlugin = viewer.getPlugin(VirtualTourPlugin as unknown as PluginConstructor)
          const markersPlugin = viewer.getPlugin(MarkersPlugin as unknown as PluginConstructor)
          virtualTourPlugin.addEventListener('node-changed', ({ node }) => {
            const sphere = virtualTour.spheres.find(s => s.id.toString() === node.id)
            if (sphere) {
              setCurrentSphere(sphere)
              onSphereChange?.(sphere)
            }
          })
          markersPlugin.addEventListener('select-marker', ({ marker }) => {
            const markerData = marker.data as { hotspot: Hotspot } | undefined
            const hotspot = markerData?.hotspot
            if (hotspot) {
              if (hotspot.type === 'info') {
                onHotspotClick?.(hotspot)
                if (hotspot.content) {
                  alert(hotspot.content)
                }
              }
            }
          })
          viewer.addEventListener('panorama-loaded', () => {
            setImageError(false)
          })
          viewer.addEventListener('panorama-error', () => {
            setImageError(true)
          })
          const handleResize = () => {
            if (viewer) {
              try {
                viewer.resize({ width: '100%', height: '100%' })
              } catch (e) {}
            }
          }
          window.addEventListener('resize', handleResize)
          window.addEventListener('orientationchange', handleResize)
          const cleanup = () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
          }
          ;(viewer as any).cleanup = cleanup
        } catch (error) {
          setImageError(true)
        }
      }).catch(() => {
        setImageError(true)
        setImageLoading(false)
      })
    }, 100)
    return () => {
      clearTimeout(initTimer)
      if (viewerRef.current) {
        try {
          if ((viewerRef.current as any).cleanup) {
            ;(viewerRef.current as any).cleanup()
          }
          viewerRef.current.destroy()
        } catch (e) {}
        viewerRef.current = null
      }
    }
  }, [mounted, virtualTour.id, initialSphereId])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {imageLoading && (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading virtual tour...</p>
          </div>
        </div>
      )}
      {imageError && !imageLoading && (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center p-4 max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-2">
              Virtual Tour Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This virtual tour has media issues and cannot be displayed.
            </p>
          </div>
        </div>
      )}
      {!imageError && (
        <div
          ref={containerRef}
          className="w-full h-full bg-black virtual-tour-viewer-container"
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      )}
    </div>
  )
}
