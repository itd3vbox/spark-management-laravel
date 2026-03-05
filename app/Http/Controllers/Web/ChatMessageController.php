<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Base\ChatMessage;
use App\Models\User;
use App\Services\Web\Search\ChatMessageSearchService;
use App\Events\ChatMessage as ChatMessageEvent;
use App\Events\ChatUser as ChatUserEvent;
use Illuminate\Support\Facades\DB;

class ChatMessageController extends Controller
{
    protected $messageSearchService;

    public function __construct(ChatMessageSearchService $messageSearchService)
    {
        $this->messageSearchService = $messageSearchService;
    }

    /**
     * Display a listing of the resource.
     */
    public function search(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'sometimes|boolean',
            'max' => 'sometimes|integer|min:1|max:100',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        if (!Auth::check()) 
        {
            return response()->json([
                'message' => 'Unauthorized action: You do not have permission to search',
            ], 403);
        }

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'username' => null,
            'auth_id' => Auth::id(),
            'user_id' => null
        ], $validated);

        $messages = $this->messageSearchService->searchAll($options);

        return response()->json([
            'message' => 'Messages retrieved successfully',
            'data' => $messages,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) : JsonResponse
    {
        $data = $request->validate([
            'content' => 'required|string',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        if (!Auth::check()) 
        {
            return response()->json([
                'message' => 'Unauthorized action: You do not have permission to store',
            ], 403);
        }

        $userId = Auth::id();
     
        $chatMessage = new ChatMessage();
        $chatMessage->content = $data['content'];
        $chatMessage->user_from_id = $userId;
        $chatMessage->user_to_id = $data['user_id'] ?? null;
        $chatMessage->status = 0;

        $chatMessage->save();

        if ($chatMessage->user_to_id) {
            // Message privé
            broadcast(new ChatMessageEvent(
                $chatMessage->user_to_id,
                $chatMessage->user_from_id
            ));//->toOthers();

        } else {

            // Message global
            broadcast(new ChatMessageEvent(
                null,
                $chatMessage->user_from_id
            ));//->toOthers();
        }

        return response()->json([
            'message' => 'Message created successfully',
            'data' => $chatMessage,
        ], 201);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) : JsonResponse
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized action: You do not have permission to delete this message',
            ], 403);
        }

        $chatMessage = ChatMessage::find($id);

        if (!$chatMessage) {
            return response()->json([
                'message' => 'Message not found',
            ], 404);
        }

        // Only the sender can delete
        if ($chatMessage->user_from_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized action: You do not have permission to delete this message',
            ], 403);
        }

        $toId = $chatMessage->user_to_id;
        $fromId = $chatMessage->user_from_id;

        $chatMessage->delete();

        // Broadcast delete event
        if ($toId) {

            // Private message delete
            broadcast(new ChatMessageEvent($toId, $fromId));//->toOthers();

        } else {

            // Global message delete
            broadcast(new ChatMessageEvent(null, $fromId));//->toOthers();
        }

        return response()->json([
            'message' => 'Message deleted successfully',
        ], 200);
    }

    /**
     * Clear all chat messages from the database.
     */
    public function clear(Request $request): JsonResponse
    {
        // Check if the user is logged in
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized action: You must be logged in to clear messages.',
            ], 403);
        }

        $user = Auth::user();

        // Check if the user has the ADMIN role
        $roles = json_decode($user->roles, true);
        if (!in_array('ADMIN', $roles)) {
            return response()->json([
                'message' => 'Unauthorized action: Only admins can clear all messages.',
            ], 403);
        }

        // Delete all chat messages
        $deleted = ChatMessage::query()->delete();

        broadcast(new ChatMessageEvent(null, $user->id));

        return response()->json([
            'message' => "All chat messages have been cleared.",
            'deleted_count' => $deleted,
        ], 200);
    }
}
