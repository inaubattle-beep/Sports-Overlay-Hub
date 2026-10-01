<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::where('user_id', $request->user()->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:10',
            'primary_color' => 'nullable|string|max:10',
            'secondary_color' => 'nullable|string|max:10',
            'logo_path' => 'nullable|string|max:500',
        ]);

        $team = Team::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'short_name' => strtoupper($validated['short_name']),
            'primary_color' => $validated['primary_color'] ?? '#2563eb',
            'secondary_color' => $validated['secondary_color'] ?? '#1e293b',
            'logo_path' => $validated['logo_path'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Team created successfully',
            'data' => $team,
        ], 201);
    }

    public function update(Request $request, Team $team)
    {
        if ($team->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized team modification');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:10',
            'primary_color' => 'nullable|string|max:10',
            'secondary_color' => 'nullable|string|max:10',
            'logo_path' => 'nullable|string|max:500',
        ]);

        $team->update([
            'name' => $validated['name'],
            'short_name' => strtoupper($validated['short_name']),
            'primary_color' => $validated['primary_color'] ?? $team->primary_color,
            'secondary_color' => $validated['secondary_color'] ?? $team->secondary_color,
            'logo_path' => $validated['logo_path'] ?? $team->logo_path,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Team updated successfully',
            'data' => $team,
        ]);
    }

    public function destroy(Request $request, Team $team)
    {
        if ($team->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized team deletion');
        }

        $team->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Team deleted successfully',
        ]);
    }
}
