<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class);
    }

    public function purchasedTemplates()
    {
        return $this->hasMany(UserTemplatePurchase::class);
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['superadmin', 'admin', 'super_admin']);
    }

    public function isSuperAdmin(): bool
    {
        return in_array($this->role, ['superadmin', 'super_admin']);
    }
}
