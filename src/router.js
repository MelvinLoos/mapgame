import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Login from './components/Pages/Login.vue';
import Register from './components/Pages/Register.vue';
import Protected from './components/Pages/Protected.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/sign-up',
      name: 'Register',
      component: Register,
    },
    {
      path: '/protected',
      name: 'Protected',
      component: Protected,
      meta: {
        requiresAuth: true,
      }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { currentUser } = firebase.auth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('protected');
  else next();
});

export default router;
