<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\PMNotificationController;
use App\Http\Middleware\AuthSpace;

Route::prefix('automates/notifications')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [PMNotificationController::class, 'index'])
        ->name('web.automates.notifications.index');
   
    Route::get('/{id}', [PMNotificationController::class, 'show'])
        ->name('web.automates.notifications.show');

    Route::post('/search', [PMNotificationController::class, 'search'])
        ->name('web.automates.notifications.search');
        
    Route::post('/', [PMNotificationController::class, 'store'])
        ->name('web.automates.notifications.store');

    Route::put('/{id}', [PMNotificationController::class, 'update'])
        ->name('web.automates.notifications.update');
    
    Route::delete('/{id}', [PMNotificationController::class, 'destroy'])
        ->name('web.automates.notifications.destroy');

});