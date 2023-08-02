import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    contract: process.env.VUE_APP_CONTRACTS_LP_LOCKER_ROOM,
    crnchyAddress: process.env.VUE_APP_CONTRACTS_CRNCHY,
    priceFeed: [],
    tokenPools: [],
    currentPrices: {},
    storage: {
      lockers: [],
      locks: [],
    },
    usdVwap: 0,
    crnchyTez: 0,
    totalTvlTez: 0,
    searchInput: "",
    filters: [],
    data: {},
  },
  actions,
  mutations,
};
