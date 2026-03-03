<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AgendaController;
use App\Http\Middleware\AuthSpace;

Route::prefix('agenda')->middleware([AuthSpace::class])->group(function () {

    Route::post('/search', [AgendaController::class, 'search'])
        ->name('web.agenda.search');
        
    Route::post('/search-month-counts', [AgendaController::class, 'searchMonthCounts'])
        ->name('web.agenda.search-month-counts');

    Route::post('/search-day-counts', [AgendaController::class, 'searchDayCounts'])
        ->name('web.agenda.search-day-counts');

    Route::post('/search-tasks', [AgendaController::class, 'searchTasks'])
        ->name('web.agenda.search-tasks');

    Route::post('/', [AgendaController::class, 'store'])
        ->name('web.agenda.store');

    Route::put('/{id}', [AgendaController::class, 'update'])
        ->name('web.agenda.update');

    Route::delete('/{id}', [AgendaController::class, 'destroy'])
        ->name('web.agenda.destroy');

    Route::post('/events/{eventId}', [AgendaController::class, 'storeTask'])
        ->name('web.agenda.store-task');

    Route::delete('/events/{eventId}/{taskId}', [AgendaController::class, 'destroyTask'])
        ->name('web.agenda.destroy-task');
});
