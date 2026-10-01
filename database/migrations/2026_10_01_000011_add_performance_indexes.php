<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->index(['user_id', 'status']);
            $table->index('sport_id');
        });

        Schema::table('score_events', function (Blueprint $table) {
            $table->index(['match_id', 'id']);
            $table->index(['match_id', 'created_at']);
        });

        Schema::table('broadcast_outputs', function (Blueprint $table) {
            $table->index(['token', 'is_active']);
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->index(['wallet_id', 'created_at']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex(['sport_id']);
        });

        Schema::table('score_events', function (Blueprint $table) {
            $table->dropIndex(['match_id', 'id']);
            $table->dropIndex(['match_id', 'created_at']);
        });

        Schema::table('broadcast_outputs', function (Blueprint $table) {
            $table->dropIndex(['token', 'is_active']);
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropIndex(['wallet_id', 'created_at']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
        });
    }
};
