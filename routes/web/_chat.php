<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AuthSpace;
use App\Http\Controllers\Web\ChatUserController;
use App\Http\Controllers\Web\ChatMessageController;

Route::prefix('chat-messages')->middleware([AuthSpace::class, ])->group(function () {

    Route::post('/search', [ChatMessageController::class, 'search'])
        ->name('web.chat-messages.search-search');

    Route::post('/', [ChatMessageController::class, 'store'])
        ->name('web.chat-messages.store');

    Route::delete('/clear', [ChatMessageController::class, 'clear'])
        ->name('web.chat-messages.clear');

    Route::delete('/{id}', [ChatMessageController::class, 'destroy'])
        ->name('web.chat-messages.destroy');

});

