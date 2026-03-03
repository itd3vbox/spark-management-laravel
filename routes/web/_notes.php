<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\NoteController;
use App\Http\Middleware\AuthSpace;

Route::prefix('notes')->middleware([AuthSpace::class])->group(function () {

    Route::get('/', [NoteController::class, 'index'])
        ->name('web.notes.index');

    Route::get('/{id}', [NoteController::class, 'show'])
        ->name('web.notes.show');

    Route::post('/search', [NoteController::class, 'search'])
        ->name('web.notes.search');

    Route::post('/', [NoteController::class, 'store'])
        ->name('web.notes.store');

    Route::put('/{id}', [NoteController::class, 'update'])
        ->name('web.notes.update');
    
    Route::delete('/{id}', [NoteController::class, 'destroy'])
        ->name('web.notes.destroy');

    Route::patch('/{id}/status', [NoteController::class, 'updateStatus'])
        ->name('web.notes.update-status');
        
    Route::patch('/{id}/image', [NoteController::class, 'updateImage'])
        ->name('web.notes.update-image');

    Route::patch('/{id}/description-short', [NoteController::class, 'updateDescriptionShort'])
        ->name('web.notes.update-description-short');
    
    Route::patch('/{id}/description', [NoteController::class, 'updateDescription'])
        ->name('web.notes.update-description');

    Route::patch('/{id}/links', [NoteController::class, 'updateLinks'])
        ->name('web.notes.update-links');
});