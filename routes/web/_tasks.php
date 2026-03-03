<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\TaskController;
use App\Http\Middleware\AuthSpace;

Route::prefix('tasks')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [TaskController::class, 'index'])
        ->name('web.tasks.index');

    Route::get('/{id}', [TaskController::class, 'show'])
        ->name('web.tasks.show');

    Route::post('/search', [TaskController::class, 'search'])
        ->name('web.tasks.search');

    Route::post('/', [TaskController::class, 'store'])
        ->name('web.tasks.store');

    Route::put('/{id}', [TaskController::class, 'update'])
        ->name('web.tasks.update');
    
    Route::delete('/{id}', [TaskController::class, 'destroy'])
        ->name('web.tasks.destroy');

    Route::patch('/{id}/status', [TaskController::class, 'updateStatus'])
        ->name('web.tasks.update-status');
        
    Route::patch('/{id}/image', [TaskController::class, 'updateImage'])
        ->name('web.tasks.update-image');

    Route::patch('/{id}/description-short', [TaskController::class, 'updateDescriptionShort'])
        ->name('web.tasks.update-description-short');
    
    Route::patch('/{id}/description', [TaskController::class, 'updateDescription'])
        ->name('web.tasks.update-description');

    Route::patch('/{id}/links', [TaskController::class, 'updateLinks'])
        ->name('web.tasks.update-links');
});