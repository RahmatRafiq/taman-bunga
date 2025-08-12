<?php
namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Sphere;
use App\Models\VirtualTour;
use Illuminate\Container\Attributes\Tag;
use Inertia\Inertia;
use Str;

class HomeController extends Controller
{
    public function index()
    {
        $hero = [
            'title' => 'Welcome to Our Platform',
            'subtitle' => 'Explore articles and immersive virtual tours',
            'cta' => [
                'label' => 'Get Started',
                'link' => '/#sections',
            ],
        ];

        $articles = Article::with(['category', 'media'])
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'excerpt' => Str::limit(strip_tags($a->content), 100),
                'category' => $a->category->name,
                'tags' => is_array($a->tags) ? $a->tags : (json_decode($a->tags, true) ?? []),
                'coverImage' => $a->getFirstMediaUrl('cover') ?: null,
            ]);

        $tours = VirtualTour::with([
            'category',
            'spheres' => fn($q) => $q->orderBy('id')->limit(1)->with('media'),
        ])
            ->withCount('spheres')
            ->latest('created_at')
            ->take(5)
            ->get();

        $virtualTours = $tours->map(fn($vt) => [
            'id' => $vt->id,
            'name' => $vt->name,
            'description' => Str::limit($vt->description, 120),
            'category' => $vt->category->name,
            'previewImage' => optional($vt->spheres->first())->getFirstMediaUrl('sphere_image') ?: null,
            'sphereCount' => $vt->spheres_count,
        ]);

        $spheres = Sphere::with(['virtualTour', 'media'])
            ->latest('created_at')
            ->take(12)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'description' => $s->description,
                'image' => $s->getFirstMediaUrl('sphere_file') ?: null,
                'category' => optional($s->category)->name,
                'virtualTourName' => optional($s->virtualTour)->name,
                'virtualTourId' => optional($s->virtualTour)->id,
            ]);
        return Inertia::render('Home', [
            'hero' => $hero,
            'articles' => $articles,
            'virtualTours' => $virtualTours,
            'spheres' => $spheres,
        ]);
    }

    public function showArticle(Article $article)
    {
        $article->load('category');

        return Inertia::render('Home/Articles/Show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'content' => $article->content,
                'category' => $article->category->name,
                'tags' => $article->tags,
                'media' => $article->getFirstMediaUrl('cover') ?: null, // GANTI 'default' JADI 'cover'
            ],
        ]);
    }

    public function showVirtualTour(VirtualTour $virtualTour)
    {
        $virtualTour->load([
            'category',
            'spheres.media',
            'spheres.hotspots.targetSphere',
            'spheres.hotspots.sphere',
        ]);

        return Inertia::render('Home/Tours/Show', [
            'tour' => $virtualTour->toArray(),
        ]);
    }

    public function allVirtualTours()
    {
        $category = request('category');

        $query = VirtualTour::with([
            'category',
            'spheres' => fn($q) => $q->orderBy('id')->limit(1)->with('media'),
        ])
            ->withCount('spheres');

        if ($category) {
            $query->whereHas('category', fn($q) => $q->where('name', $category));
        }

        $tours = $query->latest('created_at')->paginate(12);

        $categories = Category::where('type', 'virtual tour')->get(['id', 'name']);

        $virtualTours = $tours->map(fn($vt) => [
            'id' => $vt->id,
            'name' => $vt->name,
            'description' => Str::limit($vt->description, 120),
            'category' => $vt->category->name,
            'categoryName' => $vt->category->name,
            'previewImage' => optional($vt->spheres->first())->getFirstMediaUrl('sphere_image') ?: null,
            'sphereCount' => $vt->spheres_count,
        ]);

        // Ambil semua spheres untuk halaman All
        $spheres = Sphere::with(['virtualTour', 'media'])
            ->latest('created_at')
            ->paginate(12);

        $sphereList = $spheres->getCollection()->map(fn($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'description' => $s->description,
            'image' => $s->getFirstMediaUrl('sphere_file') ?: null,
            'category' => optional($s->category)->name,
            'virtualTourName' => optional($s->virtualTour)->name,
            'virtualTourId' => optional($s->virtualTour)->id,
        ])->values();

        return Inertia::render('Home/Tours/All', [
            'virtualTours' => $virtualTours,
            'spheres' => $sphereList,
            'categories' => $categories,
            'activeCategory' => $category,
            'pagination' => [
                'current_page' => $spheres->currentPage(),
                'last_page' => $spheres->lastPage(),
                'per_page' => $spheres->perPage(),
                'total' => $spheres->total(),
            ],
        ]);
    }
    public function allArticles()
    {
        $category = request('category');

        $query = Article::with(['category', 'media']);

        if ($category) {
            $query->whereHas('category', fn($q) => $q->where('name', $category));
        }

        $articles = $query->latest('created_at')->paginate(12);

        $categories = Category::where('type', 'article')->get(['id', 'name']);

        $articleList = $articles->map(fn($a) => [
            'id' => $a->id,
            'title' => $a->title,
            'slug' => $a->slug,
            'tags' => is_array($a->tags) ? $a->tags : (json_decode($a->tags, true) ?? []),
            'excerpt' => Str::limit(strip_tags($a->content), 100),
            'category' => $a->category->name,
            'coverImage' => $a->getFirstMediaUrl('cover') ?: null,
        ]);

        return Inertia::render('Home/Articles/All', [
            'articles' => $articleList,
            'categories' => $categories,
            'activeCategory' => $category,
            'pagination' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

}
