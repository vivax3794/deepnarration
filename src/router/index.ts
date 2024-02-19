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
      // {
      //   path: "/story",
      //   component: () => import("@/views/Story.vue"),
      // },
      {
        path: "/faceSwap",
        component: () => import("@/views/FaceSwap.vue"),
      },
      {
        path: "/faceSwapImage",
        component: () => import("@/views/FaceSwapImage.vue"),
      },
      {
        path: "/similarImages",
        component: () => import("@/views/SimilarImages.vue"),
      },
      {
        path: "/outpaintImage",
        component: () => import("@/views/OutpaintImage.vue"),
      },
      {
        path: "/hologram",
        component: () => import("@/views/Hologram.vue"),
      },
      {
        path: "/parallax",
        component: () => import("@/views/Parallax.vue"),
      },
      {
        path: "/logoEmerge",
        component: () => import("@/views/LogoEmerge.vue"),
      },
      {
        path: "/transparentGif",
        component: () => import("@/views/TransparentGif.vue"),
      },
      {
        path: "/createImage",
        component: () => import("@/views/CreateImage.vue"),
      },
      {
        path: "/rethemeImage",
        component: () => import("@/views/RethemeImage.vue"),
      },
      {
        path: "/VideoBackgroundRemoval",
        component: () => import('@/views/VideoBackgroundRemoval.vue')
      },
      {
        path: "/ImageBackgroundRemoval",
        component: () => import('@/views/ImageBackgroundRemoval.vue')
      },
      {
        path: "/CombineImages",
        component: () => import('@/views/CombineImages.vue')
      },
      {
        path: "/user",
        component: () => import("@/views/user.vue"),
      },
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
