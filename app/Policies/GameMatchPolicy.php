<?php

namespace App\Policies;

use App\Models\User;
use App\Models\GameMatch;

class GameMatchPolicy
{
    public function view(User $user, GameMatch $match): bool
    {
        return $user->id === $match->user_id || $user->isAdmin();
    }

    public function update(User $user, GameMatch $match): bool
    {
        return $user->id === $match->user_id || $user->isAdmin();
    }

    public function controlScore(User $user, GameMatch $match): bool
    {
        return $user->id === $match->user_id || $user->isAdmin();
    }
}
