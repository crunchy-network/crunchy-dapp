import mutations from "./mutations";
import actions from "./actions";
export default {
  state: {
    loading: false,
    tokenList: [],
    dexList: [],
    swapForm: {
      inputToken: {},
      inputAmount: 1,
      outputToken: {},
      slippageTolerance: 0.5,
    },
    currentTrade: {},
    transactionParams: {},
    swapPairs: [],
    dexApis: {
      core: {
        loading: false,
        pairs: [],
      },
    },
    swapPairsNew: [],
    isCalculatingBestRoute: false,
  },
  mutations,
  actions,
  getters: {
    getTokenList: (state) => state.tokenList,
    getCurrentTrade: (state) => state.currentTrade,
    getTransactionParams: (state) => state.transactionParams,
    getSwapForm: (state) => state.swapForm,
    getSwapPairs: (state) => state.dexApis.core.pairs,
    getApiLoadingStatus: (state) => {
      return Object.keys(state.dexApis).map((api) => ({
        api,
        loading: state.dexApis[api].loading,
      }));
    },
    getDexApis: (state) => state.dexApis,
    getIsCalculatingBestRoute: (state) => state.isCalculatingBestRoute,
  },
};
