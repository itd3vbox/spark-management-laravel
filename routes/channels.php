<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-message.{user_id}', function (User $user, $user_id) {
    return (int) $user->id === (int) $user_id;
});

Broadcast::channel('chat-user', function ($user) {
    return [
        'id' => $user->id,
        'username' => $user->username,
        'roles' => $user->roles,
        'avatar_info' => $user->avatar_info,
    ];
});