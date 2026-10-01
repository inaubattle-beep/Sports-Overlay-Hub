<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'rules_config',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'rules_config' => 'array',
        'is_active' => 'boolean',
    ];

    public function matches()
    {
        return $this->hasMany(GameMatch::class);
    }

    public function templates()
    {
        return $this->hasMany(ScoreboardTemplate::class);
    }
}
