// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import wx from 'weixin-js-sdk'
import Calendar from 'vue2-datepick'

import '../static/red-dragon-development.v0.0.1.css'

import conf from './config.js'
import axios from './api/axios.api'
Vue.use(Calendar);
Vue.config.productionTip = false

Vue.prototype.$conf = conf
Vue.prototype.$axios = axios
Vue.prototype.$wx = wx

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
