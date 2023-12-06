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
        path: "/faceSwap",
        component: () => import("@/views/FaceSwap.vue"),
      },
      {
        path: "/similarImages",
        component: () => import("@/views/SimilarImages.vue"),
      },
      {
        path: "/outpaintImage",
        component: () => import("@/views/OutpaintImage.vue"),
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
