import { createRouter, createWebHistory } from 'vue-router'

const getIsAuthenticated = () => {
  let token = localStorage.getItem('token') || '';
  return token!==''?true:false;
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/topMenu/Main.vue'),
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/dashboard/Main.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/Main.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/brokers',
          name: 'brokers',
          component: () => import('@/views/broker/Brokers.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/strategies',
          name: 'strategies',
          component: () => import('@/views/strategy/Main.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/order/Order.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/positions',
          name: 'positions',
          component: () => import('@/views/position/position.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/mystrategies',
          name: 'mystrategies',
          component: () => import('@/views/matrixJoiner/matrixJoiner.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/strategy_details',
          name: 'Strategy Details',
          component: () => import('@/views/sd/Main.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/videos',
          name: 'videos',
          component: () => import('@/views/video/video.vue'),
          meta: { requiresAuth: true },
        },
        
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/Main.vue')
    },
  

    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})


// Navigation guard to check if the user is authenticated

// router.beforeEach((to, from, next) => {
//   to.matched.some((record) => { 
//     return record.meta.requiresAuth
//   });
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (getIsAuthenticated()) {
//       next();
//     } else {
//       next({ name: 'login' });
//     }
//   } else {
//     next();
//   }
// });

export default router
