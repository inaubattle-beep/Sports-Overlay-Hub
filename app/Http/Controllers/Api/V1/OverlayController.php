<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BroadcastOutput;
use App\Models\GameMatch;
use App\Services\ScoreEngineService;
use Illuminate\Http\Request;

class OverlayController extends Controller
{
    protected ScoreEngineService $scoreEngine;

    public function __construct(ScoreEngineService $scoreEngine)
    {
        $this->scoreEngine = $scoreEngine;
    }

    private function getMatchByToken(string $token): ?GameMatch
    {
        $broadcast = BroadcastOutput::where('token', $token)
            ->where('is_active', true)
            ->first();

        if (!$broadcast) {
            return GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs'])->orderBy('id', 'desc')->first();
        }

        return GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs'])->find($broadcast->match_id);
    }

    private function formatMatchPayload(GameMatch $match, string $token): array
    {
        $state = $match->current_state ?? [];
        
        // Calculate live display timer client offset
        $elapsedSeconds = $state['elapsed_seconds'] ?? 0;
        if (($state['timer_running'] ?? false) && !empty($state['started_at'])) {
            $elapsedSeconds += now()->diffInSeconds(\Carbon\Carbon::parse($state['started_at']));
        }
        $state['current_elapsed_seconds'] = $elapsedSeconds;

        $homeTeamData = [
            'id' => $match->home_team_id,
            'name' => $match->homeTeam->name ?? 'HOME',
            'short_name' => $match->homeTeam->short_name ?? 'HOM',
            'primary_color' => $match->homeTeam->primary_color ?? '#2563eb',
            'color' => $match->homeTeam->primary_color ?? '#2563eb',
        ];

        $awayTeamData = [
            'id' => $match->away_team_id,
            'name' => $match->awayTeam->name ?? 'AWAY',
            'short_name' => $match->awayTeam->short_name ?? 'AWY',
            'primary_color' => $match->awayTeam->primary_color ?? '#dc2626',
            'color' => $match->awayTeam->primary_color ?? '#dc2626',
        ];

        $templateSlug = $state['template_slug'] ?? $match->template->slug ?? 'football-glossy';

        $templateData = [
            'id' => $match->template->id ?? 1,
            'slug' => $templateSlug,
            'name' => $match->template->name ?? 'Football Glossy',
        ];

        return [
            'id' => $match->id,
            'name' => $match->name,
            'slug' => $match->slug,
            'status' => $match->status,
            'sport' => [
                'id' => $match->sport->id ?? 1,
                'code' => $match->sport->code ?? 'football',
                'name' => $match->sport->name ?? 'Football',
            ],
            'homeTeam' => $homeTeamData,
            'home_team' => $homeTeamData,
            'awayTeam' => $awayTeamData,
            'away_team' => $awayTeamData,
            'template' => $templateData,
            'broadcastOutputs' => $match->broadcastOutputs,
            'broadcast_outputs' => $match->broadcastOutputs,
            'current_state' => $state,
            'state' => $state,
        ];
    }

    public function getStateByToken(string $token)
    {
        $match = $this->getMatchByToken($token);

        if (!$match) {
            return response()->json(['status' => 'error', 'message' => 'No active match found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'match' => $this->formatMatchPayload($match, $token),
        ]);
    }

    public function scoreByToken(Request $request, string $token)
    {
        $match = $this->getMatchByToken($token);

        if (!$match) {
            return response()->json(['status' => 'error', 'message' => 'Match not found'], 404);
        }

        $validated = $request->validate([
            'event_type' => 'required|string',
            'team_id' => 'nullable|integer',
            'value' => 'nullable|integer',
            'player_name' => 'nullable|string|max:255',
        ]);

        $updatedMatch = $this->scoreEngine->emitEvent(
            $match,
            $validated['event_type'],
            $validated['team_id'] ?? null,
            $validated['value'] ?? 1,
            ['player_name' => $validated['player_name'] ?? null]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Score updated remotely',
            'data' => $this->formatMatchPayload($updatedMatch, $token),
        ]);
    }

    public function undoByToken(string $token)
    {
        $match = $this->getMatchByToken($token);

        if (!$match) {
            return response()->json(['status' => 'error', 'message' => 'Match not found'], 404);
        }

        $updatedMatch = $this->scoreEngine->undoLastEvent($match);

        return response()->json([
            'status' => 'success',
            'message' => 'Last action undone remotely',
            'data' => $this->formatMatchPayload($updatedMatch, $token),
        ]);
    }
}
