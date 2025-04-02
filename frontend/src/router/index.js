import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/AppLogin.vue';
import Register from '../views/AppRegister.vue';
import TaskList from '../views/TaskList.vue';
import ForgotPassword from '../views/AppForgot.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/tasks', component: TaskList, meta: { requiresAuth: true } },
  { path: '/forgot', component: ForgotPassword}
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;