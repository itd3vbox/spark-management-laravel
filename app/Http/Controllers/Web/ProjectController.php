<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Project as ProjectEntity;
use App\Services\Web\Search\ProjectSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    protected $projectSearchService;

    public function __construct(ProjectSearchService $projectSearchService)
    {
        $this->projectSearchService = $projectSearchService;
    }

    /**
     * Affiche la vue principale des projets
     */
    public function index()
    {
        return view('web.projects.main', [
            'data' => [
                'menuItem' => 'i-projects',
            ]
        ]);
    }

    /**
     * Recherche / liste les projets
     */
    public function search(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'max' => 'nullable|integer|min:1|max:100',
            'project_id' => 'nullable|integer|exists:projects,id',
            'keywords' => 'nullable|string',
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => null,
        ], $validated);

        $projects = $this->projectSearchService->searchAll($options);

        return response()->json([
            'message' => 'Projects retrieved successfully',
            'data' => $projects,
        ], 200);
    }

    /**
     * Affiche un projet spécifique
     */
    public function show(string $id)
    {
        $project = ProjectEntity::find($id);

        return response()->json([
            'data' => $project
        ], 200);
    }

    /**
     * Crée un nouveau projet (seulement ADMIN)
     */
    public function store(Request $request)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description_short' => 'required|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'website' => 'nullable|string',
            'keywords' => 'nullable|json',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $project = new ProjectEntity();
        $project->name = $validatedData['name'];
        $project->description_short = $validatedData['description_short'];
        $project->description = $validatedData['description'] ?? null;
        $project->status = $validatedData['status'] ?? 0;
        $project->website = $validatedData['website'] ?? null;
        $project->keywords = $validatedData['keywords'] ?? null;
        $project->links = $validatedData['links'] ?? null;
        $project->save();

        // Création des dossiers
        $project->folder = $project->id . 'project-' . now()->format('YmdHis');
        Storage::disk('private')->makeDirectory($project->folder);
        Storage::disk('public')->makeDirectory($project->folder);

        // Gestion de l'image
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imageFile->storeAs($project->folder, $imageFileName, 'public');
            $project->image = $imageFileName;
        } else {
            $project->image = null;
        }

        $project->save();

        return response()->json([
            'message' => 'Project created successfully.',
            'data' => $project
        ], 201);
    }

    /**
     * Met à jour un projet (seulement ADMIN)
     */
    public function update(Request $request, string $id)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'description_short' => 'nullable|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'website' => 'nullable|string',
            'keywords' => 'nullable|json',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $project = ProjectEntity::findOrFail($id);

        $project->name = $validatedData['name'] ?? $project->name;
        $project->description_short = $validatedData['description_short'] ?? $project->description_short;
        $project->description = $validatedData['description'] ?? $project->description;
        $project->status = $validatedData['status'] ?? $project->status;
        $project->website = $validatedData['website'] ?? $project->website;
        $project->keywords = $validatedData['keywords'] ?? $project->keywords;
        $project->links = $validatedData['links'] ?? $project->links;

        // Supprime ancienne image si existante
        if ($project->image) {
            Storage::disk('public')->delete($project->folder . '/' . $project->image);
        }

        // Ajoute nouvelle image
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imageFile->storeAs($project->folder, $imageFileName, 'public');
            $project->image = $imageFileName;
        }

        $project->save();

        return response()->json([
            'message' => 'Project updated successfully.',
            'data' => $project
        ], 200);
    }

    /**
     * Supprime un projet (seulement ADMIN)
     */
    public function destroy(string $id)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $project = ProjectEntity::findOrFail($id);

        // Supprime image
        if ($project->image) {
            Storage::disk('public')->delete($project->folder . '/' . $project->image);
        }

        // Supprime dossiers
        if ($project->folder) {
            Storage::disk('public')->deleteDirectory($project->folder);
            Storage::disk('private')->deleteDirectory($project->folder);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.'
        ], 200);
    }

    /**
     * Vérifie si l'utilisateur connecté est ADMIN
     */
    private function authorizeAdmin(): ?JsonResponse
    {
        $currentUser = auth()->user();

        if (!$currentUser || !in_array('ADMIN', json_decode($currentUser->roles ?? '[]', true))) {
            return response()->json([
                'message' => 'Not authorized'
            ], 403);
        }

        return null; // Autorisé
    }
}
