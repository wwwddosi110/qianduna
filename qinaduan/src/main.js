// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index.js'
import App from './App'
import router from './router'

Vue.use(ElementUI);

import 'babel-polyfill';

// 引入 sessionStorage localStorage cookie的操作
import storage from '@/assets/js/storage.js';
Vue.prototype.storage = storage;

//时间戳过滤器
import "@/assets/js/filterTime.js";

import api from '@/api/index.js';
Vue.prototype.$api = api;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
