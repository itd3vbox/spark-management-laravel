<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AutomateSchedulerController;
use App\Http\Middleware\AuthSpace;

Route::prefix('automates-scheduler')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [AutomateSchedulerController::class, 'index'])
        ->name('web.automates-scheduler.index');

    Route::get('/{id}', [AutomateSchedulerController::class, 'show'])
        ->name('web.automates-scheduler.show');
        
    Route::post('/search', [AutomateSchedulerController::class, 'search'])
        ->name('web.automates-scheduler.search');

    Route::post('/', [AutomateSchedulerController::class, 'store'])
        ->name('web.automates-scheduler.store');

    Route::put('/{id}', [AutomateSchedulerController::class, 'update'])
        ->name('web.automates-scheduler.update');
    
    Route::delete('/{id}', [AutomateSchedulerController::class, 'destroy'])
        ->name('web.automates-scheduler.destroy');
});