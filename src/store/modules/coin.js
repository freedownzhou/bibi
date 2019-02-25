import Vue from 'vue'
import BigNumber from 'bignumber.js'

const state = {
  // 平台币种列表
  platformCoinList: [],
  // 1.自家支持的币种数据
  // 接口返回数据
  // {
  //   "assetCode": "BTC",
  //   "assetName": "Bitcoin",
  //   "platformRate": 0.001,
  //   "vipfPlatformRate": 0.001,
  //   "viptPlatformRate": 0.001,
  //   "contractAddress": "",
  //   "miningFee": 0.001,
  //   "status": 1,
  //   "createDate": 1531964704000,
  //   "updateDate": 1531964704000,
  //   "createBy": null
  // }
  asset: {},
  // 2.第三方提供的币种数据，仅含自家平台支持的
  // otherAsset: {
  //   BTC: {
  //     change_daily: 0.0727
  //     change_hourly: 0.0083
  //     change_monthly: 0.3955
  //     change_weekly: 0.2283
  //     high: 8334.49
  //     hist_high: 20089
  //     hist_low: 0
  //     low: 7674.56
  //     name: "bitcoin"
  //     price: 8232.22
  //     symbol: "BTC"
  //     timestamps: 1532436019834
  //     volume: 1200898.78
  //   }
  //   ...,
  //   timestamps: 1532436019834
  // }
  otherAsset: {},
  // 3.法币汇率
  // {
  //      "base": "USD",
  //      "timestamp": 1526649591621,
  //      "rates": {
  //        "USDT": 1.00000086,
  //        "USD": 1,
  //        "CNY": 6.37805,
  //        "HKD": 7.85005,
  //        "KRW": 1081.57,
  //        "JPY": 110.94767712,
  //        "EUR": 0.848582,
  //        "AUD": 1.330482,
  //        "BRL": 3.69931,
  //        "CAD": 1.280865,
  //        "CHF": 0.999304,
  //        "CLP": 632.6,
  //        "CZK": 21.715925,
  //        "DKK": 6.320165,
  //        "GBP": 0.740933
  //      }
  rate: {
    'base': 'USD',
    'timestamp': 1526649591621,
    'rates': {
      'CNY': 1
    }
  }
}

const getters = {
  // 获取汇率
  getRate: state => {
    return state.rate
  },
  // 获取平台支持的币种
  getAsset: state => {
    return JSON.stringify(state.asset) === '{}' ? false : state.asset
  },
  getOtherAsset: state => {
    return JSON.stringify(state.otherAsset) === '{}' ? false : state.otherAsset
  },
  // 获取平台支持的币种列表
  getPlatformCoinList: state => {
    return state.platformCoinList
  },
  // 计算人民币价格
  convertToCNY: (state, getters) => (coin, number) => {
    if (JSON.stringify(state.rate) !== '{}') {
      // getters.convertToUSD(coin, number) * state.rate.rates.CNY
      return new BigNumber(getters.convertToUSD(coin, number)).multipliedBy(new BigNumber(state.rate.rates.CNY)).toNumber()
    }
    return 0
  },
  // 计算美元价格
  convertToUSD: state => (coin, number) => {
    if (state.otherAsset[coin]) {
      // number * state.otherAsset[coin].price
      new BigNumber(number).multipliedBy(new BigNumber(state.otherAsset[coin].price)).toNumber()
      return new BigNumber(number).multipliedBy(new BigNumber(state.otherAsset[coin].price)).toNumber()
    }
    return 0
  }
}

const mutations = {
  setAsset (state, asset) {
    state.asset = asset
  },
  setOtherAsset (state, otherAsset) {
    state.otherAsset = otherAsset
  },
  setPlatformCoinList (state, platformCoinList) {
    state.platformCoinList = platformCoinList
  },
  setRate (state, rate) {
    state.rate = rate
  }
}

const actions = {
  // 初始化
  initCoinMarket ({commit}) {
    // 1.从获取平台支持币种
    Vue.http.get('/digitalAssets/findAllAssetUI').then(response => {
      const asset = response.body.data
      commit('setAsset', asset)
      let platformCoinList = []
      for (let i in asset) {
        platformCoinList.push({symbol: asset[i].assetCode})
      }
      commit('setPlatformCoinList', platformCoinList)
      commit('setAsset', asset)
      // 2.获取第三方对应价格
      Vue.http.get('/digitalAssets/findExPriceUI').then(response => {
        const list = response.body.data
        let objects = {}
        for (let i in list) {
          objects[list[i].currency] = {
            price: list[i].current_price,
            high: list[i].high_24h,
            low: list[i].low_24h,
            change: list[i].price_change_24h,
            change_daily: Number(list[i].price_change_24h / list[i].high_24h * 100).cut(2)
          }
        }
        objects['timestamps'] = +new Date()
        commit('setOtherAsset', objects)
      }, response => {
      })
    }, response => {})
  },
  syncPrice ({commit}) {
    // 2.获取第三方对应价格
    Vue.http.get('/digitalAssets/findExPriceUI').then(response => {
      const list = response.body.data
      let objects = {}
      for (let i in list) {
        objects[list[i].currency] = {
          price: list[i].current_price,
          high: list[i].high_24h,
          low: list[i].low_24h,
          change: list[i].price_change_24h,
          change_daily: Number(list[i].price_change_24h / list[i].high_24h * 100).cut(2)
        }
      }
      objects['timestamps'] = +new Date()
      commit('setOtherAsset', objects)
    }, response => {
    })
  }
  // 通过WebSocket实时更新所有虚拟币价格
  // syncAllCoinPrice: context => {
  //   const SockJs = require('sockjs-client')
  //   const Stomp = require('stompjs')
  //   const socket = SockJs('http://192.168.1.161:8766/gs-guide-websocket')
  //   const stompClient = Stomp.over(socket)
  //
  //   stompClient.debug = function (str) {
  //   }
  //
  //   stompClient.connect(
  //     {},
  //     function connectCallback () {
  //       stompClient.subscribe('/topic/greetings', function (response) {
  //         context.commit('syncAllCoinPrice', JSON.parse(response.body))
  //       })
  //     },
  //     function errorCallBack (error) {
  //       console.log(error)
  //     }
  //   )
  // }
}

export default {
  state,
  getters,
  actions,
  mutations
}
