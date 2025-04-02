import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { apolloProvider } from './apollo';
import Vue3Toastify from 'vue3-toastify';
import { createPinia } from 'pinia'
import "./assets/css/tailwind.css";
import "./assets/css/tailwind-output.css";
import 'vue3-toastify/dist/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App)
    .use(router)
    .use(Vue3Toastify, {
        autoClose: 3000,
    })
    .use(apolloProvider)
    .use(createPinia())
    .mount('#app');
