import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    loading: false,
    contracts: {
      pixel: process.env.VUE_APP_CONTRACTS_IFO_PIXEL
    }
  },
  actions,
  mutations
}
