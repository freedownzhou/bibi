import Vue from 'vue'
import BigNumber from 'bignumber.js'

const state = {
  // 资产列表
  sourceData: [],
  assets: {},
  // 更新时间
  lastUpdateTime: 0
}
const getters = {
  getSourceAssetsData (state) {
    return state.sourceData
  },
  getAssets (state) {
    return state.assets
  },
  getLastUpdateTime (state) {
    return state.lastUpdateTime
  }
}
const mutations = {
  setAssets (state, assets) {
    state.sourceData = assets
    for (let i in assets) {
      assets[i]['availableAmount'] = new BigNumber(assets[i]['balance']).minus(new BigNumber(assets[i]['frozenAmount'])).toNumber()
      state.assets[assets[i]['dictionariesId']] = assets[i]
    }
  },
  setLastUpdateTime (state, lastUpdateTime) {
    state.lastUpdateTime = lastUpdateTime
  }
}
const actions = {
  updateAssets ({commit, getters}) {
    return new Promise((resolve, reject) => {
      if (+new Date() - getters.getLastUpdateTime < 30000) {
        resolve(getters.getAssets)
      } else {
        Vue.http.post('/wallet/selectWalletListUI', {currencyCode: ''}).then(response => {
          commit('setLastUpdateTime', +new Date())
          commit('setAssets', response.body.data)
          resolve()
        }, response => {
          reject(response)
        })
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
