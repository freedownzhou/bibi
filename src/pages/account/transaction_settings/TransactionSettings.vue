<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bh-background_normal bh-font_subtitle">{{$t('menu.TransactionSettings')}}</span>
      </el-col>
    </el-row>

    <!--警告-->
    <el-row>
      <el-col :span="24">
        <i class="iconfont icon-tanhao"></i>
        <span class="bh-font_size__small bh-color_prompt">请设置您能支持的支付或收款方式，请务必保障所有的账号是您本人。</span>
      </el-col>
    </el-row>

    <!--银行账户-->
    <el-row>
      <el-col :span="4">
        <span><img style="width:18px;height:11px;" src="../../../assets/images/bank.svg" alt=""></span>
        <span class="bh-font_normal" style="display: inline-block;margin-left: 2px;">银行账户</span>
      </el-col>
      <el-col :span="10">
        <span class="bh-font_size__small bh-color_standard" v-if="user.isOpenBank ===0">设置尚未开启。</span>
        <span class="bh-font_size__small bh-color_standard" v-else>{{user.desensitizationBankcard}}</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.isOpenBank === 0">
        <button class="bh-btn_plain"  @click="showBankDialog">
          <span>设置</span>
        </button>
      </el-col>
      <el-col :span="2" :offset="6" v-else>
        <button class="bh-btn_plain"  @click="showBankDialog">
          <span>修改</span>
        </button>
      </el-col>
      <el-col :span="2" v-if="user.isOpenBank!==0">
        <el-switch v-model="bankValue" active-color="#0BB2FE" inactive-color="#DDDFE6"></el-switch>
      </el-col>
    </el-row>

    <!--微信账户-->
    <el-row>
      <el-col :span="4">
        <span><img style="width:20px;height:14px;" src="../../../assets/images/wechat.svg" alt=""></span>
        <span class="bh-font_normal">微信账户</span>
      </el-col>
      <el-col :span="10">
        <span class="bh-font_size__small bh-color_standard" v-if="user.isOpenWechat ===0">设置二维码后，建议开启收款语音提示。</span>
        <span class="bh-font_size__small bh-color_standard" v-else>{{user.desensitizationWechat}}</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.isOpenWechat===0">
        <button class="bh-btn_plain" @click="showWechatDialog">
          <span>设置</span>
        </button>
      </el-col>
      <el-col :span="2" :offset="6" v-else>
        <button class="bh-btn_plain" @click="showWechatDialog">
          <span>修改</span>
        </button>
      </el-col>
      <el-col :span="2" v-if="user.isOpenWechat!==0">
        <el-switch v-model="wechatValue" active-color="#0BB2FE" inactive-color="#DDDFE6"></el-switch>
      </el-col>
    </el-row>

    <!--支付宝账号-->
    <el-row>
      <el-col :span="4">
        <span><img style="width:20px;height:14px;" src="../../../assets/images/alipay.svg" alt=""></span>
        <span class="bh-font_normal">支付宝账号</span>
      </el-col>
      <el-col :span="10">
        <span class="bh-font_size__small bh-color_standard" v-if="user.isOpenAlipay ===0">设置二维码后，建议开启收款语音提示。</span>
        <span class="bh-font_size__small bh-color_standard" v-else>{{user.desensitizationAlipay}}</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.isOpenAlipay ===0">
        <button class="bh-btn_plain" @click="showAlipayDialog">设置</button>
      </el-col>
      <el-col :span="2" :offset="6" v-else>
        <button class="bh-btn_plain" @click="showAlipayDialog">修改</button>
      </el-col>
      <el-col :span="2" v-if="user.isOpenAlipay !==0">
        <el-switch v-model="alipayValue" active-color="#0BB2FE" inactive-color="#DDDFE6"></el-switch>
      </el-col>
    </el-row>

    <!--PayPal支付-->
    <el-row>
      <el-col :span="4">
        <span><img style="width:20px;height:14px;" src="../../../assets/images/paypal.svg" alt=""></span>
        <span class="bh-font_normal">PayPal支付</span>
      </el-col>
      <el-col :span="10">
        <span class="bh-font_size__small bh-color_standard" v-if="user.isOpenPaypal ===0">设置尚未开启。</span>
        <span class="bh-font_size__small bh-color_standard" v-else>{{user.desensitizationPayPal}}</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.isOpenPaypal ===0">
        <button class="bh-btn_plain" @click="showPaypalDialog">设置</button>
      </el-col>
      <el-col :span="2" :offset="6" v-else>
        <button class="bh-btn_plain" @click="showPaypalDialog">修改</button>
      </el-col>
      <el-col :span="2" v-if="user.isOpenPaypal !==0">
        <el-switch v-model="paypalValue" active-color="#0BB2FE" inactive-color="#DDDFE6"></el-switch>
      </el-col>
    </el-row>
    <!--银行账户设置-->
    <bank-account :visible.sync="bankDialog" v-if="bankDialog"></bank-account>
    <!--支付宝账号-->
    <alipay-account :visible.sync="alipayDialog" v-if="alipayDialog"></alipay-account>
    <!--微信账号-->
    <wechat-account :visible.sync="wechatDialog" v-if="wechatDialog"></wechat-account>
    <!--PayPal支付-->
    <paypal-account :visible.sync="paypalDialog" v-if="paypalDialog"></paypal-account>
  </div>
