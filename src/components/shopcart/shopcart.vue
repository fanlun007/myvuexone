<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{seller.deliveryPrice}}</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop"
                          v-on:before-enter="beforeEnter"
                          v-on:enter="enter"
                          v-on:after-enter="afterEnter">
          <div v-for="(ball,index) in balls" v-show="ball.show" class="ball" :key=ball.bs>
            <div class="inner inner-hook" :key=ball.bs></div>
          </div>
        </transition-group>
      </div>
      <!--购物列表-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.count * food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </transition>

    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="maskHidden"></div>
    </transition>
  </div>

</template>

<script>
  import BScroll from 'better-scroll'

  import {mapState, mapGetters} from 'vuex'
  import cartControl from '../cartcontrol/cartcontrol'

  export default {
    components: {
      cartControl
    },

    data() {
      return {
        //每页最多显示5个加按钮，所以在balls中定义5个小球，用于获取5个加按钮
        balls: [
          {
            show: false,
            bs: 'a'
          },
          {
            show: false,
            bs: 'b'
          },
          {
            show: false,
            bs: 'c'
          },
          {
            show: false,
            bs: 'd'
          },
          {
            show: false,
            bs: 'e'
          }
        ],
        dropBalls: [],
        fold: true//购物车详情页折叠状态,true表示折叠
      }
    },

    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        //el元素表示小球的div，ball.el表示加按钮
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },

      toggleList() {
        if(!this.totalCount) {
          return;
        }
        this.fold = !this.fold
      },

      empty() {
        this.selectFoods.forEach( (food) => {
          food.count = 0
        })
      },

      maskHidden(){
        this.fold = !this.fold
      },

      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`); //
      }
    },

    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {price: 3, count: 3}
          ]
        }
      }
    },

    computed: {
      ...mapState(['seller', 'selFoods']),
      ...mapGetters(['totalPrice2']),

      totalPrice() {
        let total = 0;
        this.selectFoods.forEach( (food) => {
          total += food.price * food.count;
        });
        return total;
      },

      totalCount() {
        let count = 0;
        this.selectFoods.forEach( (food) => {
          count += food.count;
        })
        return count;
      },

      payDesc() {
        if(this.totalPrice === 0) {
          return `￥${this.seller.minPrice}起送`
        } else if(this.totalPrice < this.seller.minPrice){
          let diff = this.seller.minPrice - this.totalPrice
          return `还差￥${diff}起送`
        } else {
          return '去结算'
        }
      },

      payClass() {
        if(this.totalPrice < this.seller.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },

      totalPrice1() {
        console.log("----------ssssss")
        let total = 0;
        this.$store.state.selFoods.forEach(function(value){
          total += value.price * value.count;
        });
        console.log(total)
        return total;
      },

      listShow() {
        if(!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          console.log('listShow------scroll')
          this.$nextTick(() => {
            if (!this.scroll) { //如果没有better-scroll的实例则添加
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh(); //refresh计算是否需要滚动
            }
          });
        }
        return show
      },


    },

    watch: {
      selFoods: {
        deep: true,
        handler(cur, old) {
          console.log(cur, old)
        }
      },

      totalPrice1: {
        deep: true,
        handler(cur, old) {
          console.log(cur, old)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    background blueviolet
    .content
      display: flex
      background: #141d27
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius 50%
            background: #2b343c
            text-align center
            .icon-shopping_cart
              margin-left 2px
              line-height 44px
              font-size 24px
              color: #80858a
              &.highlight
                color: #fff
            &.highlight
              background rgb(0, 160, 220)
          .num
            position: absolute
            top: 0
            right: 0
            width:24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color: #fff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0,0, 0.4)

        .price
          display: inline-block
          vertical-align: top
          margin-top 12px
          line-height 24px
          box-sizing border-box
          padding-right 12px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          color: rgba(255, 255, 255, 0.4)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align top
          line-height 24px
          margin: 13.5px 0 0 12px
          color: rgba(255, 255, 255, 0.4)
          font-size 10px
          letter-spacing 1px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height:48px
          line-height 48px
          text-align center
          font-size 14px
          color rgba(255, 255, 255, 0.4)
          background: #2b333b
          letter-spacing 1px
          font-weight 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active, &.drop-leave-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        padding: 0 18px
        line-height 40px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17,27,0.1)
        .title
          float: left
          font-size 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height:217px
        background: #fff
        overflow: hidden
        .food
          position relative
          padding:12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            display: inline-block
            line-height 22px
            font-size 16px
          .price
            display: inline-block
            position: absolute
            right 90px
            top 16px
            font-size 14px
            color: #f01414
          .cartcontrol-wrapper
            position relative
            float: right
            bottom:12px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height 100%
    z-index 40
    backdrop-filter: blur(15px)
    background: rgba(7, 17, 27, 0.8)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>