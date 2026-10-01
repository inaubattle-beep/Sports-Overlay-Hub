<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Sport;
use App\Models\Team;
use App\Models\Player;
use App\Models\GameMatch;
use App\Models\ScoreboardTemplate;
use App\Models\Wallet;
use App\Models\CoinPackage;
use App\Models\BroadcastOutput;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@sportsoverlay.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
        Wallet::create(['user_id' => $admin->id, 'balance_coins' => 10000]);

        $user = User::create([
            'name' => 'Demo Broadcaster',
            'email' => 'user@sportsoverlay.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);
        Wallet::create(['user_id' => $user->id, 'balance_coins' => 250]);

        // 2. Sports (Multi-Sport Catalog)
        $football = Sport::create([
            'name' => 'Football / Soccer',
            'code' => 'football',
            'icon' => 'activity',
            'is_active' => true,
        ]);

        $cricket = Sport::create([
            'name' => 'Cricket',
            'code' => 'cricket',
            'icon' => 'trophy',
            'is_active' => true,
        ]);

        $volleyball = Sport::create([
            'name' => 'Volleyball & Badminton',
            'code' => 'volleyball',
            'icon' => 'target',
            'is_active' => true,
        ]);

        $basketball = Sport::create([
            'name' => 'Basketball',
            'code' => 'basketball',
            'icon' => 'dribble',
            'is_active' => true,
        ]);

        $tennis = Sport::create([
            'name' => 'Tennis / Table Tennis',
            'code' => 'tennis',
            'icon' => 'circle',
            'is_active' => true,
        ]);

        // 3. Teams & Player Rosters
        $dhaka = Team::create([
            'user_id' => $user->id,
            'name' => 'Dhaka',
            'short_name' => 'DHA',
            'primary_color' => '#2563eb', // Glossy Blue
            'secondary_color' => '#1d4ed8',
            'text_color' => '#ffffff',
        ]);
        Player::create(['team_id' => $dhaka->id, 'name' => 'Rahim', 'jersey_number' => 10, 'position' => 'Forward']);
        Player::create(['team_id' => $dhaka->id, 'name' => 'Karim', 'jersey_number' => 7, 'position' => 'Midfielder']);
        Player::create(['team_id' => $dhaka->id, 'name' => 'Sakib', 'jersey_number' => 75, 'position' => 'Captain']);

        $saver = Team::create([
            'user_id' => $user->id,
            'name' => 'Saver',
            'short_name' => 'SAV',
            'primary_color' => '#dc2626', // Glossy Red
            'secondary_color' => '#b91c1c',
            'text_color' => '#ffffff',
        ]);
        Player::create(['team_id' => $saver->id, 'name' => 'John', 'jersey_number' => 9, 'position' => 'Forward']);
        Player::create(['team_id' => $saver->id, 'name' => 'Hasan', 'jersey_number' => 11, 'position' => 'Winger']);
        Player::create(['team_id' => $saver->id, 'name' => 'Tamim', 'jersey_number' => 28, 'position' => 'Defender']);

        $chittagong = Team::create([
            'user_id' => $user->id,
            'name' => 'Chittagong',
            'short_name' => 'CTG',
            'primary_color' => '#059669',
            'secondary_color' => '#047857',
            'text_color' => '#ffffff',
        ]);

        $rajshahi = Team::create([
            'user_id' => $user->id,
            'name' => 'Rajshahi',
            'short_name' => 'RAJ',
            'primary_color' => '#d97706',
            'secondary_color' => '#b45309',
            'text_color' => '#ffffff',
        ]);

        // 4. Scoreboard Templates
        $footballTemplate = ScoreboardTemplate::create([
            'sport_id' => $football->id,
            'name' => 'Football Glossy 3D Broadcast',
            'slug' => 'football-glossy',
            'category' => 'Broadcast Metallic',
            'aspect_ratio' => '16:9',
            'default_width' => 900,
            'default_height' => 200,
            'is_premium' => false,
            'price_coins' => 0,
            'is_active' => true,
        ]);

        $footballMinimalTemplate = ScoreboardTemplate::create([
            'sport_id' => $football->id,
            'name' => 'Football Minimal Neon Banner',
            'slug' => 'football-minimal',
            'category' => 'Neon Cyber',
            'aspect_ratio' => '16:9',
            'default_width' => 900,
            'default_height' => 200,
            'is_premium' => false,
            'price_coins' => 0,
            'is_active' => true,
        ]);

        $cricketTemplate = ScoreboardTemplate::create([
            'sport_id' => $cricket->id,
            'name' => 'Cricket Pro Overlay',
            'slug' => 'cricket-pro',
            'category' => 'Pro League',
            'aspect_ratio' => '16:9',
            'default_width' => 900,
            'default_height' => 200,
            'is_premium' => true,
            'price_coins' => 50,
            'is_active' => true,
        ]);

        $volleyballTemplate = ScoreboardTemplate::create([
            'sport_id' => $volleyball->id,
            'name' => 'Volleyball Pro Set Score',
            'slug' => 'volleyball-pro',
            'category' => 'Tournament Gold',
            'aspect_ratio' => '16:9',
            'default_width' => 900,
            'default_height' => 200,
            'is_premium' => true,
            'price_coins' => 40,
            'is_active' => true,
        ]);

        $basketballTemplate = ScoreboardTemplate::create([
            'sport_id' => $basketball->id,
            'name' => 'Basketball Shotclock Arena',
            'slug' => 'basketball-pro',
            'category' => 'NBA Arena',
            'aspect_ratio' => '16:9',
            'default_width' => 900,
            'default_height' => 200,
            'is_premium' => true,
            'price_coins' => 60,
            'is_active' => true,
        ]);

        // 5. Coin Packages
        CoinPackage::create([
            'name' => 'Starter Pack',
            'coins' => 100,
            'bonus_coins' => 0,
            'price_usd' => 4.99,
            'is_popular' => false,
        ]);

        CoinPackage::create([
            'name' => 'Pro Broadcaster Pack',
            'coins' => 500,
            'bonus_coins' => 50,
            'price_usd' => 19.99,
            'is_popular' => true,
        ]);

        CoinPackage::create([
            'name' => 'Ultimate Studio Pack',
            'coins' => 1200,
            'bonus_coins' => 200,
            'price_usd' => 39.99,
            'is_popular' => false,
        ]);

        // 6. Demo Match (Dhaka 2 - 1 Saver | 911 seconds)
        $match = GameMatch::create([
            'sport_id' => $football->id,
            'user_id' => $user->id,
            'name' => 'Dhaka vs Saver Championship Final',
            'slug' => 'dhaka-vs-saver-final',
            'status' => 'live',
            'started_at' => now()->subSeconds(911),
            'home_team_id' => $dhaka->id,
            'away_team_id' => $saver->id,
            'selected_template_id' => $footballTemplate->id,
            'current_state' => [
                'sport' => 'football',
                'home_score' => 2,
                'away_score' => 1,
                'home_scorers' => ["Rahim 34'", "Karim 67'"],
                'away_scorers' => ["John 88'"],
                'elapsed_seconds' => 911,
                'timer_running' => true,
                'started_at' => now()->subSeconds(911)->toIso8601String(),
                'paused_at' => null,
                'period' => '1st Half',
                'home_red_cards' => 0,
                'away_red_cards' => 0,
                'home_yellow_cards' => 1,
                'away_yellow_cards' => 0,
            ],
        ]);

        // 7. OBS Broadcast Output Token
        BroadcastOutput::create([
            'match_id' => $match->id,
            'user_id' => $user->id,
            'token' => 'abc123demo',
            'is_active' => true,
        ]);
    }
}
