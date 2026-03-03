<?php

namespace App\Observers;

use App\Models\Base\Automate;
use App\Models\Base\SearchIndex;

class AutomateObserver
{
    /**
     * Handle the Automate "saved" event.
     */
    public function saved(Automate $automate): void
    {
        SearchIndex::updateOrCreate(
            [
                'type' => 'automate',
                'model_id' => $automate->id,
            ],
            [
                'title' => $automate->name,
                'content' => implode(' ', [
                    $automate->name,
                    strip_tags($automate->description_short),
                    strip_tags($automate->description ?? ''),
                ]),
                'url' => route('web.automates.show', $automate->id),
                'image' => null, // si tu n'as pas de champ image
                'status' => $automate->status === 1,
            ]
        );
    }
    
    /**
     * Handle the Automate "created" event.
     */
    public function created(Automate $automate): void
    {
        //
    }

    /**
     * Handle the Automate "updated" event.
     */
    public function updated(Automate $automate): void
    {
        //
    }

    /**
     * Handle the Automate "deleted" event.
     */
    public function deleted(Automate $automate): void
    {
        SearchIndex::where('type', 'automate')
            ->where('model_id', $automate->id)
            ->delete();
    }

    /**
     * Handle the Automate "restored" event.
     */
    public function restored(Automate $automate): void
    {
        //
    }

    /**
     * Handle the Automate "force deleted" event.
     */
    public function forceDeleted(Automate $automate): void
    {
        //
    }
}
