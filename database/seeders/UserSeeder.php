<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['ADMIN', 'GUEST', 'DEVELOPER', 'GRAPHIST'];

        for ($i = 1; $i <= 10; $i++) 
        {
            $folder = 'user-' . now()->format('YmdHis') . '-' . $i;

            $user = User::create([
                'name' => 'User ' . $i,
                'email' => 'user' . $i . '@sm.demo',
                'password' => bcrypt('123456'), 
                'roles' => $i === 1 ? json_encode(['ADMIN']) : json_encode([$roles[array_rand($roles)]]),
                'username' => 'user' . $i,
                'avatar' => null,
            ]);

            $folder = 'user-' . $user->id . '-' . now()->format('YmdHis');

            $user->update(['folder' => $folder]);

            Storage::disk('private')->makeDirectory($folder);
            Storage::disk('public')->makeDirectory($folder);
        }
    }
}
