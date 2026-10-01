<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'name',
        'jersey_number',
        'position',
        'is_starter',
    ];

    protected $casts = [
        'jersey_number' => 'integer',
        'is_starter' => 'boolean',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
