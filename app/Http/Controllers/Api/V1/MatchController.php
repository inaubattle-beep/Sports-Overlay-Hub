<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\Team;
use App\Models\Sport;
use App\Models\BroadcastOutput;
use App\Models\ScoreEvent;
use App\Services\ScoreEngineService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MatchController extends Controller
{
    protected ScoreEngineService $scoreEngine;

    public function __construct(ScoreEngineService $scoreEngine)
    {
        $this->scoreEngine = $scoreEngine;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $matches = GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs'])
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $matches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sport_id' => 'required|exists:sports,id',
            'home_team_name' => 'required|string|max:255',
            'home_team_short' => 'nullable|string|max:10',
            'home_primary_color' => 'nullable|string',
            'away_team_name' => 'required|string|max:255',
            'away_team_short' => 'nullable|string|max:10',
            'away_primary_color' => 'nullable|string',
            'selected_template_id' => 'nullable|exists:scoreboard_templates,id',
        ]);

        $user = $request->user();
        $sport = Sport::findOrFail($validated['sport_id']);

        // Create Home Team
        $homeTeam = Team::create([
            'user_id' => $user->id,
            'name' => $validated['home_team_name'],
            'short_name' => strtoupper($validated['home_team_short'] ?? substr($validated['home_team_name'], 0, 3)),
            'primary_color' => $validated['home_primary_color'] ?? '#2563eb',
        ]);

        // Create Away Team
        $awayTeam = Team::create([
            'user_id' => $user->id,
            'name' => $validated['away_team_name'],
            'short_name' => strtoupper($validated['away_team_short'] ?? substr($validated['away_team_name'], 0, 3)),
            'primary_color' => $validated['away_primary_color'] ?? '#dc2626',
        ]);

        $slug = Str::slug($validated['name']) . '-' . Str::random(5);

        // Build initial state based on sport
        $initialState = [
            'sport' => $sport->code,
            'home_score' => 0,
            'away_score' => 0,
            'elapsed_seconds' => 0,
            'timer_running' => false,
            'period' => '1st Half',
            'runs' => 0,
            'wickets' => 0,
            'overs' => 0.0,
            'home_sets' => 0,
            'away_sets' => 0,
            'home_points' => 0,
            'away_points' => 0,
        ];

        $match = GameMatch::create([
            'sport_id' => $sport->id,
            'user_id' => $user->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => 'scheduled',
            'home_team_id' => $homeTeam->id,
            'away_team_id' => $awayTeam->id,
            'selected_template_id' => $validated['selected_template_id'] ?? null,
            'current_state' => $initialState,
        ]);

        // Generate OBS overlay token
        BroadcastOutput::create([
            'match_id' => $match->id,
            'user_id' => $user->id,
            'token' => Str::random(16),
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Match created successfully',
            'data' => $match->load(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs']),
        ], 201);
    }

    public function show(GameMatch $match)
    {
        $this->authorize('view', $match);

        return response()->json([
            'status' => 'success',
            'data' => $match->load(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs']),
        ]);
    }

    public function score(Request $request, GameMatch $match)
    {
        $this->authorize('controlScore', $match);

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
            'message' => 'Score updated',
            'data' => $updatedMatch,
        ]);
    }

    public function undo(GameMatch $match)
    {
        $this->authorize('controlScore', $match);

        $updatedMatch = $this->scoreEngine->undoLastEvent($match);

        return response()->json([
            'status' => 'success',
            'message' => 'Last action undone',
            'data' => $updatedMatch,
        ]);
    }

    public function events(GameMatch $match)
    {
        $events = ScoreEvent::where('match_id', $match->id)
            ->with('team')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $events,
        ]);
    }
}
