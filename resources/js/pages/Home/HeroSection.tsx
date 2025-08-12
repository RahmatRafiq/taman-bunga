import React from 'react'
import VirtualTourViewerContainer from '@/components/VirtualTourViewerContainer'

const demoTour = {
    id: 1,
    name: 'Demo Living Room Tour',
    category: { id: 1, name: 'Demo Category' },
    description: 'A demo virtual tour of a living room.',
    user: {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
    },
    spheres: [
        {
            id: 1,
            name: 'Living Room',
            hotspots: [],
            media: [
                {
                    id: 1,
                    mime_type: 'image/jpeg',
                    original_url: '/shot-panoramic-composition-living-room.jpg',
                },
            ],
            initial_yaw: 0,
            sphere_file: '/shot-panoramic-composition-living-room.jpg',
            sphere_image: '/shot-panoramic-composition-living-room.jpg',
        },
    ],
}

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden ">
            {/* Tidak ada class tinggi di sini, hanya lebar */}
            <VirtualTourViewerContainer
                virtualTour={demoTour}
                height="responsive"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 text-center">
                    Welcome to Virtual Tour
                </h1>
                <p className="text-lg md:text-2xl text-blue-200 font-medium drop-shadow text-center">
                    Jelajahi ruang secara interaktif dan immersive!
                </p>
            </div>
        </section>
    )
}
