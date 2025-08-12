import React from 'react'
import * as HoverCard from '@radix-ui/react-hover-card'
import type { SpherePreview } from '@/types/Home'
import { Link } from '@inertiajs/react'

interface Props {
  sphere: SpherePreview
}

export function TourCard({ sphere }: Props) {
  const tourLink = sphere.virtualTourId ? `/tours/${sphere.virtualTourId}` : '#';
  return (
    <HoverCard.Root openDelay={200}>
      <HoverCard.Trigger asChild>
        <Link
          href={tourLink}
          className="relative block bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:scale-[1.03] transition-transform"
          aria-disabled={!sphere.virtualTourId}
          tabIndex={sphere.virtualTourId ? 0 : -1}
        >
          <div className="relative h-52">
            <img
              src={sphere.image ?? `https://picsum.photos/seed/sphere-${sphere.id}/400/300`}
              alt={sphere.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent"></div>
            {sphere.virtualTourName && (
              <span className="absolute bottom-4 left-4 bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 text-xs font-semibold px-4 py-1 rounded-full shadow">
                {sphere.virtualTourName}
              </span>
            )}
            {!sphere.virtualTourId && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">No Tour</span>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{sphere.name}</h3>
            {sphere.category && (
              <p className="mt-2 text-sm text-indigo-500 dark:text-indigo-300 font-medium">{sphere.category}</p>
            )}
          </div>
        </Link>
      </HoverCard.Trigger>

      <HoverCard.Content
        side="top"
        align="center"
        className="z-20 w-64 rounded-lg bg-white p-4 shadow-lg animate-in fade-in-80"
      >
        <p className="text-sm text-gray-700 line-clamp-4">{sphere.description}</p>
        <HoverCard.Arrow className="fill-current text-white" />
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
