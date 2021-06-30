import { BigNumber } from 'bignumber.js';
import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    connected: false,
    network: process.env.VUE_APP_TEZOS_NETWORK,
    pkh: '',
    pkhDomain: Promise.resolve(''),
    balance: new BigNumber(0),
    updateBalanceInt: null
  },
  actions,
  mutations
}
