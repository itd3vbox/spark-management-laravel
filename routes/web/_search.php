<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\SearchController;
use App\Http\Middleware\AuthSpace;

Route::prefix('search')
    ->middleware([AuthSpace::class])
    ->group(function () {

    Route::post('/search', [SearchController::class, 'search'])
        ->name('web.search.search');
    
});