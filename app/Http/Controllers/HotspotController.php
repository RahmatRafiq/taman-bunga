<?php
namespace App\Http\Controllers;

use App\Helpers\DataTable;
use App\Models\Hotspot;
use App\Models\Sphere;
use App\Models\VirtualTour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotspotController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'active');
        $userId = $request->user()->id;

        // Ambil virtual tour milik user login sekali saja
        $userVirtualTours = VirtualTour::ownedBy($userId)->with('spheres:id,virtual_tour_id,name')->get(['id', 'name']);
        $userSphereIds = $userVirtualTours->pluck('spheres')->flatten()->pluck('id')->toArray();

        $hotspots = match ($filter) {
            'trashed' => Hotspot::onlyTrashed()->with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds)->get(),
            'all' => Hotspot::withTrashed()->with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds)->get(),
            default => Hotspot::with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds)->get(),
        };

        return Inertia::render('Hotspot/Index', [
            'hotspots'     => $hotspots,
            'filter'       => $filter,
            'virtualTours' => $userVirtualTours,
        ]);
    }

    public function json(Request $request)
    {
        $search        = $request->input('search.value', '');
        $filter        = $request->input('filter', 'active');
        $virtualTourId = $request->input('virtual_tour_id');
        $userId        = $request->user()->id;

        // Ambil sphere milik user login sekali saja
        $userSphereIds = VirtualTour::ownedBy($userId)
            ->with('spheres:id,virtual_tour_id')
            ->get()
            ->pluck('spheres')
            ->flatten()
            ->pluck('id')
            ->toArray();

        $query = match ($filter) {
            'trashed' => Hotspot::onlyTrashed()->with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds),
            'all' => Hotspot::withTrashed()->with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds),
            default => Hotspot::with(['sphere', 'targetSphere'])->whereIn('sphere_id', $userSphereIds),
        };

        if ($virtualTourId) {
            $query->whereHas('sphere', function ($q) use ($virtualTourId) {
                $q->where('virtual_tour_id', $virtualTourId);
            });
        }

        if ($search) {
            $query->where(fn($q) =>
                $q->where('type', 'like', "%{$search}%")
                    ->orWhere('tooltip', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
            );
        }
        $columns = ['id', 'type', 'tooltip', 'yaw', 'pitch', 'created_at'];
        if ($request->filled('order')) {
            $col = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($col, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request);

        $data['data'] = collect($data['data'])->map(fn($hotspot) => [
            'id'           => $hotspot->id,
            'type'         => $hotspot->type,
            'tooltip'      => $hotspot->tooltip,
            'yaw'          => $hotspot->yaw,
            'pitch'        => $hotspot->pitch,
            'sphere'       => $hotspot->sphere?->name,
            'targetSphere' => $hotspot->targetSphere?->name,
            'trashed'      => $hotspot->trashed(),
            'actions'      => '',
        ]);

        return response()->json($data);
    }

    public function create()
    {
        $userId = request()->user()->id;
        $userVirtualTours = VirtualTour::ownedBy($userId)->with(['spheres.media'])->get();
        $userSpheres = $userVirtualTours->pluck('spheres')->flatten();

        return Inertia::render('Hotspot/Form', [
            'hotspot'      => null,
            'spheres'      => $userSpheres->map(function ($sphere) {
                return [
                    'id'              => $sphere->id,
                    'name'            => $sphere->name,
                    'virtual_tour_id' => $sphere->virtual_tour_id,
                    'sphere_file'     => $sphere->getFirstMediaUrl('sphere_file'),
                ];
            }),
            'virtualTours' => $userVirtualTours->map(function ($vt) {
                return [
                    'id'   => $vt->id,
                    'name' => $vt->name,
                ];
            }),
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sphere_id'        => 'required|exists:spheres,id',
            'type'             => 'required|string|max:50',
            'target_sphere_id' => 'nullable|exists:spheres,id',
            'yaw'              => 'nullable|numeric',
            'pitch'            => 'nullable|numeric',
            'tooltip'          => 'nullable|string|max:255',
            'content'          => 'nullable|string',
        ]);

        try {
            Hotspot::create($validated);
            return redirect()->route('hotspot.index')->with('success', 'Hotspot berhasil dibuat.');
        } catch (\Throwable $e) {
            \Log::error('Store Hotspot error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal membuat hotspot.']);
        }
    }

    public function edit($id)
    {
        $hotspot      = Hotspot::withTrashed()->with('sphere')->findOrFail($id);

        $userId = request()->user()->id;
        $userVirtualTours = VirtualTour::ownedBy($userId)->with(['spheres.media'])->get();
        $userSpheres = $userVirtualTours->pluck('spheres')->flatten();

        return Inertia::render('Hotspot/Form', [
            'hotspot'      => $hotspot,
            'spheres'      => $userSpheres->map(function ($sphere) {
                return [
                    'id'              => $sphere->id,
                    'name'            => $sphere->name,
                    'virtual_tour_id' => $sphere->virtual_tour_id,
                    'sphere_file'     => $sphere->getFirstMediaUrl('sphere_file'),
                ];
            }),
            'virtualTours' => $userVirtualTours->map(function ($vt) {
                return [
                    'id'   => $vt->id,
                    'name' => $vt->name,
                ];
            }),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'sphere_id'        => 'required|exists:spheres,id',
            'type'             => 'required|string|max:50',
            'target_sphere_id' => 'nullable|exists:spheres,id',
            'yaw'              => 'nullable|numeric',
            'pitch'            => 'nullable|numeric',
            'tooltip'          => 'nullable|string|max:255',
            'content'          => 'nullable|string',
        ]);

        try {
            $hotspot = Hotspot::withTrashed()->findOrFail($id);
            $hotspot->update($validated);

            return redirect()->route('hotspot.index')->with('success', 'Hotspot berhasil diperbarui.');
        } catch (\Throwable $e) {
            \Log::error('Update Hotspot error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal memperbarui hotspot.']);
        }
    }

    public function destroy($id)
    {
        Hotspot::findOrFail($id)->delete();
        return redirect()->route('hotspot.index')->with('success', 'Hotspot dihapus.');
    }

    public function trashed()
    {
        $hotspots = Hotspot::onlyTrashed()->with(['sphere', 'targetSphere'])->get();
        return Inertia::render('Hotspot/Trashed', compact('hotspots'));
    }

    public function restore($id)
    {
        Hotspot::onlyTrashed()->where('id', $id)->restore();
        return redirect()->route('hotspot.index')->with('success', 'Hotspot dipulihkan.');
    }

    public function forceDelete($id)
    {
        $hotspot = Hotspot::onlyTrashed()->findOrFail($id);
        $hotspot->forceDelete();

        return redirect()->route('hotspot.index')->with('success', 'Hotspot dihapus permanen.');
    }
}
