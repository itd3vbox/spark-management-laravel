<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\SettingsController;
use App\Http\Middleware\AuthSpace;

Route::prefix('settings')->middleware([AuthSpace::class])->group(function () {

    // Route::put('/', [SettingsController::class, 'update'])
    //     ->name('web.settings.update');

    Route::get('/', [SettingsController::class, 'index'])
        ->name('web.settings.index');
    
    Route::put('/', [SettingsController::class, 'update'])
        ->name('web.settings.update');
        
    Route::patch('/avatar', [SettingsController::class, 'updateAvatar'])
        ->name('web.settings.update-avatar');

    Route::patch('/email', [SettingsController::class, 'updateEmail'])
        ->name('web.settings.update-email');
    
    Route::patch('/password', [SettingsController::class, 'updatePassword'])
        ->name('web.settings.update-password');

});