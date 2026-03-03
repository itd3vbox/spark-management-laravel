<?php

namespace App\Services\Web\Search;

use App\Models\Base\AgendaEvent;
use App\Models\Base\Task;
use Carbon\Carbon;

class AgendaSearchService
{
    /**
     * Récupère tous les événements pour un mois donné
     * Si aucun mois/année fourni, prend le mois courant
     */
    public function searchAll(array $options)
    {
        $options = array_merge([
            'month' => null,
            'year'  => null,
            'is_asc' => false,
            'max'   => 20,
            'date'  => null,
            'hours' => null,
        ], $options);

        $query = AgendaEvent::query();

        // 🔹 Filtrage par date complète si fournie
        if (!empty($options['date'])) {
            $query->where('date', $options['date']);
        } else {
            // Si aucun date fournie, filtrer par mois et année
            $month = $options['month'] ?? Carbon::now()->month;
            $year  = $options['year'] ?? Carbon::now()->year;

            $start = Carbon::create($year, $month, 1)->startOfMonth();
            $end   = (clone $start)->endOfMonth();

            $query->whereBetween('date', [$start->toDateString(), $end->toDateString()]);
        }

        // 🔹 Filtrage par heure si fournie (HH:MM)
        if (!empty($options['hours'])) {
            $query->whereTime('time', '=', $options['hours']);
        }

        $orderDirection = $options['is_asc'] ? 'asc' : 'desc';
        $query->orderBy('date', $orderDirection)->orderBy('time', $orderDirection);

        return $query->paginate($options['max']);
    }

    public function searchMonthCounts(array $options)
    {
        $options = array_merge([
            'month' => null,
            'year'  => null,
            'is_asc' => true,
        ], $options);

        $month = $options['month'] ?? Carbon::now()->month;
        $year  = $options['year'] ?? Carbon::now()->year;

        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end   = (clone $start)->endOfMonth();

        // 1️⃣ Récupère les totaux groupés par date
        $eventsCounts = AgendaEvent::query()
            ->selectRaw('DATE(date) as date, COUNT(*) as total')
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('date')
            ->pluck('total', 'date'); 
            // => ['2026-01-01' => 12, '2026-01-05' => 3]

        $results = [];

        $current = $start->copy();

        // 2️⃣ Boucle sur tous les jours du mois
        while ($current->lte($end)) {

            $formattedDate = $current->toDateString();

            $results[] = [
                'date'  => $formattedDate,
                'total' => $eventsCounts[$formattedDate] ?? 0
            ];

            $current->addDay();
        }

        // 3️⃣ Tri si nécessaire
        if (!$options['is_asc']) {
            $results = array_reverse($results);
        }

        return $results;
    }

    public function searchDayCounts(array $options)
    {
        $options = array_merge([
            'date' => null,  // date exacte "2026-02-28"
            'is_asc' => true,
        ], $options);

        if (!$options['date']) {
            $options['date'] = Carbon::now()->toDateString();
        }

        $date = Carbon::parse($options['date']);
        $start = $date->copy()->startOfDay(); // 00:00:00
        $end   = $date->copy()->endOfDay();   // 23:59:59

        // 1️⃣ Récupère tous les événements du jour
        $events = AgendaEvent::query()
            ->where('date', $date->toDateString())
            ->get();

        $results = [];

        // 2️⃣ Boucle par tranche de 30 minutes
        $current = $start->copy();
        while ($current->lte($end)) {
            $next = $current->copy()->addMinutes(30);

            // Total d'événements dans ce créneau
            $total = $events->filter(function($event) use ($current, $next) {
                // 🔹 Combine date + time pour obtenir le datetime exact
                $eventTime = Carbon::parse("{$event->date} {$event->time}");
                return $eventTime->gte($current) && $eventTime->lt($next);
            })->count();

            $results[] = [
                'hours' => $current->format('H\hi\m'), // "00h00m", "00h30m", ...
                'total' => $total,
            ];

            $current = $next;
        }

        // 3️⃣ Tri si nécessaire
        if (!$options['is_asc']) {
            $results = array_reverse($results);
        }

        return $results;
    }



    /**
     * Récupère toutes les tâches liées à un événement donné pour la date précise
     */
    public function searchEventTasksAll(int $event_id)
    {
        $event = AgendaEvent::findOrFail($event_id);

        // On récupère toutes les tâches liées à cet événement
        // en filtrant par la date exacte de l'événement
        $query = Task::query()
            ->whereHas('agendaEvents', function ($q) use ($event) {
                $q->where('id', $event->id)
                  ->where('date', $event->date); // exact day
            });

        return $query->get(); // pas besoin de pagination si c'est juste pour un jour
    }
}
