<template>
  <div class="bh-root otc">
    <header>
      <navigation :full-width="true"></navigation>
    </header>

    <main>
      <!--轮播图-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img1.png"/>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img2.png"/>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img3.png"/>
          </div>
        </div>
        <!--<div class="swiper-button-prev"></div>&lt;!&ndash;左箭头&ndash;&gt;-->
        <!--<div class="swiper-button-next"></div>&lt;!&ndash;右箭头&ndash;&gt;-->
      </div>

      <div class="bh-wrap_content">
        <div style="min-width: 437px;">
          <!--指数-->
          <div class="bh-exponent">
              <!--币种搜索-->
            <div class="bh-exponent_div">
              <div class="is_div">
                <div style="background:#f2f3f8;border-radius:2px 2px 0 0;width:100%;height:41px;text-align: center;">
                  <template>
                    <el-select v-model="value6" filterable placeholder="币种搜索" style="background:#ffffff;border-radius:4px;width:90%;height:26px;margin-top: 7px;" @change="chooseCoin">
                      <el-option
                        v-for="item in platformCoinList"
                        :key="item.symbol"
                        :label="item.symbol"
                        :value="item.symbol">
                      </el-option>
                    </el-select>
                  </template>
                  <el-col>
                    <ul class="is_ul" style="padding-top: 8px;cursor: pointer;height: 360px;overflow: scroll;">
                      <li v-for="item in platformCoinList" :key="item.symbol" :class="{'is_active': isActive===item.symbol}" @click="chooseCoin(item.symbol)">{{item.symbol}}</li>
                    </ul>
                  </el-col>
                </div>
              </div>
              <!--指数可视化-->
              <div class="exponent">
                <div>
                  <span class="bh-font_normal">{{isActive}}指数</span>
                  <!--<span class="bh-font_list">法币交易&nbsp;&nbsp;<span class="bh-color_select">CNY</span></span>-->
                  <span class="bh-color_prompt">{{Number(otherAsset.price * ratesCNY).cut(4)}}&nbsp;CNY<span class="bh-font_size__small">&nbsp;&nbsp;{{otherAsset['change_daily']}}%</span></span>
                </div>
                <div id="echarts"></div>
              </div>
            </div>
          </div>

          <!--常见问题-->
          <div class="bh-question">
            <el-row style="width:100%;height:50px;font-size: 16px; color: #333333;background:#ffffff;box-shadow:0 2px 3px 0 #f2f3f8;line-height: 50px;">
              <img src="../../assets/images/star.svg" alt="" style="display: inline-block;width: 16px;height: 16px;margin-left: 32px;">
              <span style="display: inline-block;margin-left: 0px;cursor: pointer;"><a target="_blank" @click="$router.push({ name: 'MoreOpen', params: {myId: questionTitle.categoryId, type: 2, myname: '常见问题'} })">常见问题</a></span>
            </el-row>
            <ul class="bh-curcos-all">
              <li v-for="(item,index) in questionTitle.helps" :key="item.id" class="bh_li apostrophe-one"><a class="bh-help" target="_blank" @click="xiangxi_jump(index)"><span class="bh-serial-number">{{ index+1 }}</span> {{item.title}}</a></li>
            </ul>
          </div>
        </div>

        <!--交易广告筛选条件-->
        <div class="bh-transaction">
          <div class="bh-transaction_menu" style="position: relative;">
              <span style="cursor: pointer;width: auto;" class="bh-font_size__big bh-color_dark bh-curcos-all" :class="{active: transactionType===2}" @click="transactionType=2">买入{{coin}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="cursor: pointer;width: auto;" class="bh-font_size__big bh-color_dark bh-curcos-all" :class="{active: transactionType===1}" @click="transactionType=1">卖出{{coin}}</span>
              <!--交易金额-->
                  <el-select v-model="amount"  style="width: 130px;height: 34px;position: absolute;right:22%;">
                    <el-option
                      v-for="item in [{label: '交易金额', value: '0'}, {label: '小于一万', value: '1'}, {label: '小于五万', value: '2'}, {label: '大于五万', value: '3'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                <!--支付方式-->
                  <el-select v-model="pattern" style="width: 130px;height: 34px;position: absolute;right:3%;">
                    <el-option
                      v-for="item in [{label: '所有支付方式', value: '0'}, {label: '微信', value: '1'}, {label: '支付宝', value: '2'}, {label: '银行卡', value: '3'}, {label: 'PayPal', value: '4'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
          </div>
          <!--交易广告-->
          <div class="bh-transaction_content">
            <el-table :data="transactionList" v-loading="queryStatus" stripe height="620">
              <el-table-column label="商家" fixed min-width="125">
                <template slot-scope="scope">
                <span class="bh-transaction_headimg">
                  <img src="../../assets/images/headimg.png">
                  <i></i>
                </span>
                  <div style="margin: -40px 0 10px 50px;">
                    <span class="bh-transaction_name" style="word-break: keep-all;">{{scope.row.name}}&nbsp;</span>
                    <div v-if="scope.row.isAuth === 'Y'">
                      <span class="bh-transaction_staus">已实名</span>
                      <span style="vertical-align: middle;line-height: normal;display: inline-block;">
                        <img class="bh-transaction_certification" src="../../assets/images/certification.svg">
                      </span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单数/好评/信任">
                <template slot-scope="scope">
                  <span>单数</span>
                  <span class="">{{scope.row.assetCount ? scope.row.assetCount : '0'}}</span>
                  <span>好评</span>
                  <span class="">{{scope.row.goodCommentCount ? scope.row.goodCommentCount : '0'}}</span>
                  <span>信任</span>
                  <span class="">{{scope.row.trustCount ? scope.row.trustCount : '0'}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column label="库存" prop="stockQuantity"></el-table-column>-->
              <el-table-column label="支付方式">
                <template slot-scope="scope">
                  <span v-if="/1/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../assets/images/owechat.svg"></span>
                  <span v-if="/2/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../assets/images/oalipay.svg"></span>
                  <span v-if="/3/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../assets/images/obank.svg"></span>
                  <span v-if="/4/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../assets/images/opaypal.svg"></span>
                </template>
              </el-table-column>
              <el-table-column label="单笔限额">
                <template slot-scope="scope">
                  <span style="">{{scope.row.startAmount || 20}}-{{scope.row.endAmount || 100000}}({{/1/.test(scope.row.priceCurrencyType) ? 'CNY' : 'USD'}})</span>
                </template>
              </el-table-column>
              <el-table-column label="交易价格">
                <template slot-scope="scope">
                  <span class="bh-color_select">{{/1/.test(scope.row.priceCurrencyType) ? 'CNY' : 'USD'}} {{Number(scope.row.price).cut(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.businType === '2'" @click="exchange(true, scope.row)" style="background:#02c087;border-radius:4px;width:60px;height:24px;padding: 0;font-size:12px;color:#ffffff;" :disabled="scope.row.userId === user.userId">买入</el-button>
                  <el-button v-else @click="exchange(false, scope.row)" style="background:#f65858;border-radius:4px;width:60px;height:24px;padding: 0;font-size:12px;color:#ffffff;" :disabled="scope.row.userId === user.userId">卖出</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="text-align: center;height:40px; line-height:40px;font-size:14px;color:#0bb2fe;">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="6"
                :total="totalCount"
                layout="total, prev, pager, next, jumper">
              </el-pagination>
              <!--<span v-else class="bh-curcos-all" @click="()=>{this.transactionType=2; this.showMore=true;}">显示更多</span>-->
            </el-row>
          </div>
        </div>
      </div>

      <!--订单-->
      <a id="order" href="#order" ref="order"></a>
      <div class="bh-order">
        <div class="bh-order_menu" style="position: relative">
          <el-row>
            <el-col :span="2">
              <span class="bh-font_size__big bh-color_dark" :class="{'bh-color_select': orderMenuSelected==='ongoing'}" @click="orderMenuSelected='ongoing'">进行中订单</span>
            </el-col>
            <el-col :span="2">
              <span class="bh-font_size__big bh-color_dark" :class="{'bh-color_select': orderMenuSelected==='completed'}" @click="orderMenuSelected='completed'">已完成订单</span>
            </el-col>
            <el-col :span="2">
              <span class="bh-font_size__big bh-color_dark" :class="{'bh-color_select': orderMenuSelected==='cancel'}" @click="orderMenuSelected='cancel'">取消订单</span>
            </el-col>
            <i :class="{ongoing: orderMenuSelected==='ongoing', completed: orderMenuSelected==='completed', cancel: orderMenuSelected==='cancel'}"></i>
            <el-col :span="15">
              <span style="font-size:16px;color:#8ed8fa;position: absolute;right: -1%;" @click="$router.push({name:'ListManagement'})">名单管理</span>
            </el-col>
          </el-row>
        </div>

        <!--进行中的订单-->
        <div class="bh-order_ongoing" v-if="orderMenuSelected==='ongoing'" v-loading="ordersLoading">
          <div v-if="showOngoingOrder">
            <order-ongoing v-for="(order, index) in orderList" :key="index" :originOrder="order" @refresh="queryOrderList"></order-ongoing>
          </div>
          <!--暂无订单信息-->
          <div class="bh-order_none" v-else>
            <img src="../../assets/images/order.svg">
            <span class="bh-font_size__large bh-color_standard">暂无订单信息</span>
            <span class="bh-font_size__small bh-color_light">温馨提示：超过三笔取消订单，将被冻结当天下单权限。</span>
          </div>
        </div>
        <!--已完成订单-->
        <div class="bh-order_completed" v-if="orderMenuSelected==='completed'">
          <order-completed v-if="orderList && orderList.length !== 0" :originOrder="orderList" :orderTotalCount="orderTotalCount" :orderCurrentPage="orderCurrentPage" @refresh="queryOrderList"></order-completed>
          <!--暂无订单信息-->
          <div class="bh-order_none" v-else>
            <img src="../../assets/images/order.svg">
            <span class="bh-font_size__large bh-color_standard">暂无订单信息</span>
            <span class="bh-font_size__small bh-color_light">温馨提示：超过三笔取消订单，将被冻结当天下单权限。</span>
          </div>
        </div>
        <!--取消订单-->
        <div class="bh-order_cancel" v-else-if="orderMenuSelected==='cancel'">
          <order-canceled v-if="orderList && orderList.length !== 0" :originOrder="orderList" :orderTotalCount="orderTotalCount" :orderCurrentPage="orderCurrentPage" @refresh="queryOrderList"></order-canceled>
          <!--暂无订单信息-->
          <div class="bh-order_none" v-else>
            <img src="../../assets/images/order.svg">
            <span class="bh-font_size__large bh-color_standard">暂无订单信息</span>
            <span class="bh-font_size__small bh-color_light">温馨提示：超过三笔取消订单，将被冻结当天下单权限。</span>
          </div>
        </div>
      </div>
    </main>

   <footer>
     <bh-footer></bh-footer>
   </footer>
    <!--买入卖出-->
    <exchange-dialog :visible.sync="exchangeDialog" v-if="exchangeDialog" :businessId="otcBusinessId" :name="otcName" :startAmount="otcStartAmount" :endAmount="otcEndAmount" :coin="otcCoin" :type="otcType" :isFixedPrice="otcIsFixedPrice" :priceType="otcPriceType" :payType="otcPayType" :stock-quantity="stockQuantity" @success="queryOrderList"></exchange-dialog>
    <!--订单确认-->
    <order-confirmation :visible.sync="orderConfirmation"></order-confirmation>
    <!--未绑定支付方式-->
    <not-bound :visible.sync="notBound"></not-bound>
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
import BhFooter from '../../components/FooterIndex'
import ExchangeDialog from './dialog/ExchangeDialog'
import OrderConfirmation from './dialog/OrderConfirmation'
import NotBound from './dialog/NotBound'
import OrderOngoing from './OrderOngoing'
import OrderCompleted from './OrderCompleted'
import OrderCanceled from './OrderCanceled'
import Swiper from 'swiper'
export default {
  name: 'OtcTrading',
  components: {
    Navigation,
    BhFooter,
    ExchangeDialog,
    OrderConfirmation,
    NotBound,
    OrderOngoing,
    OrderCompleted,
    OrderCanceled
  },
  data () {
    return {
      // 1.推荐数据
      list: [
        {
          name: '李雷',
          tran: 45,
          number: 14,
          good: '95%'
        },
        {
          name: '春天的狗',
          tran: 60,
          number: 20,
          good: '98%'
        },
        {
          name: '177****0757',
          tran: 18,
          number: 5,
          good: '100%'
        },
        {
          name: '金牌玩家',
          tran: 20,
          number: 7,
          good: '100%'
        },
        {
          name: '高价收GXC',
          tran: 55,
          number: 22,
          good: '99%'
        },
        {
          name: '天雷滚滚',
          tran: 19,
          number: 5,
          good: '100%'
        }
      ],
      // 2.K线图配置对象
      kLineChart: null,
      kLineCoin: 'SPNC',
      // K线图搜索币种
      isActive: 'SPNC',
      // K线图行情数据
      kLineData: {
        timeList: [],
        priceList: [],
        turnoverList: []
      },
      stockQuantity: '',
      // 3.显示的交易广告类型1:买入；2：卖出；0：一半买入，一半卖出
      transactionType: 2,
      // 交易广告币种
      coin: 'SPNC',
      // 交易广告筛选金额
      amount: '0',
      // 交易广告支付方式筛选
      pattern: '0',
      // 交易广告数据
      transactionList: [],
      // 4.交易对话框
      exchangeDialog: false,
      // 交易对话框属性：买卖交易广告ID
      otcType: true,
      otcBusinessId: 0,
      otcName: '',
      otcEndAmount: 0,
      otcStartAmount: 0,
      otcCoin: '',
      otcIsFixedPrice: 1,
      otcPriceType: 'CNY',
      otcPayType: '',
      // 确认订单对话框
      orderConfirmation: false,
      notBound: false,
      // 5.进行中订单、已完成订单、已取消订单
      orderMenuSelected: 'ongoing',
      order: true,
      // 交易广告查询中
      queryStatus: false,
      // 订单数据
      orderList: [],
      orderTotalCount: 0,
      orderCurrentPage: 0,
      // 所有订单的加载
      ordersLoading: false,
      // 支付方式查询中
      payTypeStatus: false,
      value6: '',
      // 显示更多、交易广告页码、总数
      showMore: false,
      currentPage: 1,
      totalCount: 0,
      // 存常见问题的问题标题
      questionTitle: [],
      // 进入页面的渠道：normal，share
      channel: 'normal'
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
      if (this.$store.getters.getOtherAsset[this.isActive]) {
        return this.$store.getters.getOtherAsset[this.isActive]
      } else {
        return {
          price: 0,
          change_daily: 0
        }
      }
    },
    user () {
      return this.$store.getters.getUser
    },
    canvasWidth () {
      return this.$store.getters.getScreenWidth
    },
    platformCoinList () {
      const list = []
      Object.assign(list, this.$store.getters.getPlatformCoinList)
      for (let i in list) {
        if (/cc/.test((list[i]['symbol'] + '').toLowerCase())) {
          list.splice(i, 1)
        }
      }
      return list
    },
    showOngoingOrder () {
      return this.orderList && this.orderList.length && this.$store.getters.getUser.userId
    }
  },
  watch: {
    canvasWidth () {
      if (this.kLineChart) {
        this.kLineChart.resize()
      }
    },
    orderMenuSelected () {
      this.orderList = []
      this.queryOrderList()
    },
    amount () {
      this.currentPage = 1
      this.totalCount = 0
      this.queryTransactionList()
    },
    pattern () {
      this.currentPage = 1
      this.totalCount = 0
      this.queryTransactionList()
    },
    transactionType () {
      if (this.channel === 'share') {
        this.channel = 'normal'
        this.currentPage = 1
        this.totalCount = 0
        return
      }
      this.currentPage = 1
      this.totalCount = 0
      this.queryTransactionList()
    }
  },
  methods: {
    // 常见问题跳转
    xiangxi_jump: function (index) {
      this.$router.push({ name: 'FrequentlyAskedQuestion', params: {type: 2, myId: this.questionTitle.categoryId, helpId: this.questionTitle.helps[index].id} })
    },
    // 选中币种进行查询
    chooseCoin (coin) {
      this.kLineData = {
        timeList: [],
        priceList: [],
        turnoverList: []
      }
      this.isActive = coin
      this.coin = coin
      this.queryLine()
      this.currentPage = 1
      this.totalCount = 0
      this.queryTransactionList()
    },
    // 查询行情折线图
    queryLine () {
      this.$http.get('/digitalAssets/findKLineDataUI?currency=' + this.isActive).then(response => {
        if (response.body.data) {
          const data = response.body.data
          let timeList = []
          let priceList = []
          let turnoverList = []
          for (let i in data) {
            timeList.push(new Date(parseInt(data[i][0])).format('hh:mm'))
            priceList.push(data[i][1])
            turnoverList.push(data[i][2])
          }
          this.$set(this.kLineData, 'timeList', timeList)
          this.$set(this.kLineData, 'priceList', priceList)
          this.$set(this.kLineData, 'turnoverList', turnoverList)
        }
        this.line()
      }, response => {
        if (response.body.data) {
          const data = response.body.data
          let timeList = []
          let priceList = []
          let turnoverList = []
          for (let i in data) {
            timeList.push(new Date(parseInt(data[i][0])).format('hh:mm'))
            priceList.push(data[i][1])
            turnoverList.push(data[i][2])
          }
          this.$set(this.kLineData, 'timeList', timeList)
          this.$set(this.kLineData, 'priceList', priceList)
          this.$set(this.kLineData, 'turnoverList', turnoverList)
        }
        this.line()
      })
    },
    line () {
      if (!this.kLineChart) {
        const echarts = require('echarts')
        this.kLineChart = echarts.init(document.getElementById('echarts'))
      }
      this.kLineChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.kLineData.timeList
        },
        yAxis: {
          show: false,
          max: 'dataMax',
          min: 'dataMax'
        },
        grid: {
          bottom: 20
        },
        series: [
          {
            name: '价格(USD)',
            type: 'line',
            smooth: false,
            showSymbol: false,
            symbolSize: 0,
            data: this.kLineData.priceList,
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: '#65CCFF'
              }
            },
            lineStyle: {
              normal: {
                color: '#65CCFF'
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(218,244,255,.4)' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#FFF' // 100% 处的颜色
                  }]
                }
              }
            }
          }]
      })
      this.kLineChart.resize()
    },
    // 查询交易广告列表
    queryTransactionList () {
      this.queryStatus = true
      // 1.交易金额
      let start = null
      let end = null
      switch (parseInt(this.amount)) {
        case 1:
          start = '0'
          end = '10000'
          break
        case 2:
          start = '0'
          end = '50000'
          break
        case 3:
          start = '50000'
          end = Number.MAX_SAFE_INTEGER + ''
          break
        default:
          start = null
          end = null
      }
      if (this.transactionType === 0) {
        // 一半买入、一半卖出
        let queryCount = 2
        this.transactionList = []
        this.$store.dispatch('encryptConnection', {
          url: '/bussinssResource/findAllBussinssResource',
          data: {
            pageSize: 5,
            pageNo: 0,
            businType: '1',
            currency: this.coin,
            startAmount: start,
            endAmount: end,
            payType: this.pattern === '0' ? undefined : this.pattern + ''
          }
        }).then(response => {
          this.transactionList = this.transactionList.concat(response.body.data)
          if (--queryCount) {
            this.queryStatus = false
          }
        }, response => {
          if (--queryCount) {
            this.queryStatus = false
          }
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
        this.$store.dispatch('encryptConnection', {
          url: '/bussinssResource/findAllBussinssResource',
          data: {
            pageSize: 5,
            pageNo: 0,
            businType: '2',
            currency: this.coin,
            startAmount: start,
            endAmount: end,
            payType: this.pattern === '0' ? undefined : this.pattern + ''
          }
        }).then(response => {
          if (this.transactionList) {
            this.transactionList = response.body.data.concat(this.transactionList)
          } else {
            this.transactionList = this.transactionList.concat(response.body.data)
          }
          if (--queryCount) {
            this.queryStatus = false
          }
        }, response => {
          if (--queryCount) {
            this.queryStatus = false
          }
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      } else {
        this.showMore = true
        // 全部买/卖
        this.$store.dispatch('encryptConnection', {
          url: '/bussinssResource/findAllBussinssResource',
          data: {
            pageSize: 6,
            pageNo: this.currentPage - 1,
            businType: this.transactionType + '',
            currency: this.coin,
            startAmount: start,
            endAmount: end,
            payType: this.pattern === '0' ? undefined : this.pattern + ''
          }
        }).then(response => {
          this.transactionList = []
          this.transactionList = response.body.data
          this.queryStatus = false
          this.totalCount = response.body.totalCount
        }, response => {
          this.queryStatus = false
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }
    },
    // 交易：交易类型，广告ID，限额-限额，币种
    exchange (exchangeType, exchangeData) {
      // 1.用户未登录限制
      if (!this.user.loginStatus) {
        this.$router.push({name: 'Login'})
        return
      }
      // 2.用户交易方式未设置限制
      if (!(this.user.isOpenBank || this.user.isOpenAlipay || this.user.isOpenWechat || this.user.isOpenPaypal)) {
        this.notBound = true
        return
      }
      this.otcType = exchangeType
      this.otcBusinessId = exchangeData.id
      this.otcStartAmount = exchangeData.startAmount
      this.otcEndAmount = exchangeData.endAmount
      this.otcCoin = exchangeData.currency
      this.otcIsFixedPrice = exchangeData.isFixedPrice
      this.otcPriceType = exchangeData.priceCurrencyType
      this.otcPayType = exchangeData.payType
      this.stockQuantity = exchangeData.stockQuantity
      this.exchangeDialog = true
    },
    // 查询订单
    queryOrderList (pageNo) {
      this.$refs.order.click()
      this.orderList = []
      if (this.$cookies.get('login_status')) {
        this.ordersLoading = true
        const type = this.orderMenuSelected === 'ongoing' ? 1 : this.orderMenuSelected === 'completed' ? 2 : this.orderMenuSelected === 'cancel' ? 3 : 1
        this.$http.get('/orders/listUI', {
          params: {
            type: type,
            pageSize: type !== 1 ? 5 : 100,
            pageNo: pageNo || 0
          }
        }).then(response => {
          this.orderList = response.body.data
          this.orderTotalCount = response.body.totalCount
          this.orderCurrentPage = pageNo
          this.ordersLoading = false
        }, response => {
          this.ordersLoading = false
        })
      } else {
        this.orderList = []
      }
    },
    // 查询支付账号信息
    queryPay (userId, item) {
      const type = item.selectedPay
      if (!item[type]) {
        this.payTypeStatus = true
        this.$http.post('/userinfo/getPayMethodsInfoUI', {
          userId: userId + '',
          type: type === '1' ? '3' : type === '2' ? '1' : type === '3' ? '4' : type === '4' ? '2' : ''
        }).then(response => {
          item[type] = response.body.data
          this.payTypeStatus = false
        }, response => {
          this.payTypeStatus = false
        })
      }
    },
    // 广告翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryTransactionList()
    }
  },
  mounted () {
    const type = this.$route.query.type
    if (type === 'id') {
      let id = this.$route.query.id || '0'
      id = window.atob(id)
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/findResourceByIdUI',
        data: {
          id: id
        }
      }).then(response => {
        this.channel = 'share'
        this.isActive = response.body.data[0].currency
        this.coin = response.body.data[0].currency
        this.transactionType = parseInt(response.body.data[0].businType)
        this.transactionList = response.body.data
      }, response => {})
    } else {
      this.coin = this.$route.params['coin'] || this.coin
      this.queryTransactionList()
    }
    this.queryLine()
    this.queryOrderList()
    if (this.$store.getters.getUser.loginStatus) {
      // 获取用户信息
      this.$store.dispatch('queryUserInfo').then(response => {}, response => {})
    }
    // swiper轮播图
    let swiper = new Swiper('.otc .swiper-container', {
      slidesPerView: 3, // slider容器能够同时显示的slides数量
      spaceBetween: 15, // 在slide之间设置距离（单位px）
      autoplay: 300000, // 钟总要求5分钟轮播一次
      speed: 1000,
      autoHeight: true, // 高度随内容变化
      loop: true,
      noSwiping: true, // 无法拖动
      pagination: '.otc .swiper-pagination'
    })
    swiper.init()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Login' && JSON.stringify(this.$route.query) !== '{}') {
      to.params.type = this.$route.query.type
      to.params.id = this.$route.query.id
    }
    next()
  },
  created () {
    // 查询带过来的币种名
    const defaultCoin = this.$route.params.coin || this.coin
    this.coin = defaultCoin
    this.isActive = defaultCoin
    // 查询常见问题
    this.$http.get('/help/listUI', {
      params: {
        type: 2
      }
    }).then(response => {
      for (let i = 0; i < response.body.data.length; i++) {
        if (response.body.data[i].category === '常见问题') {
          this.questionTitle = response.body.data[i]
        }
      }
    })
  }
}
</script>

