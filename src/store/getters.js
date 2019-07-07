const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
  itemClasses(state) {
    let result = []
    let score = Math.floor(state.seller.score * 2) / 2
    let hasDecimal = score % 1 !== 0
    let integer = Math.floor(score)
    for (let i = 0; i < integer; i++) {
      result.push(CLS_ON)
    }
    if (hasDecimal) {
      result.push(CLS_HALF)
    }
    while(result.length < LENGTH) {
      result.push(CLS_OFF)
    }
    console.log("Vuex->getter->itemClasses: " + result)
    return result;
  },

  totalPrice2(state) {
    let total = 0;
    state.selFoods.forEach(function(value){
      total += value.price * value.count;
    });
    return total;
  }
}