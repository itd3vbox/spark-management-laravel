<?php

namespace App\Services\Web\Search;

use App\Models\Base\ChatMessage as ChatMessageEntity;

class ChatMessageSearchService
{
    public function searchAll(array $options)
    {
        $options = array_merge([
            'is_asc' => false,
            'max' => 50,       // récupérer les 50 derniers messages par défaut
            'status' => null,
            'keywords' => null, 
        ], $options);

        $query = ChatMessageEntity::with('userFrom', 'userTo'); // précharge les relations

        if (!is_null($options['status'])) {
            $query->where('status', $options['status']);
        }

        if (!is_null($options['keywords'])) {
            $keywords = preg_split('/\s+/', $options['keywords']);

            foreach ($keywords as $keyword) {
                $query->where(function($q) use ($keyword) {
                    $q->where('id', 'like', "%{$keyword}%")
                      ->orWhere('content', 'like', "%{$keyword}%");
                });
            }
        }

        $orderDirection = $options['is_asc'] ? 'asc' : 'desc';
        $query->orderBy('updated_at', $orderDirection);

        $paginator = $query->paginate($options['max']);

        // Transformer les messages pour inclure les infos utilisateurs
        $paginator->getCollection()->transform(function ($message) {
            return [
                'id' => $message->id,
                'content' => $message->content,
                'status' => $message->status,
                'created_at' => $message->created_at,
                'updated_at' => $message->updated_at,
                'user_from' => [
                    'id' => $message->userFrom->id,
                    'username' => $message->userFrom->username,
                    'folder' => $message->userFrom->folder,
                    'avatar_info' => $message->userFrom->avatarInfo,
                    'roles' => $message->userFrom->roles,
                ],
                'user_to' => $message->userTo ? [
                    'id' => $message->userTo->id,
                    'username' => $message->userTo->username,
                    'folder' => $message->userTo->folder,
                    'avatar_info' => $message->userTo->avatarInfo,
                    'roles' => $message->userTo->roles,
                ] : null,
            ];
        });

        return $paginator;
    }
}