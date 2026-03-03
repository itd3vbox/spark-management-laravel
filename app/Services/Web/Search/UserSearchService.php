<?php

namespace App\Services\Web\Search;

use App\Models\User as UserEntity;

class UserSearchService
{
    /**
     * Search and filter based on the given options.
     *
     * @param array $options
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function searchAll(array $options)
    {
        $options = array_merge([
            'is_asc' => false,
            'max' => 20,
            'keywords' => null,
            'secure' => true,
        ], $options);

        $query = UserEntity::query();

        // Sélectionne uniquement les colonnes safe
        $query->select('id', 'name', 'email', 'roles', 'username', 'last_ip', 'folder', 'avatar', 'email_verified_at', 'created_at', 'updated_at');

        if (!is_null($options['keywords'])) {
            $keywords = preg_split('/\s+/', $options['keywords']);

            foreach ($keywords as $keyword) {
                $query->where(function($q) use ($keyword) {
                    $q->where('id', 'like', "%{$keyword}%")
                    ->orWhere('name', 'like', "%{$keyword}%")
                    ->orWhere('username', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%");
                });
            }
        }

        $orderDirection = $options['is_asc'] ? 'asc' : 'desc';
        $query->orderBy('updated_at', $orderDirection);

        return $query->paginate($options['max']);
    }



    public function searchOne($id)
    {
        if (!isset($id)) {
            throw new \InvalidArgumentException('id is required');
        }

        // Sélectionner tous les champs sauf email_verified_at, password et remember_token
        $user = UserEntity::where('id', $id)
            ->select([
                'id',
                'name',
                'username',
                'email',
                'roles',
                'last_ip',
                'folder',
                'avatar',
                'created_at',
                'updated_at'
            ])
            ->firstOrFail();

        return $user;
    }

}
