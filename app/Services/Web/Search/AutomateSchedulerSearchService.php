<?php

namespace App\Services\Web\Search;

use App\Models\Base\AutomateScheduler as AutomateSchedulerEntity;

class AutomateSchedulerSearchService
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
            'id' => null,
        ], $options);

        $query = AutomateSchedulerEntity::query();

        $query->with(['automates', 'project']);

        if (!is_null($options['status'])) {
            $query->where('status', $options['status']);
        }

        if (!is_null($options['id'])) {
            $query->where('id', $options['id']);
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

        $automate = AutomateSchedulerEntity::where('id', $id)
            ->with(['automates', 'project'])
            ->firstOrFail();

        return $automate;
    }
}
