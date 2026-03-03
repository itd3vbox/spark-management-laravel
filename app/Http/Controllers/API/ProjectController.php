<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Project as ProjectEntity;
use App\Services\API\Search\ProjectSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    protected $projectSearchService;

    public function __construct(ProjectSearchService $projectSearchService)
    {
        $this->projectSearchService = $projectSearchService;
    }

    /**
     * Display a listing of the resource.
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = ProjectEntity::find($id);

        return response()->json([
            'data' => $project
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description_short' => 'required|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'website' => 'nullable|string',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $project = new ProjectEntity();
        $project->name = $validatedData['name'];
        $project->description_short = $validatedData['description_short'];
        if (isset($validatedData['description']))
            $project->description = $validatedData['description'];
        if (isset($validatedData['status']))
            $project->status = $validatedData['status'];
        if (isset($validatedData['website']))
            $project->website = $validatedData['website'];
        if (isset($validatedData['links']))
            $project->links = $validatedData['links'];
          
        $project->save();

        $project->folder = $project->id . 'project-' . now()->format('YmdHis');

        $folder = $project->folder;
        Storage::disk('private')->makeDirectory($folder);
        Storage::disk('public')->makeDirectory($folder);

        if ($request->hasFile('image')) 
        {
            $imageFile = $request->file('image');
            $imageFileName =  Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs($project->folder, $imageFileName, 'public');
            $project->image = $imageFileName;
        }
        else
            $project->image = null;

        $project->save();

        return response()->json([
            'message' => 'Project created successfully.',
            'data' => $project
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'description_short' => 'nullable|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'website' => 'nullable|string',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $project = ProjectEntity::findOrFail($id);

        // Mise à jour des champs si présents
        if (isset($validatedData['name'])) $project->name = $validatedData['name'];
        if (isset($validatedData['description_short'])) $project->description_short = $validatedData['description_short'];
        if (isset($validatedData['description'])) $project->description = $validatedData['description'];
        if (isset($validatedData['status'])) $project->status = $validatedData['status'];
        if (isset($validatedData['website'])) $project->website = $validatedData['website'];
        if (isset($validatedData['links'])) $project->links = $validatedData['links'];

        // Gestion de l'image uniquement si un nouveau fichier est fourni
        if ($request->hasFile('image')) {
            // Supprimer l'ancien fichier si existant
            if ($project->image) {
                Storage::disk('public')->delete($project->folder . '/' . $project->image);
            }

            $imageFile = $request->file('image');
            $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imageFile->storeAs($project->folder, $imageFileName, 'public');
            $project->image = $imageFileName;
        }

        // Sauvegarde finale
        $project->save();

        return response()->json([
            'message' => 'Project updated successfully.',
            'data' => $project
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = ProjectEntity::findOrFail($id);
        $project->delete();

        if ($project->image) 
        {
            Storage::disk('public')->delete($project->image);

            // $existingImagePath = public_path($project->image);

            // if (file_exists($existingImagePath)) {
            //     unlink($existingImagePath);
            // }
        }

        if ($project->folder)
        {
            Storage::disk('public')->deleteDirectory($project->folder);
            Storage::disk('private')->deleteDirectory($project->folder);
        }

        return response()->json([
            'message' => 'Project deleted successfully.'
        ], 200);
    }
}
