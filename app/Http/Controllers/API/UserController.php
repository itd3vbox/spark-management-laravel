<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User as UserEntity;
use App\Services\API\Search\UserSearchService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $userSearchService;

    public function __construct(UserSearchService $userSearchService)
    {
        $this->userSearchService = $userSearchService;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function search(Request $request) : JsonResponse
    {
        $validated = $request->validate([
            'is_asc' => 'nullable|boolean',
            'max' => 'nullable|integer|min:1|max:100',
            'user_id' => 'nullable|integer|exists:users,id',
            'keywords' => 'nullable|string',
        ]);

        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => null,
        ], $validated);

        $users = $this->userSearchService->searchAll($options);

        return response()->json([
            'message' => 'Users retrieved successfully',
            'data' => $users,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = UserEntity::find($id);

        return response()->json([
            'data' => $user
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'roles' => 'required|json',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $user = new UserEntity();
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->password = Hash::make($validatedData['password']);
        $user->roles = $validatedData['roles'];
        $user->save();

        $user->folder = 'user-' . $user->id . '-' . now()->format('YmdHis');
        $user->save();

        Storage::disk('private')->makeDirectory($user->folder);
        Storage::disk('public')->makeDirectory($user->folder);

        if ($request->hasFile('avatar')) 
        {
            $avatarFile = $request->file('avatar');
            $avatarFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $avatarFile->getClientOriginalExtension();
            $avatarPath = $avatarFile->storeAs($user->folder, $avatarFileName, 'public');
            $user->avatar = $avatarFileName;
            $user->save();
        }

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'username' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'roles' => 'nullable|json',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $user = UserEntity::findOrFail($id);

        Log::info('User update:', $validatedData);

        if (isset($validatedData['username'])) 
            $user->name = $validatedData['username'];
        if (isset($validatedData['name'])) 
            $user->name = $validatedData['name'];
        if (isset($validatedData['email'])) 
            $user->email = $validatedData['email'];
        if (isset($validatedData['password'])) 
            $user->password = Hash::make($validatedData['password']);
        if (isset($validatedData['roles'])) 
            $user->roles = $validatedData['roles'];

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->folder . '/' . $user->avatar);
            }

            $avatarFile = $request->file('avatar');
            $avatarFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.' . $avatarFile->getClientOriginalExtension();
            $avatarPath = $avatarFile->storeAs($user->folder, $avatarFileName, 'public');
            $user->avatar = $avatarFileName;
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $user,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = UserEntity::findOrFail($id);

        Storage::disk('public')->deleteDirectory($user->folder);
        Storage::disk('private')->deleteDirectory($user->folder);

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ], 200);
    }
}
