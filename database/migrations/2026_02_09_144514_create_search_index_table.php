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
        Schema::create('search_index', function (Blueprint $table) {
            $table->id();

            $table->string('type');        // artist, event, ad, gallery…
            $table->unsignedBigInteger('model_id');

            $table->string('title');       // Titre principal à afficher
            $table->text('content')->nullable(); // Texte pour la recherche

            $table->string('url')->nullable();   // Lien vers la page
            $table->string('image')->nullable(); // Image de résultat

            $table->integer('popularity')->default(0); // Score / importance
            $table->boolean('status')->default(true);  // Visible ou non

            $table->index('type');
            $table->fullText(['title', 'content']); // Recherche rapide

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('search_index');
    }
};
