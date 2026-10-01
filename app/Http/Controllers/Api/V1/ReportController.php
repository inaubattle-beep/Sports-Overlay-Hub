<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\ScoreEvent;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        $matches = GameMatch::where('user_id', $userId)->get();
        $matchIds = $matches->pluck('id');

        $totalMatches = $matches->count();
        $liveMatches = $matches->where('status', 'live')->count();
        $finishedMatches = $matches->where('status', 'finished')->count();

        $totalEvents = ScoreEvent::whereIn('match_id', $matchIds)->count();
        $totalGoals = ScoreEvent::whereIn('match_id', $matchIds)->whereIn('event_type', ['goal_home', 'goal_away', 'home_score', 'away_score'])->count();
        $totalCards = ScoreEvent::whereIn('match_id', $matchIds)->whereIn('event_type', ['yellow_card', 'red_card'])->count();

        $recentEvents = ScoreEvent::whereIn('match_id', $matchIds)
            ->with(['match', 'team'])
            ->orderBy('id', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'status' => 'success',
            'analytics' => [
                'total_matches' => $totalMatches,
                'live_matches' => $liveMatches,
                'finished_matches' => $finishedMatches,
                'total_events' => $totalEvents,
                'total_goals' => $totalGoals,
                'total_cards' => $totalCards,
            ],
            'recent_events' => $recentEvents,
        ]);
    }
}
