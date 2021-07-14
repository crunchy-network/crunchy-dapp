import Vue from 'vue'
import Vuex from 'vuex'
import wallet from './wallet'
import lpLockers from './lpLockers'
import farms from './farms'
import burnRecord from './burnRecord'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lpLockers: lpLockers,
    farms: farms,
    burnRecord: burnRecord,
    wallet: wallet
  }
})
