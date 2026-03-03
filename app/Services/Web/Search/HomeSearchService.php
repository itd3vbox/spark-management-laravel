<?php

namespace App\Services\Web\Search;

use App\Models\Base\Project as ProjectEntity;
use Illuminate\Support\Facades\DB;

class HomeSearchService
{
    public function searchProjectsData(array $options)
    {
        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
        ], $options);

        $orderDirection = $options['is_asc'] ? 'asc' : 'desc';

        $query = ProjectEntity::query()
            ->select('projects.id', 'projects.name', 'projects.image')

            // Total tasks
            ->withCount('tasks')

            // Tasks done (status = 1)
            ->withCount([
                'tasks as tasks_done_count' => function ($q) {
                    $q->where('status', 1);
                }
            ])

            ->orderBy('updated_at', $orderDirection);

        $projects = $query->paginate($options['max']);

        // Ajouter le pourcentage
        $projects->getCollection()->transform(function ($project) {

            $total = $project->tasks_count;
            $done  = $project->tasks_done_count;

            $project->progress_percentage = $total > 0
                ? round(($done / $total) * 100, 2)
                : 0;

            return $project;
        });

        return $projects;
    }
}
