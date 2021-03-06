<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item"
              :class="{'current': currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type > 0" :class="iconClassMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="showDetailFood(food, $event)" v-for="(food,index) in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" alt=""/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span>
                    <span class="rate">好评率{{food.rating}} %</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol v-on:cart-add="cartAdd" :food="food" :index="index"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods"></shopcart>
    </div>
    <food :detailFood="detailFood" ref="food"></food>
  </div>

</template>

<script>
  import BScroll from 'better-scroll'

  import shopcart from '../shopcart/shopcart'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import food from '../food/food'

  import {mapState} from 'vuex'

  const ERR_OK = 0; //OK状态码

  export default {
    components: {
      shopcart,
      cartcontrol,
      food
    },

    data(){
      return {
        listHeight: [],
        scrollY: 0,
        detailFood: {}
      }
    },
    computed: {
      ...mapState(['seller', 'goods', 'iconClassMap']),

      currentIndex() {
        for(let i= 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },

      selectFoods() {
        let selectFoods = []
        this.goods.forEach((good,index)=>{
          good.foods.forEach((food)=>{
            if(food.count > 0) {
              selectFoods.push(food)
            }
          })
        })
        return selectFoods
      }
    },

    methods: {

      //展示商品详情页
      showDetailFood(food, event) {
        if(!event._constructed) {
          return
        }
        this.detailFood = food
        this.$refs.food.show()
      },

      selectMenu(index, event) {
        if(!event._constructed){ //better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
          return
        }
        console.log(index)
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodScroll.scrollToElement(el, 500)

      },

      _initScroll() {
        console.log("initScroll...")
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true,

        })
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });

        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));

        })
      },
      _calcHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for(let i = 0; i< foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },

      cartAdd (el) {
        // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
        this.$nextTick(() => {
          // 调用shopcart组件的drop()函数
          this.$refs['shopcart'].drop(el);
        })
      },


      getEvent(el) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(el);
        });
      }
    },

    created() {
      this.$http.get('/api/goods').then((response)=>{
        response = response.body
        if(response.errno === ERR_OK) {
          this.$store.dispatch('initGoods', response.data)
          this.$nextTick(() => {
            this._initScroll();
            this._calcHeight();
          });
        }

      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    width: 100%
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index 10
          margin-top -1px
          background: #fff
          font-weight 700
          border-left 2px solid #d9dde1
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17,27, 0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left 14px
        height:26px
        line-height 26px
        border-left: 2px solid #d9dde1
        font-size 13px
        color: rgb(147, 153,159)
        background #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom 18px
        border-1px(rgba(7, 17,27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          img
            width 57px
            height: 57px
            border-radius 5px
          flex: 0 0 57px
          margin-right:10px
        .content
          flex 1
          font-size 14px
          line-height 14px
          position: relative
          .name
            margin 2px 0 8px 0
            height: 14px
            line-height 14px
            font-size 14px
            color rgb(7,17,27)
          .desc
            margin-bottom 6px
            line-height 12px
            font-size 11px
            color: rgb(147, 153,159)
          .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153,159)
            .count
              margin-right 12px
          .price
            font-weight: 700
            line-height 24px
            margin-left -2px
            .now
              margin-right 8px
              font-size 16px
              color: rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size 10px
              color: rgb(147, 153,159)
          .cartcontrol-wrapper
            position: absolute
            bottom: 0
            right: 0
            line-height:0


</style>