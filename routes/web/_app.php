<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\HomeController;
use App\Http\Middleware\AuthSpace;

Route::prefix('app')->middleware([AuthSpace::class])->group(function () {

    Route::get('/main-data', [HomeController::class, 'mainData'])
        ->name('web.app.main-data');

});