<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;

class SearchIndex extends Model
{
    protected $table = 'search_index';

    protected $fillable = [
        'type',
        'model_id',
        'title',
        'content',
        'url',
        'image',
        'popularity',
        'status',
    ];
}
