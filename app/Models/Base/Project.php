<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'image_info',
        'status_info',
        'total_tasks',
        'completed_tasks',
        'progress',
        'date_info',
    ];

    // App\Models\Base\Project.php
    public function tasks()
    {
        return $this->hasMany(\App\Models\Base\Task::class, 'project_id');
    }


    public function getImageInfoAttribute()
    {
        if ($this->image) {
            $basePath = 'storage/' . $this->folder;
    
            return [
                'path' => asset($basePath . '/' . $this->image),
                'name' => $this->image,
            ];
        }
        return [
            'path' => asset('images/project-cube.png'),
            'name' => $this->image,
        ];
    }

    public function getStatusInfoAttribute()
    {
        $value = 0;
        $value_text = 'Suspended';

        if ($this->status === 1) 
        {
           $value = 1;
           $value_text = 'Active';
        }
        
        return [
            'value' => $value,
            'value_text' => $value_text,
        ];
    }

    public function getTotalTasksAttribute()
    {
        return $this->tasks()->count();
    }

    public function getCompletedTasksAttribute()
    {
        return $this->tasks()->where('status', 1)->count();
    }

    public function getProgressAttribute()
    {
        $total = $this->total_tasks;
        if ($total === 0) return 0;

        return round($this->completed_tasks / $total * 100);
    }

        public function getDateInfoAttribute()
    {
        return [
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d') : null,
        ];
    }
}
