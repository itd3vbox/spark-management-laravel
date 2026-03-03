<?php

namespace App\Services\Web\Search;

use App\Models\Base\SearchIndex;

class SearchService
{
    /**
     * Recherche globale sur la table search_index
     *
     * @param array $options
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function searchAll(array $options) 
    {
        $options = array_merge([
            'keywords' => '',
            'type' => null, // facultatif : artist, event, ad, gallerist
            'is_asc' => false,
            'max' => 20,
        ], $options);

        $query = SearchIndex::query()
            ->where('status', 1);

        // Détection automatique du type si le mot-clé commence par un mot précis
        if (!empty($options['keywords'])) {
            $keywords = trim(strtolower($options['keywords']));
            $words = explode(' ', $keywords);
            $firstWord = $words[0];

            $mapping = [
                'automate' => 'automate',
                'automates' => 'automate',
                'note' => 'note',
                'notes' => 'note',
                'project' => 'project',
                'projects' => 'projects',
                'tasks' => 'task',
                'tasks' => 'task',
            ];

            if (count($words) === 1 && isset($mapping[$firstWord])) {
                $options['type'] = $mapping[$firstWord];
                // On peut vider le mot-clé pour ne pas le rechercher dans title/content
                $keywords = '';
            }
        }

        // Filtrer par type si fourni
        if (!empty($options['type'])) {
            $query->where('type', $options['type']);
        }

        // Recherche par mots-clés
        if (!empty($keywords)) {
            $query->where(function ($q) use ($keywords) {
                $q->where('title', 'like', "%{$keywords}%")
                ->orWhere('content', 'like', "%{$keywords}%");
            });
        }

        // Tri par date
        $query->orderBy('created_at', $options['is_asc'] ? 'asc' : 'desc');

        // Pagination
        return $query->paginate($options['max']);
    }

}
