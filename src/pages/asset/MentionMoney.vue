<template>
  <div class="bh-root">
    <div>
      <!--标题-->
      <el-row>
        <el-col :span="24">
          <span class="bh-background_normal bh-font_subtitle">提币</span>
        </el-col>
      </el-row>
       <!--提币币种-->
      <el-row class="bh_height" style="margin-bottom: 26px;">
        <el-col :span="3">
          <span class="bh-font_normal">提币币种</span>
        </el-col>
        <el-col :span="8">
          <el-select v-model="coin" @change="coinChange">
            <el-option
              v-for="item in coinList"
              :key="item.symbol"
              :label="item.symbol"
              :value="item.symbol">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
       <!--接收地址-->
      <el-row class="bh_height" style="margin-bottom: 26px;">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">接收地址</span>
        </el-col>
        <el-col :span="8">
          <el-select v-model="address" @change="showGXSNote">
            <el-option
              v-for="item in addressList"
              :key="item.address"
              :label="item.address"
              :value="item.address">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" >
          <button style="margin-left: 20px;" class="bh-btn_text bh-color_hover bh-font_size__standard bh-align-vertical__middle" @click="walletAddress=true">添加钱包地址</button>
        </el-col>
      </el-row>
      <!--GXC的备注字段，提币充币新加EOS备注-->
      <el-row class="bh_height" v-if="coin==='GXC' || coin==='EOS'">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">Memo(备注)</span>
        </el-col>
        <el-col :span="8">
          <el-input v-model="GXSNote" disabled></el-input>
        </el-col>
      </el-row>
        <!--提币数量-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">提币数量</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" type="number" v-model="number" @focus="checkNumberFocus" @blur="checkNumberBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showNumberMsg">{{numberMsg}}</span>
          </transition>
        </el-col>
      </el-row>
        <!--<p style="color:#999999;position: relative;top: -6px; left: 125px;">可提现额度:{{assets[coin]['frozenAmount'] ? assets[coin]['frozenAmount'] : 0}}&nbsp;&nbsp;&nbsp;&nbsp;暂不可提现:{{assets[coin]['balance'] ? assets[coin]['balance'] : 0}}</p>-->
      <!--网络手续费-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">网络手续费</span>
        </el-col>
        <el-col :span="8">
          <el-input type="number" v-model="service" @focus="checkServiceFocus" @blur="checkServiceBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showServiceMsg">{{serviceMsg}}</span>
          </transition>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<button class="bh-btn_text bh-color_hover bh-font_size__standard bh-align-vertical__middle" style="color:#666666;margin-left: 20px;">手续费说明</button>-->
        <!--</el-col>-->
      </el-row>
        <p style="color:#999999;position: relative;top: -6px; left: 125px;">提币消耗{{miningFee}}{{coin}}矿工费，网络手续费优先从账户余额中</p>
        <p style="color:#999999;position: relative;top: -16px; left: 125px;">扣除，当余额不足网络手续费时则从提币数量中扣除。</p>
      <!--短信验证码-->
      <el-row class="bh_height" style="margin-top: -2px;" v-if="!showGoogle">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">短信验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="messageCaptcha" maxlength="6" @focus="checkMessageCaptchaFocus" @blur="checkMessageCaptchaBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showMessageCaptchaMsg">{{messageCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_plain__large" style="margin: 0 0 0 20px;" @click="getTelephoneCode" :disabled="!(phoneIntervalTime===60)">{{getMessageCaptcha}}</button>
        </el-col>
      </el-row>
      <!--谷歌验证-->
      <el-row class="bh_height" style="margin-top: -2px;" v-else>
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">谷歌验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="googleCaptcha" maxlength="6"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showGoogleCaptchaMsg">{{googleCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
      <!--<p style="color:#0bb2fe;position: relative;top: -5px; left: 125px;cursor: pointer;" v-if="!showGoogle" @click="changeCaptcha">切换为谷歌验证</p>-->
      <!--<p style="color:#0bb2fe;position: relative;top: -5px; left: 125px;cursor: pointer;" v-else @click="changeCaptcha">切换为短信验证</p>-->
      <p></p>
      <p></p>
      <!--邮箱验证码-->
      <el-row class="bh_height" style="margin-top: -2px;">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">邮箱验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="emailCaptcha" maxlength="6" @focus="checkEmailCaptchaFocus" @blur="checkEmailCaptchaBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showEmailCaptchaMsg">{{emailCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_plain__large" style="margin: 0 0 0 20px;" @click="getEmailCode" :disabled="!(emailIntervalTime===60)">{{getEmailCaptcha}}</button>
        </el-col>
      </el-row>
      <!--资金密码-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="bh-font_normal bh-align-vertical__middle">资金密码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" type="password" v-model="password" maxlength="6" @focus="checkPasswordFocus" @blur="checkPasswordBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showPasswordMsg">{{passwordMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_text bh-color_hover bh-font_size__standard bh-align-vertical__middle" style="color:#666666;margin-left: 20px;" @click="$router.push({name: 'ResetTradingPassword'})">忘记密码？</button>
        </el-col>
      </el-row>
      <!--提交确认提币-->
      <el-row>
        <el-button type="primary" style="width: 140px; height: 34px; padding: 0; margin-left: 370px;" @click="commit" :disabled="!disabled || committing">确认提币</el-button>
      </el-row>
    </div>
    <!--温馨提示-->
    <el-row>
      <el-col :span="24">
        <span class="bh-font_size__big bh-color_prompt">
          <i class="iconfont icon-tanhao"></i>
        温馨提示
        </span>
        <span class="bh-font_size__standard bh-color_prompt">
          1、申请提币之前请您确认接收地址正确，交易一旦发送到区块链网络便不可撤回。
        </span>
        <span class="bh-font_size__standard bh-color_prompt">
          2、发起提币请求后，即可发送到区块链网络中。
        </span>
        <span class="bh-font_size__standard bh-color_prompt">
          3、提币通常需要5~30分钟完成到账。
        </span>

      </el-col>
    </el-row>

    <!--提币记录-->
    <el-row style="position: relative;">
      <el-col><span style="width:56px;height:20px;display:inline-block;margin: 60px 0 8px 0;font-size:14px;color:#666666;">提币记录</span></el-col>
      <el-col><span style="position:absolute;width:56px;height:20px;display:inline-block;margin:-28px 0 0 856px;font-size:14px;color:#8ed8fa;cursor: pointer;" @click="$router.push({name: 'MoneyRecord'})">所有记录</span></el-col>
      <el-col :span="24">
        <el-table :data="withdrawList" border>
          <el-table-column label="时间" align="center" width="95">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
              <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currency" label="币种" align="center" width="60"></el-table-column>
          <el-table-column prop="batch" label="流水号" align="center"></el-table-column>
          <el-table-column prop="toAddress" label="接收地址" align="left" width="240"></el-table-column>
          <el-table-column prop="quantity" label="提币数量" align="center"></el-table-column>
          <el-table-column prop="platformfee" label="网络手续费" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(new BigNumber(scope.row.cost).plus(new BigNumber(scope.row.platformfee)).toNumber(), 8)}}</span>
              <!--{{new BigNumber(scope.row.cost).plus(new BigNumber(scope.row.platformfee)).toNumber().cut(8)}}-->
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.status.toString().replace(/4/, '审核中').replace(/1/, '处理中').replace(/2/, '成功').replace(/3/, '失败')}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<el-col  style="color:#8ed8fa;cursor: pointer;">查看</el-col>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-col>
    </el-row>
    <!--添加钱包地址-->
    <wallet-address :visible.sync="walletAddress" @lstAddress="lstAddress" :coin="coin" v-if="walletAddress"></wallet-address>
    <!--弹窗记录查看-->
    <firefox-download :visible.sync="firefoxDownload" v-if="firefoxDownload"></firefox-download>
  </div>
