<template>
  <div class="" v-loading="loading">
    <!--买入-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="530">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;margin-bottom: 14px;">
            <span v-if="type">购买{{coin}}</span>
            <span v-else>卖出{{coin}}</span>
            <span v-if="Number(balance) < 0" style="font-size: 12px;color: #FF7C44;">卖家余额不足</span>
          </el-col>
        </el-row>
        <!--用户头像-->
        <div style="margin:0 0 6px 25px;">
          <el-row style="margin: 0 0 20px 20px;">
            <el-col style="display: block;width: 50px;height: 50px;"><img src="../../../assets/images/headimg.png" alt="" style="border-radius: 50%;"></el-col>
          </el-row>
          <el-row style="margin: -52px 0 6px 90px;">
            <el-col>
              <span>{{name}}</span>
            </el-col>
            <el-col>
              <span>{{name}}</span>
            </el-col>
            <!--<el-col style="margin: -20px 0 30px 80px;width: 140px; height: 30px;background:#fff5f0;border-radius:2px;line-height: 30px;text-align: center;color:#ff7c44;font-size: 12px;">-->
              <!--<img src="../../../assets/images/v_1.svg" alt="" style="display: inline-block; width: 13px; height: 11px;">-->
              <!--<span>已通过高级认证</span>-->
            <!--</el-col>-->
            <!--<el-col style="margin: -60px 0 30px 245px;width: 140px; height: 30px;background:#fff5f0;border-radius:2px;line-height: 30px;text-align: center;color:#ff7c44;font-size: 12px;">-->
              <!--<img src="../../../assets/images/shop.svg" alt="" style="display: inline-block; width: 13px; height: 11px;">-->
              <!--<span>平台VIP商户</span>-->
            <!--</el-col>-->
          </el-row>
        </div>
        <!--导航明细-->
        <div style="text-align: center;">
          <el-row style="font-size:14px;color:#333333;">
            <el-col :span="6">交易次数</el-col>
            <el-col :span="6">信任人数</el-col>
            <el-col :span="6">好评度</el-col>
            <el-col :span="6">商家支持付款方式</el-col>
          </el-row>
          <!--导航明细数据-->
          <el-row style="font-size:14px;color:#666666;">
            <el-col :span="6">{{transactionNumber}}</el-col>
            <el-col :span="6">{{trustNumber}}</el-col>
            <el-col :span="6">{{praise}}</el-col>
            <el-col :span="6">
              <span v-if="/1/.test(supportPayType)"><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg"></span>
              <span v-if="/2/.test(supportPayType)"><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg"></span>
              <span v-if="/3/.test(supportPayType)"><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg"></span>
              <span v-if="/4/.test(supportPayType)"><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg"></span>
            </el-col>
          </el-row>
        </div>
        <!--支付方式-->
        <el-row style="margin:15px 0 15px 40px;">
          <el-col :span="6">
            <span class="bh-font_normal">广告支持付款方式:</span>
          </el-col>
          <el-col :span="18">
            <span v-if="/1/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg"></span>
            <span v-if="/2/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg"></span>
            <span v-if="/3/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg"></span>
            <span v-if="/4/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg"></span>
          </el-col>
        </el-row>
        <!--付款时间-->
        <el-row style="margin:0 0 15px 40px;">
          <el-col>
            <span style="font-size:14px;color:#333333;">平均付款时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{avgPaytime}}min</span>
          </el-col>
          <el-col style="margin:-14px 0 10px 280px;">
            <span style="font-size:14px;color:#333333;">平均放币时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{avgFbtime}}min</span>
          </el-col>
        </el-row>
        <div style="border:1px solid #d8d8d8;width: 456px;margin-left: 40px;"></div>
        <!--浮动报价-->
        <el-row style="margin:20px 0 15px 50px;">
          <span style="font-size:14px;color:#333333;" v-if="isFixedPrice">报价 ({{/1/.test(priceType) ? 'CNY' : 'USD'}})&nbsp;&nbsp;&nbsp;&nbsp;{{Number(price).cut(4)}}</span>
          <span style="font-size:14px;color:#333333;" v-else>浮动报价 ({{/1/.test(priceType) ? 'CNY' : 'USD'}})&nbsp;&nbsp;&nbsp;&nbsp;{{Number(price).cut(4)}}</span>
        </el-row>
        <!--交易数量-->
        <el-row style="margin:20px 0 15px 40px;width: 454px;height: 40px;background:#f2f3f8;border-radius:2px;line-height: 40px;">
          <span style="font-size:14px;color:#333333;margin-left: 10px;">交易数量 ({{coin}})&nbsp;&nbsp;&nbsp;&nbsp;
            <input style="position: absolute;width: 230px;background-color: transparent;border: none;" type="number" v-model="number"/>
          </span>
          <span style="font-size:14px;color:#0bb2fe;margin-left: 230px;cursor: pointer;" @click="exchangeAll" v-if="type">全部买入</span>
          <span style="font-size:14px;color:#0bb2fe;margin-left: 230px;cursor: pointer;" @click="exchangeAll" v-else>全部卖出</span>
        </el-row>
        <!--交易金额-->
        <el-row style="margin:20px 0 8px 40px;width: 454px;height: 40px;background:#f2f3f8;border-radius:2px;line-height: 40px;">
          <span style="font-size:14px;color:#333333;margin-left: 10px;">交易金额 ({{/1/.test(priceType) ? 'CNY' : 'USD'}})&nbsp;&nbsp;&nbsp;&nbsp;
            <input style="position: absolute;width: 230px;background-color: transparent;border: none;" type="number" v-model="amount"/>
          </span>
          <span style="font-size:14px;color:#333333;margin-left: 120px;" v-if="Number(startAmount) === 0 && Number(endAmount) === 0">单笔限额0-0 CNY</span>
          <span style="font-size:14px;color:#333333;margin-left: 120px;" v-else>单笔限额{{startAmount}}-{{endAmount}} {{/1/.test(priceType) ? 'CNY' : 'USD'}}</span>
        </el-row>
        <el-row style="margin:0px 0 10px 40px;">
          <span style="font-size:12px;color:#ff7c44;margin-left:66px;">您不需要支付任何手续费，交易手续费将由广告发布商承担，请安心交易。</span>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 212px; height: 34px;padding: 0;margin: 10px 40px 40px 40px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 212px; height: 34px;padding: 0;margin: 10px 50px 40px 15px;" class="bh-btn_primary" :disabled="!disabled" @click="commit">
              <i class="el-icon-loading" v-if="committing"></i>
              <span v-else>确认</span>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
