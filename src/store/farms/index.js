import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    loading: false,
    expanded: false,
    contract: process.env.VUE_APP_CONTRACTS_FARM_ESTATE,
    crunchLpAddress: process.env.VUE_APP_CONTRACTS_QUIPU_CRUNCH,
    crdaoLpAddress: process.env.VUE_APP_CONTRACTS_QUIPU_CRDAO,
    crunchAddress: process.env.VUE_APP_CONTRACTS_CRUNCH,
    crdaoAddress: process.env.VUE_APP_CONTRACTS_CRDAO,
    priceFeed: [],
    currentPrices: {},
    usdVwap: 0,
    crunchTez: 0,
    crdaoTez: 0,
    totalTvlTez: 0,
    searchInput: "",
    filters: [ 'farm' ],
    data: {}
  },
  actions,
  mutations
}
