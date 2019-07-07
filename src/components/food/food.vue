<template>
  <transition name="move">
    <div class="food" v-show="showFlag">
      <div class="food-content">
        <div class="image-header">
          <img :src="detailFood.image" alt="">
          <div class="back" @click="closePage">
            <i class="icon-arrow_lift"></i>
          </div>

        </div>

      </div>
    </div>
  </transition>

</template>

<script>
  export default {

    props: {
      detailFood: {
        type: Object
      }
    },

    data() {
      return {
        showFlag: false
      }
    },

    methods: {
      show() {
        this.showFlag = true
      },

      closePage(){
        this.showFlag = false
      }
    },

    computed: {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  width: 100%
  z-index 30
  background: #fff
  &.move-enter-active, &.move-leave-active
    transition all 0.4s linear
  &.move-enter, &.move-leave-to
    transform translate3d(100%, 0, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top 10px
      left 10px
      background rgba(7,17,27, 0.4)
      border-radius 50px
      .icon-arrow_lift
        display: block
        position relative
        right 1px
        padding: 10px
        font-size 20px
        color: #fff



</style>