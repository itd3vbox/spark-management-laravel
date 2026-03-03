<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;

class AuthSpace
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->to(route('web.sign.sign-in')); // Redirect to login if not authenticated
        }

        // Get the authenticated user
        $user = Auth::user();

        // On envoie seulement certains champs aux vues
        View::share('auth', [
            'id'       => $user->id,
            'email'    => $user->email,
            'username' => $user->username,
            'name'     => $user->name,
            'roles'    => json_decode($user->roles ?? '[]', true),
        ]);

        if ($user) {
            return $next($request);
        }

        // If type doesn't match, redirect or abort with 403
        //return redirect('/unauthorized');
        return redirect()->to(route('web.sign.sign-in'));
    }
}
