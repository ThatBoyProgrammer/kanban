<?php

    namespace App\GraphQL\Mutations;

    use App\Models\Task;
    use Illuminate\Validation\ValidationException;

    class DeleteTask
    {
        public function __invoke($_, array $args)
        {
            try {
                $task = Task::findOrFail($args['id']);                           

                $task->delete();
                return $task;

            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    'task' => ['Failed to delete task: ' . $e->getMessage()]
                ]);
            }
        }
    }