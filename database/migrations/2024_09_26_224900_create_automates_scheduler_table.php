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
        Schema::create('automates_scheduler', function (Blueprint $table) {
            $table->id();

            $table->integer('status')->default(0);
            $table->dateTime('exec_date')->nullable(); 
            $table->string('description_short')->nullable();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->onDelete('cascade');

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')
                ->references('id')
                ->onDelete('cascade')
                ->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('automates_scheduler');
    }
};
