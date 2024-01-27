import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    expanded: false,
    myFarmExpanded: false,
    contract: process.env.VUE_APP_CONTRACTS_FARM_ESTATE,
    contract_v2: process.env.VUE_APP_CONTRACTS_FARM_ESTATE_V2,
    crnchyAddress: process.env.VUE_APP_CONTRACTS_CRNCHY,
    lbDexAddress: process.env.VUE_APP_CONTRACTS_LB_DEX,
    lbLpAddress: process.env.VUE_APP_CONTRACTS_LB_LPTOKEN,
    lpTokens: [],
    priceFeed: [],
    tokenPools: [],
    currentPrices: {},
    storage: {
      farms: [],
      userRecords: [],
      vaults: {
        activeKeys: 0,
      },
    },
    usdVwap: 0,
    crnchyTez: 0,
    totalTvlTez: 0,
    searchInput: "",
    filters: [],
    data: {},
    userData: {},
  },
  actions,
  mutations,
};
