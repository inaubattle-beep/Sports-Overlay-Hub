<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Sport;
use App\Models\Team;
use App\Models\GameMatch;
use App\Models\BroadcastOutput;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OverlayTest extends TestCase
{
    use RefreshDatabase;

    public function test_obs_overlay_state_can_be_retrieved_by_public_token()
    {
        $user = User::factory()->create();
        $sport = Sport::create(['name' => 'Football', 'code' => 'football']);
        $homeTeam = Team::create(['name' => 'Dhaka', 'short_name' => 'DHA', 'primary_color' => '#2563eb']);
        $awayTeam = Team::create(['name' => 'Saver', 'short_name' => 'SAV', 'primary_color' => '#dc2626']);

        $match = GameMatch::create([
            'sport_id' => $sport->id,
            'user_id' => $user->id,
            'name' => 'Dhaka vs Saver Championship',
            'slug' => 'dhaka-vs-saver-championship',
            'home_team_id' => $homeTeam->id,
            'away_team_id' => $awayTeam->id,
            'current_state' => [
                'home_score' => 2,
                'away_score' => 1,
                'elapsed_seconds' => 911,
                'period' => '1st Half',
            ],
        ]);

        $broadcast = BroadcastOutput::create([
            'match_id' => $match->id,
            'user_id' => $user->id,
            'token' => 'test_token_123',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/overlay/test_token_123/state');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('match.homeTeam.name', 'Dhaka')
            ->assertJsonPath('match.awayTeam.name', 'Saver')
            ->assertJsonPath('match.state.home_score', 2)
            ->assertJsonPath('match.state.away_score', 1);
    }
}
