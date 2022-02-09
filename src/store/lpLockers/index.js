import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    contract: process.env.VUE_APP_CONTRACTS_LP_LOCKER_ROOM,
    crunchLpAddress: process.env.VUE_APP_CONTRACTS_QUIPU_CRUNCH,
    crdaoLpAddress: process.env.VUE_APP_CONTRACTS_QUIPU_CRDAO,
    crunchAddress: process.env.VUE_APP_CONTRACTS_CRUNCH,
    crdaoAddress: process.env.VUE_APP_CONTRACTS_CRDAO,
    priceFeed: [],
    currentPrices: {},
    storage: {
      lockers: [],
      locks: [],
    },
    usdVwap: 0,
    crunchTez: 0,
    crdaoTez: 0,
    totalTvlTez: 0,
    searchInput: "",
    filters: [],
    data: {},
  },
  actions,
  mutations,
};
