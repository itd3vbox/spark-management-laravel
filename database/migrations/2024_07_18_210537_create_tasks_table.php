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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('title')->nullable();
            $table->integer('status')->default(0);
            $table->string('description_short')->nullable();
            $table->json('description')->nullable();
            $table->string('image')->nullable();
            $table->json('links')->nullable();
            $table->json('keywords')->nullable();
            
            $table->foreignId('project_id')
                ->constrained('projects')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
