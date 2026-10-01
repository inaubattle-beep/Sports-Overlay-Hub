<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTemplatePurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'scoreboard_template_id',
        'price_paid',
        'transaction_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(ScoreboardTemplate::class, 'scoreboard_template_id');
    }
}