</template>

<script>
import BankAccount from './dialog/BankAccount'
import AlipayAccount from './dialog/AlipayAccount'
import WechatAccount from './dialog/WechatAccount'
import PaypalAccount from './dialog/PaypalAccount'
export default {
  name: 'SecuritySettings',
  components: {
    BankAccount,
    AlipayAccount,
    WechatAccount,
    PaypalAccount
  },
  data () {
    return {
      // 是否显示对话框
      bankDialog: false,
      alipayDialog: false,
      wechatDialog: false,
      paypalDialog: false,
      // 银行按钮的切换显示频率
      bankFrequency: null,
      // 微信账户按钮切换显示频率
      wechatFrequency: null,
      // 支付宝账号按钮切换显示频率
      alipayFrequency: null,
      // paypal按钮的切换显示频率
      paypalFrequency: null
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    bankValue: {
      set () {
        if (this.bankFrequency) {
          return
        } else {
          this.bankFrequency = setTimeout(() => {
            clearTimeout(this.bankFrequency)
            this.bankFrequency = null
          }, 2000)
        }
        if (this.$store.getters.getUser.isOpenBank === 1) {
          this.$message.info('关闭交易方式将会影响正在进行的订单')
        }
        this.$store.commit('setUser', {
          isOpenBank: this.$store.getters.getUser.isOpenBank === 1 ? 2 : 1
        })
        this.$http.post('/userinfo/changeBankpayStatusUI').then(response => {
        }, response => {
          this.$store.commit('setUser', {
            isOpenBank: this.$store.getters.getUser.isOpenBank === 1 ? 2 : 1
          })
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      },
      get () {
        return this.$store.getters.getUser.isOpenBank === 1
      }
    },
    wechatValue: {
      set () {
        if (this.wechatFrequency) {
          return
        } else {
          this.wechatFrequency = setTimeout(() => {
            clearTimeout(this.wechatFrequency)
            this.wechatFrequency = null
          }, 2000)
        }
        if (this.$store.getters.getUser.isOpenWechat === 1) {
          this.$message.info('关闭交易方式将会影响正在进行的订单')
        }
        this.$store.commit('setUser', {
          isOpenWechat: this.$store.getters.getUser.isOpenWechat === 1 ? 2 : 1
        })
        this.$http.post('/userinfo/changeWechatpayStatusUI').then(response => {
        }, response => {
          this.$store.commit('setUser', {
            isOpenWechat: this.$store.getters.getUser.isOpenWechat === 1 ? 2 : 1
          })
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      },
      get () {
        return this.$store.getters.getUser.isOpenWechat === 1
      }
    },
    alipayValue: {
      set () {
        if (this.alipayFrequency) {
          return
        } else {
          this.alipayFrequency = setTimeout(() => {
            clearTimeout(this.alipayFrequency)
            this.alipayFrequency = null
          }, 2000)
        }
        if (this.$store.getters.getUser.isOpenAlipay === 1) {
          this.$message.info('关闭交易方式将会影响正在进行的订单')
        }
        this.$store.commit('setUser', {
          isOpenAlipay: this.$store.getters.getUser.isOpenAlipay === 1 ? 2 : 1
        })
        this.$http.post('/userinfo/changeAlipayPayStatusUI').then(response => {
        }, response => {
          this.$store.commit('setUser', {
            isOpenAlipay: this.$store.getters.getUser.isOpenAlipay === 1 ? 2 : 1
          })
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      },
      get () {
        return this.$store.getters.getUser.isOpenAlipay === 1
      }
    },
    paypalValue: {
      set () {
        if (this.paypalFrequency) {
          return
        } else {
          this.paypalFrequency = setTimeout(() => {
            clearTimeout(this.paypalFrequency)
            this.paypalFrequency = null
          }, 2000)
        }
        if (this.$store.getters.getUser.isOpenPaypal === 1) {
          this.$message.info('关闭交易方式将会影响正在进行的订单')
        }
        this.$store.commit('setUser', {
          isOpenPaypal: this.$store.getters.getUser.isOpenPaypal === 1 ? 2 : 1
        })
        this.$http.post('/userinfo/changePaypalPayStatusUI').then(response => {
        }, response => {
          this.$store.commit('setUser', {
            isOpenPaypal: this.$store.getters.getUser.isOpenPaypal === 1 ? 2 : 1
          })
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      },
      get () {
        return this.$store.getters.getUser.isOpenPaypal === 1
      }
    }
  },
  methods: {
    filter () {
      const user = this.$store.getters.getUser
      if (user.identityAuthenticator === 0) {
        this.$alert('请先完成实名认证', '完成实名认证', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({name: 'Authentication'})
          }
        })
        return false
      }
      if (user.fundPassword === 0) {
        this.$alert('请先设置资金密码', '设置资金密码', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({name: 'SecuritySettings'})
          }
        })
        return false
      }
      return true
    },
    showBankDialog () {
      if (this.filter()) {
        this.bankDialog = true
      }
    },
    showAlipayDialog () {
      if (this.filter()) {
        this.alipayDialog = true
      }
    },
    showWechatDialog () {
      if (this.filter()) {
        this.wechatDialog = true
      }
    },
    showPaypalDialog () {
      if (this.filter()) {
        this.paypalDialog = true
      }
    }
  }
}
</script>

<style scoped>
  /*警告*/
  .bh-root .el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
    border: none;
  }

  .bh-root .el-row:first-child .icon-tanhao {
    margin-right: 6px;
    font-size: 12px;
  }

  /*路由的标题*/
  .bh-root .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
  }

  .bh-root .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
   }

  /*警告*/
  .bh-root .el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
    border: none;
  }

  .bh-root .el-row:first-child .icon-tanhao {
    margin-right: 6px;
    font-size: 12px;
  }

  /*底线*/
  .el-row {
    border-bottom: 1px solid #D8D8D8;
    min-height: 52px;
    max-height: 156px;
    line-height: 52px;
    padding-left: 5px;
  }

  /*中间多行文字的垂直居中*/
  .el-row .el-col span {
    line-height: normal;
    display:inline-block;
    vertical-align: middle;
  }

  /*除第一行提示外的小图标*/
  .icon-tanhao {
    font-size: 14px;
    margin-right: 6px;
    vertical-align: middle;
  }

  /*所有按钮的对齐方式*/
  .el-row .el-col-2 {
    text-align: right;
  }
</style>
