<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CleanDataService;

class CleanData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clean:data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all projects, tasks, automates, and their associated directories.';

    /**
     * Execute the console command.
     */
    public function handle(CleanDataService $cleanDataServiceService)
    {
        $deletedCount = $cleanDataServiceService->deleteAllFolders();

        $this->info('All data deleted successfully.');
    }
}
