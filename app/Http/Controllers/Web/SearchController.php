<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Services\Web\Search\SearchService;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Display a listing of the resource.
     */
    public function search(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'sometimes|boolean',
            'max' => 'sometimes|integer|min:1|max:100',
            'keywords' => 'nullable|string',
            'type' => 'nullable|string', // artist, event, ad, gallerist
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => '',
            'type' => null,
        ], $validated);

        $data = $this->searchService->searchAll($options);

        return response()->json([
            'message' => 'Search data retrieved successfully',
            'data' => $data,
        ], 200);
    }
}
