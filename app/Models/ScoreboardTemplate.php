<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoreboardTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'sport_id',
        'name',
        'slug',
        'category',
        'aspect_ratio',
        'default_width',
        'default_height',
        'preview_image',
        'is_premium',
        'price_coins',
        'config_schema',
        'is_active',
    ];

    protected $casts = [
        'config_schema' => 'array',
        'is_premium' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }
}
