import React, { useEffect, useState } from 'react'

interface ResponsiveIframeProps {
    src: string
    title?: string
    className?: string
    allowFullScreen?: boolean
}

export default function ResponsiveIframe({ 
    src, 
    title = 'Virtual Tour',
    className = '',
    allowFullScreen = true
}: ResponsiveIframeProps) {
    const [dimensions, setDimensions] = useState({ width: '100%', height: '400px' })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Listen for messages from the iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'tour-resize') {
                const { width, height } = event.data
                // Maintain aspect ratio while being responsive
                const aspectRatio = width / height
                const containerWidth = window.innerWidth
                const calculatedHeight = Math.min(containerWidth / aspectRatio, window.innerHeight * 0.8)
                
                setDimensions({
                    width: '100%',
                    height: `${calculatedHeight}px`
                })
            }

            if (event.data?.type === 'tour-loaded') {
                setIsLoading(false)
            }
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    const handleLoad = () => {
        setIsLoading(false)
    }

    return (
        <div className={`relative w-full ${className}`}>
            {isLoading && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
                    style={{ height: dimensions.height }}
                >
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading Virtual Tour...</p>
                    </div>
                </div>
            )}
            <iframe
                src={src}
                title={title}
                width="100%"
                height={dimensions.height}
                frameBorder="0"
                allowFullScreen={allowFullScreen}
                onLoad={handleLoad}
                className="w-full border-0"
                style={{
                    minHeight: '300px',
                    maxHeight: '80vh',
                    ...dimensions
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                loading="lazy"
            />
        </div>
    )
}
