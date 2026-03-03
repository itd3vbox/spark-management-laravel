<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SignController;


Route::middleware(['auth:sanctum',])->group(function () {
    Route::get('/sign-out', [SignController::class, 'signOut'])->name('api-core.sign.sign-out');
    Route::get('/check-auth', [SignController::class, 'checkAuth'])->name('api-core.sign.check-auth');
});

Route::middleware([])->group(function () {
    Route::post('/sign-in', [SignController::class, 'signIn'])->name('api-core.sign.sign-in');
});
