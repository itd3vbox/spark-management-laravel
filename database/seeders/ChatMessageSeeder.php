<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Base\ChatMessage;
use App\Models\User;
use Carbon\Carbon;

class ChatMessageSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        if ($users->count() < 2) {
            $this->command->info('Not enough users to create messages.');
            return;
        }

        // Create 50 random messages
        for ($i = 0; $i < 50; $i++) {

            $userFrom = $users->random();
            $userTo = rand(0, 1) ? $users->random() : null; // Private or global message

            // Generate a random date within the last 10 days before today
            $createdAt = Carbon::today()->subDays(rand(1, 10))
                                         ->addHours(rand(0, 23))
                                         ->addMinutes(rand(0, 59))
                                         ->addSeconds(rand(0, 59));

            ChatMessage::create([
                'content' => 'Test message #' . ($i + 1),
                'user_from_id' => $userFrom->id,
                'user_to_id' => $userTo?->id, // null if global message
                'status' => 0,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }

        $this->command->info('50 messages created with dates before today.');
    }
}