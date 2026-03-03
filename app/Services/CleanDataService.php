<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class CleanDataService
{
    public function deleteAllFolders()
    {
        $deletedCount = 0;

        $deletedCount += $this->deleteFoldersFromDisk('public');

        $deletedCount += $this->deleteFoldersFromDisk('private');

        return $deletedCount;
    }

    protected function deleteFoldersFromDisk($disk)
    {
        $deletedCount = 0;

        $folders = Storage::disk($disk)->directories();

        foreach ($folders as $folder) {
            Storage::disk($disk)->deleteDirectory($folder);
            $deletedCount++;
        }

        return $deletedCount;
    }
}
