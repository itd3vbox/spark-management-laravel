<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Web\Data\AppDataService;
use App\Services\Web\Search\HomeSearchService;

class HomeController extends Controller
{
    protected $appDataService;
    protected $homeSearchService;
    
    public function __construct(AppDataService $appDataService, 
        HomeSearchService $homeSearchService)
    {
        $this->appDataService = $appDataService;
        $this->homeSearchService = $homeSearchService;
    }

    public function index()
    {
        return view('web.home.main', [
            'data' => [
                'menuItem' => 'i-home',
            ]
        ]);
    }

    public function mainData(Request $request) : JsonResponse
    {
        $user = $request->user();
        $data = $this->appDataService->getMainData();

        return response()->json([
            'message' => 'Data retrieved successfully',
            'data' => $data,
        ], 200);
    }

    public function searchProjectsData(Request $request) : JsonResponse
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

        $data = $this->homeSearchService->searchProjectsData($options);

        return response()->json([
            'message' => 'Data retrieved successfully',
            'data' => $data,
        ], 200);
    }
}
