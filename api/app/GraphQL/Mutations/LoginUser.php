<?php
    namespace App\GraphQL\Mutations;

    use App\Models\User;
    use Illuminate\Support\Facades\Hash;
    use GraphQL\Type\Definition\ResolveInfo;
    use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
    use Nuwave\Lighthouse\Exceptions\ValidationException;
    use GraphQL\Error\UserError;

    class LoginUser
    {
        public function __invoke($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
        {
            // Validate input
            if (empty($args['email']) || empty($args['password'])) {
                throw new UserError('Email and password are required.');
            }

            // Find user by email
            $user = User::where('email', $args['email'])->first();
            if (!$user) {
                throw new UserError('No profile found.');
            }

            // Check password
            if (!Hash::check($args['password'], $user->password)) {
                throw new UserError('Invalid credentials.');
            }

            // Generate token
            try {
                $token = $user->createToken('auth-token')->plainTextToken;
            } catch (\Exception $e) {
                throw new UserError('Failed to generate authentication token.');
            }

            return [
                'status' => 'success',
                'message' => 'Login successful.',
                'user' => $user,
                'token' => $token,
            ];
        }
    }
