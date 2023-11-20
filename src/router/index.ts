// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/MainLayout.vue'),
    children: [
      {
        path: "/",
        redirect: "/about"
      },
      {
        path: "/about",
        component: () => import("@/views/About.vue"),
      },
      {
        path: "/story",
        component: () => import("@/views/Story.vue"),
      },
      {
        path: "/comfy",
        component: () => import("@/views/Comfy.vue"),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
