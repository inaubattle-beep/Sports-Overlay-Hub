<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('jersey_number')->nullable();
            $table->string('position')->nullable(); // Forward, Midfielder, Defender, Goalkeeper, Batsman, Bowler
            $table->boolean('is_starter')->default(true);
            $table->timestamps();

            $table->index(['team_id', 'jersey_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
