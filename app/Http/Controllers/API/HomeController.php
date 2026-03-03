<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\API\Data\AppDataService;

class HomeController extends Controller
{
    protected $appDataService;
    
    public function __construct(AppDataService $appDataService)
    {
        $this->appDataService = $appDataService;
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
}
