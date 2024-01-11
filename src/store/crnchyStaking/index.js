import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
  state: {
    loading: true,
    contract: process.env.VUE_APP_CONTRACTS_CRNCHY_STAKING,
    crnchyAddress: process.env.VUE_APP_CONTRACTS_CRNCHY,
    crvoteAddress: process.env.VUE_APP_CONTRACTS_CRVOTE,
    rewardAddress: process.env.VUE_APP_CONTRACTS_WTZ_FA2,
    summary: {
      totalCrnchy: 1,
      totalCrnchyStaked: 0,
      totalCrvoteIssued: 0,
      totalRewardsAvail: 0,
      avgLockTimeMs: 0,
    },
    settings: {
      currentCycle: 0,
      cycleDuration: 0,
      cycleGenesis: new Date(),
      stakingPowerMap: {},
    },
    currentCycle: {
      cycleId: 0,
      totalIssued: 0,
      totalDeposit: 0,
      totalRewards: 0,
      starts: new Date(),
      ends: new Date(),
    },
    nextCycle: {
      cycleId: 0,
      totalIssued: 0,
      totalDeposit: 0,
      totalRewards: 0,
      starts: new Date(),
      ends: new Date(),
    },
    myStaking: {
      crnchyBalance: 0,
      lockEndTime: new Date(),
      currentCycle: {
        cycleId: 0,
        issued: 0,
        deposit: 0,
        stakingPower: 0,
        pendingHarvest: 0,
      },
      nextCycle: {
        cycleId: 0,
        issued: 0,
        deposit: 0,
        stakingPower: 0,
        pendingHarvest: 0,
      },
    },
  },
  actions,
  getters,
  mutations,
};
