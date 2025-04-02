<?php

    namespace App\GraphQL\Mutations;

    use App\Models\Task;
    use Illuminate\Validation\ValidationException;

    class UpdateTask
    {
        public function __invoke($_, array $args)
        {
            try {
                $task = Task::findOrFail($args['id']);
                
                // Verify task belongs to authenticated user
                $task->update([
                    'title' => $args['title'] ?? $task->title,
                    'description' => $args['description'] ?? $task->description,
                    'status' => $args['status'] ?? $task->status,
                    'due_date' => $args['dueDate'] ?? $task->due_date
                ]);

                return $task->fresh();

            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    'task' => ['Failed to update task: ' . $e->getMessage()]
                ]);
            }
        }
    }