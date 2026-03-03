<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;

Route::prefix('projects')->group(function () {
   
    Route::get('/{id}', [ProjectController::class, 'show'])
        ->name('api-core.projects.show');

});

Route::prefix('projects')->middleware('auth:sanctum')->group(function () {

    Route::post('/search', [ProjectController::class, 'search'])
        ->name('api-core.projects.search');
        
    Route::post('/', [ProjectController::class, 'store'])
        ->name('api-core.projects.store');

    Route::put('/{id}', [ProjectController::class, 'update'])
        ->name('api-core.projects.update');
    
    Route::delete('/{id}', [ProjectController::class, 'destroy'])
        ->name('api-core.projects.destroy');
        
    Route::patch('/{id}/image', [ProjectController::class, 'updateImage'])
        ->name('api-core.projects.update-image');

    Route::patch('/{id}/description-short', [ProjectController::class, 'updateDescriptionShort'])
        ->name('api-core.projects.update-description-short');
    
    Route::patch('/{id}/description', [ProjectController::class, 'updateDescription'])
        ->name('api-core.projects.update-description');

    Route::patch('/{id}/links', [ProjectController::class, 'updateLinks'])
        ->name('api-core.projects.update-links');
    
    Route::patch('/{id}/website', [ProjectController::class, 'updateWebsite'])
        ->name('api-core.projects.update-website');
});