</template>

<script>
import WalletAddress from './dialog/WalletAddress'
import FirefoxDownload from './dialog/FirefoxDownload'
import BigNumber from 'bignumber.js'
import NumberFormat from '../../plugin/NumberFormat'
export default {
  components: {
    WalletAddress,
    FirefoxDownload
  },
  data () {
    return {
      // 添加钱包地址
      walletAddress: false,
      firefoxDownload: false,
      showGoogle: false,
      emailIntervalTime: 60,
      phoneIntervalTime: 60,
      // 1.提币币种
      coin: '',
      coinList: [],
      // 2.接收地址
      address: '',
      // 接收地址列表
      addressList: [],
      // 所有币种的地址列表
      addressListCache: {},
      // 所有币种的余额和冻结金额
      assets: {},
      // 3.提币数量
      number: 0,
      numberTestResults: 0,
      numberMsg: '',
      showNumberMsg: false,
      // 4.网络手续费
      service: '',
      serviceTestResults: 0,
      serviceMsg: '',
      showServiceMsg: false,
      // 5.1短信验证码
      messageCaptcha: '',
      messageCaptchaTestResults: 0,
      messageCaptchaMsg: '',
      showMessageCaptchaMsg: false,
      getMessageCaptcha: '获取验证码',
      // 5.2谷歌证码
      googleCaptcha: '',
      googleCaptchaTestResults: 0,
      googleCaptchaMsg: '',
      showGoogleCaptchaMsg: false,
      // 6.邮箱验证码
      emailCaptcha: '',
      emailCaptchaTestResults: 0,
      emailCaptchaMsg: '',
      showEmailCaptchaMsg: false,
      getEmailCaptcha: '获取验证码',
      // 7.资金密码
      password: '',
      passwordTestResults: 0,
      passwordMsg: '',
      showPasswordMsg: false,
      // 提币记录
      withdrawList: [
      ],
      committing: false,
      // 公信宝备注字段
      GXSNote: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    BigNumber () {
      return BigNumber
    },
    // 提币旷工费
    miningFee () {
      return this.assets[this.coin] ? new BigNumber(this.assets[this.coin].miningFee).toNumber() : 0
    },
    disabled () {
      if (this.showGoogle) {
        return this.coin &&
          this.address &&
          this.numberTestResults === true &&
          this.serviceTestResults === true &&
          this.googleCaptchaTestResults === true &&
          this.emailCaptchaTestResults === true &&
          this.passwordTestResults === true
      } else {
        return this.coin &&
          this.address &&
          this.numberTestResults === true &&
          this.serviceTestResults === true &&
          this.messageCaptchaTestResults === true &&
          this.emailCaptchaTestResults === true &&
          this.passwordTestResults === true
      }
    }
  },
  watch: {
    number () {
      this.showNumberMsg = false
      this.numberMsg = ''
      this.numberTestResults = 0
      // 提币数量格式的校验
      if (Number(this.number) <= 0) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量不正确'
        this.numberTestResults = 1
        return
      }
      // 提币数量格式的校验
      if (Number(this.number).cut(8) !== Number(this.number)) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量小数位不能超过8位'
        this.numberTestResults = 2
        return
      }
      // 手续费计算
      // const platformRate = new BigNumber(this.assets[this.coin].platformRate)
      const miningFee = new BigNumber(this.assets[this.coin].miningFee)
      // const service = platformRate.multipliedBy(this.number).plus(miningFee)
      const service = miningFee
      // 提币限制
      const balance = new BigNumber(this.assets[this.coin].balance)
      if (balance.isGreaterThan(service.plus(new BigNumber(this.number)))) {
        this.service = service.toString()
      } else {
        this.number = balance.minus(service).toNumber()
      }

      this.numberTestResults = true
    },
    service () {
      this.showServiceMsg = false
      this.serviceMsg = ''
      this.serviceTestResults = 0
      // 1.服务费为空
      // if (!this.service) {
      //   return
      // }
      // 2.提币数量格式的校验
      if (Number(this.service) < 0) {
        this.showServiceMsg = true
        this.serviceMsg = '手续费不正确'
        this.serviceTestResults = 1
        return
      }
      // 2.提币数量格式的校验
      if (Number(this.service).cut(8) !== Number(this.service)) {
        this.showServiceMsg = true
        this.serviceMsg = '手续费小数位不能超过8位'
        this.serviceTestResults = 2
        return
      }
      this.serviceTestResults = true
    },
    messageCaptcha () {
      this.showMessageCaptchaMsg = false
      this.messageCaptchaMsg = ''
      this.messageCaptchaTestResults = 0
      // 1.短信验证码为空
      if (!this.messageCaptcha) {
        return
      }
      // 2.短信验证码格式的校验
      if (!this.$RegExp.captcha(this.messageCaptcha)) {
        this.showMessageCaptchaMsg = true
        this.messageCaptchaMsg = '验证码不正确'
        this.messageCaptchaTestResults = 1
        return
      }
      this.messageCaptchaTestResults = true
    },
    googleCaptcha () {
      this.showGoogleCaptchaMsg = false
      this.googleCaptchaMsg = ''
      this.googleCaptchaTestResults = 0
      // 1.验证码为空
      if (!this.googleCaptcha) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.numberPassword(this.googleCaptcha)) {
        this.showGoogleCaptchaMsg = true
        this.googleCaptchaMsg = '验证码格式不正确'
        this.googleCaptchaTestResults = 1
        return
      }
      this.googleCaptchaTestResults = true
    },
    emailCaptcha () {
      this.showEmailCaptchaMsg = false
      this.emailCaptchaMsg = ''
      this.emailCaptchaTestResults = 0
      // 1.邮箱验证码为空
      if (!this.emailCaptcha) {
        return
      }
      // 2.邮箱验证码格式的校验
      if (!this.$RegExp.captcha(this.emailCaptcha)) {
        this.showEmailCaptchaMsg = true
        this.emailCaptchaMsg = '格式不正确'
        this.emailCaptchaTestResults = 1
        return
      }
      this.emailCaptchaTestResults = true
    },
    password () {
      this.showPasswordMsg = false
      this.passwordMsg = ''
      this.passwordTestResults = 0
      // 1.资金密码为空
      if (!this.password) {
        return
      }
      // 2.资金密码格式的校验
      if (!this.$RegExp.numberPassword(this.password)) {
        this.showPasswordMsg = true
        this.passwordMsg = '格式不正确'
        this.passwordTestResults = 1
        return
      }
      this.passwordTestResults = true
    }
  },
  methods: {
    // 显示公信宝的备注字段
    showGXSNote () {
      if (this.coin !== 'GXC' && this.coin !== 'EOS') {
        this.GXSNote = ''
        return
      }
      for (let i in this.addressList) {
        if (this.addressList[i].address === this.address) {
          this.GXSNote = this.addressList[i].tag
        }
      }
    },
    changeCaptcha () {
      this.showGoogle = !this.showGoogle
      this.googleCaptcha = ''
      this.messageCaptcha = ''
    },
    checkNumberFocus () {
      if (this.number === '') {
        this.numberTestResults = 0
        this.showNumberMsg = false
        this.numberMsg = ''
      }
    },
    checkNumberBlur () {
      // 为空不继续校验
      // if (this.numberTestResults === 0) {
      //   this.showNumberMsg = true
      //   this.numberMsg = '提币数量不能为零'
      // }
    },
    checkServiceFocus () {
      if (this.service === '') {
        this.serviceTestResults = 0
        this.showServiceMsg = false
        this.serviceMsg = ''
      }
    },
    checkServiceBlur () {
      // 为空不继续校验
      // if (this.serviceTestResults === 0) {
      //   this.showServiceMsg = true
      //   this.serviceMsg = '提币数量不能为零'
      // }
    },
    checkMessageCaptchaFocus () {
      if (this.messageCaptcha === '') {
        this.messageCaptchaTestResults = 0
        this.showMessageCaptchaMsg = false
        this.messageCaptchaMsg = ''
      }
    },
    checkMessageCaptchaBlur () {
      // 为空不继续校验
      if (this.messageCaptchaTestResults === 0) {
        this.showMessageCaptchaMsg = true
        this.messageCaptchaMsg = '验证码不能为空'
      }
    },
    checkEmailCaptchaFocus () {
      if (this.emailCaptcha === '') {
        this.emailCaptchaTestResults = 0
        this.showEmailCaptchaMsg = false
        this.emailCaptchaMsg = ''
      }
    },
    checkEmailCaptchaBlur () {
      // 为空不继续校验
      if (this.emailCaptchaTestResults === 0) {
        this.showEmailCaptchaMsg = true
        this.emailCaptchaMsg = '验证码不能为空'
      }
    },
    checkPasswordFocus () {
      if (this.password === '') {
        this.passwordTestResults = 0
        this.showPasswordMsg = false
        this.passwordMsg = ''
      }
    },
    checkPasswordBlur () {
      // 为空不继续校验
      if (this.passwordTestResults === 0) {
        this.showPasswordMsg = true
        this.passwordMsg = '密码不能为空'
      }
    },
    coinChange () {
      this.address = ''
      this.addressList = []
      this.queryAddressList()
    },
    lstAddress (data) {
      this.addressListCache[this.coin].push({address: data.address, tag: data.tag})
      this.addressList = this.addressListCache[this.coin]
    },
    queryAddressList () {
      if (this.addressListCache[this.coin]) {
        this.addressList = this.addressListCache[this.coin]
        // if (this.addressList) {
        //   this.address = this.addressList[0]
        // }
      } else {
        this.$store.dispatch('encryptConnection', {
          url: '/commonWalletAddress/findAddressListUI',
          data: {
            currencyCode: this.coin
          }
        }).then(response => {
          this.addressList = response.body.data
          this.addressListCache[this.coin] = response.body.data
          // if (this.addressList) {
          //   this.address = this.addressList[0]
          // }
        }, response => {
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }
    },
    // 查询余额
    queryAllBalance () {
      if (this.assets[this.coin]) {
        return
      }
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/selectRichWalletListUI',
        data: {}
      }).then(response => {
        const data = response.body.data
        for (let i in data) {
          const coinName = data[i].dictionariesId
          this.coinList.push({symbol: coinName})
          this.assets[coinName] = data[i]
        }
        this.coin = this.coin || (this.coinList.length ? this.coinList[0].symbol : '')
        this.queryAddressList()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 获取邮箱验证码
    getEmailCode () {
      this.getEmailCaptcha = this.emailIntervalTime--
      const temp = setInterval(() => {
        this.getEmailCaptcha = this.emailIntervalTime--
        if (this.emailIntervalTime === 0) {
          this.getEmailCaptcha = '获取验证码'
          this.emailIntervalTime = 60
          clearInterval(temp)
        }
      }, 1000)
      this.$store.dispatch('encryptConnection', {
        url: '/auth/getEmailAuthCode',
        data: {
          email: this.$store.getters.getUser.email,
          type: '18'
        }
      }).then(response => {
      }, response => {
        this.getEmailCaptcha = '获取验证码'
        this.emailIntervalTime = 60
        clearInterval(temp)
        switch (response.body.code) {
          case 666:
            return
          case 'E0901':
            this.$message.error('参数为空')
            break
          case 'E0902':
            this.$message.error('邮箱格式不正确')
            break
          case 'E0903':
            this.$message.error('发送失败' + response.body.msg)
            break
          case 'E0904':
            this.$message.error('邮箱已存在')
            break
          case 'E0906':
            this.$message.error('不存在该邮箱')
            break
          case 'E0907':
            this.$message.error('已经认证该邮箱')
            break
          case 'E0910':
            this.$message.error('已经认证该邮箱')
            break
          default:
            this.$message.error('发送失败' + response.body.msg)
        }
      })
    },
    // 获取新手机验证码
    getTelephoneCode () {
      this.getMessageCaptcha = this.phoneIntervalTime--
      const temp = setInterval(() => {
        this.getMessageCaptcha = this.phoneIntervalTime--
        if (this.getMessageCaptcha === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.getMessageCaptcha = '获取验证码'
        this.phoneIntervalTime = 60
        clearInterval(temp)
      }
      this.$store.dispatch('encryptConnection', {
        url: '/auth/getTelephoneAuthCode',
        data: {
          telephone: this.$store.getters.getUser.telephone,
          type: '18'
        }
      }).then(response => {
      }, response => {
        clear()
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            this.$message.error('短信发送过于频繁')
            break
          default:
            this.$message.error('短信发送失败' + response.body.msg)
        }
      })
    },
    commit () {
      this.committing = true
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/mentionCoinUI',
        data: {
          currencyCode: this.coin,
          amount: this.number + '',
          free: this.service + '',
          toAddress: this.address,
          telephoneCode: this.messageCaptcha,
          mailCode: this.emailCaptcha,
          password: this.password,
          remark: this.GXSNote
        }
      }).then(response => {
        this.committing = false
        this.$message.success('发起提币申请成功，等待系统处理')
        this.$router.push({name: 'OtcTrading'})
      }, response => {
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          case 'ERROR_CAC2':
            this.$message.error('参数不合法')
            break
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          case 'NO_009':
            this.$message.error('可用余额不足')
            break
          default:
            this.$message.error(response.body.msg)
            break
        }
      })
    },
    numberFilter (value, objName) {
      if (Number(value) === 0) {
        return
      }
      this[objName] = NumberFormat.toFixed(value, 8)
      if (Number(value) > 1000000) {
        this[objName] = 1000000
      }
    }
  },
  created () {
    if (this.$store.getters.getUser.fundPassword === 0) {
      this.$alert('请先设置资金密码', '设置资金密码', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({name: 'SecuritySettings'})
        }
      })
      return false
    }
    this.coin = this.$route.params.coin || this.coin
    this.queryAllBalance()
    // 充币记录
    this.$store.dispatch('encryptConnection', {
      url: '/assetRecord/queryAssetRecordListUI',
      data: {
        type: '3',
        pageSize: '5',
        pageNo: '0'
      }
    }).then(response => {
      this.withdrawList = response.body.data
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
          break
      }
    })
  }
}
</script>

