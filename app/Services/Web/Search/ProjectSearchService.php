<?php

namespace App\Services\Web\Search;

use App\Models\Base\Project as ProjectEntity;

class ProjectSearchService
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
        ], $options);

        $query = ProjectEntity::query();

        if (!is_null($options['status'])) {
            $query->where('status', $options['status']);
        }

        if (!is_null($options['keywords'])) {
            $keywords = preg_split('/\s+/', $options['keywords']);

            foreach ($keywords as $keyword) {
                $query->where(function($q) use ($keyword) {
                    $q->where('id', 'like', "%{$keyword}%")
                    ->orWhere('name', 'like', "%{$keyword}%");
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
