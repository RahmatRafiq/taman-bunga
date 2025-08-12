import React from 'react'

export function Footer() {
  return (
    <footer className="w-full border-t bg-gradient-to-r from-white via-indigo-50 to-white dark:from-[#18181b] dark:via-indigo-900 dark:to-[#18181b] py-8 mt-24 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-base text-gray-600 dark:text-gray-400">
        <span>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-bold text-indigo-700 dark:text-indigo-300">
            VirtualTour
          </span>
          . All rights reserved.
        </span>
        <span>
          Made with{' '}
          <span className="text-pink-500 animate-pulse">♥</span> by Your Team
        </span>
      </div>
    </footer>
  )
}