import BigNumber from 'bignumber.js'
import NumberFormat from '../../../plugin/NumberFormat'
export default {
  components: {
    BhDialog
  },
  data () {
    return {
      // 加载状态
      loading: true,
      // 提交状态
      committing: false,
      // 商家交易数量
      transactionNumber: 0,
      // 商家信任人数
      trustNumber: 0,
      // 商家好评
      praise: '0%',
      // 商家支持的支付方式
      supportPayType: '4',
      // 平均付款时间
      avgPaytime: null,
      // 平均放币时间
      avgFbtime: null,
      historyQuantity: 4,
      // 交易价格
      price: 0,
      // 交易数量
      number: 0,
      // 交易金额
      amount: 0,
      // 卖家余额
      balance: 0,
      // 数量同步锁
      synchronizedNumber: false,
      // 金额同步锁
      synchronizedAmount: false
    }
  },
  props: {
    businessId: {
      type: Number
    },
    name: {
      type: String,
      default: ''
    },
    startAmount: {
      type: Number,
      default: 0
    },
    endAmount: {
      type: Number,
      default: 0
    },
    coin: {
      type: String,
      default: ''
    },
    type: {
      type: Boolean,
      default: true
    },
    isFixedPrice: {
      type: Number,
      default: 0
    },
    payType: {
      type: String,
      default: ''
    },
    priceType: {
      type: String,
      default: '1'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    number (value) {
      if (this.synchronizedNumber) {
        this.synchronizedNumber = false
        return
      }
      // 同步交易金额
      this.synchronizedAmount = true
      this.amount = new BigNumber(value || 0).multipliedBy(new BigNumber(this.price)).toNumber().cut(4) || 0
    },
    amount (value, lastValue) {
      if (this.synchronizedAmount) {
        this.synchronizedAmount = false
        return
      }
      if (value.length > 9) {
        this.synchronizedAmount = true
        this.amount = lastValue
        return
      }
      this.synchronizedNumber = true
      this.number = new BigNumber(value).dividedBy(new BigNumber(this.price)).toNumber()
    }
  },
  computed: {
    disabled () {
      // 1.交易数量大于零
      // 2.交易数量小于等于卖家余额
      // 3.交易金额小于等于单笔限额
      // 4.交易金额大于零
      let start = this.startAmount ? new BigNumber(this.startAmount).div(new BigNumber(this.price)) : new BigNumber(0)
      let end = this.endAmount ? new BigNumber(this.endAmount).div(new BigNumber(this.price)) : new BigNumber(this.balance)
      end = this.balance < end ? this.balance : end
      let number = new BigNumber(this.number)
      if (start) {
        return number.isGreaterThanOrEqualTo(start) && number.isLessThanOrEqualTo(end) && Number(this.amount).toFixed(2) > 0
      } else {
        return number.isGreaterThan(start) && number.isLessThanOrEqualTo(end) && Number(this.amount).toFixed(2) > 0
      }
    }
  },
  methods: {
    commit () {
      if (this.committing) {
        return
      } else {
        this.committing = true
      }
      if (this.type) {
        // 商户(卖家)没有广告交易方式
        if (!this.payType) {
          this.committing = false
          this.$message.info('卖家没有开通交易方式，无法下单')
          return
        }
      } else {
        // 商户(买家)广告交易方式与卖家的没有交集
        const user = this.$store.getters.getUser
        let temp = this.payType
        temp += user.isOpenWechat === 1 ? '1' : ''
        temp += user.isOpenAlipay === 1 ? '2' : ''
        temp += user.isOpenBank === 1 ? '3' : ''
        temp += user.isOpenPaypal === 1 ? '4' : ''
        const wechat = temp.match(/1/g) || []
        const alipay = temp.match(/2/g) || []
        const bankcard = temp.match(/3/g) || []
        const paypal = temp.match(/4/g) || []
        if (wechat.length < 2 && alipay.length < 2 && bankcard.length < 2 && paypal.length < 2) {
          // 商户(卖家)的广告交易方式与买家设置的不符合
          this.committing = false
          this.$message.info('您没有设置买家广告所需的交易方式，请设置')
          this.$router.push({name: 'TransactionSettings'})
          return
        }
      }
      this.$store.dispatch('encryptConnection', {
        url: '/orders/addUI',
        data: {
          businResourceId: this.businessId + '',
          oCapitalCount: this.amount + '',
          oCoinCount: this.number + ''
        }
      }).then(response => {
        this.committing = false
        this.$message.success('下单成功!')
        this.$emit('success')
        this.$emit('update:visible', false)
      }, response => {
        if (response.body.code === 666) {
          return
        }
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          case '403':
            this.$message.error('当日取消订单已超限制，不可下单!')
            break
          case 'E5203':
            this.$message.error('卖家余额不足!')
            break
          case 'NO-0023':
            this.$message.error('未通过中级实名认证!')
            break
          case 'E5208':
            this.$message.error('本人不能做交易!')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$emit('update:visible', false)
      })
    },
    exchangeAll () {
      if (this.endAmount) {
        const end = new BigNumber(this.endAmount).div(new BigNumber(this.price))
        this.number = end.isLessThan(new BigNumber(this.balance)) ? NumberFormat.toFixed(end.toString().toNumber(), 8) : NumberFormat.toFixed(this.balance.toString().toNumber(), 8)
      } else {
        this.number = this.balance
      }
      if (this.number < 0) {
        this.number = 0
        this.$message.error(this.type ? '商家余额不足' : '您的余额不足')
      }
    }
  },
  created () {
    // 1.查询商家信息
    this.$http.post('/userinfo/findUserInfoByUI', {
      businessId: this.businessId
    }).then(response => {
      const merchant = response.body.data
      this.transactionNumber = merchant.transationNumber || 0
      this.trustNumber = merchant.trustNumber || 0
      this.praise = merchant.praise || '100%'
      this.historyQuantity = merchant.historyQuantity || 0
      this.avgPaytime = merchant.avgPaytime || 0
      this.avgFbtime = merchant.avgFbtime || 0
      this.supportPayType = merchant.payType || 0
      this.price = merchant.price + '' || 0
      this.loading = false
      if (this.type) {
        this.balance = merchant.balance || 0
      }
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
    // 2.查询卖家余额
    if (!this.type) {
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/selectWalletListUI',
        data: {
          currencyCode: this.coin
        }
      }).then(response => {
        const data = response.body.data
        for (let i in data) {
          if (this.coin === data[i].dictionariesId) {
            this.balance = new BigNumber(data[i].balance).minus(data[i].frozenAmount).toNumber()
          }
        }
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
}
</script>

<style scoped>

</style>
