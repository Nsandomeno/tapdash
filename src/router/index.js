import { createRouter, createWebHistory } from "vue-router";
import Admin from "../views/Admin.vue";
import Asset from "../views/Asset.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Admin,
    },
    {
      path: '/universe',
      name: 'universe',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Universe.vue')
    },
    {
        path: '/asset/:id',
        name: 'asset',
        component: Asset,
    }
  ]
})

export default router
