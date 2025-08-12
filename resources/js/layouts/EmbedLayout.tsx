import React from 'react'
import { Head } from '@inertiajs/react'

interface EmbedLayoutProps {
    children: React.ReactNode
    title?: string
}

export default function EmbedLayout({ children, title = 'Virtual Tour' }: EmbedLayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <style>{`
                    body { 
                        margin: 0; 
                        padding: 0; 
                        overflow: hidden; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        position: fixed;
                        width: 100%;
                        height: 100%;
                        touch-action: manipulation;
                        -webkit-overflow-scrolling: touch;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                    html, body, #app { 
                        height: 100%; 
                        width: 100%; 
                        overflow: hidden;
                        position: relative;
                    }
                    * { 
                        box-sizing: border-box; 
                    }
                    
                    /* Prevent zoom on input focus for iOS */
                    input, select, textarea {
                        font-size: 16px !important;
                    }
                    
                    /* Responsive adjustments for small screens */
                    @media (max-width: 640px) {
                        body {
                            font-size: 14px;
                        }
                    }
                    
                    /* Prevent text selection and context menu */
                    * {
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                `}</style>
            </Head>
            <div id="embed-container" className="w-full h-screen relative overflow-hidden">
                {children}
            </div>
        </>
    )
}
