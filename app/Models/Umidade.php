<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Umidade extends Model
{
    protected $table = 'umidades';
    
    protected $fillable = [
        'valor'
    ];
    
    protected $casts = [
        'valor' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}
