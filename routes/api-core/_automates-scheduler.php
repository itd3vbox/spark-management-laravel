<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AutomateSchedulerController;

Route::prefix('automates-scheduler')->group(function () {
   
    Route::get('/{id}', [AutomateSchedulerController::class, 'show'])
        ->name('api-core.automates-scheduler.show');

});

Route::prefix('automates-scheduler')->middleware('auth:sanctum')->group(function () {

    Route::post('/search', [AutomateSchedulerController::class, 'search'])
        ->name('api-core.automates-scheduler.search');

    Route::post('/', [AutomateSchedulerController::class, 'store'])
        ->name('api-core.automates-scheduler.store');

    Route::put('/{id}', [AutomateSchedulerController::class, 'update'])
        ->name('api-core.automates-scheduler.update');
    
    Route::delete('/{id}', [AutomateSchedulerController::class, 'destroy'])
        ->name('api-core.automates-scheduler.destroy');
});