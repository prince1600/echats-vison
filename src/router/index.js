import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen',
  },
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/ScreenPage.vue')
  },
  {
    path: '/seller',
    name: 'SellerPage',
    component: () => import('@/views/SellerPage.vue')
  },
  {
    path: '/trend',
    name: "TrendPage",
    component: () => import('@/views/TrendPage.vue')
  },
  {
    path: '/map',
    name: "MapPage",
    component: () => import('@/views/MapPage.vue')
  },
  {
    path: '/rank',
    name: 'RankPage',
    component: () => import('@/views/RankPage.vue')
  },
  {
    path: '/hot',
    name: 'HotProductPage',
    component: () => import('@/views/HotProductPage.vue')
  },
  {
    path: '/stock',
    name: 'StockPage',
    component: () => import('@/views/StockPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
