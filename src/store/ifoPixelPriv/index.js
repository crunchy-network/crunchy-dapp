import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    loading: false,
    contracts: {
      pixel: process.env.VUE_APP_CONTRACTS_IFO_PIXEL_PRIVATE
    },
    data: {
      raisingGoal: 0,
      totalRaised: 0,
      offeringSupply: 0,
      swapRate: 0,
      startTime: "",
      endTime: "",
      harvestTime: "",
      started: false,
      ended: false,
      harvesting: false,
      harvestDuration: 0,
      userRecord: {
        committed: 0,
        committedPercent: 0,
        projectedHarvest: 0,
        projectedFee: 0,
        amountHarvested: 0,
        pendingHarvest: 0,
        lastHarvest: ""
      }
    }
  },
  actions,
  mutations
}
