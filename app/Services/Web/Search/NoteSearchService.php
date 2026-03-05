<?php

namespace App\Services\Web\Search;

use App\Models\Base\Note as NoteEntity;

class NoteSearchService
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
            'status' => null,
            'keywords' => null,
            'event_id' => null,
        ], $options);

        $query = NoteEntity::query()->with('event:id,date,time');

        if (!is_null($options['event_id'])) {
            $query->where('event_id', $options['event_id']);
        }

        if (!is_null($options['status'])) {
            $query->where('status', $options['status']);
        }

        if (!is_null($options['keywords'])) {
            $keywords = preg_split('/\s+/', $options['keywords']);

            foreach ($keywords as $keyword) {
                $query->where(function($q) use ($keyword) {
                    $q->where('id', 'like', "%{$keyword}%")
                    ->orWhere('title', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%");
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

        $project = ProjectEntity::where('id', $id)
            ->firstOrFail();

        return $project;
    }
}
