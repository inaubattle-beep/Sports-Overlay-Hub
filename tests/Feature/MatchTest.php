<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Sport;
use App\Models\Team;
use App\Models\GameMatch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Sport $sport;
    protected Team $homeTeam;
    protected Team $awayTeam;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->sport = Sport::create([
            'name' => 'Football',
            'code' => 'football',
        ]);
        $this->homeTeam = Team::create([
            'name' => 'Dhaka',
            'short_name' => 'DHA',
            'primary_color' => '#2563eb',
        ]);
        $this->awayTeam = Team::create([
            'name' => 'Saver',
            'short_name' => 'SAV',
            'primary_color' => '#dc2626',
        ]);
    }

    public function test_user_can_create_match()
    {
        $response = $this->actingAs($this->user)->postJson('/api/v1/matches', [
            'name' => 'Dhaka vs Saver Championship',
            'sport_id' => $this->sport->id,
            'home_team_name' => 'Dhaka',
            'away_team_name' => 'Saver',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Dhaka vs Saver Championship');

        $this->assertDatabaseHas('matches', ['name' => 'Dhaka vs Saver Championship']);
    }

    public function test_score_event_emission_and_undo()
    {
        $match = GameMatch::create([
            'sport_id' => $this->sport->id,
            'user_id' => $this->user->id,
            'name' => 'Dhaka vs Saver',
            'slug' => 'dhaka-vs-saver',
            'home_team_id' => $this->homeTeam->id,
            'away_team_id' => $this->awayTeam->id,
            'current_state' => ['home_score' => 0, 'away_score' => 0],
        ]);

        // Score Goal for Home
        $response = $this->actingAs($this->user)->postJson("/api/v1/matches/{$match->id}/score", [
            'event_type' => 'goal_home',
            'team_id' => $this->homeTeam->id,
            'value' => 1,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, $match->fresh()->current_state['home_score']);
        $this->assertDatabaseHas('score_events', ['event_type' => 'goal_home']);

        // Undo Last Action
        $undoRes = $this->actingAs($this->user)->postJson("/api/v1/matches/{$match->id}/undo");
        $undoRes->assertStatus(200);
        $this->assertEquals(0, $match->fresh()->current_state['home_score']);
    }

    public function test_public_overlay_state_and_remote_score_by_token()
    {
        $match = GameMatch::create([
            'sport_id' => $this->sport->id,
            'user_id' => $this->user->id,
            'name' => 'Public Overlay Test Match',
            'slug' => 'public-overlay-test',
            'home_team_id' => $this->homeTeam->id,
            'away_team_id' => $this->awayTeam->id,
            'current_state' => ['home_score' => 0, 'away_score' => 0],
        ]);

        $broadcast = \App\Models\BroadcastOutput::create([
            'match_id' => $match->id,
            'user_id' => $this->user->id,
            'token' => 'testtoken123',
            'is_active' => true,
        ]);

        // Get State by Token
        $stateRes = $this->getJson("/api/v1/overlay/{$broadcast->token}/state");
        $stateRes->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('match.name', 'Public Overlay Test Match');

        // Remote Score by Token
        $scoreRes = $this->postJson("/api/v1/remote/{$broadcast->token}/score", [
            'event_type' => 'goal_home',
            'team_id' => $this->homeTeam->id,
            'value' => 1,
        ]);
        $scoreRes->assertStatus(200);
        $this->assertEquals(1, $match->fresh()->current_state['home_score']);

        // Remote Undo by Token
        $undoRes = $this->postJson("/api/v1/remote/{$broadcast->token}/undo");
        $undoRes->assertStatus(200);
        $this->assertEquals(0, $match->fresh()->current_state['home_score']);
    }
}
