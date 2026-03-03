<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Automate;
use App\Models\Base\AutomateScheduler;
use App\Models\Base\AutomateSchedulerAutomate;
use App\Services\API\Search\AutomateSchedulerSearchService;
use Carbon\Carbon;


class AutomateSchedulerController extends Controller
{
    protected $automateSchedulerSearchService;

    public function __construct(AutomateSchedulerSearchService $automateSchedulerSearchService)
    {
        $this->automateSchedulerSearchService = $automateSchedulerSearchService;
    }

     /**
     * Display a listing of the resource.
     */
    public function search(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'max' => 'nullable|integer|min:1|max:100',
            'id' => 'nullable|integer|exists:automates_scheduler,id',
            'keywords' => 'nullable|string',
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => null,
        ], $validated);

        $projects = $this->automateSchedulerSearchService->searchAll($options);

        return response()->json([
            'message' => 'Automates Scheduler retrieved successfully',
            'data' => $projects,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'date' => 'required|string',
            'time' => 'required|string',
            'description_short' => 'required|string|max:255',
            'project' => 'required|integer|exists:projects,id',
            'automates' => 'required|json',
        ]);

        $automates = json_decode($validatedData['automates'], true);

        if (!is_array($automates)) {
            return response()->json([
                'message' => 'Invalid JSON format for automates.',
            ], 400);
        }

        if (empty($automates)) {
            return response()->json([
                'message' => 'The automates list cannot be empty.',
            ], 400);
        }

        try {
            $execDate = Carbon::createFromFormat('Y-m-d H:i:s', $validatedData['date'] . ' ' . $validatedData['time']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid date or time format.',
                'error' => $e->getMessage(),
            ], 400);
        }

        $automateScheduler = new AutomateScheduler();
        $automateScheduler->exec_date = $execDate;
        $automateScheduler->description_short = $validatedData['description_short'];
        $automateScheduler->project_id = $validatedData['project'];
        $automateScheduler->save();

        foreach ($automates as $automateId) 
        {
            if (!is_int($automateId) || !Automate::where('id', $automateId)->exists()) 
            {
                return response()->json([
                    'message' => "Automate ID {$automateId} is invalid.",
                ], 400);
            }

            $automateSchedulerAutomate = new AutomateSchedulerAutomate;
            $automateSchedulerAutomate->automate_scheduler_id = $automateScheduler->id;
            $automateSchedulerAutomate->automate_id = $automateId;
            $automateSchedulerAutomate->save();
        }

        return response()->json([
            'message' => 'Automate scheduler created successfully.',
            'data' => $automateScheduler,
        ], 201);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        //
    }
}
