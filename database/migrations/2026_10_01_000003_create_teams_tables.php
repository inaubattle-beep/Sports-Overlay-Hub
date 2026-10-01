<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('short_name', 10);
            $table->string('logo_path')->nullable();
            $table->string('primary_color', 10)->default('#1e40af');
            $table->string('secondary_color', 10)->default('#1e293b');
            $table->string('text_color', 10)->default('#ffffff');
            $table->timestamps();
        });

        Schema::create('team_logos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_logos');
        Schema::dropIfExists('teams');
    }
};
