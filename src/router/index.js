import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/seller',
    name: 'SellerPage',
    component: () => import('@/views/SellerPage.vue')
  },
  {
    path: '/trend',
    name: "TrendPage",
    component: () => import('@/views/TrendPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
