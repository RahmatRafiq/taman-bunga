<?php
namespace App\Http\Controllers;

use App\Models\VirtualTour;
use App\Models\Sphere;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Hitung jumlah untuk statistik utama
        $totalVirtualTours = VirtualTour::count();
        $totalSpheres = Sphere::count();
        $totalArticles = Article::count();
        $totalUsers = User::count();
        
        // Dapatkan 5 virtual tour terbaru
        $recentTours = VirtualTour::with('category')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($tour) {
                // Cek apakah ada sphere dengan gambar
                $featuredSphere = $tour->spheres()->first();
                $thumbnailUrl = null;
                
                if ($featuredSphere) {
                    $thumbnailUrl = $featuredSphere->getFirstMediaUrl('sphere_image');
                }
                
                return [
                    'id' => $tour->id,
                    'name' => $tour->name,
                    'category' => $tour->category ? $tour->category->name : 'Uncategorized',
                    'description' => $tour->description,
                    'spheres_count' => $tour->spheres()->count(),
                    'created_at' => $tour->created_at->format('d M Y'),
                    'thumbnail' => $thumbnailUrl,
                ];
            });
            
        // Dapatkan 5 artikel terbaru
        $recentArticles = Article::with('category')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'category' => $article->category ? $article->category->name : 'Uncategorized',
                    'excerpt' => \Str::limit(strip_tags($article->content), 100),
                    'created_at' => $article->created_at->format('d M Y'),
                    'thumbnail' => $article->getFirstMediaUrl('cover'),
                ];
            });
            
        // Statistik kategori
        $categoryStats = Category::withCount(['virtualTours', 'articles'])
            ->orderBy('virtual_tours_count', 'desc')
            ->take(5)
            ->get();
            
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalVirtualTours' => $totalVirtualTours,
                'totalSpheres' => $totalSpheres,
                'totalArticles' => $totalArticles,
                'totalUsers' => $totalUsers,
            ],
            'recentTours' => $recentTours,
            'recentArticles' => $recentArticles,
            'categoryStats' => $categoryStats,
        ]);
    }
}
