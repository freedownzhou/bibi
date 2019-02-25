import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import screen from './modules/screen'
import coin from './modules/coin'
import assets from './modules/assets'
import EncrypedConnection from './modules/encrypedConnection'
import EncrypedConnectionSSO from './modules/encrypedConnectionSSO'
import host from './modules/host'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    screen,
    coin,
    assets,
    EncrypedConnection,
    EncrypedConnectionSSO,
    host
  }
})
