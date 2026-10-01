<?php

namespace App\Services;

use App\Models\GameMatch;
use App\Models\ScoreEvent;
use App\Models\AuditLog;
use App\Events\ScoreUpdated;
use Illuminate\Support\Facades\DB;

class ScoreEngineService
{
    /**
     * Emit a score event and compute new match state.
     */
    public function emitEvent(GameMatch $match, string $eventType, ?int $teamId = null, int $value = 1, array $metadata = []): GameMatch
    {
        $updatedMatch = DB::transaction(function () use ($match, $eventType, $teamId, $value, $metadata) {
            $prevState = $match->current_state ?? [];
            $newState = $this->calculateNextState($match, $prevState, $eventType, $teamId, $value, $metadata);

            // Calculate elapsed time
            $elapsedSeconds = $prevState['elapsed_seconds'] ?? 0;
            if (($prevState['timer_running'] ?? false) && !empty($prevState['started_at'])) {
                $elapsedSeconds += now()->diffInSeconds(\Carbon\Carbon::parse($prevState['started_at']));
            }

            // Save Immutable Event
            ScoreEvent::create([
                'match_id' => $match->id,
                'team_id' => $teamId,
                'event_type' => $eventType,
                'value' => $value,
                'previous_state' => $prevState,
                'new_state' => $newState,
                'event_time' => $elapsedSeconds,
                'created_by' => auth()->id(),
                'metadata' => $metadata,
            ]);

            // Update Match State
            $match->update([
                'current_state' => $newState,
                'status' => $newState['status'] ?? $match->status,
            ]);

            // Audit log
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'score_event_' . $eventType,
                'resource_type' => 'match',
                'resource_id' => (string)$match->id,
                'payload_before' => $prevState,
                'payload_after' => $newState,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $match->fresh(['homeTeam', 'awayTeam', 'sport', 'template', 'broadcastOutputs']);
        });

        // Broadcast Real-time WebSocket Event
        ScoreUpdated::dispatch($updatedMatch);

        return $updatedMatch;
    }

    /**
     * Undo the last score event by appending a compensating event (Immutable Ledger).
     */
    public function undoLastEvent(GameMatch $match): GameMatch
    {
        $updatedMatch = DB::transaction(function () use ($match) {
            $lastEvent = ScoreEvent::where('match_id', $match->id)
                ->where('event_type', '!=', 'score_reverted')
                ->orderBy('id', 'desc')
                ->first();

            if (!$lastEvent) {
                return $match;
            }

            $previousState = $lastEvent->previous_state;
            $currentState = $match->current_state ?? [];

            // Record Compensating Event
            ScoreEvent::create([
                'match_id' => $match->id,
                'team_id' => $lastEvent->team_id,
                'event_type' => 'score_reverted',
                'value' => -$lastEvent->value,
                'previous_state' => $currentState,
                'new_state' => $previousState,
                'event_time' => $currentState['elapsed_seconds'] ?? 0,
                'created_by' => auth()->id(),
                'metadata' => ['reverted_event_id' => $lastEvent->id, 'reverted_type' => $lastEvent->event_type],
            ]);

            // Revert state
            $match->update([
                'current_state' => $previousState,
            ]);

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'score_event_reverted',
                'resource_type' => 'match',
                'resource_id' => (string)$match->id,
                'payload_before' => $currentState,
                'payload_after' => $previousState,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $match->fresh(['homeTeam', 'awayTeam', 'sport', 'template', 'broadcastOutputs']);
        });

        ScoreUpdated::dispatch($updatedMatch);

        return $updatedMatch;
    }

    private function calculateNextState(GameMatch $match, array $state, string $eventType, ?int $teamId, int $value, array $metadata = []): array
    {
        $sportCode = $match->sport->code ?? 'football';
        $isHome = ($teamId && $teamId == $match->home_team_id);

        $state['sport'] = $sportCode;
        $playerName = $metadata['player_name'] ?? null;

        switch ($sportCode) {
            case 'gaa':
                return $this->handleGAAEvent($state, $eventType, $isHome, $value, $playerName);
            case 'cricket':
                return $this->handleCricketEvent($state, $eventType, $isHome, $value, $playerName);
            case 'volleyball':
                return $this->handleVolleyballEvent($state, $eventType, $isHome, $value, $playerName);
            case 'football':
            default:
                if (str_contains($eventType, 'gaa')) {
                    return $this->handleGAAEvent($state, $eventType, $isHome, $value, $playerName);
                }
                return $this->handleFootballEvent($state, $eventType, $isHome, $value, $playerName);
        }
    }

