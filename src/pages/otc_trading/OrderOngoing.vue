<template>
  <div class="order_ongoing">
    <div class="order_root" v-loading="loading">
      <div class="order_header">
        <span>订单号：{{startCode}}</span><span class="font_blue">{{endCode}}</span>
        <span class="margin_left_b">{{exchangeType ? '卖家' : '买家'}}：{{exchangeType ? order.sellNickName : order.buyname}}</span>
        <!--可取消:1,2,3,4,5,6,7,8,9-->
        <span class="pointer align_right margin_left_a font_blue" v-if="statusRegExp.test('1')" @click="cancelOrder">取消订单</span>
        <span class="pointer align_right margin_left_a" v-if="statusRegExp.test('3,4,6,7,8')" @click="call">通知对方&nbsp;&nbsp;<img src="../../assets/images/Fill.svg"></span>
        <span class="pointer align_right margin_left_a" v-if="statusRegExp.test('3,4,7,8,9')" @click="complain">客服投诉</span>
      </div>
      <div class="order_body">
        <!--1-->
        <div>
          <p>{{exchangeType ? '买入' : '卖出'}}</p>
          <p>{{order.oCoinType}}</p>
        </div>
        <!--2-->
        <div>
          <p class="detail" style="position: relative;height: 34px;line-height: 34px;">
            <span>交易金额：{{order.oCapitalCount}}&nbsp;{{order.oCapitalType === '1' ? 'CNY' : 'USD'}}</span>&nbsp;&nbsp;
            <span>数量：{{Number(order.oCoinCount)}}</span>&nbsp;&nbsp;
            <span>价格：{{order.price}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <!--支付方式-->
            <span v-if="statusRegExp.test('1,2')" style="position: absolute;right: 0;top: 0;bottom: 0;height: 34px;vertical-align: middle;">
              <el-select v-model="pay" style="height: 34px;width: 130px;" @change="queryPay">
                <el-option
                  v-for="item in payList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span v-else>支付方式：{{selectedPay}}</span>
          </p>
          <p class="hint background_gray">
            <span>提示</span><br>
            <span>1、如果您已经支付完成请点击下方【确认已付款】，卖家确认收款后会及时为您放币。</span><br>
            <span class="color_red">2、对于未支付完成，却点击【确认已付款】的用户将会降低信用权重，甚至冻结账户使用权限。</span>
          </p>
        </div>
        <!--3-->
        <div>
          <!--微信-->
          <div class="pay" v-if="pay === '1' || order.oPayType === '1'">
            <p>
              <span class="main">姓名：</span>
              <span class="secondary">{{wechat.WechatName}}</span>
            </p>
            <p>
              <span class="main">账户：</span>
              <span class="secondary">{{wechat.WechatAccount}}</span>
            </p>
            <p>
              <el-tooltip class="item" effect="dark" placement="top-end" transition="el-fade-in-linear">
                <div slot="content">
                  <img class="main" :src="wechat.WechatQrcode">
                </div>
                <img class="main" :src="wechat.WechatQrcode" style="max-width: 250px;max-height: 156px;cursor: pointer;">
              </el-tooltip>
            </p>
          </div>
          <!--支付宝-->
          <div class="pay" v-else-if="pay === '2' || order.oPayType === '2'">
            <p>
              <span class="main">昵称：</span>
              <span class="secondary">{{alipay.AlipayName}}</span>
            </p>
            <p>
              <span class="main">账户：</span>
              <span class="secondary">{{alipay.AlipayAccount}}</span>
            </p>
            <p>
              <el-tooltip class="item" effect="dark" placement="top-end" transition="el-fade-in-linear">
                <div slot="content">
                  <img class="main" :src="alipay.AlipayQrcode">
                </div>
                <img class="main" :src="alipay.AlipayQrcode" style="max-width: 250px;max-height: 156px;cursor: pointer;">
              </el-tooltip>
            </p>
          </div>
          <!--银行卡-->
          <div class="pay" v-else-if="pay === '3' || order.oPayType === '3'">
            <p>
              <span class="main">姓名：</span>
              <span class="secondary">{{bankcard.UserName}}</span>
            </p>
            <p>
              <span class="main">卡号：</span>
              <span class="secondary">{{bankcard.BankAccount}}</span>
            </p>
            <p>
              <span class="main">开户行：</span>
              <span class="secondary">{{bankcard.BankName}}</span>
            </p>
          </div>
          <!--PayPal-->
          <div class="pay" v-else-if="pay === '4' || order.oPayType === '4'">
            <p>
              <span class="main">姓名：</span>
              <span class="secondary">{{paypal.PaypalName}}</span>
            </p>
            <p>
              <span class="main">账户：</span>
              <span class="secondary">{{paypal.PaypalAccount}}</span>
            </p>
          </div>
          <div class="pay" v-else></div>
        </div>
        <!--4-->
        <div>
          <!--4.1买家待付款-->
          <div class="operation" v-if="status === 1">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;付款倒计时</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="hint">待付款</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="bh-btn_primary" @click="()=>{if(this.payList.length<1){this.$message.error('请选择至少一种支付方式');return;}this.status = 2}">已付款</button>
            </p>
          </div>
          <!--4.2买家确认付款-->
          <div class="operation" v-else-if="status === 2">
            <p>
              <input v-model="password" type="password" placeholder="请输入资金密码" maxlength="6"/>
            </p>
            <p>
              <button class="bh-btn_plain" @click="status = 1">取消</button>
              <button class="bh-btn_primary" @click="payMoney(order.oId)" :disabled="!/[0-9]{6}/.test(password)">确认已付款</button>
            </p>
          </div>
          <!--4.3买家等待卖家确认收款-->
          <div class="operation" v-else-if="status === 3">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;待卖家确认收款</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="bh-font_size__small bh-color_light">超时后系统将冻结订单</span>
            </p>
          </div>
          <!--4.4买家等待卖家放币-->
          <div class="operation" v-else-if="status === 4">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;卖家放币中</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="bh-font_size__small bh-color_light">超时后系统将自动放币</span>
            </p>
          </div>
          <!--4.5买家确认收币-->
          <div class="operation" v-else-if="status === 5">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;待确认收币</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="bh-font_size__small bh-color_light">超时后系统将自动收币</span>
            </p>
            <p>
              <span class="hint">待确认收币</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="bh-btn_primary" @click="collectCoin">确认已收币</button>
            </p>
          </div>
          <!--4.6卖家等待买家付款-->
          <div class="operation" v-else-if="status === 6">
            <p class="bh-font_subtitle">
              <span>等待买家付款</span>
            </p>
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;付款倒计时</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
          </div>
          <!--4.7卖家待收款-->
          <div class="operation" v-else-if="status === 7">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;付款倒计时</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="bh-font_size__small bh-color_light">超时后系统将冻结订单</span>
            </p>
            <p>
              <span class="hint">待确认收款</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="bh-btn_primary" @click="status = 8">确认收款</button>
            </p>
          </div>
          <!--4.8卖家确认收款-->
          <div class="operation" v-else-if="status === 8">
            <p>
              <input v-model="password" type="password" placeholder="请输入资金密码" maxlength="6"/>
            </p>
            <p>
              <button class="bh-btn_primary" @click="status = 7">取消</button>
              <button class="bh-btn_primary" @click="collectMoney()" :disabled="!/[0-9]{6}/.test(password)">确认已收款</button>
            </p>
          </div>
          <!--4.9卖家待放币-->
          <div class="operation" v-else-if="status === 9">
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;倒计时</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
            <p>
              <span class="bh-font_size__small bh-color_light">超时后系统将自动放币</span>
            </p>
            <p>
              <span class="hint">待放币</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="bh-btn_primary" @click="payCoin">确认放币</button>
            </p>
          </div>
          <!--4.10卖家已放币,买家待确认收币-->
          <div class="operation" v-else-if="status === 10">
            <p class="bh-font_subtitle">
              <span>等待买家收币</span>
            </p>
            <p class="bh-font_size__big bh-color_dark"><i class="el-icon-time"></i>&nbsp;收币倒计时</p>
            <p class="bh-font_normal">
              <span class="time">{{countDownTimer.minutes}}</span>分&nbsp;
              <span class="time">{{countDownTimer.second}}</span>秒
            </p>
          </div>
          <!--4.100 被投诉啦-->
          <div class="operation" v-else-if="status === 100">
            <p class="bh-font_normal">
              <span class="time">订单投诉</span>
            </p>
            <p class="bh-font_normal">
              <span class="time">客服处理中...</span><br/>
              <button class="bh-btn_primary" @click="callServer">联系客服</button>
            </p>
          </div>
          <!--4.101 卖家确认收款超时-->
          <div class="operation" v-else-if="status === 101">
            <p class="bh-font_normal">
              <span class="time">卖家确认收款超时</span>
            </p>
            <p class="bh-font_normal">
              <span class="time">请联系客服处理</span>
              <button class="bh-btn_primary" @click="callServer">联系客服</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  props: ['originOrder'],
  data () {
    return {
      loading: false,
      order: {},
      // 自定义状态
      status: '',
      // 计时器
      countDownTimer: {
        lastTime: 0,
        minutes: 0,
        second: 0,
        timer: null
      },
      // 订单号
      startCode: '',
      endCode: '',
      // 交易状态:买入;卖出.
      exchangeType: true,
      // 对方名字
      otherName: '',
      // 支持的支付方式列表
      payList: [],
      // 支付信息
      wechat: {},
      alipay: {},
      bankcard: {},
      paypal: {},
      // 当前选中的支付方式
      pay: '',
      // 订单ID
      orderId: '',
      // 资金密码
      password: '',
      // 买家使用的支付方式
      selectedPay: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    statusRegExp () {
      return new RegExp(this.status)
    }
  },
  methods: {
    // 查询支付账号信息
    queryPay (payType) {
      const pay = payType || this.pay
      return new Promise((resolve, reject) => {
        if (pay.length > 1) {
          return
        }
        switch (pay) {
          case '1':
            if (JSON.stringify(this.wechat) !== '{}') return
            break
          case '2':
            if (JSON.stringify(this.alipay) !== '{}') return
            break
          case '3':
            if (JSON.stringify(this.bankcard) !== '{}') return
            break
          case '4':
            if (JSON.stringify(this.paypal) !== '{}') return
            break
        }
        this.$http.post('/userinfo/getPayMethodsInfoUI', {
          userId: this.order.oSellerId + '',
          type: pay
        }).then(response => {
          switch (pay) {
            case '1':
              this.wechat = response.body.data
              break
            case '2':
              this.alipay = response.body.data
              break
            case '3':
              this.bankcard = response.body.data
              break
            case '4':
              this.paypal = response.body.data
              break
          }
          resolve()
        }, response => {
          reject(response)
        })
      })
    },
    // 买家付款
    payMoney () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/alreadyPayUI',
        data: {
          orderId: this.orderId + '',
          password: this.password,
          oPayType: this.pay
        }
      }).then(response => {
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.loading = false
        // 重新查询订单
        this.$emit('refresh')
      })
    },
    // 卖家收款
    collectMoney () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/alreadyReceiveUI',
        data: {
          orderId: this.orderId + '',
          password: this.password
        }
      }).then(response => {
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$emit('refresh')
      })
    },
    // 卖家放币
    payCoin () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/putCurrencyUI',
        data: {
          orderId: this.orderId + ''
        }
      }).then(response => {
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.$emit('refresh')
      })
    },
    // 买家收币
    collectCoin () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/getCurrencyUI',
        data: {
          orderId: this.orderId + ''
        }
      }).then(response => {
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.$emit('refresh')
      })
    },
    // 取消订单
    cancelOrder () {
      this.loading = true
      this.$http.post('/orders/cancelUI', {
        orderId: this.orderId
      }).then(response => {
        this.$message.success('取消成功')
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      })
    },
    complain () {
      this.loading = true
      this.$http.post('/orders/complainUI', {
        orderId: this.orderId
      }).then(response => {
        this.$message.success('投诉成功')
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        // 重新查询订单
        this.$emit('refresh')
        this.loading = false
      })
    },
    call () {
      this.$store.dispatch('encryptConnection', {
        url: '/call/callNotifyUI',
        data: {
          orderId: this.orderId + ''
        }
      }).then(response => {
        this.$message.success('已电话通知对方')
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'E7602':
            this.$message.error('超过限定次数')
            break
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 联系客服
    callServer () {
      document.getElementById('chatBtn').click()
    }
  },
  mounted () {
    const o = this.originOrder
    this.order = o
    this.orderId = o.oId
    // 1.添加订单号前半部分和后四位尾数.
    this.startCode = o.oCode.substring(0, o.oCode.length - 4)
    this.endCode = o.oCode.substring(o.oCode.length - 4, o.oCode.length)
    // 2.交易类型.true:买入;false:卖出;
    console.log(this.user.userId === parseInt(o.oBuyerId), this.user.userId, parseInt(o.oBuyerId))
    this.exchangeType = this.user.userId === parseInt(o.oBuyerId)
    // 3.对方名称.
    this.otherName = this.exchangeType ? o.sellname : o.buyname
    // 4.订单状态.
    // 买家:1.买家付款倒计时;2.买家确认付款,输入资金密码;3.买家付款,等待卖家确认收款倒计时;4.等待卖家放币;5.买家待确认收币;
    // 卖家:6.等待对方付款;7.确认收款;8.输入资金密码,确认收款;9.卖家待放币;10.卖家已放币，待买家确认收币
    // 其他:11.订单被投诉
    if (this.exchangeType) {
      switch (o.oStatus) {
        case '1':
          this.status = 1
          break
        case '2':
          this.status = 3
          break
        case '3':
          this.status = 4
          break
        case '4':
          this.status = 5
          break
        case '5':
          this.status = 5
          break
        case '9':
          this.status = 100
          break
        case '10':
          this.status = 101
          break
      }
    } else {
      switch (o.oStatus) {
        case '1':
          this.status = 6
          break
        case '2':
          this.status = 7
          break
        case '3':
          this.status = 9
          break
        case '4':
          this.status = 10
          break
        case '5':
          this.status = 10
          break
        case '9':
          this.status = 100
          break
        case '10':
          this.status = 101
          break
      }
    }
    // 5.卖家支付方式:{wechat, alipay, bankcard, paypal, current, currentType}
    if (this.statusRegExp.test('1,2') && this.exchangeType) {
      console.error(o.sellerPayType, o.resPayType)
      const pays = (o.sellerPayType + o.resPayType)
      // 统计卖家支付方式、交易广告支付方式的交集
      const wechat = pays.match(/1/g) || []
      const alipay = pays.match(/2/g) || []
      const bankcard = pays.match(/3/g) || []
      const paypal = pays.match(/4/g) || []
      this.payList = []
      if (wechat.length >= 2) {
        this.payList.push({label: '微信', value: '1'})
      }
      if (alipay.length >= 2) {
        this.payList.push({label: '支付宝', value: '2'})
      }
      if (bankcard.length >= 2) {
        this.payList.push({label: '银行卡', value: '3'})
      }
      if (paypal.length >= 2) {
        this.payList.push({label: 'PayPal', value: '4'})
      }
      // 查询需要显示的默认支付信息
      if (this.payList.length) {
        this.pay = this.payList[0].value
        this.queryPay(this.payList[0].value)
      }
    } else {
      // 6.实际支付方式
      switch (o.oPayType) {
        case '1':
          this.selectedPay = '微信'
          break
        case '2':
          this.selectedPay = '支付宝'
          break
        case '3':
          this.selectedPay = '银行卡'
          break
        case '4':
          this.selectedPay = 'PayPal'
          break
      }
      this.queryPay(o.oPayType)
    }
    // 7.操作倒计时
    if (new RegExp(this.status.toString()).test('1,2,3,4,5,6,7,8,9,10')) {
      const countDown = o.countDown
      this.countDownTimer.lastTime = countDown
      this.countDownTimer.minutes = parseInt(countDown / 60)
      this.countDownTimer.second = parseInt(countDown % 60)
      if (parseInt(countDown) > 0) {
        this.countDownTimer.timer = setInterval(() => {
          // 倒计时结束
          if (--this.countDownTimer.lastTime <= 0) {
            clearTimeout(this.countDownTimer.timer)
            // 重新查询订单
            this.$emit('refresh')
            return
          }
          this.$set(this.countDownTimer, 'minutes', parseInt(this.countDownTimer.lastTime / 60))
          this.$set(this.countDownTimer, 'second', parseInt(this.countDownTimer.lastTime) % 60)
        }, 1000)
      }
    }
    // 8.交易金额
    this.order.oCapitalCount = Number(this.order.oCapitalCount).toFixed(2)
    // 9.电子币数量
    this.order.oCoinCount = Number(this.order.oCoinCount).toFixed(8)
    // 10.交易价格
    this.order.price = new BigNumber(this.order.oCapitalCount).div(new BigNumber(this.order.oCoinCount)).toNumber().toFixed(2)
  }
}
</script>

<style scoped>
  .order_ongoing {
    position: relative;
  }

  .order_ongoing .pointer {
    cursor: pointer;
  }

  .order_root {
    position: relative;
    background: #FFF;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.11);
    border-radius: 2px;
  }

  /*标题头：订单号、对方名称、联系商家、客服投诉*/
  .order_header {
    background: #F2F3F8;
    padding: 10px 14px;
  }

  .order_header img {
    width: 18px;
    height: 16px;
    line-height: normal;
    vertical-align: middle;
  }

  .order_header span {
    font-size:14px;
    color: #333;
    text-align:left;
    line-height: normal;
    display: inline-block;
    vertical-align: middle;
  }

  .order_header .font_blue {
    color: #0BB2FE;
  }

  .order_header .margin_left_a{
    margin-left: 40px;
  }

  .order_header .margin_left_b{
    margin-left: 134px;
  }

  .order_header .align_right {
    float: right;
  }

  /*订单主体*/
  .order_body {
    background-color: #FFF;
    padding: 20px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .order_body>div {
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    vertical-align: top;
  }

  /*分四列*/
  .order_body>div:nth-child(1) {
    width: 10%;
    padding-left: 26px;
  }
  .order_body>div:nth-child(2) {
    width: 41%;
  }
  .order_body>div:nth-child(3) {
    width: 29%;
    text-align: center;
  }
  .order_body>div:nth-child(4) {
    width: 19%;
    min-height: 197px;
    border-left: 1px solid #D8D8D8;
    text-align: center;
  }

  /*第一列*/
  /*第二列*/
  .order_body .detail {
    font-size: 14px;
    color: #666;
  }

  .detail>span {
    display: inline-block;
    overflow: visible;
  }

  .order_body .hint {
    padding: 17px 15px;
  }

  .hint span {
    line-height: 150%;
  }

  .order_body .background_gray {
    background-color: #F7F7F7;
  }
  .order_body .color_red {
    color: #FF3A3A;
  }
  /*第三列*/
  .order_body .pay {
    display:inline-block;
    text-align: left;
  }

  .pay .main{
    font-size: 14px;
    color: #666;
    line-height: 100%;
  }

  .pay .secondary{
    font-size: 14px;
    color: #333;
    line-height: 100%;
  }

  /*第四列*/
  .order_body .operation {
    display: inline-block;
    padding-top: 30px;
  }

  .operation .time {
    font-size: 28px;
    color: #FF3A3A;
  }

  .operation .hint {
    font-size: 14px;
    color: #FF3A3A;
  }

  .operation button {
    width: 100px;
    height: 36px;
  }

  .operation input {
    height: 34px;
  }

  .operation .bh-font_subtitle {
    margin-bottom: 54px;
  }
</style>
