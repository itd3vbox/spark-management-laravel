<?php

namespace App\Observers;

use App\Models\Base\Task;
use App\Models\Base\SearchIndex;

class TaskObserver
{
    /**
     * Handle the Task "saved" task.
     */
    public function saved(Task $task): void
    {
        SearchIndex::updateOrCreate(
            [
                'type' => 'task',
                'model_id' => $task->id,
            ],
            [
                'title' => $task->title,
                'content' => implode(' ', [
                    $task->title,
                    strip_tags($task->description_short),
                    strip_tags($task->description ?? ''),
                ]),
                'url' => route('web.tasks.show', $task->id),
                'image' => $task->image_info['path'],
                'status' => $task->status == 1,
            ]
        );
    }

    /**
     * Handle the Task "created" task.
     */
    public function created(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "updated" task.
     */
    public function updated(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "deleted" task.
     */
    public function deleted(Task $task): void
    {
        SearchIndex::where('type', 'task')
            ->where('model_id', $task->id)
            ->delete();
    }

    /**
     * Handle the Task "restored" task.
     */
    public function restored(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "force deleted" task.
     */
    public function forceDeleted(Task $task): void
    {
        //
    }
}
