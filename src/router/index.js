import Vue from 'vue'
import VueRouter from 'vue-router'

//添加其他子组件

import goods from '../components/goods/goods'
import ratings from '../components/ratings/ratings'
import seller from '../components/seller/seller'


Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/',
      redirect: '/goods'
    }

  ],
  linkActiveClass: 'active'
})
