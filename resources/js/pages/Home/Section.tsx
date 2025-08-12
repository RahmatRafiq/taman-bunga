import { Link } from '@inertiajs/react'
import React from 'react'
import { BookOpen, Camera, Globe, Star } from 'lucide-react'

interface Props {
  title: string
  href?: string
}

function getSectionIcon(title: string) {
  if (title.toLowerCase().includes('article')) {
    return <BookOpen className="w-6 h-6 text-indigo-500" />
  }
  if (title.toLowerCase().includes('tour')) {
    // Camera icon + 360° text for virtual tour
    return (
      <span className="inline-flex items-center">
        <Camera className="w-6 h-6 text-indigo-500" />
        <span className="ml-1 text-xs font-bold text-blue-500">360°</span>
      </span>
    )
    // Or use <Globe className="w-6 h-6 text-indigo-500" /> for globe style
  }
  // Default: Star icon
  return <Star className="w-6 h-6 text-indigo-500" />
}

export function Section({ title, href }: Props) {
   return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-blue-400 rounded-full shadow"></div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight flex items-center gap-2">
          {getSectionIcon(title)}
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center px-5 py-2 text-base font-semibold text-white dark:text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400 hover:scale-105 hover:bg-indigo-700 dark:hover:bg-indigo-500 rounded-full shadow transition"
        >
          View all →
        </Link>
      )}
    </div>
  )
}