    private function handleFootballEvent(array $state, string $eventType, bool $isHome, int $value, ?string $playerName): array
    {
        $state['home_score'] = $state['home_score'] ?? 0;
        $state['away_score'] = $state['away_score'] ?? 0;
        $state['home_scorers'] = $state['home_scorers'] ?? ['Rahim 34\''];
        $state['away_scorers'] = $state['away_scorers'] ?? ['Karim 67\''];
        $state['elapsed_seconds'] = $state['elapsed_seconds'] ?? 0;
        $state['timer_running'] = $state['timer_running'] ?? false;
        $state['period'] = $state['period'] ?? '1st Half';

        switch ($eventType) {
            case 'home_score':
            case 'goal_home':
                $state['home_score'] = max(0, $state['home_score'] + $value);
                if ($playerName) {
                    $mins = Math.floor(($state['elapsed_seconds'] ?? 0) / 60);
                    $state['home_scorers'][] = "{$playerName} {$mins}'";
                }
                break;
            case 'away_score':
            case 'goal_away':
                $state['away_score'] = max(0, $state['away_score'] + $value);
                if ($playerName) {
                    $mins = Math.floor(($state['elapsed_seconds'] ?? 0) / 60);
                    $state['away_scorers'][] = "{$playerName} {$mins}'";
                }
                break;
            case 'timer_start':
                $state['timer_running'] = true;
                $state['started_at'] = now()->toIso8601String();
                $state['paused_at'] = null;
                $state['status'] = 'live';
                break;
            case 'timer_pause':
                if ($state['timer_running'] && !empty($state['started_at'])) {
                    $state['elapsed_seconds'] += now()->diffInSeconds(\Carbon\Carbon::parse($state['started_at']));
                }
                $state['timer_running'] = false;
                $state['paused_at'] = now()->toIso8601String();
                $state['status'] = 'paused';
                break;
            case 'timer_reset':
                $state['timer_running'] = false;
                $state['started_at'] = null;
                $state['paused_at'] = null;
                $state['elapsed_seconds'] = 0;
                $state['home_score'] = 0;
                $state['away_score'] = 0;
                $state['period'] = '1st Half';
                $state['status'] = 'scheduled';
                break;
            case 'period_change':
                $state['period'] = $state['period'] === '1st Half' ? '2nd Half' : '1st Half';
                break;
            case 'yellow_card':
                if ($isHome) {
                    $state['home_yellow_cards'] = ($state['home_yellow_cards'] ?? 0) + 1;
                } else {
                    $state['away_yellow_cards'] = ($state['away_yellow_cards'] ?? 0) + 1;
                }
                break;
            case 'red_card':
                if ($isHome) {
                    $state['home_red_cards'] = ($state['home_red_cards'] ?? 0) + 1;
                } else {
                    $state['away_red_cards'] = ($state['away_red_cards'] ?? 0) + 1;
                }
                break;
        }

        return $state;
    }

    private function handleCricketEvent(array $state, string $eventType, bool $isHome, int $value, ?string $playerName): array
    {
        $state['runs'] = $state['runs'] ?? 0;
        $state['wickets'] = $state['wickets'] ?? 0;
        $state['overs'] = $state['overs'] ?? 0.0;

        if ($playerName) {
            $state['current_batsman'] = $playerName;
        }

        switch ($eventType) {
            case 'add_run':
                $state['runs'] += $value;
                break;
            case 'add_wicket':
                $state['wickets'] = min(10, $state['wickets'] + 1);
                break;
            case 'add_over':
                $state['overs'] = round($state['overs'] + 0.1, 1);
                if (fmod($state['overs'], 1.0) >= 0.6) {
                    $state['overs'] = floor($state['overs']) + 1.0;
                }
                break;
        }

        return $state;
    }

    private function handleVolleyballEvent(array $state, string $eventType, bool $isHome, int $value, ?string $playerName): array
    {
        $state['home_sets'] = $state['home_sets'] ?? 0;
        $state['away_sets'] = $state['away_sets'] ?? 0;
        $state['home_points'] = $state['home_points'] ?? 0;
        $state['away_points'] = $state['away_points'] ?? 0;
        $state['current_set'] = $state['current_set'] ?? 1;

        if ($playerName) {
            $state['active_server'] = $playerName;
        }

        switch ($eventType) {
            case 'point_home':
                $state['home_points'] += 1;
                break;
            case 'point_away':
                $state['away_points'] += 1;
                break;
            case 'set_home':
                $state['home_sets'] += 1;
                $state['home_points'] = 0;
                $state['away_points'] = 0;
                $state['current_set'] += 1;
                break;
            case 'set_away':
                $state['away_sets'] += 1;
                $state['home_points'] = 0;
                $state['away_points'] = 0;
                $state['current_set'] += 1;
                break;
        }

        return $state;
    }

    private function handleGAAEvent(array $state, string $eventType, bool $isHome, int $value, ?string $playerName): array
    {
        $state['home_goals'] = $state['home_goals'] ?? 2;
        $state['home_points'] = $state['home_points'] ?? 10;
        $state['away_goals'] = $state['away_goals'] ?? 1;
        $state['away_points'] = $state['away_points'] ?? 14;

        switch ($eventType) {
            case 'gaa_home_goal':
                $state['home_goals'] += 1;
                break;
            case 'gaa_home_point':
                $state['home_points'] += 1;
                break;
            case 'gaa_away_goal':
                $state['away_goals'] += 1;
                break;
            case 'gaa_away_point':
                $state['away_points'] += 1;
                break;
        }

        return $state;
    }
}
