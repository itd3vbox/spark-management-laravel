<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\HomeController;

Route::prefix('app')->middleware('auth:sanctum')->group(function () {

    Route::get('/main-data', [HomeController::class, 'mainData'])
        ->name('api-core.app.main-data');

});