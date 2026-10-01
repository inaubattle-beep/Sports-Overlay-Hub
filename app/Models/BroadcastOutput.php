<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadcastOutput extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'user_id',
        'token',
        'expires_at',
        'is_active',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
