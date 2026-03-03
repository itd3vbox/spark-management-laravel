<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use App\Models\Base\Automate;
use App\Observers\AutomateObserver;
use App\Models\Base\Note;
use App\Observers\NoteObserver;
use App\Models\Base\Project;
use App\Observers\ProjectObserver;
use App\Models\Base\Task;
use App\Observers\TaskObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
        Automate::observe(AutomateObserver::class);
        Note::observe(NoteObserver::class);
        Project::observe(ProjectObserver::class);
        Task::observe(TaskObserver::class);
    }
}
