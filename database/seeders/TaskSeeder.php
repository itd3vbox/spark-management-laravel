<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Base\Project;
use App\Models\Base\Task;
use Illuminate\Support\Str;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param array $data
     * @return void
     */
    public function run(array $data = [])
    {
        $project = Project::first();

        if (!$project) {
            $this->command->error('No projects found.');
            return;
        }

        $tasks = [
            [
                'title' => 'Task One',
                'description_short' => 'A short description for Task One.',
                'description' => json_encode(['en' => 'Detailed description in English for Task One', 'fr' => 'Description détaillée en Français pour Task One']),
                'status' => 1,
                'links' => json_encode(['github' => 'https://github.com/taskone']),
                'project_id' => $project->id,
            ],
            [
                'title' => 'Task Two',
                'description_short' => 'A short description for Task Two.',
                'description' => json_encode(['en' => 'Detailed description in English for Task Two', 'fr' => 'Description détaillée en Français pour Task Two']),
                'status' => 2,
                'links' => json_encode(['gitlab' => 'https://gitlab.com/tasktwo']),
                'project_id' => $project->id,
            ],
        ];

        foreach ($tasks as $taskData) {
            $task = new Task();

            $task->title = $taskData['title'];
            $task->description_short = $taskData['description_short'];
            $task->description = $taskData['description'];
            $task->status = $taskData['status'];
            $task->links = $taskData['links'];
            $task->project_id = $taskData['project_id'];

            $task->save();
        }
    }
}
