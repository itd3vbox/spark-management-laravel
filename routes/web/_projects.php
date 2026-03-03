<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\ProjectController;
use App\Http\Middleware\AuthSpace;

Route::prefix('projects')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [ProjectController::class, 'index'])
        ->name('web.projects.index');
   
    Route::get('/{id}', [ProjectController::class, 'show'])
        ->name('web.projects.show');

    Route::post('/search', [ProjectController::class, 'search'])
        ->name('web.projects.search');
        
    Route::post('/', [ProjectController::class, 'store'])
        ->name('web.projects.store');

    Route::put('/{id}', [ProjectController::class, 'update'])
        ->name('web.projects.update');
    
    Route::delete('/{id}', [ProjectController::class, 'destroy'])
        ->name('web.projects.destroy');
        
    Route::patch('/{id}/image', [ProjectController::class, 'updateImage'])
        ->name('web.projects.update-image');

    Route::patch('/{id}/description-short', [ProjectController::class, 'updateDescriptionShort'])
        ->name('web.projects.update-description-short');
    
    Route::patch('/{id}/description', [ProjectController::class, 'updateDescription'])
        ->name('web.projects.update-description');

    Route::patch('/{id}/links', [ProjectController::class, 'updateLinks'])
        ->name('web.projects.update-links');
    
    Route::patch('/{id}/website', [ProjectController::class, 'updateWebsite'])
        ->name('web.projects.update-website');
});