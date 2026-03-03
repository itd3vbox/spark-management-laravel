<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Base\Project;
use App\Models\User;

class Task extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'status_info',
        'image_info',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tasks_users', 'task_id', 'user_id');
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

    public function getImageInfoAttribute()
    {
        if ($this->image && $this->project) {
            $basePath = 'storage/' . $this->project->folder;
    
            return [
                'path' => asset($basePath . '/' . $this->image),
                'name' => $this->image,
            ];
        }
        return [
            'path' => 'https://assets.bigcartel.com/product_images/299586342/A8B52BAB-F334-4114-BA29-6A34A379A47F.jpeg?auto=format&amp;fit=max&amp;w=800',
            'name' => $this->image,
        ];
    }
}
