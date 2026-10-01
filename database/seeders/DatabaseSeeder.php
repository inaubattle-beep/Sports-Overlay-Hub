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
        $americanFootball = Sport::create(['name' => 'American Football', 'code' => 'american_football', 'icon' => 'activity', 'is_active' => true]);
        $badminton = Sport::create(['name' => 'Badminton', 'code' => 'badminton', 'icon' => 'target', 'is_active' => true]);
        $basketball = Sport::create(['name' => 'Basketball', 'code' => 'basketball', 'icon' => 'dribble', 'is_active' => true]);
        $cricket = Sport::create(['name' => 'Cricket', 'code' => 'cricket', 'icon' => 'trophy', 'is_active' => true]);
        $darts = Sport::create(['name' => 'Darts', 'code' => 'darts', 'icon' => 'target', 'is_active' => true]);
        $gaa = Sport::create(['name' => 'GAA (Gaelic Football & Hurling)', 'code' => 'gaa', 'icon' => 'shield', 'is_active' => true]);
        $padel = Sport::create(['name' => 'Padel', 'code' => 'padel', 'icon' => 'circle', 'is_active' => true]);
        $pickleball = Sport::create(['name' => 'Pickleball', 'code' => 'pickleball', 'icon' => 'circle', 'is_active' => true]);
        $pingpong = Sport::create(['name' => 'PingPong (Table Tennis)', 'code' => 'pingpong', 'icon' => 'circle', 'is_active' => true]);
        $pool = Sport::create(['name' => 'Pool & Billiards', 'code' => 'pool', 'icon' => 'circle', 'is_active' => true]);
        $rugby = Sport::create(['name' => 'Rugby (Union & League)', 'code' => 'rugby', 'icon' => 'trophy', 'is_active' => true]);
        $soccer = Sport::create(['name' => 'Soccer (Football)', 'code' => 'football', 'icon' => 'activity', 'is_active' => true]);
        $tennis = Sport::create(['name' => 'Tennis', 'code' => 'tennis', 'icon' => 'circle', 'is_active' => true]);
        $volleyball = Sport::create(['name' => 'Volleyball', 'code' => 'volleyball', 'icon' => 'target', 'is_active' => true]);

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

        // 4. Scoreboard Templates Catalog
        $templatesData = [
            ['sport_id' => $soccer->id, 'name' => 'Football Glossy 3D Broadcast', 'slug' => 'football-glossy', 'category' => 'Broadcast Metallic', 'price_coins' => 0, 'is_premium' => false],
            ['sport_id' => $soccer->id, 'name' => 'Soccer Minimal Banner', 'slug' => 'football-minimal', 'category' => 'Neon Cyber', 'price_coins' => 0, 'is_premium' => false],
            ['sport_id' => $americanFootball->id, 'name' => 'American Football Scores & Downs', 'slug' => 'american-football-pro', 'category' => 'NFL Arena', 'price_coins' => 50, 'is_premium' => true],
            ['sport_id' => $badminton->id, 'name' => 'Badminton Sets & Serves', 'slug' => 'badminton-pro', 'category' => 'Racket Sports', 'price_coins' => 35, 'is_premium' => true],
            ['sport_id' => $basketball->id, 'name' => 'Basketball Shotclock Arena', 'slug' => 'basketball-pro', 'category' => 'NBA Arena', 'price_coins' => 60, 'is_premium' => true],
            ['sport_id' => $cricket->id, 'name' => 'Cricket Pro Wickets & Overs', 'slug' => 'cricket-pro', 'category' => 'Pro League', 'price_coins' => 50, 'is_premium' => true],
            ['sport_id' => $darts->id, 'name' => 'Darts 501 Leg & Sets Scoreboard', 'slug' => 'darts-pro', 'category' => 'Pub Sports', 'price_coins' => 30, 'is_premium' => true],
            ['sport_id' => $gaa->id, 'name' => 'GAA Goals & Points Scoreboard', 'slug' => 'gaa-pro', 'category' => 'Gaelic Sports', 'price_coins' => 40, 'is_premium' => true],
            ['sport_id' => $padel->id, 'name' => 'Padel Pro Game & Set Scoreboard', 'slug' => 'padel-pro', 'category' => 'Racket Sports', 'price_coins' => 35, 'is_premium' => true],
            ['sport_id' => $pickleball->id, 'name' => 'Pickleball Points & Serve Indicator', 'slug' => 'pickleball-pro', 'category' => 'Racket Sports', 'price_coins' => 35, 'is_premium' => true],
            ['sport_id' => $pingpong->id, 'name' => 'PingPong Table Tennis Match Board', 'slug' => 'pingpong-pro', 'category' => 'Racket Sports', 'price_coins' => 30, 'is_premium' => true],
            ['sport_id' => $pool->id, 'name' => 'Pool & Billiards Frame Counter', 'slug' => 'pool-pro', 'category' => 'Cue Sports', 'price_coins' => 25, 'is_premium' => true],
            ['sport_id' => $rugby->id, 'name' => 'Rugby Union & League Tries', 'slug' => 'rugby-pro', 'category' => 'Championship', 'price_coins' => 40, 'is_premium' => true],
            ['sport_id' => $tennis->id, 'name' => 'Tennis Grand Slam Match Board', 'slug' => 'tennis-pro', 'category' => 'Grand Slam', 'price_coins' => 45, 'is_premium' => true],
            ['sport_id' => $volleyball->id, 'name' => 'Volleyball Sets & Points Scoreboard', 'slug' => 'volleyball-pro', 'category' => 'Tournament Gold', 'price_coins' => 40, 'is_premium' => true],
        ];

        $footballTemplate = null;
        foreach ($templatesData as $tData) {
            $tpl = ScoreboardTemplate::create([
                'sport_id' => $tData['sport_id'],
                'name' => $tData['name'],
                'slug' => $tData['slug'],
                'category' => $tData['category'],
                'aspect_ratio' => '16:9',
                'default_width' => 900,
                'default_height' => 200,
                'is_premium' => $tData['is_premium'],
                'price_coins' => $tData['price_coins'],
                'is_active' => true,
            ]);
            if ($tData['slug'] === 'football-glossy') {
                $footballTemplate = $tpl;
            }
        }

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
            'sport_id' => $soccer->id,
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
