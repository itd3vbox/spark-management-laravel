<?php

namespace App\Services\Web\Data;

use App\Models\User;
use App\Models\Base\Project;
use App\Models\Base\Task;
use App\Models\Base\Automate;

class AppDataService
{
    /**
     * Retrieve main data including counts and global project progress.
     *
     * @return array
     */
    public function getMainData(): array
    {
        $totalUsers = User::count();
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $totalAutomates = Automate::count();

        // ✅ calcul du pourcentage global de progression
        $doneTasks = Task::where('status', 1)->count();

        $progressProjectTotal = $totalTasks > 0
            ? round(($doneTasks / $totalTasks) * 100, 2)
            : 0;

        return [
            'total_users' => $totalUsers,
            'total_projects' => $totalProjects,
            'total_tasks' => $totalTasks,
            'total_automates' => $totalAutomates,
            'progress_projects_total' => $progressProjectTotal, // ex: 45.44
        ];
    }
}

