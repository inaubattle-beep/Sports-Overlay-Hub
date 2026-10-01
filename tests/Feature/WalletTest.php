<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Sport;
use App\Models\ScoreboardTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_template_purchase_with_coins()
    {
        $user = User::factory()->create();
        Wallet::create(['user_id' => $user->id, 'balance_coins' => 100]);

        $sport = Sport::create(['name' => 'Cricket', 'code' => 'cricket']);

        $template = ScoreboardTemplate::create([
            'sport_id' => $sport->id,
            'name' => 'Cricket Pro Overlay',
            'slug' => 'cricket-pro',
            'is_premium' => true,
            'price_coins' => 50,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/templates/purchase', [
            'template_id' => $template->id,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertEquals(50, $user->fresh('wallet')->wallet->balance_coins);
        $this->assertDatabaseHas('user_template_purchases', [
            'user_id' => $user->id,
            'scoreboard_template_id' => $template->id,
        ]);
    }
}
