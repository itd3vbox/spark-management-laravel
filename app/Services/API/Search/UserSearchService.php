<?php

namespace App\Services\API\Search;

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
        ], $options);

        $query = UserEntity::query();

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

        $user = UserEntity::where('id', $id)
            ->firstOrFail();

        return $user;
    }
}
