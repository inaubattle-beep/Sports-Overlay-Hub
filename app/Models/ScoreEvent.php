<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoreEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'team_id',
        'event_type',
        'value',
        'previous_state',
        'new_state',
        'event_time',
        'created_by',
        'metadata',
    ];

    protected $casts = [
        'previous_state' => 'array',
        'new_state' => 'array',
        'metadata' => 'array',
    ];

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
