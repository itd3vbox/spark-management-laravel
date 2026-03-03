<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SettingsController;

Route::prefix('settings')->middleware('auth:sanctum')->group(function () {

    // Route::put('/', [SettingsController::class, 'update'])
    //     ->name('api-core.settings.update');
        
    Route::patch('/avatar', [SettingsController::class, 'updateAvatar'])
        ->name('api-core.settings.update-avatar');

    Route::patch('/email', [SettingsController::class, 'updateEmail'])
        ->name('api-core.settings.update-email');
    
    Route::patch('/password', [SettingsController::class, 'updatePassword'])
        ->name('api-core.settings.update-password');

});