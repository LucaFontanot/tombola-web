// Composables
import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'view/:id',
        name: 'Tabbellone',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Tabellone.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
