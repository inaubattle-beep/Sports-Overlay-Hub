<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_stats_and_users()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $normalUser = User::factory()->create(['role' => 'user']);

        // Normal user should be rejected (403)
        $this->actingAs($normalUser)
            ->getJson('/api/v1/admin/stats')
            ->assertStatus(403);

        // Admin user should succeed
        $response = $this->actingAs($admin)->getJson('/api/v1/admin/stats');
        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['stats', 'recent_users']);

        // Admin can update user role
        $updateRes = $this->actingAs($admin)->putJson("/api/v1/admin/users/{$normalUser->id}", [
            'role' => 'moderator',
            'status' => 'active',
        ]);

        $updateRes->assertStatus(200);
        $this->assertEquals('moderator', $normalUser->fresh()->role);
    }
}
