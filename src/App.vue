<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  import VHeader from './components/header/header'
  import {urlParse} from './common/js/util'

  const ERR_OK = 0; //OK状态码

  export default {
    data() {
      return {
        sellerId: (() => {
          let queryParam = urlParse();
          if (queryParam.length === 0 || queryParam === 'undefined') {
            return 11;
          }
          // console.log(queryParam.sellerId);
          return queryParam.sellerId;
        })(),

        // seller: {}
      }
    },
    computed: {},

    created() {

      this.$http.get('/api/seller?id=' + this.sellerId).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.$store.dispatch('initSeller', response.data);
          console.log(this.$store.state.seller);
        }
      });

    },

    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl"

  #app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align center
        & > a
          display block
          font-size 14px
          color: rgb(77, 85, 93)
          &.active
            color rgb(240, 20, 20)
</style>
