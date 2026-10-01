<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(Request $request, Team $team)
    {
        if ($team->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized team player access');
        }

        return response()->json([
            'status' => 'success',
            'data' => $team->players()->orderBy('jersey_number', 'asc')->get(),
        ]);
    }

    public function store(Request $request, Team $team)
    {
        if ($team->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized player creation');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'jersey_number' => 'nullable|integer|min:0|max:99',
            'position' => 'nullable|string|max:100',
            'is_starter' => 'nullable|boolean',
        ]);

        $player = Player::create([
            'team_id' => $team->id,
            'name' => $validated['name'],
            'jersey_number' => $validated['jersey_number'] ?? null,
            'position' => $validated['position'] ?? 'Player',
            'is_starter' => $validated['is_starter'] ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Player added to team roster',
            'data' => $player,
        ], 201);
    }

    public function destroy(Request $request, Player $player)
    {
        if ($player->team->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized player deletion');
        }

        $player->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Player removed from roster',
        ]);
    }
}
