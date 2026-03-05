<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\AgendaEvent;

class Note extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'status_info',
        'date_info',
    ];

    public function event()
    {
        return $this->belongsTo(AgendaEvent::class, 'event_id');
    }

    public function getStatusInfoAttribute()
    {
        $value = 0;
        $value_text = 'reset';

        if ($this->status === 1) 
        {
           $value = 1;
           $value_text = 'done';
        }

        if ($this->status === 2) 
        {
            $value = 2;
            $value_text = 'on progress';
        }
        
        return [
            'value' => $value,
            'value_text' => $value_text,
        ];
    }

    public function getDateInfoAttribute()
    {
        return [
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d') : null,
        ];
    }

    public function getEventInfoAttribute()
    {
        if ($this->event) {
            return [
                'event_id' => $this->event->id,
                'date' => $this->event->date,
                'time' => $this->event->time,
            ];
        }
        return null;
    }
}
