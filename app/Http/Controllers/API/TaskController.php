<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Task as TaskEntity;
use App\Models\User as UserEntity;
use App\Services\API\Search\TaskSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    protected $taskSearchService;

    public function __construct(TaskSearchService $taskSearchService)
    {
        $this->taskSearchService = $taskSearchService;
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
            'with_project' => 'nullable|boolean',
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
        ], $validated);

        $tasks = $this->taskSearchService->searchAll($options);

        return response()->json([
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = TaskEntity::find($id);

        return response()->json([
            'data' => $task
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'nullable|integer',
            'description_short' => 'required|string',
            'description' => 'nullable|json',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'project_id' => 'required|exists:projects,id',
            'username' => 'nullable|string',
        ]);

        $task = new TaskEntity();
        $task->title = $validatedData['title'];
        $task->description_short = $validatedData['description_short'];
        if (isset($validatedData['description']))
            $task->description = $validatedData['description'];
        if (isset($validatedData['status']))
            $task->status = $validatedData['status'];
        if (isset($validatedData['links']))
            $task->links = $validatedData['links'];
        $task->project_id = $validatedData['project_id'];
        
        $task->save();

        if (isset($validatedData['username'])) {
            $username = ltrim($validatedData['username'], '#');
            $user = UserEntity::where('username', $username)->first();
            if ($user) {
                $task->users()->attach($user->id);
            }
        }

        $folder = $task->project->folder;
        Storage::disk('private')->makeDirectory($folder);
        Storage::disk('public')->makeDirectory($folder);

        if ($request->hasFile('image')) 
        {
            $imageFile = $request->file('image');
            $imageFileName =  Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs($folder, $imageFileName, 'public');
            $task->image = $imageFileName;
        }
        else
            $task->image = null;

        $task->save();

        return response()->json([
            'message' => 'Task created successfully.',
            'data' => $task
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'title' => 'nullable|string|max:255',
            'description_short' => 'nullable|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'username' => 'required|string',
        ]);

        //dd($validatedData);

        $task = TaskEntity::findOrFail($id);

        if (isset($validatedData['title']))
            $task->title = $validatedData['title'];
    
        if (isset($validatedData['description_short']))
            $task->description_short = $validatedData['description_short'];
    
        if (isset($validatedData['description']))
            $task->description = $validatedData['description'];
    
        if (isset($validatedData['status']))
            $task->status = $validatedData['status'];
    
        if (isset($validatedData['links']))
            $task->links = $validatedData['links'];
    
        if ($task->image) 
        {
            Storage::disk('public')->delete($task->image);

            // $existingImagePath = public_path($project->image);

            // if (file_exists($existingImagePath)) {
            //     unlink($existingImagePath);
            // }
        }

        if (isset($validatedData['username'])) {
            $username = ltrim($validatedData['username'], '#');
            $user = UserEntity::where('username', $username)->first();
            if ($user) {
                $task->users()->sync([$user->id]);
            } else {
                $task->users()->detach();  // Supprime toute association si utilisateur introuvable
            }
        }
        
        if ($request->hasFile('image')) 
        {
            $imageFile = $request->file('image');
            $imageFileName =  Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();
            $imagePath = $imageFile->storeAs($task->project->folder, $imageFileName, 'public');
            $task->image = $imageFileName;
        }
        else
            $task->image = null;

        $task->save();

        return response()->json([
            'message' => 'Task updated successfully.',
            'data' => $task
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = TaskEntity::findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.'
        ], 200);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'status' => 'nullable|integer',
        ]);

        //dd($validatedData);

        $task = TaskEntity::findOrFail($id);

        if (isset($validatedData['status']))
            $task->status = $validatedData['status'];
    
        $task->save();

        return response()->json([
            'message' => 'Task updated successfully.',
            'data' => $task
        ], 200);
    }
}
