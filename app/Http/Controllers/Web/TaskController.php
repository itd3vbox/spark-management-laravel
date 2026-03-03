<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Task as TaskEntity;
use App\Models\User as UserEntity;
use App\Services\Web\Search\TaskSearchService;
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

    public function index()
    {
        return view('web.tasks.main', [
            'data' => [
                'menuItem' => 'i-tasks',
            ]
        ]);
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
        if ($response = $this->authorizeAdmin()) return $response;

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description_short' => 'required|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'keywords' => 'nullable|json',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $task = new TaskEntity();

        $task->title = $validatedData['title'];
        $task->description_short = $validatedData['description_short'];
        $task->description = $validatedData['description'] ?? null;
        $task->status = $validatedData['status'] ?? 0;
        $task->keywords = $validatedData['keywords'] ?? null;
        $task->links = $validatedData['links'] ?? null;
        $task->project_id = $validatedData['project_id'];

        $task->save();

        // Assignation user si project_id ET user_id donnés
        if (!empty($validatedData['user_id']) && !empty($validatedData['project_id'])) {
            $task->users()->attach($validatedData['user_id']);
        }

        // Gestion image
        if ($request->hasFile('image')) {

            $folder = $task->project->folder;

            $imageFile = $request->file('image');
            $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();

            $imageFile->storeAs($folder, $imageFileName, 'public');

            $task->image = $imageFileName;
            $task->save();
        }

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
        if ($response = $this->authorizeAdmin()) return $response;

        $validatedData = $request->validate([
            'title' => 'nullable|string|max:255',
            'description_short' => 'nullable|string',
            'description' => 'nullable|json',
            'status' => 'nullable|integer',
            'keywords' => 'nullable|json',
            'links' => 'nullable|json',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'project_id' => 'nullable|exists:projects,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $task = TaskEntity::findOrFail($id);

        // Assignation propriété par propriété
        if (array_key_exists('title', $validatedData))
            $task->title = $validatedData['title'];

        if (array_key_exists('description_short', $validatedData))
            $task->description_short = $validatedData['description_short'];

        if (array_key_exists('description', $validatedData))
            $task->description = $validatedData['description'];

        if (array_key_exists('status', $validatedData))
            $task->status = $validatedData['status'];

        if (array_key_exists('keywords', $validatedData))
            $task->keywords = $validatedData['keywords'];

        if (array_key_exists('links', $validatedData))
            $task->links = $validatedData['links'];

        if (array_key_exists('project_id', $validatedData))
            $task->project_id = $validatedData['project_id'];

        $task->save();

        // Assignation user si envoyé
        if (array_key_exists('user_id', $validatedData)) {

            if ($validatedData['user_id']) {
                $task->users()->sync([$validatedData['user_id']]);
            } else {
                $task->users()->detach();
            }
        }

        // Gestion image uniquement si nouvelle image envoyée
        if ($request->hasFile('image')) {

            if ($task->image) {
                Storage::disk('public')
                    ->delete($task->project->folder . '/' . $task->image);
            }

            $folder = $task->project->folder;

            $imageFile = $request->file('image');
            $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $imageFile->getClientOriginalExtension();

            $imageFile->storeAs($folder, $imageFileName, 'public');

            $task->image = $imageFileName;
            $task->save();
        }

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
        if ($response = $this->authorizeAdmin()) return $response;

        $task = TaskEntity::findOrFail($id);

        if ($task->image) {
            Storage::disk('public')
                ->delete($task->project->folder.'/'.$task->image);
        }

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

    private function authorizeAdmin(): ?JsonResponse
    {
        $currentUser = auth()->user();

        if (!$currentUser || !in_array('ADMIN', json_decode($currentUser->roles ?? '[]', true))) {
            return response()->json([
                'message' => 'Not authorized'
            ], 403);
        }

        return null;
    }

}
