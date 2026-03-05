<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Base\ChatMessage as ChatMessageEntity;

class ChatMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $to_id;
    public $from_id;

    public function __construct(?int $to_id, int $from_id)
    {
        $this->to_id = $to_id;
        $this->from_id = $from_id;
    }

    public function broadcastOn(): array
    {
        // Message privé
        if ($this->to_id) {
            return [
                new PrivateChannel('chat-message.' . $this->to_id),
            ];
        }

        // Message global
        return [
            new Channel('chat-message.global'),
        ];
    }
}