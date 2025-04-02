<template>
    <section class="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div class="bg-gray-100 p-5 flex rounded-2xl shadow-lg max-w-3xl w-full">
        <div class="md:w-1/2 px-5">
          <h2 class="text-2xl font-bold text-[#002D74]">Forgot Password</h2>
          <p class="text-xs mt-4 text-[#002D74]">Enter your email to reset your password</p>
  
          <form class="mt-6" @submit.prevent="handleReset">
            <div>
              <label class="block text-gray-700 text-xs">Email Address</label>
              <input v-model="email" type="email" placeholder="Enter Email Address"
                class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-1 border focus:border-blue-500 focus:bg-white focus:outline-none" 
                required>
            </div>
  
            <button type="submit" class="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6">Reset Password</button>
          </form>
  
          <div class="text-xs flex justify-between items-center mt-3">
            <router-link to="/" class="text-blue-500 hover:underline">Back to Login</router-link>
          </div>
        </div>
  
        <div class="w-1/2 md:block hidden">
          <img src="../../public/authbackground.png" class="rounded-2xl" alt="page img">
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { gql } from '@apollo/client/core';
  import { useMutation } from '@vue/apollo-composable';
  import { ref } from 'vue';
  
  const RESET_PASSWORD_MUTATION = gql`
    mutation ResetPassword($email: String!) {
      resetPassword(email: $email) { success message }
    }
  `;
  
  export default {
    setup() {
      const email = ref('');
      const { mutate: resetPasswordMutation } = useMutation(RESET_PASSWORD_MUTATION);
  
      const handleReset = async () => {
        const { data } = await resetPasswordMutation({ email: email.value });
        if (data?.resetPassword?.success) {
          alert('Check your email for the reset link.');
        }
      };
  
      return { email, handleReset };
    }
  };
  </script>
  