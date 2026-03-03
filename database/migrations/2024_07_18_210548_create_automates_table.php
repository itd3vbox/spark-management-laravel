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
        Schema::create('automates', function (Blueprint $table) {
            $table->id();

            $table->string('name', 255)->nullable();
            $table->string('type', 255)->nullable();
            $table->string('description_short')->nullable();
            $table->json('description')->nullable();
            $table->text('command')->nullable();
            $table->bigInteger('duration')->default(0);
            $table->dateTime('exec_date')->nullable(); 
            $table->integer('status')->default(0);
            $table->string('folder', 255)->nullable();

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
        Schema::dropIfExists('automates');
    }
};
