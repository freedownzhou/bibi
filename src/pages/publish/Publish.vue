<template>
  <div class="bh-publish_root">
    <header class="bh-background_main">
      <navigation></navigation>
    </header>

    <main>
      <!--1交易发布说明-->
      <div class="bh-publish_explain">
        <div class="bh-color_dark bh-font_size__large">免费发布场外交易商家广告</div>
        <div class="bh-publish_explain-content">
          <!--1.1满足申请的条件-->
          <div><span class="bh-serial-number">1</span><span class="bh-font_size__big bh-color_dark">满足申请条件</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">通过实名中级认证</span>
            <span class="bh-font_size__big bh-color_dark" style="cursor: pointer;" v-if="user.identityAuthenticator<3">不符合</span>
            <span class="bh-font_size__big bh-color_dark" v-else>符合</span>
            <button class="bh-btn_plain" v-if="user.identityAuthenticator<3" @click="$router.push({name: 'Authentication'})">去认证</button>
          </div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">场外交易 ≥5笔</span><span class="bh-font_size__big bh-color_dark">（您已成交{{record}}笔)。</span>
          </div>
          <!--1.2费用说明-->
          <div><span class="bh-serial-number">2</span><span class="bh-font_size__big bh-color_dark">费用说明</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">{{currency}}广告费：2018-9-20 0:00 ~ 2018-12-31 23:59免费。</span>
          </div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">{{currency}}成交手续费：成交额的{{wallet[currency] ? (wallet[currency]['platformRate'] * 100) : 0.1}}%</span>
          </div>
          <!--1.3展示说明-->
          <div><span class="bh-serial-number">3</span><span class="bh-font_size__big bh-color_dark">展示说明</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">广告有效期：15天</span>
          </div>
          <!--<div>-->
            <!--<span class="bh-serial-number bh-visibility_hidden"></span>-->
            <!--<span class="bh-font_list">账户余额需大于 0.1 BTC，广告才可展示，若少于0.1个BTC，您需要用比特币为您的8bihui钱包充值。</span>-->
          <!--</div>-->
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="bh-font_list">若您想直接编辑已创建的广告，请查看<button @click="$router.push({name: 'MyAdvertising'})" class="bh-btn_text bh-color_select">我的交易广告。</button></span>
          </div>
        </div>
      </div>
      <!--2发布交易设置-->
      <div class="bh-publish_settings">
        <div class="bh-color_dark bh-font_size__large">发布交易广告</div>
        <div class="bh-publish_settings-content">
          <!--2.1交易类型-->
          <el-row>
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">交易类型</span>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="businType" label="1" class="bh-font_size__big">购买</el-radio>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="businType" label="2" class="bh-font_size__big">出售</el-radio>
            </el-col>
            <el-col :span="16">
              <span style="font-size:12px;color:#666666;">如果您希望出售数字货币，请确保您在8bihui的钱包中有数字货币。</span>
            </el-col>
          </el-row>
          <!--2.2交易币种-->
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">交易币种</span>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="currency" label="BTC" class="bh-font_size__big">BTC</el-radio>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="currency" label="ETH" class="bh-font_size__big">ETH</el-radio>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="currency" label="GXC" class="bh-font_size__big">GXC</el-radio>
            </el-col>
            <el-col :span="2" v-if="!/BTC|ETH|GXC/.test(currency)">
              <el-radio v-model="currency" :label="currency" class="bh-font_size__big">{{currency}}</el-radio>
            </el-col>
            <el-col :span="2" style="margin:-5px 0 0 80px;">
              <el-select v-model="currency" filterable placeholder="搜索" style="border:0 solid #d8d8d8;width:153px;height:22px;">
                <el-option
                  v-for="item in coins"
                  :key="item.symbol"
                  :label="item.symbol"
                  :value="item.symbol">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!--2.3交易法币-->
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">交易法币</span>
            </el-col>
            <el-col :span="2">
              <el-radio v-model="priceCurrencyType" label="CNY" class="bh-font_size__big">CNY</el-radio>
            </el-col>
            <!--<el-col :span="2">-->
              <!--<el-radio v-model="priceCurrencyType" label="USD" class="bh-font_size__big">USD</el-radio>-->
            <!--</el-col>-->
          </el-row>
          <!--2.4固定价格交易-->
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">固定价格交易</span>
            </el-col>
            <!--打开、关闭按钮-->
            <el-col :span="2" >
              <el-switch v-model="isFixedPrice" active-color="#4bd763" inactive-color="#DDDFE6"></el-switch>
            </el-col>
            <!--可隐藏可显示、可隐藏可显示-->
            <el-col :span="18" v-show="isFixedPrice">
              <i class="iconfont icon-tanhao"></i>
              <span style="font-size:12px;color:#ff7c44;">启用后，您的交易价格不随币价波动，固定值不变。</span>
            </el-col>
          </el-row>
          <!--可显示、可隐藏-->
          <div v-show="isFixedPrice">
            <!--2.5出售价设置-->
            <el-row style="margin-top: 20px;">
              <el-col :span="4">
                <span class="is_blue"></span>
                <span class="bh-font_size__big">交易价设置</span>
              </el-col>
              <el-col :span="7">
                <div @keyup="numberFilter(price, 'price')">
                  <el-input v-model="price" type="number" step="0.01" maxlength="10" @focus="priceFocus=true" placeholder="不随市场波动价改变出售价格" style="border:0 solid #d8d8d8;border-radius:4px;width:324px;height:33px;"></el-input>
                </div>
                <transition name="el-fade-in-linear">
                  <span  v-if="priceFocus && !checkPrice" class="bh-hint bh-color_prompt" style="position: absolute;top: 35px;left: 194px;">{{isPricemsg}}</span>
                </transition>
              </el-col>
              <el-col :span="4">
                <span v-if="priceCurrencyType==='USD'" class="bh-color_select">
                  当前行情价格:{{otherAsset.price}}$
                </span>
                <span v-else class="bh-color_select">
                  当前行情价格:{{Number(otherAsset.price * ratesCNY).cut(4)}}￥
                </span>
              </el-col>
            </el-row>
            <!--2.6支付方式-->
            <el-row style="margin-top: 20px;">
              <el-col :span="4">
                <span class="is_blue"></span>
                <span class="bh-font_size__big">支付方式</span>
              </el-col>
              <el-col :span="3" v-if="user.isOpenWechat===1">
                <el-checkbox v-model="checkedOne" class="bh-font_size__big">微信支付</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenAlipay===1">
                <el-checkbox v-model="checkedTwo" class="bh-font_size__big">支付宝</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenBank===1">
                <el-checkbox v-model="checkedThree" class="bh-font_size__big">银行转账</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenPaypal===1">
                <el-checkbox v-model="checkedFour" class="bh-font_size__big">PayPal</el-checkbox>
              </el-col>
              <el-col :span="3">
                <span style="font-size:16px;color:#0bb2fe;cursor: pointer;" @click="$router.push({name:'TransactionSettings'})">支付方式设置</span>
              </el-col>
            </el-row>
          </div>
          <!--可隐藏可显示、可隐藏可显示-->
          <div v-show="!isFixedPrice">
            <!--对标交易所-->
            <!--<el-row style="margin-top: 20px;">-->
              <!--<el-col :span="4">-->
                <!--<span class="is_blue"></span>-->
                <!--<span class="bh-font_size__big">对标交易所</span>-->
              <!--</el-col>-->
              <!--<el-col :span="4">-->
                <!--<el-select v-model="exchangeResourceId" filterable style="border:0 solid #d8d8d8;width:324px;height:33px;">-->
                  <!--<el-option-->
                    <!--v-for="item in exchangeResources"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-col>-->
              <!--&lt;!&ndash;<el-col :span="4" style="margin-left: 150px;">&ndash;&gt;-->
                <!--&lt;!&ndash;<span style="font-size:12px;color:#999999;"><span style="color:#0bb2fe;">9999.00</span>CNY/eth,当前市场最低出售价。</span>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
            <!--</el-row>-->
            <!--出售价设置-->
            <el-row style="margin-top: 20px;">
              <el-col :span="4">
                <span class="is_blue"></span>
                <span class="bh-font_size__big">出售价设置</span>
              </el-col>
              <el-col :span="4">
                <div style="background:#f2f3f8;width:325px;height:47px;">
                  <bh-slider @getValue="lstGetValue"></bh-slider>
                </div>
              </el-col>
              <el-col :span="4" style="margin-left: 150px;" v-if="otherAsset">
                <span v-if="priceCurrencyType==='USD'" style="font-size:12px;color:#999999;"><span style="color:#0bb2fe;">
                  {{Number(otherAsset.price * ((pricePercent / 100) + 1)).cut(4)}}</span>USD/{{currency}},您设置的报价。
                </span>
                <span v-else style="font-size:12px;color:#999999;"><span style="color:#0bb2fe;">
                  {{Number(otherAsset.price * ratesCNY * ((pricePercent / 100) + 1)).cut(4)}}</span>CNY/{{currency}},您设置的报价。
                </span>
                <br>
                <span v-if="priceCurrencyType==='USD'" class="bh-color_select">
                  当前行情价格:{{otherAsset.price}}$
                </span>
                <span v-else class="bh-color_select">
                  当前行情价格:{{Number(otherAsset.price * ratesCNY).cut(4)}}￥
                </span>
              </el-col>
              <el-col :span="4">
                <el-tooltip class="item" effect="light" content="为基于市场价格的溢出比例，基础市场价来源于您设置的交易所的对标价格，设定适当的溢价比例能让您的广告报价处于合理范围，比如当前价格为100，溢价比例为5%，那么价格为105."  placement="top-end">
                  <img class="bh-icon_hover" src="../../assets/images/hello_1.svg" style="width: 17px; height: 17px;display: inline-block;">
                </el-tooltip>
              </el-col>
            </el-row>
            <!--最低单价设置-->
            <el-row style="margin-top: 20px;">
              <el-col :span="4">
                <span class="is_blue"></span>
                <span class="bh-font_size__big" v-if="businType==='1'">最高单价设置</span>
                <span class="bh-font_size__big" v-else>最低单价设置</span>
              </el-col>
              <el-col :span="3">
                <input v-if="businType==='1'" type="text" placeholder="设置您可接受的最高单价，留空，则不设置。" v-model="lowestPrice" style="border:0.5px solid #d8d8d8;border-radius:4px;width:324px;height:33px;">
                <input v-else type="text" placeholder="设置您可接受的最低单价，留空，则不设置。" v-model="lowestPrice" style="border:0.5px solid #d8d8d8;border-radius:4px;width:324px;height:33px;">
              </el-col>
              <el-col :span="3">
                <el-tooltip class="item" effect="light" content="该设置可保护您的广告在低于最低价时无法进行交易，比如设置最低价为2000，而市场价处于2000以下时，您的广告将无法下单交易。"  placement="top-end" style="">
                  <img class="bh-icon_hover" src="../../assets/images/hello_1.svg" style="width: 17px; height: 17px;display: inline-block;margin-left: 196px;">
                </el-tooltip>
              </el-col>
            </el-row>
            <!--支付方式-->
            <el-row style="margin-top: 20px;">
              <el-col :span="4">
                <span class="is_blue"></span>
                <span class="bh-font_size__big">支付方式</span>
              </el-col>
              <el-col :span="3" v-if="user.isOpenWechat===1">
                <el-checkbox v-model="checkedOne" class="bh-font_size__big">微信支付</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenAlipay===1">
                <el-checkbox v-model="checkedTwo" class="bh-font_size__big">支付宝</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenBank===1">
                <el-checkbox v-model="checkedThree" class="bh-font_size__big">银行转账</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenPaypal===1">
                <el-checkbox v-model="checkedFour" class="bh-font_size__big">PayPal</el-checkbox>
              </el-col>
              <el-col :span="3">
                <span style="font-size:16px;color:#0bb2fe;cursor: pointer;" @click="$router.push({name:'TransactionSettings'})">支付方式设置</span>
              </el-col>
            </el-row>
          </div>
          <!--交易限额-->
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">交易限额</span>
            </el-col>
            <el-col :span="8">
              <div @keyup="numberFilter(startAmount, 'startAmount')">
                <el-input placeholder="每笔交易的最低交易金额" v-model="startAmount" type="number" onpaste="return false;" style="border:0 solid #d8d8d8;border-radius:2px;width:274px;height:33px;">
                  <template slot="append">{{priceCurrencyType}}</template>
                </el-input>
              </div>
              <p style="font-size:14px;color:#666666;">最小限额:小于最大限额且大于20</p>
            </el-col>
            <el-col :span="8">
              <div @keyup="numberFilter(endAmount, 'endAmount')">
                <el-input placeholder="每笔交易的最高交易金额" v-model="endAmount" type="number" style="border:0 solid #d8d8d8;border-radius:2px;width:274px;height:33px;">
                  <template slot="append">{{priceCurrencyType}}</template>
                </el-input>
              </div>
              <p style="font-size:14px;color:#666666;">最大限额:大于最小限额且小于100000</p>
            </el-col>
          </el-row>
          <!--交易限额设置-->
          <el-row style="margin-top: 10px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">交易限制设置</span>
            </el-col>
            <el-checkbox-group v-model="tranSet">
              <el-col :span="4">
                <el-checkbox label="1" class="bh-checkbox"></el-checkbox>
                <span class="bh-font_size__big bh-text-size">禁止初级认证用户交易</span>
              </el-col>
              <el-col :span="4">
                <el-checkbox label="2" class="bh-checkbox"></el-checkbox>
                <span class="bh-font_size__big bh-text-size">禁止中级认证用户交易</span>
              </el-col>
              <!--<el-col :span="4">-->
                <!--<el-checkbox label="3" class="bh-checkbox"></el-checkbox>-->
                <!--<span class="bh-font_size__big bh-text-size">禁止高级认证用户交易</span>-->
              <!--</el-col>-->
              <!--<el-col :span="4">-->
                <!--<el-checkbox label="4" class="bh-checkbox"></el-checkbox>-->
                <!--<span class="bh-font_size__big bh-text-size">仅限受信任的交易者</span>-->
              <!--</el-col>-->
              <!--<el-col :span="4" style="margin-left: -14px;">-->
                <!--<el-checkbox label="5" class="bh-checkbox"></el-checkbox>-->
                <!--<span class="bh-font_size__big bh-text-size">禁止新手交易(0次交易)</span>-->
              <!--</el-col>-->
            </el-checkbox-group>
          </el-row>
          <!--注意事项-->
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <span class="is_blue"></span>
              <span class="bh-font_size__big">注意事项</span>
            </el-col>
            <el-col>
              <div style="background:#fafafa;width:980px;height:254px;margin: -15px 0 20px 190px;">
                <ul style="margin-left: 10px;">
                  <li style="font-size:14px;color:#ff7c44;padding-top: 22px;">1、为了保证用户的交易安全，将采用数字货币托管系统，严禁绕过平台私下交易，违者将自行承担损失，且永久封号。</li>
                  <li style="font-size:14px;color:#ff7c44;margin-top: 8px;">2、发布广告后请履行契约精神，恶意抬价或者是反悔，被投诉将冻结账户3-14天不等。</li>
                  <li style="font-size:14px;color:#ff7c44;margin-top: 8px;">3、请勿在8bihui尝试欺诈行为，违者将会导致账号被冻结，并承担法律责任。</li>
                </ul>
                <div style="margin-top: 20px;">
                  <ul style="margin-left: 10px;">
                    <li class="bu_li_color"><span class="bh-serial-number">1</span> 交易过程中，请先确认款项入账后再释放数字货币。</li>
                    <li class="bu_li_color"><span class="bh-serial-number">2</span> 交易过程中，不要透露与您账户安全有关的敏感资讯。</li>
                    <li class="bu_li_color"><span class="bh-serial-number">3</span> 不要直接透露你的电子邮箱给买家，否则有可能会收到诈骗信件，及对账户安全造成危害。</li>
                    <li class="bu_li_color"><span class="bh-serial-number">4</span> 永远确保你在正确的8bihui网站上，请将网站记录在书签上，避免误闯钓鱼网站。</li>
                    <li class="bu_li_color"><span class="bh-serial-number">5</span> 8bihui员工和客服将不会以官方名义与您进行交易，请不要与自称是8bihui的员工进行交易，避免利益损失。</li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
          <!--发布交易广告-->
          <el-row style="text-align: center;">
            <button class="bh-btn_primary bh-font_size__big" @click="commit" style="width:248px;height:44px;" :disabled="committing">
              <i v-if="committing" class="el-icon-loading"></i>
              <span v-else>发布交易广告</span>
            </button>
          </el-row>
        </div>
      </div>
    </main>

    <!--&lt;!&ndash;广告编辑2.0&ndash;&gt;-->
    <!--<edit-ad :visible.sync="editAd"></edit-ad>-->
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
import BHSlider from '../../components/BHSlider'
export default {
  components: {
    Navigation,
    BhSlider: BHSlider
  },
  data () {
    return {
      // 完成交易条数
      record: 0,
      // 交易类型:1买入;2卖出
      businType: '1',
      // 交易币种
      currency: 'BTC',
      // 交易法币
      priceCurrencyType: 'CNY',
      // 是否固定价格:1是，0否
      isFixedPrice: false,
      // 出售单价
      price: null,
      // 溢价比例
      pricePercent: 0,
      // 最低价格设置
      lowestPrice: null,
      // 单选框选择
      checkedOne: false,
      checkedTwo: false,
      checkedThree: false,
      checkedFour: false,
      // 出售价设置
      isPricemsg: '交易价格不能为空或零!',
      priceFocus: false,
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
      // 钱包信息
      wallet: {},
      // 资产列表
      assetList: {}
    }
  },
  computed: {
    ratesCNY () {
      if (JSON.stringify(this.$store.getters.getRate) !== '{}') {
        return this.$store.getters.getRate.rates.CNY
      } else {
        return 1
      }
    },
    otherAsset () {
      if (this.$store.getters.getOtherAsset[this.currency]) {
        return this.$store.getters.getOtherAsset[this.currency]
      } else {
        return {
          price: 0
        }
      }
    },
    coins () {
      const list = []
      Object.assign(list, this.$store.getters.getPlatformCoinList)
      for (let i in list) {
        if (/cc/.test((list[i]['symbol'] + '').toLowerCase()) || /adc/.test((list[i]['symbol'] + '').toLowerCase())) {
          list.splice(i, 1)
        }
      }
      return list
    },
    user () {
      return this.$store.getters.getUser
    },
    disabled () {
      // 1.交易方式
      // 2.固定价格时价格必须
      // 3.场外交易大于五笔
      // 4.实名认证通过中级
      // 5.交易限额开始必须小于结束
      const startAmountNumber = Number(this.startAmount)
      const endAmountNumber = Number(this.endAmount)
      return (this.checkedOne || this.checkedTwo || this.checkedThree || this.checkedFour) &&
        ((this.isFixedPrice && Number(this.price) > 0) || !this.isFixedPrice) &&
        this.record >= 5 &&
        (!this.lowestPrice || (this.lowestPrice && this.lowestPrice >= 0)) &&
        this.$store.getters.getUser.identityAuthenticator > 2 &&
        startAmountNumber >= 20 &&
        endAmountNumber <= 100000 &&
        startAmountNumber < endAmountNumber &&
        // 卖出时，余额*价格必须在限额范围内：最小限额小于等于余额
        (
          this.businType === '1' ||
          (
            this.businType === '2' && (
              (this.isFixedPrice && startAmountNumber <= this.price * this.assetList[this.currency].balance) ||
              (!this.isFixedPrice && startAmountNumber <= this.$store.getters.convertToCNY(this.currency, this.assetList[this.currency].balance).toFixed(2))
            )
          )
        )
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
    }
  },
  methods: {
    lstGetValue (data) {
      this.pricePercent = data.value
    },
    commit () {
      if (this.record < 5) {
        this.$message.error('请先完成五笔场外交易')
        return
      }
      const startAmountNumber = Number(this.startAmount)
      const endAmountNumber = Number(this.endAmount)
      if (this.$store.getters.getUser.identityAuthenticator <= 2) {
        this.$message.error('请完成中级实名认证')
        return
      }
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
        let fPrice = Number(this.otherAsset.price * this.ratesCNY * ((this.pricePercent / 100) + 1)).cut(4)
        // 买入限制最高单价
        if (this.businType === '1' && (this.lowestPrice && (this.lowestPrice <= fPrice))) {
          this.$message.error('最高单价必须大于当前设置价格')
          return
        }
        // 卖出限制最低单价
        if (this.businType === '2' && (this.lowestPrice && (this.lowestPrice >= fPrice))) {
          this.$message.error('最低单价必须小于当前设置价格')
          return
        }
      }
      if (!(this.checkedOne || this.checkedTwo || this.checkedThree || this.checkedFour)) {
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
      if (this.businType === '2' && !(this.assetList[this.currency] && this.assetList[this.currency].balance)) {
        this.$message.error('该币种余额不足')
        return
      }
      if (!(
        this.businType === '1' ||
        (
          this.businType === '2' && (
            (this.isFixedPrice && startAmountNumber <= this.price * this.assetList[this.currency].balance) ||
            (!this.isFixedPrice && startAmountNumber <= this.$store.getters.convertToCNY(this.currency, this.assetList[this.currency].balance).toFixed(2))
          )
        ))
      ) {
        this.$message.error('该币种余额总价不能小于最低限额')
        return
      }

      this.committing = true
      let payType = ''
      if (this.checkedOne) {
        payType = '1'
      }
      if (this.checkedTwo) {
        payType += payType ? ',2' : '2'
      }
      if (this.checkedThree) {
        payType += payType ? ',3' : '3'
      }
      if (this.checkedFour) {
        payType += payType ? ',4' : '4'
      }
      let startAmount = this.startAmount
      let endAmount = this.endAmount
      if (this.startAmount === 0 && this.endAmount === 0) {
        startAmount = null
        endAmount = null
      }
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/addBussinssResourceUI',
        data: {
          // 最小限额
          startAmount: startAmount,
          // 最大限额
          endAmount: endAmount,
          // 单价
          price: Number(this.price),
          // 价格(币种)
          priceCurrencyType: this.priceCurrencyType === 'CNY' ? 1 : 2,
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
          payType: payType,
          // 交易设置
          tranSet: this.tranSet.toString(),
          // 是否启动固定价格交易
          isFixedPrice: this.isFixedPrice ? '1' : '0',
          // 对接交易所
          exchangeResourceId: this.exchangeResourceId

        }
      }).then(response => {
        this.committing = false
        this.$message.success('交易发布成功!')
        this.$router.push({name: 'MyAdvertising'})
      }, response => {
        if (response.body.code === 666) {
          return
        }
        switch (response.body.code) {
          case 666:
            return
          case 'NO_004':
            this.$message.error('余额不足!')
            break
          case 'NO_005':
            this.$message.error('请先绑定银行卡!')
            break
          case 'BS_2034':
            this.$message.error('已经存在该币种的广告!')
            break
          default:
            this.$message.error(response.body.msg)
            break
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
    this.$store.dispatch('encryptConnection', {
      url: '/assetRecord/queryAssetRecordListUI',
      data: {}
    }).then(response => {
      this.record = response.body.totalCount || 0
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
    // 获取用户信息
    this.$store.dispatch('queryUserInfo').then(response => {}, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })

    // 获取平台费率
    this.$store.dispatch('encryptConnection', {
      url: '/wallet/selectWalletListUI',
      data: {}
    }).then(response => {
      const data = response.body.data
      let temp = {}
      for (let i in data) {
        temp[data[i]['dictionariesId']] = data[i]
      }
      this.wallet = temp
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })

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
  main {
    background-color: #F2F3F8;
    padding-top: 20px;
    padding-bottom: 80px;
  }

  main>div {
    width: 1200px;
    margin: auto;
  }

  /*1.发布交易说明*/
  /*1.1标题*/
  .bh-publish_explain>div:first-child{
    background: #f9f7fe;
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
  }
  /*1.2内容*/
  .bh-publish_explain-content {
    padding: 18px 18px 21px 18px;
    background-color: #FFF;
  }

  .bh-publish_explain-content .bh-serial-number {
    margin-right: 7px;
  }

  .bh-visibility_hidden {
    visibility: hidden;
  }

  /*1.2.1满足申请条件*/
  .bh-publish_explain-content>div:nth-child(2) {
    margin-top: 10px;
  }

  .bh-publish_explain-content>div:nth-child(2)>:nth-child(3) {
    display: inline-block;
    margin-left: 9px;
    margin-right: 36px;
    padding: 2px 10px;
    background-color: #FFEEEE;
    color: #f55858;
    font-size: 12px;
  }

  .bh-publish_explain-content>div:nth-child(2)>:nth-child(4) {
    border-radius: 999px;
  }

  /*1.2.2费用说明*/
  .bh-publish_explain-content>:nth-child(4) {
    margin-top: 20px;
  }

  .bh-publish_explain-content>:nth-child(5) {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  /*1.2.3展示说明*/
  .bh-publish_explain-content>:nth-child(7) {
    margin-top: 20px;
  }

  .bh-publish_explain-content>:nth-child(8) {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .bh-publish_explain-content>:nth-child(9) {
    margin-bottom: 5px;
  }

  .bh-publish_explain-content>:nth-child(10) .bh-btn_text{
    color: #0BB2FE;
  }

  /*2.发布交易设置 */
  .bh-publish_settings {
    margin-top: 20px;
  }
  /*2.1标题*/
  .bh-publish_settings>:first-child {
    background: #f9f7fe;
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
  }

  /*2.1内容*/
  .bh-publish_settings-content {
    padding: 25px 18px 25px 18px;
    background-color: #FFF;
  }
  /*蓝色小竖条*/
  .is_blue{
    background:#7cd6ff;
    width:2px;
    height:16px;
    display: inline-block;
  }
  .bu_li_color{
    font-size:14px;
    color:#666666;
    margin-bottom:6px;
  }
  /*复选框*/
  .bh_input_all{
    border:1px solid #d8d8d8;
    border-radius:2px;
    width:12px;
    height:12px;
  }
  .bh-text-size{
    margin-left: 6px;
  }
</style>
