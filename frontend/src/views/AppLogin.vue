<template>
  <section class="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center">
    <div class="bg-gray-100 p-5 flex rounded-2xl shadow-lg max-w-3xl w-full">
      <div class="md:w-1/2 px-5">
        <h2 class="text-2xl font-bold text-[#002D74]">Login</h2>
        <p class="text-xs mt-4 text-[#002D74]">If you have an account, please login</p>
        
        <form class="mt-6" @submit.prevent="handleLogin">
          <div>
            <label class="block text-gray-700 text-xs">Email Address</label>
            <input v-model="email" type="email" placeholder="Enter Email Address"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-1 border focus:border-blue-500 focus:bg-white focus:outline-none" 
              required>
          </div>

          <div class="mt-4">
            <label class="block text-gray-700 text-xs">Password</label>
            <input v-model="password" type="password" placeholder="Enter Password" minlength="6"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-1 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required>
          </div>

          <div class="text-right mt-2">
            <router-link to="/forgot" class="text-xs font-semibold text-gray-700 hover:text-blue-700">Forgot Password?
            </router-link>
          </div>

          <button 
            type="submit" 
            class="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 flex justify-center items-center"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <span v-if="!loading">Log In</span>
            <span v-else> Logging in...</span>
          </button>
        </form>

        <div class="mt-7 grid grid-cols-3 items-center text-gray-500">
          <hr class="border-gray-500" />
          <p class="text-center text-xs">OR</p>
          <hr class="border-gray-500" />
        </div>

        <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-xs hover:scale-105 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FBBC05" d="M0 37V11l17 13z"/>
            <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
            <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
            <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
          </svg>
          <span class="ml-4">Login with Google</span>
        </button>

        <div class="text-xs flex justify-between items-center mt-3">
          <p>If you don't have an account...</p>
          <router-link to="/register"
            class="py-2 px-5 ml-3 bg-white border rounded-xl hover:scale-110 duration-300 border-blue-400">
            Register
          </router-link>
        </div>
      </div>

      <div class="w-1/2 md:block hidden">
        <img src="../../public/authbackground.png"
          class="rounded-2xl" alt="page img">
      </div>
    </div>
  </section>
</template>

<script>
import { gql } from '@apollo/client/core';
import { useMutation } from '@vue/apollo-composable';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
import { provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '@/apollo';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) { 
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default {
  setup() {
    provideApolloClient(apolloClient);

    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const router = useRouter();
    const { mutate: loginMutation } = useMutation(LOGIN_MUTATION);
    
    const handleLogin = async () => {
      loading.value = true;
      try {
        const { data } = await loginMutation({ email: email.value, password: password.value });
        if (data?.login?.token) {
          localStorage.setItem('userId', data.login.user.id);
          localStorage.setItem('token', data.login.token);
          toast.success("Login successful!");
          router.push('/tasks');
        } else {
          toast.error("Invalid credentials. Please try again.");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred. Please check your connection.");
      } finally {
        loading.value = false;
      }
    };

    return { email, password, handleLogin, loading };
  }
};
</script>