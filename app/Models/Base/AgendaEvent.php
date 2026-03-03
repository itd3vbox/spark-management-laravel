<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\AgendaEventTask;

class AgendaEvent extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'date', 'time', 'note'];

    public function tasks()
    {
        return $this->belongsToMany(
            AgendaEventTask::class,
            'agenda_event_task',
            'event_id',
            'task_id'
        );
    }
}

