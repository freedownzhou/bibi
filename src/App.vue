<template>
  <div id="app">
    <!--<b-h-input type="password" v-model="value" :condition="condition" :min-length="4" :max-length="11"></b-h-input>-->
    <!--{{value}}:{{condition? '合格' : '不合格'}}-->
    <router-view></router-view>
  </div>
</template>

<script>
import BHInput from './components/BHInput'
export default {
  name: 'App',
  components: {BHInput},
  data () {
    return {
      value: '123',
      condition: ''
    }
  },
  computed: {
    getTitle () {
      // 注册有礼的标题
      if (this.$route.name === 'Activity') {
        // return '注册有礼'钟总要求改动
        return '抽奖活动'
      }
      const messages = this.$i18n.messages
      const locale = this.$i18n.locale
      // const routeName = this.$route.name
      // return messages[locale].title[routeName] + messages[locale].title.Description
      return messages[locale].title.Description
    },
    user () {
      return this.$store.getters.getUser
    }
  },
  created () {
    // 1.初始化coinmarketcap提供的数字货币列表
    this.$store.dispatch('initCoinMarket').then(() => {
    }, response => {
      this.$message.error('数据同步失败')
    })
  },
  mounted () {
  // 开启友盟统计
    if (process.env.NODE_ENV !== 'development') {
      var cnzzProtocol = ((document.location.protocol === 'https:') ? ' https://' : ' http://')
      document.write(unescape("%3Cspan id='cnzz_stat_icon_1274113368'%3E%3C/span%3E%3Cscript src='" + cnzzProtocol + "s19.cnzz.com/z_stat.php%3Fid%3D1274113368%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"))
    }
    this.$store.commit('setScreenWidth', window.innerWidth)
    this.$store.commit('setScreenHeight', window.innerHeight)
  }
}
</script>

<style>
#app {
}
</style>
