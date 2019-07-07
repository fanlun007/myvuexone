<template>
  <div class="cartcontrol">
    <transition>
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="removeCart1">
        <span class="inner inner1 icon-remove_circle_outline"></span>
      </div>
    </transition>

    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart1"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    props:{
      food: {
        type: Object
      },
      index: {
        type: Number
      }
    },

    methods: {
      addCart(event) {
        if(!event._constructed){
          return
        }
        if(!this.food.count) {
          Vue.set(this.food, 'count', 1)
        }else {
          this.food.count++
        }
        console.log(this.food.name)
      },

      addCart1(event) {
        if(!event._constructed){
          return
        }
        if(!this.food.count) {
          Vue.set(this.food, 'count', 1)
        }else {
          this.food.count++
        }
        // let obj = {}
        // obj['index'] = this.index
        // obj['food'] = this.food
        let index = this.index
        let food = this.food
        this.$store.dispatch('setSelFood', {index, food})

        // this.$bus.emit('add', event.target);
        this.$emit('cart-add', event.target);
      },

      removeCart(event) {
        if(!event._constructed) {
          return
        }
        if(this.food.count > 0) {
          this.food.count--;
        }
      },

      removeCart1(event) {
        if(!event._constructed) {
          return
        }
        if(this.food.count > 0) {
          this.food.count--;
        }
        let index = this.index
        let food = this.food
        this.$store.dispatch('removeSelFood', {index, food})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display: inline-block
      padding: 10px 0 0 20px
      .inner
        color rgb(0,160,220)
        font-size 24px
      &.v-enter-active, &.v-leave-active
        opacity 1
        transition: all 0.4s linear
        .inner1
          transition: all 0.4s;
          opacity: 1
          transform: rotate(0deg)
      &.v-enter, &.v-leave-to   //刚进入和离开后的状态
        opacity: 0
        transform: translateX(24px)
        .inner1
          opacity: 0
          transform: rotate(270deg)
    .cart-count
      display: inline-block
      position: relative;
      line-height 12px
      font-size 14px
      left: 9px
      bottom: 6px
      color rgb(147,153,159)
    .cart-add
      display: inline-block
      position: relative
      padding: 10px 20px 0 0
      font-size 24px
      right: -20px
      color: rgb(0, 160, 220)

</style>