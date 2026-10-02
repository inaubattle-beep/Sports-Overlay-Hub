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

    private function formatMatchPayload(GameMatch $match): array
    {
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

        $templateData = [
            'id' => $match->template->id ?? 1,
            'slug' => $match->template->slug ?? 'football-glossy',
            'name' => $match->template->name ?? 'Football Glossy',
        ];

        return array_merge($match->toArray(), [
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
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs'])
            ->orderBy('id', 'desc');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        } elseif ($user && !$request->has('all')) {
            $query->where('user_id', $user->id);
        }

        $matches = $query->get();

        // Fallback: If user query returned empty, fetch all matches so newly created or seeded matches are accessible
        if ($matches->isEmpty()) {
            $matches = GameMatch::with(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs'])
                ->orderBy('id', 'desc')
                ->get();
        }

        $formattedData = $matches->map(fn ($m) => $this->formatMatchPayload($m));

        return response()->json([
            'status' => 'success',
            'data' => $formattedData,
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

        $userId = $request->user()?->id ?? 1;
        $sport = Sport::findOrFail($validated['sport_id']);

        // Create Home Team
        $homeTeam = Team::create([
            'user_id' => $userId,
            'name' => $validated['home_team_name'],
            'short_name' => strtoupper($validated['home_team_short'] ?? substr($validated['home_team_name'], 0, 3)),
            'primary_color' => $validated['home_primary_color'] ?? '#2563eb',
        ]);

        // Create Away Team
        $awayTeam = Team::create([
            'user_id' => $userId,
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

        $defaultTemplateId = $validated['selected_template_id'] 
            ?? \App\Models\ScoreboardTemplate::where('sport_id', $sport->id)->value('id')
            ?? \App\Models\ScoreboardTemplate::first()?->id;

        $match = GameMatch::create([
            'sport_id' => $sport->id,
            'user_id' => $userId,
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => 'scheduled',
            'home_team_id' => $homeTeam->id,
            'away_team_id' => $awayTeam->id,
            'selected_template_id' => $defaultTemplateId,
            'current_state' => $initialState,
        ]);

        // Generate OBS overlay token
        BroadcastOutput::create([
            'match_id' => $match->id,
            'user_id' => $userId,
            'token' => Str::random(16),
            'is_active' => true,
        ]);

        $match->load(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs']);

        return response()->json([
            'status' => 'success',
            'message' => 'Match created successfully',
            'data' => $this->formatMatchPayload($match),
        ], 201);
    }

    public function show(GameMatch $match)
    {
        $match->load(['sport', 'homeTeam', 'awayTeam', 'template', 'broadcastOutputs']);

        return response()->json([
            'status' => 'success',
            'data' => $this->formatMatchPayload($match),
        ]);
    }

    public function score(Request $request, GameMatch $match)
    {
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
            'data' => $this->formatMatchPayload($updatedMatch),
        ]);
    }

    public function undo(GameMatch $match)
    {
        $updatedMatch = $this->scoreEngine->undoLastEvent($match);

        return response()->json([
            'status' => 'success',
            'message' => 'Last action undone',
            'data' => $this->formatMatchPayload($updatedMatch),
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
