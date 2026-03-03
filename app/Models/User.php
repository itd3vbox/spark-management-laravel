<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Base\Task;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'total_tasks',
        'total_projects',
        'days_since_joined',
        'avatar_info',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'tasks_users');
    }

    public function projects()
    {
        return $this->tasks()->with('project')->get()->pluck('project')->unique('id');
    }

    public function getTotalTasksAttribute()
    {
        return $this->tasks()->count();
    }

    public function getTotalProjectsAttribute()
    {
        return $this->projects()->count();
    }

    public function getDaysSinceJoinedAttribute()
    {
        return round(Carbon::parse($this->created_at)->diffInDays(now())) . ' Days';
    }

    public function getAvatarInfoAttribute()
    {
        if ($this->avatar) 
        {
            $basePath = 'storage/' . $this->folder;
    
            return [
                'path' => asset($basePath . '/' . $this->avatar),
                'name' => $this->avatar,
            ];
        }

        return [
            'path' => asset('images/avatar.png'),
            'name' => $this->avatar,
        ];
    }

}
