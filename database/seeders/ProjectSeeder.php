<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Base\Project;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $projects = [
            [
                'name' => 'Project Manager',
                'description_short' => 'Short description for Project Manager.',
                'description' => json_encode(['en' => 'Detailed description for Project Manager', 'fr' => 'Description détaillée pour Project Manager']),
                'status' => 1,
                'website' => 'https://www.projectone.com',
                'links' => json_encode(['github' => 'https://github.com/projectone']),
                'folder' => 'project-' . now()->format('YmdHis') . '-1',
            ],
        ];

        foreach ($projects as $projectData) 
        {
            $project = new Project();

            $project->name = $projectData['name'];
            $project->description_short = $projectData['description_short'];
            $project->description = $projectData['description'];
            $project->status = $projectData['status'];
            $project->website = $projectData['website'];
            $project->links = $projectData['links'];
            $project->folder = $projectData['folder'];

            $project->save();

            Storage::disk('private')->makeDirectory($project->folder);
            Storage::disk('public')->makeDirectory($project->folder);

            // $imageFileName = Str::random(10) . '_' . now()->format('YmdHis') . '.jpg';
            // Storage::disk('public')->put($project->folder . '/' . $imageFileName, '');
            // $project->update(['image' => $imageFileName]);
        }
    }
}
