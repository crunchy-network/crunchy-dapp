import Vue from 'vue'
import Vuex from 'vuex'
import wallet from './wallet'
import farms from './farms'
import burnRecord from './burnRecord'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    farms: farms,
    burnRecord: burnRecord,
    wallet: wallet
  }
})
