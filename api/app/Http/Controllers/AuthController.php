<?php
//app/http/controllers/authcontroller.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use GraphQL\Error\UserError;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('api-token')->plainTextToken,
        ]);
    }
    
    public function login($root, array $args, $context)
    {
        // Try to find the user by email
        $user = User::where('email', $args['email'])->first();
    
        // Check if user exists and password is correct
        if (!$user) {
            throw new UserError('User not found');
        }
    
        if (!Hash::check($args['password'], $user->password)) {
            throw new UserError('Incorrect password');
        }
    
        // Generate a new token for the authenticated user
        $token = $user->createToken('auth-token')->plainTextToken;
    
        return [
            'token' => $token,
            'user' => $user,
        ];
    }
    
}
