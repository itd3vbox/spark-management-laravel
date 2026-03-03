<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\SignController;
use App\Http\Middleware\AuthSpace;

Route::middleware([AuthSpace::class])->group(function () {
    Route::get('/sign-out', [SignController::class, 'signOut'])
        ->name('web.sign.sign-out');
});

Route::middleware([])->group(function () {
    Route::get('/sign-in', [SignController::class, 'index'])
        ->name('web.sign.sign-in');
    Route::post('/authenticate', [SignController::class, 'authenticate'])
        ->name('web.sign.authenticate');
    Route::get('/check-auth', [SignController::class, 'checkAuth'])
        ->name('web.sign.check-auth');
});
