<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\AgendaEvent;

class AgendaNote extends Model
{
    use HasFactory;

    protected $table = 'agenda_events_tasks';

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [

    ];

        public function agendaEvents()
    {
        return $this->belongsToMany(
            AgendaEvent::class,
            'agenda_event_task',
            'task_id',
            'event_id'
        );
    }


}