<style scoped>
  /*丧心病狂*/
  .bh-root>div:first-child {
    margin-bottom: 40px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    padding-bottom: 37px;
  }

  /*标题*/
  .bh-root>div:first-child>.el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
    margin: 0;
  }

  .bh-root>div:first-child>.el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*行高，input宽度*/
  .bh-root>div:first-child .el-row {
    min-height: 34px;
    margin-top: 20px;
    padding-left: 8px;
  }
  .bh-root>div:first-child .el-col {
    min-height: 34px;
  }

  .bh-root>div:first-child .el-input, .bh-root>div:first-child .el-select {
    width: 300px;
    height: 34px;
  }

  /*温馨提示*/
  .bh-root>.el-row:nth-child(2) {
    padding: 20px 12px;
    background: #fff5f0;
  }
  .bh-root>.el-row:nth-child(2) .el-col-24>span {
    display: inline-block;
    width: 100%;
    min-height: 20px;
    word-wrap: break-word;
    word-break: break-word;
  }
  .bh-root>.el-row:nth-child(2) .el-col-24>span:first-child {
    margin-bottom: 4px;
  }
  .bh_height{
    line-height: 34px;
  }

  /*报错提示*/
  .el-col-8 {
    position: relative;
  }

  .bh-hint.bh-color_prompt {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 34px;
    padding-right: 15px;
  }
</style>
