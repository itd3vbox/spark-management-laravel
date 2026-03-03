<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\Project;
use App\Models\Base\Automate;

class AutomateScheduler extends Model
{
    use HasFactory;

    protected $table = 'automates_scheduler';

    public function automates()
    {
        return $this->belongsToMany(Automate::class, 'automates_scheduler_automates', 'automate_scheduler_id', 'automate_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
