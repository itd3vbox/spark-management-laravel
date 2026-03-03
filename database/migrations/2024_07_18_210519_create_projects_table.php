<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('name')->nullable();
            $table->string('description_short')->nullable();
            $table->json('description')->nullable();
            $table->integer('status')->default(0);
            $table->string('folder')->nullable();
            $table->string('image')->nullable();
            $table->json('keywords')->nullable();
            $table->json('links')->nullable();
            $table->string('website')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
