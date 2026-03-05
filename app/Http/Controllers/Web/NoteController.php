<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Note as NoteEntity;
use App\Services\Web\Search\NoteSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    protected $noteSearchService;

    public function __construct(NoteSearchService $noteSearchService)
    {
        $this->noteSearchService = $noteSearchService;
    }

    public function index()
    {
        return view('web.notes.main', [
            'data' => [
                'menuItem' => 'i-notes',
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
            'notes_id' => 'nullable|integer|exists:notes,id',
            'event_id' => 'nullable|integer|exists:agenda_events,id',
            'keywords' => 'nullable|string',
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => null,
            'event_id' => null,
        ], $validated);

        $notes = $this->noteSearchService->searchAll($options);

        return response()->json([
            'message' => 'Notes retrieved successfully',
            'data' => $notes,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $note = NoteEntity::find($id);

        return response()->json([
            'data' => $note
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'links' => 'nullable|string',
            'keywords' => 'nullable|string',
            'event_id' => 'nullable|exists:agenda_events,id',
        ]);

        $note = new NoteEntity();
        $note->title = $validated['title'] ?? null;
        $note->content = $validated['content'] ?? null;
        $note->links = $validated['links'] ?? null;
        $note->keywords = $validated['keywords'] ?? null;
        $note->event_id = $validated['event_id'] ?? null;
        $note->user_id = Auth::id();
        $note->save();

        return response()->json([
            'message' => 'Note created successfully',
            'data' => $note,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'links' => 'nullable|string',
            'keywords' => 'nullable|string',
        ]);

        $note = NoteEntity::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $note->title = $validated['title'] ?? null;
        $note->content = $validated['content'] ?? null;
        $note->links = $validated['links'] ?? null;
        $note->keywords = $validated['keywords'] ?? null;
        $note->save();

        return response()->json([
            'message' => 'Note updated successfully',
            'data' => $note,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $note = NoteEntity::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully',
        ]);
    }
}
