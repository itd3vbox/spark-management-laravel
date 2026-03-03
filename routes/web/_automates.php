<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AutomateController;
use App\Http\Middleware\AuthSpace;

Route::prefix('automates')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [AutomateController::class, 'index'])
        ->name('web.automates.index');

    Route::get('/{id}', [AutomateController::class, 'show'])
        ->name('web.automates.show');

    Route::post('/search', [AutomateController::class, 'search'])
        ->name('web.automates.search');

    Route::post('/', [AutomateController::class, 'store'])
        ->name('web.automates.store');

    Route::put('/{id}', [AutomateController::class, 'update'])
        ->name('web.automates.update');
    
    Route::delete('/{id}', [AutomateController::class, 'destroy'])
        ->name('web.automates.destroy');
        
    Route::patch('/{id}/update-type', [AutomateController::class, 'updateType'])
        ->name('web.automates.update-type');

    Route::patch('/{id}/update-description-short', [AutomateController::class, 'updateDescriptionShort'])
        ->name('web.automates.update-description-short');
    
    Route::patch('/{id}/update-description', [AutomateController::class, 'updateDescription'])
        ->name('web.automates.update-description');

    Route::patch('/{id}/update-command', [AutomateController::class, 'updateCommand'])
        ->name('web.automates.update-command');
    
    Route::patch('/{id}/update-status', [AutomateController::class, 'updateStatus'])
        ->name('web.automates.update-status');

    Route::post('/{id}/execute', [AutomateController::class, 'execute'])
        ->name('web.automates.execute');

    Route::post('/{id}/clear', [AutomateController::class, 'clear'])
        ->name('web.automates.clear');

    Route::get('/{id}/log', [AutomateController::class, 'log'])
        ->name('web.automates.log');
});