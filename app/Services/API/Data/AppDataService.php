<?php

namespace App\Services\API\Data;

use App\Models\User;
use App\Models\Base\Project;
use App\Models\Base\Task;
use App\Models\Base\Automate;

use Carbon\Carbon;

class AppDataService
{
      /**
     * Retrieve main data including counts of users, projects, tasks, and automations.
     *
     * @return array
     */
    public function getMainData(): array
    {
        $totalUsers = User::count();
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $totalAutomates = Automate::count();

        return [
            'total_users' => $totalUsers,
            'total_projects' => $totalProjects,
            'total_tasks' => $totalTasks,
            'total_automates' => $totalAutomates,
        ];
    }
}
