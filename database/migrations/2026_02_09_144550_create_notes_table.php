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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();

            $table->string('title')->nullable();
            $table->longText('content')->nullable();

            $table->string('links')->nullable();
            $table->string('keywords')->nullable();
            
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->onDelete('cascade')
                ->on('users');

            $table->foreignId('event_id')
                ->nullable()                 
                ->constrained('agenda_events')
                ->onDelete('cascade');

      
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