<style scoped>
  .bh-root {
    position: relative;
    min-height: 100%;
    background-color: #F2F3F8;
    font-size: 1em;
  }

  header>div, footer>div {
    background: #2c3253 !important;
  }

  main {
    display: block;
    width: 100%;
    padding: 18px 15px 80px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  footer {
    display: block;
    position: relative;
    width: 100%;
    background: #2c3253;
  }

  /*1.推荐*/
  .bh-recommend {
    width: 100%;
    height: 190px;
  }

  .bh-recommend>div {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    background: #FFF;
    /*padding: 0 35px;*/
  }

  .bh-recommend>div:first-child {
    height: 50px;
    line-height: 50px;
    box-shadow: 0 2px 3px 0 #F2F3F8;
    border-radius: 2px 2px 0 0;
  }

  .bh-recommend_list {
    border-radius: 0 0 2px 2px;
    margin-top: 2px;
    padding-top: 17px !important;
    padding-bottom: 17px !important;
  }

  /*!*推荐的小方格广告栏*!*/
  /*.bh-recommend_list>.el-row>.el-col:first-child .bh-recommend_content {*/
    /*margin-left: 0;*/
  /*}*/
  /*.bh-recommend_list>.el-row>.el-col:last-child .bh-recommend_content {*/
    /*margin-right: 0;*/
  /*}*/
  .bh-recommend_content{
    position: relative;
    margin: auto;
    background: #2597ED;
    background: -moz-linear-gradient(left, #40D7EC 0%, #2597ED 100%);
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, #40D7EC), color-stop(100%, #2597ED));
    background: -webkit-linear-gradient(left, #40D7EC 0%, #2597ED 100%);
    background: -o-linear-gradient(left, #40D7EC 0%, #2597ED 100%);
    background: -ms-linear-gradient(left, #40D7EC 0%, #2597ED 100%);
    background: linear-gradient(to right, #40D7EC 0%, #2597ED 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#40D7EC', endColorstr='#2597ED',GradientType=1 );

  }
  :root .bh-recommend_content{
    filter:none;
  }
  @media screen and (max-width: 1366px) {
    .bh-recommend_content {
      width: 156px;
      height: 95px;
    }
  }
  @media screen and (min-width: 1367px) {
    .bh-recommend_content {
      width: 220px;
      height: 110px;
    }
  }

  /*奖杯的背景图片*/
  .bh-recommend_content-background {
    width: 100%;
    height: 100%;
    background: url('../../assets/images/cup.svg') center bottom no-repeat transparent;
    -webkit-background-size: 80% 80%;
    background-size: 80% 80%;
  }
  /*勋章*/
  .bh-recommend_content img {
    width: 29px;
    height: 38px;
    position: absolute;
    top: 0;
    right: 0;
  }
  @media screen and (max-width: 1366px) {
    .bh-recommend_content img {
      width: 20px;
      height: 27px;
    }
  }
  @media screen and (min-width: 1367px) {
    .bh-recommend_content img {
      width: 29px;
      height: 38px;
    }
  }

  /*姓名*/
  .bh-recommend_content-background span {
    display: block;
  }

  .bh-recommend_content-background span:first-child {
    width: 80%;
    height: 10%;
    line-height: 22px;
  }

  /*中间部分：包含指数、常见问题、交易记录*/
  .bh-wrap_content {
    height: 768px;
    /*background-color: red;*/
  }

  /*包含指数、常见问题的div*/
  .bh-wrap_content>div:first-child {
    width: 32.7%;
    height: 100%;
    float: left;
    position: relative;
  }

  /*2.1指数*/
  .bh-exponent {
    width: 97.5%;
    min-width: 426px;
    height: 58.2%;
    background-color: #FFF;
    border-radius: 2px;
    margin-top: 22px;
    position: relative;
  }
  /*指数容量*/
  .bh-exponent_div{
    width: 97.5%;
    height: 98.2%;
    padding: 15px 20px;
    position: relative;
  }
  /*2.2常见问题*/
  .bh-question {
    width: 97.5%;
    height: 36.8%;
    background-color: #FFFFFF;
    position: absolute;
    bottom: 0;
    border-radius: 2px;
  }

  /*2.3交易记录*/
  .bh-transaction {
    width: 67%;
    height: 100%;
    margin-top: 22px;
    /*background-color: yellow;*/
    float: right;
  }

  /*顶部菜单*/
  .bh-transaction_menu {
    width: 100%;
    height: 50px;
    background-color: #FFF;
    line-height: 50px;
    /*box-shadow:0 2px 3px 0 #f2f3f8;*/
  }

  .bh-transaction_menu>span:first-child, .bh-transaction_menu>span:nth-child(2) {
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
  }
  .bh-transaction_menu>span:first-child {
    margin-left: 20px;
  }

  /*头像*/
  .bh-transaction_headimg {
    display: inline-block;
    width: 42px;
    height: 42px;
    position: relative;
  }
  .bh-transaction_headimg img {
    width: 42px;
    height: 42px;
    -webkit-border-radius: 9999px;
    -moz-border-radius: 9999px;
    border-radius: 9999px;
  }
  .bh-transaction_headimg i {
    display: inline-block;
    width: 5px;
    height: 5px;
    -webkit-border-radius: 999px;
    -moz-border-radius: 999px;
    border-radius: 999px;
    background-color: #38f64b;
    position: absolute;
    bottom: 9%;
    right: 9%;
  }

  .bh-transaction_certification {
    width: 11px;
    height: 12px;
  }

  /*交易记录的表格*/
  .bh-transaction_content {
    height: 695px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

  /*3.订单*/
  .bh-order {
    background: #FFF;
    border-radius: 2px;
    margin-top: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*订单上的菜单*/
  .bh-order_menu {
    height: 50px;
    border-bottom: 2px solid #F2F3F8;
    padding: 0 24px;
    position: relative;
  }

  .bh-order_menu span {
    display: inline-block;
    width: 100px;
    height: 100%;
    line-height: 50px;
    margin-right: 40px;
    text-align: center;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }
  .bh-order_menu span:hover {
    cursor: pointer;
  }
  .bh-order_menu i {
    display: inline-block;
    width: 100px;
    height: 2px;
    background-color: #0BB2FE;
    position: absolute;
    bottom: 0;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }
  /*进行中*/
  .bh-order_menu i.ongoing {
    left: 0%;
  }
  /*已完成*/
  .bh-order_menu i.completed {
    left: 8.5%;
  }
  /*已取消*/
  .bh-order_menu i.cancel {
    left: 16.5%;
  }

  /*3.1进行中的订单呢*/
  .bh-order_ongoing {
    background: #FFF;
    border-radius: 2px;
    /*margin: 15px 35px 0 35px;*/
    padding: 15px 35px 49px  35px;
  }

  .bh-order_item {
    box-shadow: 0 2px 5px 0 rgba(0,0,0, .11);
  }
  /*进行中订单的标题*/
  .bh-order_item-title {
    background-color: #F2F3F8;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    position: relative;
    /*overflow: hidden;*/
  }
  .bh-order_item-title>span:first-child {
    margin-right: 135px;
  }

  .bh-order_item-content {
    padding: 20px 26px 28px 26px;
    height: 200px;
    /*overflow: hidden;*/
  }

  /*暂无订单信息*/
  .bh-order_none {
    text-align: center;
    padding-top: 45px;
    padding-bottom: 42px;
  }
  .bh-order_none img {
    width: 51px;
    height: 74px;
    margin-bottom: 20px;
  }
  .bh-order_none span {
    display: block;
    margin-top: 6px;
  }

  /*3.2已完成订单，3.3取消订单*/
  .bh-order_completed, .bh-order_cancel {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 15px 35px 49px  35px;
  }
  /*常见问题样式*/
  .bh_li{
    margin: 15px 0 15px 30px;
    font-size: 14px;
    color: #666666;
  }
  /*提示样式*/
  .box {
    width: 400px;
  }

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
    background: #FFFFFF;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
  .bh_ul_li li{
    margin:10px 0 10px 0;
  }
  .is_div {
    display: inline-block;
    border:1px solid #d8d8d8;
    border-radius:2px;
    width:31%;
    height: 403px;
    overflow: hidden;
    vertical-align: top;
  }
  .is_ul li{
    width:99%;
    height:36px;
    font-size:14px;
    color:#333333;
    line-height: 36px;
  }
  .is_ul li:hover{
    background:#f4fbff;
    border-left: 2px solid #0BB2FE;
  }
  .is_active {
    background:#f4fbff;
    border-left: 2px solid #0BB2FE;
  }
  .bh_spacing{
    padding: 3% 0 12% 4%;
  }
  .is_spacing{
    padding: 0 0 2% 4%;
  }
  .bh-help {
    color: #666;
    cursor: pointer !important;
  }
  .bh-help:hover{
    color: #0BB2FE !important;
  }
  .bh-curcos-all.active {
    color:#0BB2FE;
  }

  /*指数样式*/
  .exponent {
    display: inline-block;
    position: relative;
    width: 64%;
    height: 403px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .exponent>div:first-child {
    height: 100px;
    position: absolute;
    left: 20px;
    right: 20px;
    margin: auto;
    border-bottom: 1px solid #D8D8D8;
  }

  .exponent div > span:first-child {
    float: left;
  }
  .exponent div > span:nth-child(2) {
    float: right;
  }
  .exponent div > span:last-child {
    float: left;
    clear: both;
    margin-top: 10px;
    font-size: 20px;
  }

  #echarts {
    width: 100%;
    position: absolute;
    height: 303px;
    bottom: 0;
  }
  .swiper-slide img{position: relative;width: 100%;}
</style>
