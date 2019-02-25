<template>
  <div class="">
    <!--买入-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="573">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>广告编辑</span>
          </el-col>
        </el-row>
        <!--2.4固定价格交易-->
        <el-row style="margin-top: 20px;">
          <el-col :span="5">
            <span style=" font-size:14px;color:#333333;">固定价格交易</span>
          </el-col>
          <el-col :span="2">
            <el-switch v-model="isFixedPrice" active-color="#4bd763" inactive-color="#DDDFE6"></el-switch>
          </el-col>
        </el-row>
        <!--对标交易所-->
        <!--<el-row v-if="!isFixedPrice" style="margin-top: 20px;">-->
          <!--<el-col :span="4">-->
            <!--<span class="bh-font_size__big_all">对标交易所</span>-->
          <!--</el-col>-->
          <!--<el-col :span="4">-->
            <!--<el-select v-model="exchangeResourceId" filterable style="border:0 solid #d8d8d8;width:418px;height:33px;border-radius:4px;margin: -6px 0 0 20px;">-->
              <!--<el-option-->
                <!--v-for="item in exchangeResources"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <!--出售价设置-->
        <el-row v-if="isFixedPrice" style="margin-top: 20px;">
          <el-col :span="4">
            <span class="is_blue"></span>
            <span class="bh-font_size__big">出售价设置</span>
          </el-col>
          <el-col :span="4" :offset="1">
            <div @keyup="numberFilter(price, 'price')">
              <el-input v-model="price" type="number" maxlength="10" @focus="priceFocus=true" placeholder="不随市场波动价改变出售价格" style="border:0 solid #d8d8d8;border-radius:4px;width:324px;height:33px;"></el-input>
            </div>
            <transition name="el-fade-in-linear">
              <span  v-if="priceFocus && !checkPrice" class="bh-hint bh-color_prompt" style="position: absolute;top: 35px;left: 194px;">{{isPricemsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <el-row v-else style="margin-top: 20px;">
          <el-col :span="4">
            <span class="bh-font_size__big_all">出售价设置</span>
          </el-col>
          <el-col :span="4">
            <div style="background:#f2f3f8;width:420px;height:47px;margin: -6px 0 0 20px;">
              <bh-slider @getValue="lstGetValue" :percent="pricePercent"></bh-slider>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="!isFixedPrice">
          <el-col :span="16" :offset="5" v-if="otherAsset">
            <span style="font-size:12px;color:#999999;">
              您设置的报价:
              <span style="color:#0bb2fe;">{{Number(otherAsset.price * ((pricePercent / 100) + 1)).cut(4)}}</span>
              CNY/{{currency}}。
              <br>
              当前行情价格:
              <span class="bh-color_select">{{Number(otherAsset.price).cut(4)}}</span>
              CNY/{{currency}}
            </span>
          </el-col>
        </el-row>
        <!--最低单价设置-->
        <el-row v-if="!isFixedPrice" style="margin-top: 20px;">
          <el-col :span="5">
            <span style=" font-size:14px;color:#333333;" v-if="businType + ''==='1'">最高单价设置</span>
            <span style=" font-size:14px;color:#333333;" v-else>最低单价设置</span>
          </el-col>
          <el-col :span="3">
            <div @keyup="numberFilter(lowestPrice, 'lowestPrice')">
              <input v-if="businType + ''==='1'" type="number" placeholder="设置您可接受的最低单价，留空，则不设置。" v-model="lowestPrice" style="border:0.5px solid #d8d8d8;border-radius:4px;width:416px;height:33px;margin-top: -6px;">
              <input v-else type="number" placeholder="设置您可接受的最低单价，留空，则不设置。" v-model="lowestPrice" style="border:0.5px solid #d8d8d8;border-radius:4px;width:416px;height:33px;margin-top: -6px;">
            </div>
          </el-col>
        </el-row>
        <!--支付方式-->
        <el-row style="margin-top: 20px;">
          <el-checkbox-group v-model="payType">
            <el-col :span="5">
              <span class="bh-font_size__big_all">支付方式</span>
            </el-col>
            <el-col :span="4" v-if="user.isOpenWechat===1">
              <el-checkbox label="1" class="bh-checkbox"></el-checkbox>
              <span class="bh_size__big_all">微信支付</span>
            </el-col>
            <el-col :span="4" style="margin-left: 5px;" v-if="user.isOpenAlipay===1">
              <el-checkbox label="2" class="bh-checkbox"></el-checkbox>
              <span class="bh_size__big_all">支付宝</span>
            </el-col>
            <el-col :span="4" style="margin-left: 18px;" v-if="user.isOpenBank===1">
              <el-checkbox label="3" class="bh-checkbox"></el-checkbox>
              <span class="bh_size__big_all">银行转账</span>
            </el-col>
            <el-col :span="4" style="margin-left: 20px;" v-if="user.isOpenPaypal===1">
              <el-checkbox label="4" class="bh-checkbox"></el-checkbox>
              <span class="bh_size__big_all">PayPal</span>
            </el-col>
          </el-checkbox-group>
        </el-row>
        <!--交易限额-->
        <el-row style="margin-top: 20px;">
          <el-col :span="5">
            <span class="bh-font_size__big_all">交易限额</span>
          </el-col>
          <el-col :span="10">
            <div @keyup="numberFilter(startAmount, 'startAmount')">
              <el-input placeholder="每笔交易最低金额" v-model="startAmount" type="number" style="border:0 solid #d8d8d8;border-radius:2px;width:204px;height:33px;">
                <template slot="append">{{priceCurrencyType === 1 ? 'CNY' : 'USD'}}</template>
              </el-input>
            </div>
            <p style="font-size:14px;color:#666666;margin-top:4px;">最小限额:小于最大限额且大于20</p>
          </el-col>
          <el-col :span="9">
            <div @keyup="numberFilter(endAmount, 'endAmount')">
              <el-input placeholder="每笔交易最高金额" v-model="endAmount" type="number" style="border:0 solid #d8d8d8;border-radius:2px;width:204px;height:33px;">
                <template slot="append">{{priceCurrencyType === 1 ? 'CNY' : 'USD'}}</template>
              </el-input>
            </div>
            <p style="font-size:14px;color:#666666;margin-top:4px;">最大限额:大于最小限额且小于100000</p>
          </el-col>
        </el-row>
        <!--交易限额设置-->
        <el-row style="margin-top: 10px;">
          <el-col :span="4">
            <span class="bh_size__big_all">交易限制设置</span>
          </el-col>
          <div style="margin-left: 20px;">
            <el-checkbox-group v-model="tranSet">
              <el-col :span="12" style="margin-left: 20px;">
                <el-checkbox label="1" class="bh-checkbox"></el-checkbox>
                <span class="bh_size__big_all">禁止初级认证用户交易</span>
              </el-col>
              <el-col :span="8" style="margin-left: -69px;">
                <el-checkbox label="2" class="bh-checkbox"></el-checkbox>
                <span class="bh_size__big_all">禁止中级认证用户交易</span>
              </el-col>
              <!--<el-col :span="12">-->
                <!--<el-checkbox label="3" class="bh-checkbox" style="margin-left: 88px;"></el-checkbox>-->
                <!--<span class="bh_size__big_all">禁止高级认证用户交易</span>-->
              <!--</el-col>-->
              <!--<el-col :span="12">-->
                <!--<el-checkbox label="4" class="bh-checkbox" style="margin-left: 19px;"></el-checkbox>-->
                <!--<span class="bh_size__big_all">仅限受信任的交易者</span>-->
              <!--</el-col>-->
              <!--<el-col :span="24">-->
                <!--<el-checkbox style="margin-left: 88px;" label="5" class="bh-checkbox"></el-checkbox>-->
                <!--<span class="bh_size__big_all">禁止新手交易(0次交易)</span>-->
              <!--</el-col>-->
            </el-checkbox-group>
          </div>
        </el-row>
        <el-row style="margin-top: 10px;" v-if="advertising.status!==1">
          <el-col :span="5">
            <span class="bh-font_size__big_all">重新上架</span>
          </el-col>
          <el-col :span="18">
            <el-switch v-model="online" active-color="#4bd763" inactive-color="#DDDFE6"></el-switch>
          </el-col>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 194px; height: 34px;padding: 0;margin: 20px 40px 40px 108px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 194px; height: 34px;padding: 0;margin: 20px 50px 40px 66px;" class="bh-btn_primary" @click="commit">
              <i v-if="committing" class="el-icon-loading"></i>
              <span v-else>确认</span>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhSlider from '../../../../components/BHSlider'
import BhDialog from '../../../../components/BHDialog'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    advertising: {
      type: Object
    }
  },
  components: {
    BhDialog,
    BhSlider
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    disabled () {
      const startAmountNumber = Number(this.startAmount)
      const endAmountNumber = Number(this.endAmount)
      return this.payType.toString() &&
        (
          (this.isFixedPrice && Number(this.price) > 0) ||
          (!this.isFixedPrice && (this.lowestPrice === '' || Number(this.lowestPrice) >= 0))
        ) &&
        startAmountNumber >= 20 &&
        endAmountNumber <= 100000 &&
        startAmountNumber <= endAmountNumber
    },
    // 出售价设置位数校验
    checkPrice () {
      if (!this.priceFocus) {
        return true
      }
      if (this.price) {
        return true
      }
      return false
    },
    otherAsset () {
      if (this.$store.getters.getOtherAsset[this.currency]) {
        return this.$store.getters.getOtherAsset[this.currency]
      } else {
        return {
          price: 0
        }
      }
    }
  },
  data () {
    return {
      // 上架状态
      online: true,
      // 交易类型:1买入;2卖出
      businType: '1',
      // 交易币种
      currency: 'BTC',
      // 交易法币
      priceCurrencyType: 'CNY',
      // 是否固定价格:1是，0否
      isFixedPrice: true,
      // 出售单价
      price: null,
      priceFocus: false,
      isPricemsg: '',
      // 溢价比例
      pricePercent: this.pricePercent,
      lowestPrice: null,
      // 支付方式(1微信 2支付宝 3银行卡4 paypal 多种支付方式用逗号间隔)
      payType: [],
      // 最小限额
      startAmount: 20,
      // 最大限额
      endAmount: 100000,
      // 交易设置1.禁止初级用户交易 2禁止终极认证用户交易 3.禁止高级认证用户交易 4仅限受信任的用户交易 5禁止新手交易
      tranSet: [],
      // 对标交易所
      exchangeResourceId: 1,
      // 交易所列表
      exchangeResources: [
        {
          label: 'BlockCC',
          value: 1
        }
      ],
      committing: false,
      // 资产列表
      assetList: {}
    }
  },
  methods: {
    lstGetValue (data) {
      this.pricePercent = data.value
    },
    commit () {
      const startAmountNumber = Number(this.startAmount)
      const endAmountNumber = Number(this.endAmount)
      if (!((this.isFixedPrice && Number(this.price) > 0) || !this.isFixedPrice)) {
        this.$message.error('交易价格必须大于零')
        return
      }
      if (!(!this.lowestPrice || (this.lowestPrice && this.lowestPrice >= 0))) {
        this.$message.error('最低单价必须大于或等于零')
        return
      }
      // 浮动价格
      if (!this.isFixedPrice) {
        let fPrice = Number(this.otherAsset.price * ((this.pricePercent / 100) + 1)).cut(4)
        // 买入限制最高单价
        if (this.businType + '' === '1' && (this.lowestPrice && (this.lowestPrice <= fPrice))) {
          this.$message.error('最高单价必须大于当前设置价格')
          return
        }
        // 卖出限制最低单价
        if (this.businType + '' === '2' && (this.lowestPrice && (this.lowestPrice >= fPrice))) {
          this.$message.error('最低单价必须小于当前设置价格')
          return
        }
      }
      if (!this.payType.toString()) {
        this.$message.error('请选择至少一种支付方式')
        return
      }
      if (startAmountNumber < 20) {
        this.$message.error('最低限额不能小于20')
        return
      }
      if (endAmountNumber > 100000) {
        this.$message.error('最高限额不能大于100000')
        return
      }
      if (startAmountNumber > endAmountNumber) {
        this.$message.error('最低限额不能大于最高限额')
        return
      }
      if (!/1/.test(this.businType) && !(this.assetList[this.currency] && Number(this.assetList[this.currency].balance))) {
        this.$message.error('可用余额不足')
        return
      }
      if (!(
        this.businType.toString() === '1' ||
        (
          this.businType.toString() === '2' && (
            (this.isFixedPrice && startAmountNumber <= this.price * this.assetList[this.currency].balance) ||
            (!this.isFixedPrice && startAmountNumber <= this.$store.getters.convertToCNY(this.currency, this.assetList[this.currency].balance).toFixed(2))
          )
        ))
      ) {
        this.$message.error('该币种余额总价不能小于最低限额')
        return
      }

      this.committing = true
      let startAmount = this.startAmount
      let endAmount = this.endAmount
      if (!this.startAmount && !this.endAmount) {
        startAmount = null
        endAmount = null
      }
      // 支付方式排个序
      let peyType = /1/.test(this.payType.toString()) ? '1,' : ''
      peyType += /2/.test(this.payType.toString()) ? '2,' : ''
      peyType += /3/.test(this.payType.toString()) ? '3,' : ''
      peyType += /4/.test(this.payType.toString()) ? '4' : ''
      peyType = peyType.replace(/,$/, '')
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/updateUI',
        data: {
          id: this.advertising.id,
          // 最小限额
          startAmount: startAmount,
          // 最大限额
          endAmount: endAmount,
          // 单价
          price: this.price,
          // 价格(币种)
          priceCurrencyType: this.priceCurrencyType,
          // 溢价比例
          pricePercent: (this.pricePercent / 100) + 1,
          lowestPrice: this.lowestPrice,
          // 交易类型
          businType: this.businType,
          // 数字币种
          currency: this.currency,
          // 出售(买入)数量
          quantity: 1,
          // // 支付方式
          payType: peyType,
          // 交易设置
          tranSet: this.tranSet.toString(),
          // 是否启动固定价格交易
          isFixedPrice: this.isFixedPrice ? '1' : '0',
          // 对接交易所
          exchangeResourceId: this.exchangeResourceId,
          status: this.advertising.status !== 1 && this.online ? '1' : null
        }
      }).then(response => {
        this.committing = false
        this.$emit('success')
      }, response => {
        switch (response.body.code) {
          case 'NO_004':
            this.$message.error('余额不足!')
            break
          case 'NO_005':
            this.$message.error('请先绑定银行卡!')
            break
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.committing = false
      })
    },
    numberFilter (value, objName) {
      if (Number(value) > 1000000) {
        this[objName] = 1000000
      }
      if (value.indexOf('.') === -1) {
        this[objName] = Number(value).cut(3)
      } else {
        if (value.split('.')[1].length > 3) {
          this[objName] = Number(value).cut(3)
        }
      }
    }
  },
  created () {
    this.online = this.advertising.status === 1
    this.currency = this.advertising.currency
    this.businType = this.advertising.businType
    this.priceCurrencyType = this.advertising.priceCurrencyType
    this.isFixedPrice = parseInt(this.advertising.isFixedPrice) === 1
    this.price = Number(this.advertising.price).cut(3)
    this.startAmount = this.advertising.startAmount
    this.endAmount = this.advertising.endAmount
    this.lowestPrice = this.advertising.lowestPrice
    this.pricePercent = Number((this.advertising.pricePercent - 1) * 100).cut(2)
    if (typeof this.advertising.payType === 'string') {
      this.payType = this.advertising.payType.split(',')
    }
    if (typeof this.advertising.tranSet === 'string') {
      this.tranSet = this.advertising.tranSet.split(',')
    }

    // 2.查询余额
    this.$store.dispatch('encryptConnection', {
      url: '/wallet/selectRichWalletListUI',
      data: {}
    }).then(response => {
      const data = response.body.data
      for (let i in data) {
        const coinName = data[i].dictionariesId
        this.assetList[coinName] = data[i]
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
</script>

<style scoped>
.bh-font_size__big_all{
  font-size:14px;
  color:#333333;
  letter-spacing:3.6px;
}
.bh_size__big_all{
  font-size:14px;
  color:#333333;
}
/*复选框*/
.bh_input_all{
  border:1px solid #d8d8d8;
  border-radius:2px;
  width:12px;
  height:12px;
}
</style>
