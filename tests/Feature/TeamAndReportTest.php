<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamAndReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_manage_teams()
    {
        $user = User::factory()->create();

        // Create Team
        $response = $this->actingAs($user)->postJson('/api/v1/teams', [
            'name' => 'Dhaka Kings',
            'short_name' => 'DKG',
            'primary_color' => '#1d4ed8',
            'secondary_color' => '#1e293b',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Dhaka Kings');

        $this->assertDatabaseHas('teams', ['name' => 'Dhaka Kings', 'user_id' => $user->id]);

        // List Teams
        $listRes = $this->actingAs($user)->getJson('/api/v1/teams');
        $listRes->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_user_can_view_reports_summary()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/reports/summary');
        $response->assertStatus(200)
            ->assertJsonStructure(['analytics', 'recent_events']);
    }
}
