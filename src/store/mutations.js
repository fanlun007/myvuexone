export default {
  initSeller (state, {seller}) {
    state.seller = seller
  },

  initGoods(state, {goods}) {
    state.goods = goods
  },

  setSelFood(state, {index, food}) {
    state.selFoods.set(index, food)
  },

  removeSelFood(state, {index, food}) {
    if(food.count > 0) {
      state.selFoods.set(index, food)
    } else if(food.count === 0) {
      state.selFoods.delete(index)
    }
  }
}