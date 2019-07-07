export default {
  initSeller ({commit}, seller) {
    console.log('init Seller action...')
    commit('initSeller', {seller})
  },

  initGoods({commit}, goods) {
    console.log('init Goods action...')
    commit('initGoods', {goods})
  },

  setSelFood({commit}, {index, food}) {
    console.log(`action...${index}...`)
    console.log(food)

    commit('setSelFood', {index, food})
  },

  removeSelFood({commit}, {index, food}) {
    commit('removeSelFood', {index, food})
  }
}