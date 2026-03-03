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
        Schema::create('agenda_events_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')
                ->constrained('agenda_events')
                ->onDelete('cascade'); 
            $table->foreignId('task_id')
                ->constrained('agenda_events_tasks')
                ->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda_events_tasks');
    }
};
