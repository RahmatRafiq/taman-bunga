import { useState, useEffect } from 'react'
import { usePage, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import VirtualTourLayout from '@/layouts/VirtualTours/Layout'
import VirtualTourViewerContainer from '@/components/VirtualTourViewerContainer'
import { BreadcrumbItem } from '@/types'
import type { VirtualTour, Sphere, Hotspot } from '@/types/SphereView'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Code2, 
  Link, 
  Copy, 
  Check, 
  ExternalLink,
  Monitor,
  Smartphone 
} from 'lucide-react'

export default function Show() {
  const { virtualTour } = usePage<{ virtualTour: VirtualTour }>().props
  const [currentSphere, setCurrentSphere] = useState<Sphere | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [embedWidth, setEmbedWidth] = useState('800')
  const [embedHeight, setEmbedHeight] = useState('600')
  const [embedType, setEmbedType] = useState<'iframe' | 'link'>('iframe')

  // Debug logging for dashboard view
  useEffect(() => {
    console.log('Dashboard Show.tsx - Virtual Tour data:', {
      tourId: virtualTour.id,
      tourName: virtualTour.name,
      spheresCount: virtualTour.spheres?.length || 0,
      spheres: virtualTour.spheres?.map(sphere => ({
        id: sphere.id,
        name: sphere.name,
        hotspotsCount: sphere.hotspots?.length || 0,
        hotspots: sphere.hotspots?.map(h => ({
          id: h.id,
          type: h.type,
          typeOf: typeof h.type,
          yaw: h.yaw,
          pitch: h.pitch
        }))
      }))
    })
  }, [virtualTour])

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Virtual Tours', href: '/virtual-tour' },
    { title: virtualTour.name, href: route('virtual-tour.show', virtualTour.id) },
  ]

  // Generate embed URL
  const embedUrl = `${window.location.origin}/embed/tour/${virtualTour.id}`
  
  // Generate iframe code with custom dimensions
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="${embedWidth}" 
  height="${embedHeight}" 
  frameborder="0" 
  allowfullscreen>
</iframe>`

  // Generate simple link code
  const linkCode = `<a href="${embedUrl}" target="_blank" rel="noopener noreferrer">
  View Virtual Tour: ${virtualTour.name}
