import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Image, FileText, Users, Eye, Clock, CalendarDays, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        totalVirtualTours: number;
        totalSpheres: number;
        totalArticles: number;
        totalUsers: number;
    };
    recentTours: Array<{
        id: number;
        name: string;
        category: string;
        description: string;
        spheres_count: number;
        created_at: string;
        thumbnail: string | null;
    }>;
    recentArticles: Array<{
        id: number;
        title: string;
        category: string;
        excerpt: string;
        created_at: string;
        thumbnail: string | null;
    }>;
    categoryStats: Array<{
        id: number;
        name: string;
        virtual_tours_count: number;
        articles_count: number;
    }>;
}

export default function Dashboard({ stats, recentTours, recentArticles, categoryStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard | Virtual Tour" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-6">
                            <div className="space-y-1">
                                <CardDescription>Virtual Tours</CardDescription>
                                <CardTitle className="text-3xl font-bold">{stats.totalVirtualTours}</CardTitle>
                            </div>
                            <div className="rounded-full bg-primary/20 p-3">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-6">
                            <div className="space-y-1">
                                <CardDescription>Total Spheres</CardDescription>
                                <CardTitle className="text-3xl font-bold">{stats.totalSpheres}</CardTitle>
                            </div>
                            <div className="rounded-full bg-blue-500/20 p-3">
                                <Globe className="h-6 w-6 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-6">
                            <div className="space-y-1">
                                <CardDescription>Articles</CardDescription>
                                <CardTitle className="text-3xl font-bold">{stats.totalArticles}</CardTitle>
                            </div>
                            <div className="rounded-full bg-green-500/20 p-3">
                                <FileText className="h-6 w-6 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between p-6">
                            <div className="space-y-1">
                                <CardDescription>Users</CardDescription>
                                <CardTitle className="text-3xl font-bold">{stats.totalUsers}</CardTitle>
                            </div>
                            <div className="rounded-full bg-orange-500/20 p-3">
                                <Users className="h-6 w-6 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Recent Virtual Tours */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Virtual Tours</CardTitle>
                                <CardDescription>Latest virtual tours created in the system</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/virtual-tour">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTours && recentTours.length > 0 ? (
                                    recentTours.map((tour) => (
                                        <div key={tour.id} className="flex items-center gap-4 rounded-lg border p-3">
                                            <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                                                {tour.thumbnail ? (
                                                    <img 
                                                        src={tour.thumbnail} 
                                                        alt={tour.name} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Globe className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{tour.name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Tag className="h-3 w-3" />
                                                    <span>{tour.category}</span>
                                                    <span className="mx-1">•</span>
                                                    <Globe className="h-3 w-3" />
                                                    <span>{tour.spheres_count} spheres</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarDays className="mr-1 h-3 w-3" />
                                                {tour.created_at}
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/virtual-tour/${tour.id}`}>Edit</Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/tours/${tour.id}`}>
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex h-32 items-center justify-center rounded-lg border">
                                        <p className="text-gray-500">No virtual tours found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories Overview</CardTitle>
                            <CardDescription>Distribution of content across categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categoryStats && categoryStats.length > 0 ? (
                                    categoryStats.map((category) => (
                                        <div key={category.id} className="flex flex-col gap-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">{category.name}</span>
                                                <span className="text-sm text-gray-500">
                                                    {category.virtual_tours_count + category.articles_count} items
                                                </span>
                                            </div>
                                            <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
                                                {category.virtual_tours_count > 0 && (
                                                    <div 
                                                        className="bg-primary" 
                                                        style={{ 
                                                            width: `${(category.virtual_tours_count / (category.virtual_tours_count + category.articles_count)) * 100}%` 
                                                        }} 
                                                    />
                                                )}
                                                {category.articles_count > 0 && (
                                                    <div 
                                                        className="bg-green-500" 
                                                        style={{ 
                                                            width: `${(category.articles_count / (category.virtual_tours_count + category.articles_count)) * 100}%` 
                                                        }} 
                                                    />
                                                )}
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{category.virtual_tours_count} tours</span>
                                                <span>{category.articles_count} articles</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex h-32 items-center justify-center rounded-lg border">
                                        <p className="text-gray-500">No categories found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Articles */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Articles</CardTitle>
                            <CardDescription>Latest articles published on the platform</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/article">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {recentArticles && recentArticles.length > 0 ? (
                                recentArticles.map((article) => (
                                    <div key={article.id} className="overflow-hidden rounded-lg border">
                                        <div className="aspect-video overflow-hidden bg-gray-100">
                                            {article.thumbnail ? (
                                                <img 
                                                    src={article.thumbnail} 
                                                    alt={article.title} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <FileText className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Tag className="h-3 w-3" />
                                                <span>{article.category}</span>
                                                <span className="mx-1">•</span>
                                                <CalendarDays className="h-3 w-3" />
                                                <span>{article.created_at}</span>
                                            </div>
                                            <h4 className="mt-2 font-medium line-clamp-1">{article.title}</h4>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                                            <div className="mt-3 flex justify-end">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/article/${article.id}`}>Edit</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" className="ml-2" asChild>
                                                    <Link href={`/articles/${article.id}`}>
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 flex h-32 items-center justify-center rounded-lg border">
                                    <p className="text-gray-500">No articles found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
