import React, { useRef,  } from 'react';
import { Head, Link } from '@inertiajs/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TourCard } from '../TourCard';
import type { SpherePreview } from '@/types/Home';

interface Category { id: number; name: string; }
interface Pagination { current_page: number; last_page: number; per_page: number; total: number; }
interface AllSpheresProps { spheres: SpherePreview[]; categories: Category[]; activeCategory?: string; pagination: Pagination; }

export default function AllSpheres({ spheres, categories, activeCategory, pagination }: AllSpheresProps) {
  const AutoSlider: React.FC<{ items: SpherePreview[]; reverse?: boolean; speed?: number }> = ({ items }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((sphere) => (
          <div key={sphere.id} className="inline-block flex-shrink-0 w-64 mx-2">
            <TourCard sphere={sphere} />
          </div>
        ))}
      </div>
    );
  };

  const rows = [0, 1, 2].map(i => spheres.filter((_, idx) => Math.floor(idx / 3) === i));

  return (
    <Tooltip.Provider>
      <Head title="Virtual Tours" />
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Virtual Tours</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore our collection of immersive virtual tours and experiences</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Link href="/tours" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>All Tours</Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/tours?category=${encodeURIComponent(cat.name)}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.name ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{cat.name}</Link>
            ))}
          </div>
          {spheres.length > 0 && (
            <div className="hidden md:grid grid-cols-3 gap-6 pb-4">
              {spheres.map(sphere => <TourCard key={sphere.id} sphere={sphere} />)}
            </div>
          )}
          {spheres.length > 0 && (
            <div className="md:hidden space-y-4 pb-4">
              {rows.map((row, idx) => (
                <AutoSlider key={idx} items={row} reverse={idx % 2 === 1} speed={0.5 + idx * 0.1} />
              ))}
            </div>
          )}
          {pagination.last_page > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {pagination.current_page > 1 && <Link href={`/spheres?page=${pagination.current_page - 1}${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''}`} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Previous</Link>}
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => (
                <Link key={i + 1} href={`/spheres?page=${i + 1}${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''}`} className={`px-3 py-2 rounded-md ${pagination.current_page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{i + 1}</Link>
              ))}
              {pagination.current_page < pagination.last_page && <Link href={`/spheres?page=${pagination.current_page + 1}${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''}`} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Next</Link>}
            </div>
          )}
          {spheres.length > 0 && <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">Showing {spheres.length} of {pagination.total} spheres</div>}
          {spheres.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">{activeCategory ? `No spheres found in "${activeCategory}" category` : 'No spheres available'}</div>
              {activeCategory && <Link href="/spheres" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">View All Spheres</Link>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </Tooltip.Provider>
  );
}