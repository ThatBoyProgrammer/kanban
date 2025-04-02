<?php

namespace App\GraphQL\Queries;

use App\Models\Task;
use Illuminate\Validation\ValidationException;

class Tasks
{
    public function __invoke($root, array $args)
    {
        try {
            $userId = $args['user_id'] ?? auth()->id();
            
            if (!$userId) {
                throw ValidationException::withMessages([
                    'auth' => ['You must be logged in to view tasks']
                ]);
            }

            return Task::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'tasks' => ['Failed to fetch tasks: ' . $e->getMessage()]
            ]);
        }
    }
}