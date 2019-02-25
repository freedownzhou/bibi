<template>
  <div class="bh-root">
    <header>
      <navigation></navigation>
    </header>

    <main :style="mainStyle">
      <div class="bh-account_main">
        <ul class="bh-account_menu bh-font_list">
          <li :class="{'bh-account_active': m1, 'bh-color_select': m1, 'bh-background_normal': m1}" @click="$router.push({name:'AccountInformation'})">
            <img class="bh-icon_normal" src="../../assets/images/personal_gray.svg">
            <img class="bh-icon_hover" src="../../assets/images/personal_blue.svg">
            <span>{{$t('menu.PersonalInformation')}}</span>
          </li>
          <li :class="{'bh-account_active': m2, 'bh-color_select': m2, 'bh-background_normal': m2}" @click="$router.push({name:'SecuritySettings'})">
            <img class="bh-icon_normal" src="../../assets/images/aqh.svg">
            <img class="bh-icon_hover" src="../../assets/images/aql.svg">
            <span>{{$t('menu.SecuritySettings')}}</span>
          </li>
          <li :class="{'bh-account_active': m3, 'bh-color_select': m3, 'bh-background_normal': m3}" @click="$router.push({name:'Authentication'})">
            <img class="bh-icon_normal" src="../../assets/images/real_name_gray.svg">
            <img class="bh-icon_hover" src="../../assets/images/real_name_blue.svg">
            <span>{{$t('menu.IdentityAuthentication')}}</span>
          </li>
          <li :class="{'bh-account_active': m4, 'bh-color_select': m4, 'bh-background_normal': m4}" @click="$router.push({name:'TransactionSettings'})">
            <img class="bh-icon_normal" src="../../assets/images/transaction_gray.svg">
            <img class="bh-icon_hover" src="../../assets/images/transaction_blue.svg">
            <span>{{$t('menu.TransactionSettings')}}</span>
          </li>
          <li :class="{'bh-account_active': m5, 'bh-color_select': m5, 'bh-background_normal': m5}" @click="$router.push({name:'ListManagement'})">
            <img class="bh-icon_normal" src="../../assets/images/mdh.svg">
            <img class="bh-icon_hover" src="../../assets/images/mdl.svg">
            <span>{{$t('menu.ListManagement')}}</span>
          </li>
          <li :class="{'bh-account_active': m6, 'bh-color_select': m6, 'bh-background_normal': m6}" @click="$router.push({name:'MyAdvertising'})">
            <img class="bh-icon_normal" src="../../assets/images/advertisinggray.svg">
            <img class="bh-icon_hover" src="../../assets/images/advertising_l.svg">
            <span>{{$t('menu.MyAdvertising')}}</span>
          </li>
        </ul>
        <div class="bh-account_router">
          <router-view/>
        </div>
      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import IconSelect from '../../components/LanguageSelect'
import Navigation from '../../components/Navigation'
import BhFooter from '../../components/FooterIndex'
export default {
  name: 'Account',
  components: {
    Navigation,
    IconSelect,
    BhFooter
  },
  computed: {
    mainStyle () {
      // 导航60 底部220
      return 'min-height:' + (this.$store.getters.getScreenHeight - 280) + 'px;'
    },
    divStyle () {
      // 导航74 底部370 上间距10 下间距41
      return 'min-height:' + (this.$store.getters.getScreenHeight - 495) + 'px;'
    },
    m1 () {
      return this.$route.name === 'AccountInformation'
    },
    m2 () {
      return this.$route.name === 'SecuritySettings'
    },
    m3 () {
      return /Authentication|AuthenticationLow|AuthenticationMedium|AuthenticationMediumAudit|AuthenticationHigh/.test(this.$route.name)
    },
    m4 () {
      return this.$route.name === 'TransactionSettings'
    },
    m5 () {
      return this.$route.name === 'ListManagement'
    },
    m6 () {
      return this.$route.name === 'MyAdvertising'
    }
  },
  created () {
    // 获取用户信息
    this.$store.dispatch('queryUserInfo').then(response => {
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
  }
}
</script>

<style scoped>
  .bh-root {
  }

  header {
    background-color: #2C3253;
  }

  main {
    background-color: #F2F3F8;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 80px;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }

  .bh-account_main {
    width: 1200px;
    min-height: 555px;
    padding: 15px 35px 58px 35px;
    margin: 10px auto 20px auto;
    background-color: #FFF;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }

  .bh-account_main img {
    width: 16px;
    height: 17px;
    vertical-align: middle;
  }

  /*小菜单*/
  .bh-account_main ul {
    display: inline-block;
    width: 180px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #D8D8D8;
    vertical-align: top;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /*鼠标划过*/
  .bh-account_main li {
    min-height: 35px;
    max-height: 70px;
    line-height: 35px;
    text-align: left;
    cursor: pointer;
    border-left: 2px solid transparent;
    padding-left: 28px;
  }

  .bh-account_main li:hover {
    background-color: #F2F3F8;
  }

  .bh-icon_hover {
    display: none;
  }

  .bh-icon_normal {
    display: inline-block;
  }

  .bh-account_main li:hover .bh-icon_normal {
    display: none;
  }
  .bh-account_main li:hover .bh-icon_hover {
    display: inline-block;
  }

  /*被选中*/
  .bh-account_main .bh-account_active {
    background-color: #F2F3F8;
    border-left: 2px solid #0BB2FE;
  }

  .bh-account_active img[class='bh-icon_hover'] {
    display: inline-block;
  }

  .bh-account_active img[class='bh-icon_normal'] {
    display: none;
  }

  /*路由*/
  .bh-account_router {
    display: inline-block;
    width: 917px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 29px;
  }

  .bh-account_router_title span {
    display: inline-block;
    height: 25px;
    line-height: 25px;
    margin: 5px 0 0 10px;
  }

  footer {
    position: relative;
    bottom: 0;
  }
</style>
