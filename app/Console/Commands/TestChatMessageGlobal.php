<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\ChatMessage as ChatMessageEvent;
use App\Models\Base\ChatMessage;
use App\Models\User;

class TestChatMessageGlobal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * You can call this command with:
     * php artisan test:message-global "Hello world"
     */
    protected $signature = 'test:message-global {content=Test global message}';

    /**
     * The console command description.
     */
    protected $description = 'Send a global chat message to test websocket broadcasting and save it in the database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Get a random user as the sender
        $user = User::inRandomOrder()->first();

        if (!$user) {
            $this->error('No users found. Please create at least one user.');
            return 1;
        }

        $content = $this->argument('content');

        // Create the message in the database
        $chatMessage = new ChatMessage();
        $chatMessage->content = $content;
        $chatMessage->user_from_id = $user->id;
        $chatMessage->user_to_id = null; // global message
        $chatMessage->status = 0;

        $chatMessage->save();

        // Broadcast the WebSocket event
        broadcast(new ChatMessageEvent(
            null,                 // user_to_id = null for global
            $chatMessage->user_from_id
        ));//->toOthers();

        $this->info("Global message created and broadcasted by user #{$user->id}: {$content}");

        return 0;
    }
}