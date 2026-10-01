<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coin_package_id',
        'gateway',
        'transaction_id',
        'amount',
        'currency',
        'status',
        'gateway_payload',
    ];

    protected $casts = [
        'gateway_payload' => 'array',
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(CoinPackage::class, 'coin_package_id');
    }
}
