import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './request'

import './assets/css/global.less'
import './assets/font/iconfont.css'
import Socket from './utils/socket_service.js'

Socket.Instance.connect()
Vue.prototype.$socket = Socket.Instance

Vue.prototype.$http = axios
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