</a>`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [virtualTour])

  useEffect(() => {
    if (mounted && virtualTour.spheres?.length > 0) {
      setCurrentSphere(virtualTour.spheres[0])
    }
  }, [mounted, virtualTour.spheres])

  const handleSphereChange = (sphere: Sphere) => {
    setCurrentSphere(sphere)
  }

  const handleHotspotClick = (hotspot: Hotspot) => {
    console.log('Hotspot clicked:', hotspot)
    // Add custom hotspot handling logic here
  }
  
  if (!mounted) return <div>Loading...</div>
  
  if (!virtualTour.spheres || virtualTour.spheres.length === 0) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={virtualTour.name} />
        <VirtualTourLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Spheres Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This virtual tour doesn't have any spheres yet.
              </p>
            </div>
          </div>
        </VirtualTourLayout>
      </AppLayout>
    )
  }
  
  if (!currentSphere) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={virtualTour.name} />
        <VirtualTourLayout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Sphere Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No sphere is currently selected or available.
              </p>
            </div>
          </div>
        </VirtualTourLayout>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={virtualTour.name} />
      <VirtualTourLayout>
        <div className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{virtualTour.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{virtualTour.description}</p>
            </div>
            <Button 
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              variant="outline"
              className="shrink-0"
            >
              {showEmbedCode ? 'Hide Embed Code' : 'Get Embed Code'}
            </Button>
          </div>

          {/* Embed Code Section */}
          {showEmbedCode && (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Embed this Virtual Tour</h3>
              
              <div className="space-y-6">
                {/* Embed Type Selector */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Embed Type:</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant={embedType === 'iframe' ? 'default' : 'outline'}
                      onClick={() => setEmbedType('iframe')}
                      className="flex items-center gap-2"
                    >
                      <Code2 size={16} />
                      Iframe Embed
                    </Button>
                    <Button
                      size="sm"
                      variant={embedType === 'link' ? 'default' : 'outline'}
                      onClick={() => setEmbedType('link')}
                      className="flex items-center gap-2"
                    >
                      <Link size={16} />
                      Simple Link
                    </Button>
                  </div>
                </div>

                {/* Iframe Options - Only show when iframe type is selected */}
                {embedType === 'iframe' && (
                  <>
                    {/* Iframe Dimensions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="embed-width" className="text-sm font-medium text-gray-700 dark:text-gray-300">Width (px):</Label>
                        <Input
                          id="embed-width"
                          type="text"
                          value={embedWidth}
                          onChange={(e) => setEmbedWidth(e.target.value)}
                          className="mt-1"
                          placeholder="800 or 100%"
                        />
                      </div>
                      <div>
                        <Label htmlFor="embed-height" className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (px):</Label>
                        <Input
                          id="embed-height"
                          type="text"
                          value={embedHeight}
                          onChange={(e) => setEmbedHeight(e.target.value)}
                          className="mt-1"
                          placeholder="600"
                        />
                      </div>
                    </div>

                    {/* Quick Size Presets */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Sizes:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEmbedWidth('800'); setEmbedHeight('600') }}
                          className="flex items-center gap-2"
                        >
                          <Monitor size={14} />
                          800×600
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEmbedWidth('1024'); setEmbedHeight('768') }}
                          className="flex items-center gap-2"
                        >
                          <Monitor size={14} />
                          1024×768
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEmbedWidth('1200'); setEmbedHeight('800') }}
                          className="flex items-center gap-2"
                        >
                          <Monitor size={14} />
                          1200×800
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEmbedWidth('100%'); setEmbedHeight('400') }}
                          className="flex items-center gap-2"
                        >
                          <Smartphone size={14} />
                          Responsive
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Direct URL */}
                <div>
                  <Label htmlFor="embed-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">Direct URL:</Label>
                  <div className="flex mt-2">
                    <Input
                      id="embed-url"
                      type="text"
                      value={embedUrl}
                      readOnly
                      className="flex-1 rounded-r-none bg-white dark:bg-gray-900"
                    />
                    <Button
                      onClick={() => copyToClipboard(embedUrl)}
                      className="rounded-l-none flex items-center gap-2"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Code Output */}
                <div>
                  <Label htmlFor="embed-code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {embedType === 'iframe' ? 'Iframe Code:' : 'Link Code:'}
                  </Label>
                  <div className="flex mt-2">
                    <textarea
                      id="embed-code"
                      value={embedType === 'iframe' ? iframeCode : linkCode}
                      readOnly
                      rows={embedType === 'iframe' ? 6 : 3}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-900 text-sm font-mono text-gray-900 dark:text-gray-100 resize-none"
                    />
                    <Button
                      onClick={() => copyToClipboard(embedType === 'iframe' ? iframeCode : linkCode)}
                      className="rounded-l-none self-start flex items-center gap-2"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {embedType === 'iframe' 
                      ? 'Copy this code and paste it into your website\'s HTML to embed the virtual tour.'
                      : 'Copy this link code to create a simple hyperlink to the virtual tour.'
                    }
                  </p>
                </div>

                {/* Preview Link */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview Embed:</Label>
                  <div className="mt-2">
                    <a
                      href={embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm"
                    >
                      <ExternalLink size={16} />
                      Open embed in new window
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <h2 className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xl text-gray-900 dark:text-gray-100">
              Virtual Tour: {virtualTour.name}
            </h2>
            <VirtualTourViewerContainer
              virtualTour={virtualTour}
              onSphereChange={handleSphereChange}
              onHotspotClick={handleHotspotClick}
              height="large"
              showNavigation={true}
            />
            
            {/* Current Sphere Info */}
            {currentSphere && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Current: {currentSphere.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentSphere.hotspots.length} hotspot{currentSphere.hotspots.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {virtualTour.spheres.length} sphere{virtualTour.spheres.length !== 1 ? 's' : ''} total
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </VirtualTourLayout>
    </AppLayout>
  )
}