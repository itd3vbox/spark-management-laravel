<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User as UserEntity;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Update the user's avatar.
     */
    public function updateAvatar(Request $request) : JsonResponse
    {
        $data = $request->validate([
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'data' => null,
            ], 404);
        }

        if ($user->avatar) 
        {
            Storage::disk('public')->delete($user->avatar);
        }

        if ($request->hasFile('avatar')) 
        {

            if (!isset($user->folder))
            {
                $user->folder = 'user-' . $user->id . now()->format('YmdHis');
                $user->save();
                $folder = $user->folder;
                Storage::disk('private')->makeDirectory($folder);
                Storage::disk('public')->makeDirectory($folder);
            }

            $avatarFile = $request->file('avatar');
            $avatarFileName = 'avatar.' . $avatarFile->getClientOriginalExtension();
            $avatarPath = $avatarFile->storeAs($user->folder, $avatarFileName, 'public');
            $user->avatar = $avatarFileName;
        }
        else
            $user->avatar = null;

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Update the user's email address.
     */
    public function updateEmail(Request $request) : JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'data' => null,
            ], 404);
        }

        $user->email = $data['email'];
        $user->email_verified_at = null;
        $user->save();

        // Trigger an email verification notification if needed
        // $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email updated successfully',
            'data' => $user,
        ], 200);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request) : JsonResponse
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'data' => null,
            ], 404);
        }

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
                'data' => null,
            ], 422);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
            'data' => $user,
        ], 200);
    }
}
