<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;

Route::prefix('tasks')->group(function () {
   
    Route::get('/{id}', [TaskController::class, 'show'])
        ->name('api-core.tasks.show');

});

Route::prefix('tasks')->middleware('auth:sanctum')->group(function () {

    Route::post('/search', [TaskController::class, 'search'])
        ->name('api-core.tasks.search');

    Route::post('/', [TaskController::class, 'store'])
        ->name('api-core.tasks.store');

    Route::put('/{id}', [TaskController::class, 'update'])
        ->name('api-core.tasks.update');
    
    Route::delete('/{id}', [TaskController::class, 'destroy'])
        ->name('api-core.tasks.destroy');

    Route::patch('/{id}/status', [TaskController::class, 'updateStatus'])
        ->name('api-core.tasks.update-status');
        
    Route::patch('/{id}/image', [TaskController::class, 'updateImage'])
        ->name('api-core.tasks.update-image');

    Route::patch('/{id}/description-short', [TaskController::class, 'updateDescriptionShort'])
        ->name('api-core.tasks.update-description-short');
    
    Route::patch('/{id}/description', [TaskController::class, 'updateDescription'])
        ->name('api-core.tasks.update-description');

    Route::patch('/{id}/links', [TaskController::class, 'updateLinks'])
        ->name('api-core.tasks.update-links');
});