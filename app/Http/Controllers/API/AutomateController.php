<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Base\Automate as AutomateEntity;
use App\Services\API\Search\AutomateSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class AutomateController extends Controller
{
    protected $automateSearchService;

    public function __construct(AutomateSearchService $automateSearchService)
    {
        $this->automateSearchService = $automateSearchService;
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

        $automates = $this->automateSearchService->searchAll($options);

        return response()->json([
            'message' => 'Automates retrieved successfully',
            'data' => $automates,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $automate = AutomateEntity::find($id);

        return response()->json([
            'data' => $automate
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description_short' => 'required|string|max:255',
            'description' => 'nullable|json',
            'command' => 'nullable|string',
            'folder' => 'nullable|string',
            'status' => 'nullable|integer',
            'project_id' => 'required|integer|exists:projects,id',
        ]);

        $automate = new AutomateEntity();
        $automate->name = $validatedData['name'];
        $automate->type = $validatedData['type'];
        $automate->description_short = $validatedData['description_short'];
        if (isset($validatedData['description']))
            $automate->description = $validatedData['description'];
        if (isset($validatedData['status']))
            $automate->status = $validatedData['status'];
        if (isset($validatedData['command']))
            $automate->command = $validatedData['command'];
        if (isset($validatedData['folder']))
            $automate->folder = $validatedData['folder'];
        $automate->project_id = $validatedData['project_id'];
        $automate->folder = 'automate-' . now()->format('YmdHis');

        $automate->save();

        $folder = $automate->folder;
        Storage::disk('private')->makeDirectory($folder);
        Storage::disk('public')->makeDirectory($folder);

        return response()->json([
            'message' => 'Automate created successfully.',
            'data' => $automate
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'description_short' => 'nullable|string|max:255',
            'description' => 'nullable|json',
            'command' => 'nullable|string',
            'folder' => 'nullable|string',
            'status' => 'nullable|integer',
        ]);

        $automate = AutomateEntity::findOrFail($id);
        
        if (isset($validatedData['name']))
            $automate->name = $validatedData['name'];
    
        if (isset($validatedData['description_short']))
            $automate->description_short = $validatedData['description_short'];
    
        if (isset($validatedData['description']))
            $automate->description = $validatedData['description'];

        if (isset($validatedData['status']))
            $automate->status = $validatedData['status'];
    
        if (isset($validatedData['type']))
            $automate->type = $validatedData['type'];
    
        if (isset($validatedData['command']))
            $automate->command = $validatedData['command'];
        
        if (isset($validatedData['folder']))
            $automate->folder = $validatedData['folder'];

        $automate->save();

        return response()->json([
            'message' => 'Automate updated successfully.',
            'data' => $automate
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $automate = AutomateEntity::findOrFail($id);
        $automate->delete();

        return response()->json([
            'message' => 'Automate deleted successfully.'
        ], 200);
    }

    /**
     * Execute a command from an existing automate record.
     */
    public function execute(Request $request, $id)
    {
        $automate = AutomateEntity::find($id);

        if (!$automate) {
            return response()->json([
                'message' => 'Automate not found'
            ], 404);
        }

        if (!$automate->command) {
            return response()->json([
                'message' => 'No command set for this automate'
            ], 400);
        }

        if (!Storage::disk('public')->exists($automate->folder)) {
            Storage::disk('public')->makeDirectory($automate->folder);
        }

        $outputLogPath = Storage::disk('public')->path($automate->folder . '/output.log');

        $startTime = microtime(true);

        try {
            // Execute the command and capture the output
            $output = shell_exec($automate->command . ' 2>&1');

            if ($output === null) {
                $output = "Command executed successfully with no output.\n";
            }

            $endTime = microtime(true);
            $duration = ($endTime - $startTime) * 1000;

            $automate->exec_date = now();
            $automate->duration = $duration;
            $automate->status = 1;
            $automate->save();

            // Write the output to the log file
            file_put_contents($outputLogPath, $output,);

            return response()->json([
                'message' => 'Command executed successfully.',
                'output' => $output,
                'data' => $automate,
            ]);
        } 
        catch (\Exception $e) {

            $endTime = microtime(true);

            $duration = ($endTime - $startTime) * 1000;

            $automate->exec_date = now();
            $automate->duration = $duration;
            $automate->status = 2; 
            $automate->save();

            // Log error using Laravel's logging mechanism
            Log::error('Failed to execute command', ['error' => $e->getMessage()]);

            // Append the error message to the log file
            $errorOutput = "Error: " . $e->getMessage() . "\n";
            file_put_contents($outputLogPath, $errorOutput, FILE_APPEND);

            return response()->json([
                'message' => 'Failed to execute command.',
                'error' => $e->getMessage(),
                'data' => $automate,
            ], 500);
        }
    }

    /**
     * Clear the contents of the output log file for a specific automate record without deleting the file.
     */
    public function clear(Request $request, $id)
    {
        $automate = AutomateEntity::find($id);

        if (!$automate) {
            return response()->json([
                'message' => 'Automate not found'
            ], 404);
        }

        if (!Storage::disk('public')->exists($automate->folder)) {
            return response()->json([
                'message' => 'Log folder not found'
            ], 404);
        }

        $outputLogPath = Storage::disk('public')->path($automate->folder . '/output.log');

        try {
            if (file_exists($outputLogPath)) {
                file_put_contents($outputLogPath, '');

                return response()->json([
                    'message' => 'Log cleared successfully.'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Log file does not exist.'
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Failed to clear log', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to clear log.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the contents of the output log file for a specific automate record.
     */
    public function log(Request $request, $id)
    {
        $automate = AutomateEntity::find($id);

        if (!$automate) {
            return response()->json([
                'message' => 'Automate not found'
            ], 404);
        }

        if (!Storage::disk('public')->exists($automate->folder)) {
            return response()->json([
                'message' => 'Log folder not found'
            ], 404);
        }

        $outputLogPath = Storage::disk('public')->path($automate->folder . '/output.log');

        try {
            if (file_exists($outputLogPath)) {

                $logContent = file_get_contents($outputLogPath);

                return response()->json([
                    'message' => 'Log retrieved successfully.',
                    'output' => $logContent
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Log file does not exist.'
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Failed to retrieve log', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to retrieve log.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
