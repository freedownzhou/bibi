const state = {
  hostName: 'server',
  host: {
    'server': {name: '测试服务器', hostName: 'server', ip: '192.168.1.249', port: 8766},
    'dengxiaoqin': {name: '邓小勤', hostName: 'dengxiaoqin', ip: '192.168.1.134', port: 8766},
    'yangmingfei': {name: '杨名飞', hostName: 'yangmingfei', ip: '192.168.1.101', port: 8766},
    'longqiao': {name: '龙巧巧', hostName: 'longqiao', ip: '192.168.1.98', port: 8766}
  }
}
const getters = {
  getHostName: state => {
    return state.hostName
  },
  getServer: state => {
    return state
  }
}
const mutations = {
  setServer: (state, key) => {
    state.hostName = state.host[key].hostName
    console.group('%c服务器切换', 'color: #0BB2FE')
    console.log('当前服务器名称：', state.host[key].hostName)
    console.log('当前服务器IP：', state.host[key].ip)
    console.log('当前服务器所有人：', state.host[key].name)
    console.groupEnd()
  }
}
const actions = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
