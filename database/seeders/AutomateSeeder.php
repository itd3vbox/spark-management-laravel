<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Base\Automate;
use App\Models\Base\Project;
use Illuminate\Support\Str;

class AutomateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::first();
        $projectId = $project ? $project->id : null;

        $automates = [
            [
                'name' => 'Doc Generator',
                'type' => 'Script',
                'description_short' => 'Generates documentation',
                'description' => json_encode(['en' => 'Generates documentation for the project', 'fr' => 'Génère de la documentation pour le projet']),
                'command' => '/automates/doc-generator/automate.sh',
                'folder' => 'automate-' . now()->format('YmdHis'),
                'status' => 1,
                'project_id' => $projectId,
            ],
        ];

        foreach ($automates as $automateData) {
            $automate = new Automate();

            $automate->name = $automateData['name'];
            $automate->type = $automateData['type'];
            $automate->description_short = $automateData['description_short'];
            $automate->description = $automateData['description'];
            $automate->command = $automateData['command'];
            $automate->folder = $automateData['folder'];
            $automate->status = $automateData['status'];
            $automate->project_id = $automateData['project_id'];

            $automate->save();

            Storage::disk('private')->makeDirectory($automateData['folder']);
            Storage::disk('public')->makeDirectory($automateData['folder']);

            $fileName = 'output.log';
            Storage::disk('public')->put($automateData['folder'] . '/' . $fileName, 'This is a placeholder file.');
        }
    }
}
