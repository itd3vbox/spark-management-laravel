<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class SignController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user)
            return view('web.home.main');

        return view('web.sign-in.main');
    }
    
    public function checkAuth(Request $request) : JsonResponse 
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    public function authenticate(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $request->session()->regenerate();

        $user = Auth::user();
        $user->last_ip = $request->ip();
        $user->save();

        return response()->json([
            'message' => 'Authenticated (session)',
            'user' => $user,
            'redirect' => route('web.home.index'),
        ]);
    }

    public function signOut(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->last_ip = null;
            $user->save();
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // return response()->json([
        //     'message' => 'Signed out (session)',
        // ]);
        return redirect()->to(route('web.sign.sign-in'));
    }


    public function apiAuthenticate(Request $request) : JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 401);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials.'], 401);
        }

        $token = $user->createToken('Web Token');

        $user->last_ip = $request->ip();
        $user->save();

        // if(Auth::attempt($credentials))
        // {
        //     $request->session()->regenerate();
        // }

        return response()->json([
            'token' => $token->plainTextToken,
            'user' => $user,
        ]);
    }

    public function apiSignOut(Request $request) : JsonResponse
    {
        $user = $request->user();
        $user->last_ip = null;
        $user->save();

        $request->user()->tokens()->delete();

        // Mise à jour de l'adresse IP de l'utilisateur
       
        
        // $request->session()->invalidate();
        // $request->session()->regenerateToken();


        //Auth::logout();

        return response()->json(['message' => 'You are now signed out.']);
    }
}
