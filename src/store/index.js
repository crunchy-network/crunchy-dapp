import Vue from 'vue'
import Vuex from 'vuex'
import wallet from './wallet'
import lpLockers from './lpLockers'
import farms from './farms'
import burnRecord from './burnRecord'
import wtz from './wtz'
import rckt from './rckt'
import ifo from './ifo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lpLockers: lpLockers,
    farms: farms,
    burnRecord: burnRecord,
    wallet: wallet,
    wtz: wtz,
    rckt: rckt,
    ifo: ifo
  }
})
