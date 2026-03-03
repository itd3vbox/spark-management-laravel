<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\AutomateScheduler;

class AutomateSchedulerAutomate extends Model
{
    use HasFactory;

    protected $table = 'automates_scheduler_automates';

    public function automateSchedulers()
    {
        return $this->belongsToMany(AutomateScheduler::class, 'automates_scheduler_automates', 'automate_id', 'automate_scheduler_id');
    }
}
