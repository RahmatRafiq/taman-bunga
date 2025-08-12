import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import type { User } from '@/types/UserRolePermission'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { BookOpen, Camera } from 'lucide-react'

export function Header() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props
    const isActive = (path: string) => window.location.pathname.startsWith(path)
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-indigo-50/80 to-white/90 dark:from-[#18181b]/90 dark:via-indigo-900/80 dark:to-[#18181b]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-lg mb-2 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-extrabold text-2xl text-indigo-700 dark:text-indigo-300 hover:scale-105 transition-transform"
                >
                    <span className="tracking-tight drop-shadow-lg">VirtualTour</span>
                </Link>
                {/* Desktop Menu */}
                <div className="flex-1 hidden md:flex" />
                <div className="hidden md:flex items-center">
                    <div className="inline-flex rounded-xl bg-gradient-to-r from-indigo-600/80 to-indigo-400/80 dark:from-indigo-900/80 dark:to-indigo-700/80 p-1 shadow-inner border border-indigo-200 dark:border-indigo-800">
                        <Link
                            href="/articles"
                            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/articles')
                                    ? 'bg-white text-indigo-700 font-bold shadow'
                                    : 'text-white hover:bg-indigo-700/80'
                                }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Articles
                            </span>
                        </Link>
                        <Link
                            href="/tours"
                            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/tours')
                                    ? 'bg-white text-indigo-700 font-bold shadow'
                                    : 'text-white hover:bg-indigo-700/80'
                                }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Tours
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="flex-1 hidden md:flex" />
                <div className="hidden md:flex items-center gap-4">
                    <AppearanceToggleDropdown className="mx-2" />
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded border border-indigo-200 px-5 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded border border-transparent px-5 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-200 dark:hover:bg-indigo-900 transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded border border-indigo-200 px-5 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                {/* Hamburger for mobile */}
                <button
                    className="ml-auto md:hidden p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Open menu"
                >
                    <svg className="w-6 h-6 text-indigo-700 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden px-4 pb-4">
                    <div className="flex flex-col gap-2 mt-2 rounded-xl bg-gradient-to-r from-indigo-700/90 to-indigo-900/90 p-3 shadow-inner">
                        <Link
                            href="/articles"
                            className={`px-5 py-2 rounded-lg font-medium transition ${isActive('/articles')
                                    ? 'bg-indigo-500 text-white font-bold shadow'
                                    : 'text-gray-200 hover:bg-gray-700'
                                }`}
                            onClick={() => setMobileOpen(false)}
                        >
                            Articles
                        </Link>
                        <Link
                            href="/tours"
                            className={`px-5 py-2 rounded-lg font-medium transition ${isActive('/tours')
                                    ? 'bg-indigo-500 text-white font-bold shadow'
                                    : 'text-gray-200 hover:bg-gray-700'
                                }`}
                            onClick={() => setMobileOpen(false)}
                        >
                            Tours
                        </Link>
                        <div className="border-t border-gray-700 my-2" />
                        <AppearanceToggleDropdown className="mx-2" />
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded border border-[#19140035] px-5 py-1.5 text-sm font-medium text-[#EDEDEC] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b] transition"
                                onClick={() => setMobileOpen(false)}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded border border-transparent px-5 py-1.5 text-sm font-medium text-[#EDEDEC] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded border border-[#19140035] px-5 py-1.5 text-sm font-medium text-[#EDEDEC] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}