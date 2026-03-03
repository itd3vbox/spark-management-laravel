<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\AgendaEvent;
use App\Models\Base\Task;
use App\Services\Web\Search\AgendaSearchService;

class AgendaController extends Controller
{
    protected $agendaSearchService;

    public function __construct(AgendaSearchService $agendaSearchService)
    {
        $this->agendaSearchService = $agendaSearchService;
    }

   public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'max'    => 'nullable|integer|min:1|max:100',
            'month'  => 'nullable|integer|min:1|max:12',
            'year'   => 'nullable|integer|min:2000|max:2100',
            'date'   => 'nullable|date_format:Y-m-d', // nouvelle validation
            'hours'  => 'nullable|string', // "HH:MM" format
        ]);

        $options = array_merge([
            'month' => null,
            'year'  => null,
            'is_asc' => false,
            'max'   => 20,
            'date'  => null,
            'hours' => null,
        ], $validated);

        $events = $this->agendaSearchService->searchAll($options);

        return response()->json([
            'message' => 'Agenda events retrieved successfully',
            'data' => $events,
        ], 200);
    }

    public function searchMonthCounts(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'month'  => 'nullable|integer|min:1|max:12',
            'year'   => 'nullable|integer|min:2000|max:2100',
        ]);

        $options = array_merge([
            'month' => null,
            'year'  => null,
        ], $validated);

        $events = $this->agendaSearchService->searchMonthCounts($options);

        return response()->json([
            'message' => 'Agenda events retrieved successfully',
            'data' => $events,
        ], 200);
    }

    public function searchDayCounts(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'date'  => 'required|string',
        ]);

        $options = array_merge([
            'date' => null,
        ], $validated);

        $events = $this->agendaSearchService->searchDayCounts($options);

        return response()->json([
            'message' => 'Agenda events retrieved successfully',
            'data' => $events,
        ], 200);
    }

    public function searchTasks(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|integer|exists:agendas_events,id',
        ]);

        $tasks = $this->agendaSearchService
                    ->searchEventTasksAll($validated['event_id']);

        return response()->json([
            'message' => 'Event tasks retrieved successfully',
            'data' => $tasks,
        ], 200);
    }


    /**
     * Crée un nouvel événement d'agenda (ADMIN uniquement)
     */
    public function store(Request $request): JsonResponse
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'date'  => 'required|date',
            'time'  => 'required',
            'note'  => 'nullable|string',
        ]);

        $event = AgendaEvent::create($validated);

        return response()->json([
            'message' => 'Agenda event created successfully.',
            'data' => $event
        ], 201);
    }

    /**
     * Met à jour un événement d'agenda existant (ADMIN uniquement)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $event = AgendaEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'date'  => 'nullable|date',
            'time'  => 'nullable',
            'note'  => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Agenda event updated successfully.',
            'data' => $event
        ], 200);
    }

    /**
     * Supprime un événement d'agenda (ADMIN uniquement)
     */
    public function destroy(int $id): JsonResponse
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $event = AgendaEvent::findOrFail($id);
        $event->delete();

        return response()->json([
            'message' => 'Agenda event deleted successfully.'
        ], 200);
    }

    /**
     * Associe une tâche à un événement d'agenda (ADMIN uniquement)
     */
    public function storeTask(Request $request, int $eventId): JsonResponse
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $event = AgendaEvent::findOrFail($eventId);

        $validated = $request->validate([
            'task_id' => 'required|integer|exists:tasks,id'
        ]);

        $taskId = $validated['task_id'];

        if (!$event->tasks()->where('task_id', $taskId)->exists()) {
            $event->tasks()->attach($taskId);
        }

        return response()->json([
            'message' => 'Task attached to agenda event successfully.'
        ], 200);
    }

    /**
     * Supprime une tâche associée à un événement d'agenda (ADMIN uniquement)
     */
    public function destroyTask(Request $request, int $eventId, int $taskId): JsonResponse
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $event = AgendaEvent::findOrFail($eventId);

        $event->tasks()->detach($taskId);

        return response()->json([
            'message' => 'Task detached from agenda event successfully.'
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
