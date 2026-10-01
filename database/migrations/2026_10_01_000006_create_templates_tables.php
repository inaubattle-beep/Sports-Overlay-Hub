<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scoreboard_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->default('Standard');
            $table->string('aspect_ratio')->default('16:9');
            $table->integer('default_width')->default(900);
            $table->integer('default_height')->default(200);
            $table->string('preview_image')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->integer('price_coins')->default(0);
            $table->json('config_schema')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scoreboard_template_id')->constrained()->cascadeOnDelete();
            $table->string('version')->default('1.0.0');
            $table->json('assets')->nullable();
            $table->json('markup_schema')->nullable();
            $table->timestamps();
        });

        Schema::create('template_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scoreboard_template_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('file_path');
            $table->string('asset_type'); // font, image, css
            $table->timestamps();
        });

        Schema::create('template_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scoreboard_template_id')->constrained()->cascadeOnDelete();
            $table->json('custom_config')->nullable(); // user overrides for colors, fonts, logos, position
            $table->timestamps();
        });

        Schema::create('user_template_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scoreboard_template_id')->constrained()->cascadeOnDelete();
            $table->integer('price_paid');
            $table->string('transaction_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_template_purchases');
        Schema::dropIfExists('template_settings');
        Schema::dropIfExists('template_assets');
        Schema::dropIfExists('template_versions');
        Schema::dropIfExists('scoreboard_templates');
    }
};
