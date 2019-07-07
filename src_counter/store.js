/*
  vuex 核心管理模块 store
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {  //初始化状态
  count: 0
}

const mutations = {
  increment_m(state) {
    state.count++
  },
  decrement_m(state) {
    state.count--
  }
}

const actions = {
  increment({commit}){
    commit('increment_m')
  },
  decrement({commit}){
    commit('decrement_m')
  },
  incrementIfOdd({commit, state}){
    if (state.count % 2  == 1){
      commit('increment_m')
    }
  }
}

const getters = {
  evenOrOdd(state) {
    return state.count % 2 ===0 ? '偶数': '奇数'
  }
}

export default new Vuex.Store({
  state,  //状态对象
  mutations, //包含多个更新state函数的对象
  actions, //包含多个对应事件回调函数的对象
  getters  //包含多个getter计算属性的对象
})