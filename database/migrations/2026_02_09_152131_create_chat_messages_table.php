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
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();

            $table->integer('status')->default(0);
            $table->text('content');
            
            $table->unsignedBigInteger('user_from_id');
            $table->foreign('user_from_id')
                ->references('id')
                ->onDelete('cascade')
                ->on('users');

            $table->unsignedBigInteger('user_to_id')->nullable();
            $table->foreign('user_to_id')
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
        Schema::dropIfExists('chat_messages');
    }
};
