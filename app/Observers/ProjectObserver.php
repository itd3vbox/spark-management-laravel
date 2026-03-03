<?php

namespace App\Observers;

use App\Models\Base\Project;
use App\Models\Base\SearchIndex;

class ProjectObserver
{
    /**
     * Handle the Project "saved" project.
     */
    public function saved(Project $project): void
    {
        SearchIndex::updateOrCreate(
            [
                'type' => 'project',
                'model_id' => $project->id,
            ],
            [
                'title' => $project->name,
                'content' => implode(' ', [
                    $project->name,
                    strip_tags($project->description_short),
                    strip_tags($project->description ?? ''),
                ]),
                'url' => route('web.projects.show', $project->id),
                'image' => $project->image_info['path'],
                'status' => $project->status == 1,
            ]
        );
    }

    /**
     * Handle the Project "created" project.
     */
    public function created(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "updated" project.
     */
    public function updated(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "deleted" project.
     */
    public function deleted(Project $project): void
    {
        SearchIndex::where('type', 'project')
            ->where('model_id', $project->id)
            ->delete();
    }

    /**
     * Handle the Project "restored" project.
     */
    public function restored(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "force deleted" project.
     */
    public function forceDeleted(Project $project): void
    {
        //
    }
}
