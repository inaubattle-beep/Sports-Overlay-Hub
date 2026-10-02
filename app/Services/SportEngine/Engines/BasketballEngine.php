<?php

namespace App\Services\SportEngine\Engines;

use App\Models\GameMatch;
use App\Services\SportEngine\Contracts\SportEngineInterface;

class BasketballEngine implements SportEngineInterface
{
    public function getSportCode(): string
    {
        return 'basketball';
    }

    public function validateEvent(GameMatch $match, array $state, string $eventType, ?int $teamId, int $value, array $metadata = []): bool
    {
        return true;
    }

    public function applyEvent(GameMatch $match, array $state, string $eventType, ?int $teamId, int $value, array $metadata = []): array
    {
        $state['home_score'] = $state['home_score'] ?? 0;
        $state['away_score'] = $state['away_score'] ?? 0;
        $state['period'] = $state['period'] ?? 'Q1';
        $state['shot_clock'] = $state['shot_clock'] ?? 24;
        $state['possession'] = $state['possession'] ?? 'HOME';
        $state['home_fouls'] = $state['home_fouls'] ?? 0;
        $state['away_fouls'] = $state['away_fouls'] ?? 0;
        $state['home_timeouts'] = $state['home_timeouts'] ?? 5;
        $state['away_timeouts'] = $state['away_timeouts'] ?? 5;

        $isHome = ($teamId && $teamId == $match->home_team_id) || ($metadata['team'] ?? '') === 'HOME';

        switch ($eventType) {
            case 'add_score':
            case 'score_points':
                if ($isHome) {
                    $state['home_score'] = max(0, $state['home_score'] + $value);
                } else {
                    $state['away_score'] = max(0, $state['away_score'] + $value);
                }
                $state['shot_clock'] = 24;
                break;
            case 'foul':
                if ($isHome) {
                    $state['home_fouls'] += 1;
                } else {
                    $state['away_fouls'] += 1;
                }
                break;
            case 'timeout':
                if ($isHome) {
                    $state['home_timeouts'] = max(0, $state['home_timeouts'] - 1);
                } else {
                    $state['away_timeouts'] = max(0, $state['away_timeouts'] - 1);
                }
                break;
            case 'toggle_possession':
                $state['possession'] = ($state['possession'] === 'HOME') ? 'AWAY' : 'HOME';
                break;
            case 'reset_shot_clock':
                $state['shot_clock'] = $value > 0 ? $value : 24;
                break;
            case 'next_period':
                $periods = ['Q1' => 'Q2', 'Q2' => 'Q3', 'Q3' => 'Q4', 'Q4' => 'OT'];
                $state['period'] = $periods[$state['period']] ?? 'OT';
                break;
        }

        return $state;
    }

    public function getAvailableActions(array $state): array
    {
        return [
            ['type' => 'score_points', 'label' => '+1 FT', 'value' => 1],
            ['type' => 'score_points', 'label' => '+2 PT', 'value' => 2],
            ['type' => 'score_points', 'label' => '+3 PT', 'value' => 3],
            ['type' => 'foul', 'label' => 'Foul'],
            ['type' => 'timeout', 'label' => 'Timeout'],
            ['type' => 'toggle_possession', 'label' => 'Possession'],
            ['type' => 'reset_shot_clock', 'label' => 'Shot Clock (24s)', 'value' => 24],
            ['type' => 'reset_shot_clock', 'label' => 'Shot Clock (14s)', 'value' => 14],
        ];
    }

    public function calculateStatistics(array $state): array
    {
        return [
            'total_points' => ($state['home_score'] ?? 0) + ($state['away_score'] ?? 0),
            'total_fouls' => ($state['home_fouls'] ?? 0) + ($state['away_fouls'] ?? 0),
        ];
    }
}
