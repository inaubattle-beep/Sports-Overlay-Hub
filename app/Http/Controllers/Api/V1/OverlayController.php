<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BroadcastOutput;
use App\Models\GameMatch;
use Illuminate\Http\Request;

class OverlayController extends Controller
{
    public function getStateByToken(string $token)
    {
        $broadcast = BroadcastOutput::where('token', $token)
            ->where('is_active', true)
            ->first();

        if (!$broadcast) {
            // Fallback to latest active match if token is demo or not found
            $match = GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template'])->orderBy('id', 'desc')->first();
        } else {
            $match = GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template'])->find($broadcast->match_id);
        }

        if (!$match) {
            return response()->json(['status' => 'error', 'message' => 'No active match found'], 404);
        }

        $state = $match->current_state ?? [];
        
        // Calculate live display timer client offset
        $elapsedSeconds = $state['elapsed_seconds'] ?? 0;
        if (($state['timer_running'] ?? false) && !empty($state['started_at'])) {
            $elapsedSeconds += now()->diffInSeconds(\Carbon\Carbon::parse($state['started_at']));
        }
        $state['current_elapsed_seconds'] = $elapsedSeconds;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'match' => [
                'id' => $match->id,
                'name' => $match->name,
                'status' => $match->status,
                'sport' => $match->sport->code ?? 'football',
                'homeTeam' => [
                    'name' => $match->homeTeam->name ?? 'HOME',
                    'short_name' => $match->homeTeam->short_name ?? 'HOM',
                    'color' => $match->homeTeam->primary_color ?? '#2563eb',
                ],
                'awayTeam' => [
                    'name' => $match->awayTeam->name ?? 'AWAY',
                    'short_name' => $match->awayTeam->short_name ?? 'AWY',
                    'color' => $match->awayTeam->primary_color ?? '#dc2626',
                ],
                'template' => [
                    'slug' => $match->template->slug ?? 'football-glossy',
                    'name' => $match->template->name ?? 'Football Glossy',
                ],
                'state' => $state,
            ],
        ]);
    }
}
