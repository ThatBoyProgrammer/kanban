<?php

    namespace App\GraphQL\Mutations;

    use App\Models\Task;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Validation\ValidationException;

    class CreateTask
    {
        public function __invoke($_, array $args)
        {
            try {
                $input = $args['input'];
                
                return Task::create([
                    'title' => $input['title'],
                    'description' => $input['description'] ?? null,
                    'status' => $input['status'] ?? 'Task Ready',
                    'due_date' => $input['dueDate'] ?? null,
                    'user_id' => $input['user_id'],
                ]);

            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    'task' => ['Failed to create task: ' . $e->getMessage()]
                ]);
            }
        }
    }