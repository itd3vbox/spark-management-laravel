<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\UserController;
use App\Http\Middleware\AuthSpace;

Route::prefix('users')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [UserController::class, 'index'])
        ->name('web.users.index');

    Route::get('/{id}', [UserController::class, 'show'])
        ->name('web.users.show');

    Route::post('/search-auth', [UserController::class, 'searchAuth'])
        ->name('web.users.search-auth');

     Route::post('/search', [UserController::class, 'search'])
        ->name('web.users.search');

    Route::post('/', [UserController::class, 'store'])
        ->name('web.users.store');

    Route::put('/{id}', [UserController::class, 'update'])
        ->name('web.users.update');
    
    Route::delete('/{id}', [UserController::class, 'destroy'])
        ->name('web.users.destroy');
});