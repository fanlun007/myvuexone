// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store.js'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  store,    //所有组件对象都会多一个$store属性
  template: '<App/>'
})
