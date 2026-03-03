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

}
