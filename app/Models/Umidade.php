<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Umidade extends Model
{
    protected $table = 'umidades';
    
    protected $fillable = [
        'node_id',
        'valor',
        'rssi',
        'limite'
    ];
    
    protected $casts = [
        'valor' => 'integer',
        'rssi' => 'integer',
        'limite' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}
