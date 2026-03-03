<?php

namespace App\Observers;

use App\Models\Base\Note;
use App\Models\Base\SearchIndex;

class NoteObserver
{
    /**
     * Handle the Note "saved" note.
     */
    public function saved(Note $note): void
    {
        SearchIndex::updateOrCreate(
            [
                'type' => 'note',
                'model_id' => $note->id,
            ],
            [
                'title' => $note->title,
                'content' => implode(' ', [
                    $note->title,
                    strip_tags($note->content),
                ]),
                'url' => route('web.notes.show', $note->id),
                'image' => null,
                'status' => true,
            ]
        );
    }

    /**
     * Handle the Note "created" note.
     */
    public function created(Note $note): void
    {
        //
    }

    /**
     * Handle the Note "updated" note.
     */
    public function updated(Note $note): void
    {
        //
    }

    /**
     * Handle the Note "deleted" note.
     */
    public function deleted(Note $note): void
    {
        SearchIndex::where('type', 'note')
            ->where('model_id', $note->id)
            ->delete();
    }

    /**
     * Handle the Note "restored" note.
     */
    public function restored(Note $note): void
    {
        //
    }

    /**
     * Handle the Note "force deleted" note.
     */
    public function forceDeleted(Note $note): void
    {
        //
    }
}
