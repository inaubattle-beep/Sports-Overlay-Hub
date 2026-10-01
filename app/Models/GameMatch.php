<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'sport_id',
        'user_id',
        'name',
        'slug',
        'status',
        'scheduled_at',
        'started_at',
        'ended_at',
        'home_team_id',
        'away_team_id',
        'current_state',
        'selected_template_id',
    ];

    protected $casts = [
        'current_state' => 'array',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function scoreEvents()
    {
        return $this->hasMany(ScoreEvent::class, 'match_id');
    }

    public function broadcastOutputs()
    {
        return $this->hasMany(BroadcastOutput::class, 'match_id');
    }

    public function templateSettings()
    {
        return $this->hasOne(TemplateSetting::class, 'match_id');
    }

    public function template()
    {
        return $this->belongsTo(ScoreboardTemplate::class, 'selected_template_id');
    }
}
