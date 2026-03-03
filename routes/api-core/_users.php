<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;

Route::prefix('users')->group(function () {
   
    Route::get('/{id}', [UserController::class, 'show'])
        ->name('api-core.users.show');

});

Route::prefix('users')->middleware('auth:sanctum')->group(function () {

    Route::post('/search', [UserController::class, 'search'])
        ->name('api-core.users.search');

    Route::post('/', [UserController::class, 'store'])
        ->name('api-core.users.store');

    Route::put('/{id}', [UserController::class, 'update'])
        ->name('api-core.users.update');
    
    Route::delete('/{id}', [UserController::class, 'destroy'])
        ->name('api-core.users.destroy');
});