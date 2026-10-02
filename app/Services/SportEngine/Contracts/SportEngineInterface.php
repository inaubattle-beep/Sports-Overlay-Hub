<?php

namespace App\Services\SportEngine\Contracts;

use App\Models\GameMatch;

interface SportEngineInterface
{
    /**
     * Get the unique code for the sport engine (e.g., 'basketball', 'soccer', 'tennis').
     */
    public function getSportCode(): string;

    /**
     * Validate if an event can be applied to the current match state.
     */
    public function validateEvent(GameMatch $match, array $state, string $eventType, ?int $teamId, int $value, array $metadata = []): bool;

    /**
     * Apply an event and return the updated match state array.
     */
    public function applyEvent(GameMatch $match, array $state, string $eventType, ?int $teamId, int $value, array $metadata = []): array;

    /**
     * Return available controller actions for the current match state.
     */
    public function getAvailableActions(array $state): array;

    /**
     * Calculate display statistics derived from current match state.
     */
    public function calculateStatistics(array $state): array;
}
