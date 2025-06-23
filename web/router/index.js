import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue' // Предполагаем, что Home.vue лежит в src/views
import Registration from '@/views/Registration.vue';
import Login from '@/views/Login.vue';
import HowItWorks from '../views/HowItWorks.vue';
import Contacts from '../views/Contacts.vue';
import Analytics from '../views/Analytics.vue';
import Profile from '@/views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/how-it-works',
    name: 'HowItWorks',
    component: HowItWorks,
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
  },
  {
  path: '/analytics',
  name: 'Analytics',
  component: Analytics,
  meta: { requiresAuth: true }  // защита авторизацией
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } // доступ только после входа
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})


export default router

