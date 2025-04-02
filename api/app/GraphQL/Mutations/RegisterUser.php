<?php
    namespace App\GraphQL\Mutations;

    use App\Models\User;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Support\Facades\Validator;
    use GraphQL\Error\UserError;

    class RegisterUser
    {
        public function __invoke($_, array $args)
        {
            // Validate input
            $validator = Validator::make($args, [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                throw new UserError(implode(", ", $validator->errors()->all()));
            }

            // Create user
            try {
                $user = User::create([
                    'name' => $args['name'],
                    'email' => $args['email'],
                    'password' => Hash::make($args['password']),
                ]);

                // Generate authentication token
                $token = $user->createToken('auth-token')->plainTextToken;

                return [
                    'status' => 'success',
                    'message' => 'Registration successful.',
                    'user' => $user,
                    'token' => $token,
                ];
            } catch (\Exception $e) {
                throw new UserError('Failed to register user. Please try again.');
            }
        }
    }
