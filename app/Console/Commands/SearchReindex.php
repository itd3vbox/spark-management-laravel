<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Base\Automate;
use App\Models\Base\Note;
use App\Models\Base\Project;
use App\Models\Base\Task;
use App\Models\Base\SearchIndex;

class SearchReindex extends Command
{
    protected $signature = 'search:reindex';
    protected $description = 'Reindex all searchable models into search_index table';

    public function handle()
    {
        $this->info('Deleting old search index...');
        SearchIndex::truncate();

        $models = [
            'Automate' => [Automate::class, true],
            'Note' => [Note::class, false], // ❌ pas de status
            'Project' => [Project::class, true],
            'Task' => [Task::class, true],
        ];

        foreach ($models as $label => [$model, $hasStatus]) {

            $query = $model::query();

            if ($hasStatus) {
                $query->where('status', 1);
            }

            $count = $query->count();
            $this->info("Reindexing {$label} ({$count})...");

            if ($count === 0) {
                continue;
            }

            $query->chunk(100, function ($items) {
                foreach ($items as $item) {
                    $item->touch(); // déclenche l'observer
                }
            });
        }

        $this->info('Reindexing completed successfully ✅');
    }
}
