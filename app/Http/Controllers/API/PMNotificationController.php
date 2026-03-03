<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Base\PMNotification as PMNotificationEntity;

class PMNotificationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'integer|default:0',
        ]);

        $notification = PMNotificationEntity::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Notification created successfully.',
            'data' => $notification
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $notification = PMNotificationEntity::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $notification
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'integer|default:0',
        ]);

        $notification = PMNotificationEntity::findOrFail($id);
        $notification->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Notification updated successfully.',
            'data' => $notification
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $notification = PMNotificationEntity::findOrFail($id);
        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully.'
        ], 200);
    }
}
