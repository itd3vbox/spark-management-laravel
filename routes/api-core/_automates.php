<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AutomateController;

Route::prefix('automates')->group(function () {
   
    Route::get('/{id}', [AutomateController::class, 'show'])
        ->name('api-core.automates.show');

});

Route::prefix('automates')->middleware('auth:sanctum')->group(function () {

    Route::post('/search', [AutomateController::class, 'search'])
        ->name('api-core.automates.search');

    Route::post('/', [AutomateController::class, 'store'])
        ->name('api-core.automates.store');

    Route::put('/{id}', [AutomateController::class, 'update'])
        ->name('api-core.automates.update');
    
    Route::delete('/{id}', [AutomateController::class, 'destroy'])
        ->name('api-core.automates.destroy');
        
    Route::patch('/{id}/update-type', [AutomateController::class, 'updateType'])
        ->name('api-core.automates.update-type');

    Route::patch('/{id}/update-description-short', [AutomateController::class, 'updateDescriptionShort'])
        ->name('api-core.automates.update-description-short');
    
    Route::patch('/{id}/update-description', [AutomateController::class, 'updateDescription'])
        ->name('api-core.automates.update-description');

    Route::patch('/{id}/update-command', [AutomateController::class, 'updateCommand'])
        ->name('api-core.automates.update-command');
    
    Route::patch('/{id}/update-status', [AutomateController::class, 'updateStatus'])
        ->name('api-core.automates.update-status');

    Route::post('/{id}/execute', [AutomateController::class, 'execute'])
        ->name('api-core.automates.execute');

    Route::post('/{id}/clear', [AutomateController::class, 'clear'])
        ->name('api-core.automates.clear');

    Route::get('/{id}/log', [AutomateController::class, 'log'])
        ->name('api-core.automates.log');
});