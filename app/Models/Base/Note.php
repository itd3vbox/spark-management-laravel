<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

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
