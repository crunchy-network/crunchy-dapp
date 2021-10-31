import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    loading: false,
    contracts: {
      pixel: process.env.VUE_APP_CONTRACTS_IFO_PIXEL
    },
    data: {
      raisingGoal: 0,
      totalRaised: 0,
      offeringSupply: 0,
      swapRate: 0,
      startTime: "",
      endTime: "",
      started: false,
      ended: false,
      userRecord: {
        committed: 0,
        committedPercent: 0,
        projectedHarvest: 0,
        projectedFee: 0
      }
    }
  },
  actions,
  mutations
}
